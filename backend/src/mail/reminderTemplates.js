// ─── Shared primitives ────────────────────────────────────────────────────────

const wrap = (accentColor, inner) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:32px 16px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <div style="max-width:560px;margin:auto;">

    <!-- Brand bar -->
    <div style="margin-bottom:20px;text-align:left;">
      <span style="font-size:13px;font-weight:700;color:#0f172a;letter-spacing:-0.3px;">Student</span><span style="font-size:13px;font-weight:700;color:${accentColor};letter-spacing:-0.3px;">OS</span>
    </div>

    <!-- Card -->
    <div style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
      <!-- Accent strip -->
      <div style="height:4px;background:${accentColor};"></div>

      <!-- Body -->
      <div style="padding:32px 36px;">
        ${inner}
      </div>

      <!-- Footer -->
      <div style="padding:20px 36px;background:#f8fafc;border-top:1px solid #e2e8f0;">
        <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.5;">
          You're receiving this because you track job applications on StudentOS.<br>
          Open your tracker to update statuses and keep reminders accurate.
        </p>
      </div>
    </div>

  </div>
</body>
</html>`;

const greeting = (name) =>
  `<p style="margin:0 0 20px;font-size:15px;color:#334155;">Hi <strong style="color:#0f172a;">${name}</strong>,</p>`;

const highlight = (accentColor, lines) => `
  <div style="background:#f8fafc;border-left:3px solid ${accentColor};border-radius:0 8px 8px 0;padding:14px 18px;margin:20px 0;">
    ${lines.map(l => `<p style="margin:0 0 4px;font-size:13px;color:#475569;line-height:1.5;">${l}</p>`).join("")}
  </div>`;

const tip = (text) =>
  `<p style="margin:16px 0 0;font-size:13px;color:#64748b;line-height:1.6;font-style:italic;">${text}</p>`;

const formatInterviewType = (type) =>
  (type ?? "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());


// ─── 1. Application deadline (wishlist → apply-by reminder) ──────────────────

export const deadlineReminderTemplate = ({ name, company, role, deadline, scheduledAt, gapLabel }) =>
  wrap("#d97706", `
    ${greeting(name)}
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0f172a;line-height:1.3;">
      Apply to ${company} by ${deadline}
    </h2>
    <p style="margin:0 0 20px;font-size:14px;color:#64748b;">
      ${role} · Application deadline in <strong style="color:#d97706;">${gapLabel}</strong>
    </p>
    ${highlight("#d97706", [
      scheduledAt
        ? `<strong>Deadline:</strong> ${scheduledAt}`
        : `<strong>By:</strong> ${deadline}`,
      `<strong>Role:</strong> ${role}`,
    ])}
    <p style="margin:20px 0 0;font-size:14px;color:#334155;line-height:1.6;">
      You saved this opening but haven't applied yet. Don't let the deadline sneak up on you.
    </p>
    ${gapLabel === "1 day" || gapLabel === "3 days"
      ? tip("Last check: resume updated? Job link still active? Application portal open?")
      : tip("Aim to submit 24–48 hours early in case the portal has issues.")}
  `);


// ─── 2. OA reminder ──────────────────────────────────────────────────────────

export const oaReminderTemplate = ({ name, company, role, scheduledAt, gapLabel, platform, duration }) =>
  wrap("#7c3aed", `
    ${greeting(name)}
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0f172a;line-height:1.3;">
      ${company} OA in ${gapLabel}
    </h2>
    <p style="margin:0 0 20px;font-size:14px;color:#64748b;">
      ${role} · Online Assessment
    </p>
    ${highlight("#7c3aed", [
      `<strong>Starts:</strong> ${scheduledAt}`,
      platform ? `<strong>Platform:</strong> ${platform}` : null,
      duration ? `<strong>Duration:</strong> ${duration} minutes` : null,
    ].filter(Boolean))}
    ${gapLabel === "2 hours"
      ? `<p style="margin:20px 0 0;font-size:14px;color:#334155;line-height:1.6;">
          Almost time. Make sure your internet is stable, your IDE is ready, and you're in a quiet space.
         </p>`
      : `<p style="margin:20px 0 0;font-size:14px;color:#334155;line-height:1.6;">
          Use today to review relevant topics, test your coding environment, and get a good night's rest.
         </p>`
    }
    ${tip(platform
      ? `You'll be using <strong>${platform}</strong> — log in ahead of time to avoid last-minute setup issues.`
      : "Check your email for the OA link and any instructions from the recruiter."
    )}
  `);


// ─── 3. Interview reminder ────────────────────────────────────────────────────

export const interviewReminderTemplate = ({ name, company, role, scheduledAt, gapLabel, round, type }) => {
  const typeName = formatInterviewType(type);
  const prepTips = {
    technical:    "Warm up with 2–3 LeetCode problems. Focus on articulating your thought process, not just the answer.",
    system_design:"Practice the standard flow: clarify requirements → estimate scale → design components → discuss trade-offs.",
    hr:           "Prepare STAR-format answers for your top 3 projects and know your \"tell me about yourself\" cold.",
    behavioral:   "Have 5–6 concrete examples ready (impact, conflict, leadership, failure, collaboration).",
    phone:        "Find a quiet spot with strong signal. Have your resume open and your key points memorised.",
    onsite:       "Get everything ready the night before — travel route, outfit, portfolio, questions to ask.",
    group:        "Listen as much as you speak. Show you can collaborate, not just lead.",
  };

  return wrap("#059669", `
    ${greeting(name)}
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0f172a;line-height:1.3;">
      ${company} interview in ${gapLabel}
    </h2>
    <p style="margin:0 0 20px;font-size:14px;color:#64748b;">
      ${role} · Round ${round} — ${typeName}
    </p>
    ${highlight("#059669", [
      `<strong>When:</strong> ${scheduledAt}`,
      `<strong>Type:</strong> ${typeName}`,
      `<strong>Round:</strong> ${round}`,
    ])}
    ${gapLabel === "2 hours"
      ? `<p style="margin:20px 0 0;font-size:14px;color:#334155;line-height:1.6;">
          Almost there. Take a breath, review your notes one last time, and trust your prep.
         </p>`
      : `<p style="margin:20px 0 0;font-size:14px;color:#334155;line-height:1.6;">
          You've got this. Use the time to go through your prep notes and get a solid night's sleep.
         </p>`
    }
    ${prepTips[type] ? tip(prepTips[type]) : ""}
  `);
};


// ─── 4. Offer decision deadline ───────────────────────────────────────────────

export const offerDeadlineTemplate = ({ name, company, role, deadline, gapLabel }) =>
  wrap("#2563eb", `
    ${greeting(name)}
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0f172a;line-height:1.3;">
      Your ${company} offer expires in ${gapLabel}
    </h2>
    <p style="margin:0 0 20px;font-size:14px;color:#64748b;">
      ${role} · Offer decision deadline
    </p>
    ${highlight("#2563eb", [
      `<strong>Deadline:</strong> ${deadline}`,
      `<strong>Role:</strong> ${role}`,
    ])}
    <p style="margin:20px 0 0;font-size:14px;color:#334155;line-height:1.6;">
      If you've made your decision, update your tracker in StudentOS so your reminders stay accurate.
      If you need an extension, now is the time to email the recruiter.
    </p>
    ${tip("Negotiating an extension is common and rarely hurts — a polite one-line email is usually enough.")}
  `);


// ─── 5. Ghost nudge (per status context) ─────────────────────────────────────

const GHOST_CONTEXT = {
  applied: {
    headline: (company) => `Still waiting to hear from ${company}?`,
    body: (daysSince, company) =>
      `It's been <strong>${daysSince} days</strong> since you applied to ${company} with no update.
       Most companies reply within 2–4 weeks. If it's been longer, a short follow-up to the recruiter
       is completely reasonable.`,
    suggestion: "If you still haven't heard back, consider marking this as Ghosted to keep your tracker clean.",
  },
  oa: {
    headline: (company) => `Any OA results from ${company}?`,
    body: (daysSince, company) =>
      `Your ${company} OA was <strong>${daysSince} days ago</strong> and there's been no status update.
       OA results typically come in 3–10 days. If it's been longer, it may be worth following up.`,
    suggestion: "Update your status in StudentOS — either move forward if you heard back, or mark as Ghosted.",
  },
  interview: {
    headline: (company) => `Any update from ${company} after the interview?`,
    body: (daysSince, company) =>
      `It's been <strong>${daysSince} days</strong> since your last interview update with ${company}.
       Post-interview feedback usually arrives within 1–2 weeks. If it's been longer, a polite follow-up is fine.`,
    suggestion: "Log the outcome in StudentOS so your tracker stays accurate, even if it's uncertain.",
  },
};

export const ghostNudgeTemplate = ({ name, company, role, status, daysSince }) => {
  const ctx = GHOST_CONTEXT[status] ?? GHOST_CONTEXT.applied;
  return wrap("#64748b", `
    ${greeting(name)}
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0f172a;line-height:1.3;">
      ${ctx.headline(company)}
    </h2>
    <p style="margin:0 0 20px;font-size:14px;color:#64748b;">
      ${role}
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:#334155;line-height:1.6;">
      ${ctx.body(daysSince, company)}
    </p>
    ${tip(ctx.suggestion)}
  `);
};
