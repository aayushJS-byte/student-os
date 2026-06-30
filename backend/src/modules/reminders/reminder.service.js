import Application from "../applications/application.model.js";
import User from "../user/user.model.js";
import { sendEmail } from "../../services/email.service.js";
import {
  deadlineReminderTemplate,
  oaReminderTemplate,
  interviewReminderTemplate,
  offerDeadlineTemplate,
  ghostNudgeTemplate,
} from "../../mail/reminderTemplates.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const msToHours = (ms) => ms / (1000 * 60 * 60);

/** Format a datetime for email (IST) */
const formatDateTime = (date) =>
  new Date(date).toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });

/** Format a date-only value for email (IST) */
const formatDateOnly = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

const hasSent = (sentReminders, key) =>
  sentReminders.some((r) => r.key === key);

// Returns true if hoursUntil falls in (minHours, maxHours] and is in the future.
const inWindow = (hoursUntil, { maxHours, minHours }) =>
  hoursUntil > 0 && hoursUntil <= maxHours && hoursUntil > minHours;

// ─── Window definitions ───────────────────────────────────────────────────────

const DEADLINE_WINDOWS = [
  { key: "deadline_7d", maxHours: 7 * 24, minHours: 3 * 24, label: "7 days"  },
  { key: "deadline_3d", maxHours: 3 * 24, minHours: 24,     label: "3 days"  },
  { key: "deadline_1d", maxHours: 24,     minHours: 0,       label: "1 day"   },
];

const OA_WINDOWS = [
  { key: "oa_24h", maxHours: 24, minHours: 2, label: "24 hours" },
  { key: "oa_2h",  maxHours: 2,  minHours: 0, label: "2 hours"  },
];

const INTERVIEW_WINDOWS = [
  { key: "interview_24h", maxHours: 24, minHours: 2, label: "24 hours" },
  { key: "interview_2h",  maxHours: 2,  minHours: 0, label: "2 hours"  },
];

const OFFER_WINDOWS = [
  { key: "offer_7d",  maxHours: 7 * 24, minHours: 3 * 24, label: "7 days"   },
  { key: "offer_3d",  maxHours: 3 * 24, minHours: 24,     label: "3 days"   },
  { key: "offer_1d",  maxHours: 24,     minHours: 12,     label: "1 day"    },
  { key: "offer_12h", maxHours: 12,     minHours: 0,      label: "12 hours" },
];

// Ghost nudge fires once per status stage (keys are cleared on every status transition).
// Threshold is shorter for OA (results come in fast) than for applied/interview.
const GHOST_CONFIG = {
  applied:   { key: "ghost_applied",   days: 30 },
  oa:        { key: "ghost_oa",        days: 14 },
  interview: { key: "ghost_interview", days: 21 },
};

// ─── Core processor ───────────────────────────────────────────────────────────

export const processReminders = async () => {
  const now = new Date();

  // Only fetch active applications — ghosted, accepted, rejected, withdrawn need no reminders.
  const applications = await Application.find({
    status: { $nin: ["accepted", "rejected", "withdrawn", "ghosted"] },
  }).select(
    "user status deadline oa offer interviews sentReminders updatedAt company role jobType"
  );

  if (applications.length === 0) {
    console.log("[reminders] No active applications to process.");
    return;
  }

  // Batch-fetch users once to avoid N+1 queries
  const userIds = [...new Set(applications.map((a) => a.user.toString()))];
  const users = await User.find({ _id: { $in: userIds } }).select("name email");
  const userMap = Object.fromEntries(users.map((u) => [u._id.toString(), u]));

  const emailTasks = [];
  let appsUpdated = 0;

  for (const app of applications) {
    const user = userMap[app.user.toString()];
    if (!user) continue;

    const newKeys = []; // keys to push to sentReminders atomically

    // ── 1. Apply-by deadline ── wishlist status only ────────────────────────
    // deadline = "apply-by date". Irrelevant once the user has submitted.
    if (app.status === "wishlist" && app.deadline) {
      const hoursUntil = msToHours(new Date(app.deadline) - now);
      for (const w of DEADLINE_WINDOWS) {
        if (inWindow(hoursUntil, w) && !hasSent(app.sentReminders, w.key)) {
          newKeys.push(w.key);
          emailTasks.push({
            to: user.email,
            subject: `Apply to ${app.company} — deadline in ${w.label}`,
            html: deadlineReminderTemplate({
              name: user.name,
              company: app.company,
              role: app.role,
              deadline: formatDateOnly(app.deadline),
              scheduledAt: formatDateTime(app.deadline),
              gapLabel: w.label,
            }),
          });
        }
      }
    }

    // ── 2. OA reminder ── oa status only, not completed ────────────────────
    if (app.status === "oa" && app.oa?.scheduledAt && !app.oa.completed) {
      const hoursUntil = msToHours(new Date(app.oa.scheduledAt) - now);
      for (const w of OA_WINDOWS) {
        if (inWindow(hoursUntil, w) && !hasSent(app.sentReminders, w.key)) {
          newKeys.push(w.key);
          emailTasks.push({
            to: user.email,
            subject: `${app.company} OA in ${w.label} — ${app.role}`,
            html: oaReminderTemplate({
              name: user.name,
              company: app.company,
              role: app.role,
              scheduledAt: formatDateTime(app.oa.scheduledAt),
              gapLabel: w.label,
              platform: app.oa.platform || null,
              duration: app.oa.duration || null,
            }),
          });
        }
      }
    }

    // ── 3. Interview reminders ── interview status, pending rounds only ─────
    if (app.status === "interview") {
      for (const interview of app.interviews ?? []) {
        if (!interview.scheduledAt || interview.result !== "pending") continue;
        const hoursUntil = msToHours(new Date(interview.scheduledAt) - now);
        for (const w of INTERVIEW_WINDOWS) {
          const key = `${w.key}_${interview._id}`;
          if (inWindow(hoursUntil, w) && !hasSent(app.sentReminders, key)) {
            newKeys.push(key);
            emailTasks.push({
              to: user.email,
              subject: `${app.company} Round ${interview.round} interview in ${w.label}`,
              html: interviewReminderTemplate({
                name: user.name,
                company: app.company,
                role: app.role,
                scheduledAt: formatDateTime(interview.scheduledAt),
                gapLabel: w.label,
                round: interview.round,
                type: interview.type,
              }),
            });
          }
        }
      }
    }

    // ── 4. Offer decision deadline ── offer status only ─────────────────────
    if (app.status === "offer" && app.offer?.deadline) {
      const hoursUntil = msToHours(new Date(app.offer.deadline) - now);
      for (const w of OFFER_WINDOWS) {
        if (inWindow(hoursUntil, w) && !hasSent(app.sentReminders, w.key)) {
          newKeys.push(w.key);
          emailTasks.push({
            to: user.email,
            subject: `${app.company} offer expires in ${w.label} — ${app.role}`,
            html: offerDeadlineTemplate({
              name: user.name,
              company: app.company,
              role: app.role,
              deadline: formatDateOnly(app.offer.deadline),
              gapLabel: w.label,
            }),
          });
        }
      }
    }

    // ── 5. Ghost nudge ── per-status, with tailored thresholds ─────────────
    // Ghost keys are cleared on every status transition (in updateApplicationStatus),
    // so this fires once per status stage. updatedAt tracks when the USER last changed
    // anything — the reminder system saves with { timestamps: false } to avoid resetting it.
    const ghostCfg = GHOST_CONFIG[app.status];
    if (ghostCfg) {
      const daysSince = Math.floor((now - new Date(app.updatedAt)) / (1000 * 60 * 60 * 24));
      if (daysSince >= ghostCfg.days && !hasSent(app.sentReminders, ghostCfg.key)) {
        newKeys.push(ghostCfg.key);
        emailTasks.push({
          to: user.email,
          subject: ghostSubject(app.status, app.company),
          html: ghostNudgeTemplate({
            name: user.name,
            company: app.company,
            role: app.role,
            status: app.status,
            daysSince,
          }),
        });
      }
    }

    // ── Persist new sentinel keys WITHOUT touching updatedAt ────────────────
    // Using timestamps:false so the ghost nudge timer reflects real user activity only.
    if (newKeys.length > 0) {
      const entries = newKeys.map((key) => ({ key, sentAt: now }));
      await Application.updateOne(
        { _id: app._id },
        { $push: { sentReminders: { $each: entries } } },
        { timestamps: false }
      );
      appsUpdated++;
    }
  }

  // Fire all emails concurrently — failures are logged individually but don't abort the run
  const results = await Promise.allSettled(
    emailTasks.map((task) => sendEmail(task))
  );

  const failed = results.filter((r) => r.status === "rejected");
  failed.forEach((r, i) =>
    console.error(`[reminders] Email ${i} failed:`, r.reason?.message ?? r.reason)
  );

  console.log(
    `[reminders] Processed ${applications.length} apps — ` +
    `${emailTasks.length} emails queued, ${failed.length} failed, ${appsUpdated} apps updated`
  );
};

// ─── Ghost subject lines (per status context) ─────────────────────────────────

function ghostSubject(status, company) {
  switch (status) {
    case "oa":        return `Any OA results from ${company}?`;
    case "interview": return `Any update from ${company} after the interview?`;
    default:          return `Still waiting to hear from ${company}?`;
  }
}
