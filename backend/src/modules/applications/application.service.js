import mongoose from "mongoose";
import Application from "./application.model.js";
import AppError from "../../errors/AppError.js";
import { APPLICATION_STATUS } from "./application.constants.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Fetch one non-deleted application and assert ownership in one shot.
 * Throws 404 if not found, 403 if not owned by userId.
 */
const findOwned = async (id, userId) => {
  const application = await Application.findById(id);
  if (!application) throw new AppError("Application not found.", 404);
  if (!application.user.equals(userId)) throw new AppError("Forbidden.", 403);
  return application;
};

const addActivity = (application, action, details) => {
  application.activityLog.push({ action, details, createdAt: new Date() });
};

// ─── Service Methods ──────────────────────────────────────────────────────────

export const createApplication = async (userId, data) => {
  const application = await Application.create({
    user: userId,
    ...data,
  });

  addActivity(application, "CREATED", `Application created for ${data.company} — ${data.role}`);
  await application.save();

  return application;
};

export const getApplications = async (userId, query = {}) => {
  const {
    status,
    jobType,
    search,
    tags,
    referral,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 20,
  } = query;

  const filter = { user: new mongoose.Types.ObjectId(userId) };

  if (status) {
    const statuses = status.split(",").map((s) => s.trim());
    filter.status = { $in: statuses };
  }
  if (jobType) filter.jobType = jobType;
  if (referral === "true") filter.referral = true;
  if (tags) {
    const tagList = tags.split(",").map((t) => t.trim());
    filter.tags = { $in: tagList };
  }
  if (search) {
    filter.$or = [
      { company: { $regex: search, $options: "i" } },
      { role: { $regex: search, $options: "i" } },
    ];
  }

  const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [applications, total] = await Promise.all([
    Application.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      // Exclude large embedded arrays from list view for performance
      .select("-activityLog -interviews -notes -oa.notes -offer"),
    Application.countDocuments(filter),
  ]);

  return {
    applications,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  };
};

export const getApplicationById = async (userId, id) => {
  return findOwned(id, userId);
};

export const updateApplication = async (userId, id, data) => {
  const application = await findOwned(id, userId);

  // When a date changes, clear its corresponding sent-reminder keys so the
  // scheduler re-sends reminders calibrated to the new date.
  const dateChanged = (current, incoming) =>
    incoming !== undefined &&
    (!current || current.getTime() !== new Date(incoming).getTime());

  if (dateChanged(application.deadline, data.deadline)) {
    application.sentReminders = application.sentReminders.filter(
      (r) => !r.key.startsWith("deadline_")
    );
  }
  if (data.oa && dateChanged(application.oa?.scheduledAt, data.oa.scheduledAt)) {
    application.sentReminders = application.sentReminders.filter(
      (r) => !r.key.startsWith("oa_")
    );
  }
  if (data.offer && dateChanged(application.offer?.deadline, data.offer.deadline)) {
    application.sentReminders = application.sentReminders.filter(
      (r) => !r.key.startsWith("offer_")
    );
  }

  // Merge nested OA and offer fields rather than overwriting the whole subdocument
  if (data.oa) {
    Object.assign(application.oa, data.oa);
    delete data.oa;
  }
  if (data.offer) {
    Object.assign(application.offer, data.offer);
    delete data.offer;
  }

  Object.assign(application, data);

  addActivity(application, "UPDATED", "Application details updated");
  await application.save();

  return application;
};

export const updateApplicationStatus = async (userId, id, newStatus) => {
  const application = await findOwned(id, userId);

  const previousStatus = application.status;
  application.status = newStatus;

  // Auto-set appliedDate when tracking moves to "applied"
  if (newStatus === APPLICATION_STATUS.APPLIED && !application.appliedDate) {
    application.appliedDate = new Date();
  }

  // Clear ghost nudge keys so the new status stage can fire its own nudge if needed
  application.sentReminders = application.sentReminders.filter(
    (r) => !r.key.startsWith("ghost_")
  );

  addActivity(
    application,
    "STATUS_CHANGED",
    `Status changed: ${previousStatus} → ${newStatus}`
  );

  await application.save();
  return application;
};

export const deleteApplication = async (userId, id) => {
  const application = await findOwned(id, userId);
  await application.deleteOne();
  return true;
};

// ─── Interview Methods ────────────────────────────────────────────────────────

export const addInterview = async (userId, applicationId, data) => {
  const application = await findOwned(applicationId, userId);

  application.interviews.push(data);

  addActivity(
    application,
    "INTERVIEW_ADDED",
    `Round ${data.round} (${data.type}) interview added`
  );

  await application.save();
  return application;
};

export const updateInterview = async (userId, applicationId, interviewId, data) => {
  const application = await findOwned(applicationId, userId);

  const interview = application.interviews.id(interviewId);
  if (!interview) throw new AppError("Interview not found.", 404);

  // If scheduledAt changed, clear this interview's reminder keys so they re-fire
  const dateChanged = (current, incoming) =>
    incoming !== undefined &&
    (!current || current.getTime() !== new Date(incoming).getTime());

  if (dateChanged(interview.scheduledAt, data.scheduledAt)) {
    const prefix24 = `interview_24h_${interviewId}`;
    const prefix2  = `interview_2h_${interviewId}`;
    application.sentReminders = application.sentReminders.filter(
      (r) => r.key !== prefix24 && r.key !== prefix2
    );
  }

  Object.assign(interview, data);

  addActivity(
    application,
    "INTERVIEW_UPDATED",
    `Round ${interview.round} interview updated`
  );

  await application.save();
  return application;
};

export const deleteInterview = async (userId, applicationId, interviewId) => {
  const application = await findOwned(applicationId, userId);

  const interview = application.interviews.id(interviewId);
  if (!interview) throw new AppError("Interview not found.", 404);

  const round = interview.round;
  interview.deleteOne();

  addActivity(application, "INTERVIEW_REMOVED", `Round ${round} interview removed`);

  await application.save();
  return application;
};

// ─── Analytics ────────────────────────────────────────────────────────────────

export const getAnalytics = async (userId) => {
  const uid = new mongoose.Types.ObjectId(userId);

  const [result] = await Application.aggregate([
    { $match: { user: uid } },
    {
      $facet: {
        byStatus: [
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ],
        byMonth: [
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          { $limit: 12 },
        ],
        bySource: [
          { $match: { source: { $ne: null } } },
          { $group: { _id: "$source", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
        byJobType: [
          { $group: { _id: "$jobType", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
      },
    },
  ]);

  const statusMap = Object.fromEntries(
    (result.byStatus ?? []).map(({ _id, count }) => [_id, count])
  );

  const s = (key) => statusMap[key] ?? 0;

  // Funnel: cumulative count of apps that REACHED each stage or beyond
  const funnelApplied   = s("applied") + s("oa") + s("interview") + s("offer") + s("accepted") + s("rejected") + s("withdrawn") + s("ghosted");
  const funnelOA        = s("oa")        + s("interview") + s("offer") + s("accepted");
  const funnelInterview = s("interview") + s("offer") + s("accepted");
  const funnelOffer     = s("offer")     + s("accepted");
  const funnelAccepted  = s("accepted");

  const pct = (num, den) => (den > 0 ? Math.round((num / den) * 100) : null);

  return {
    pipeline: {
      wishlist:  s("wishlist"),
      applied:   s("applied"),
      oa:        s("oa"),
      interview: s("interview"),
      offer:     s("offer"),
      accepted:  s("accepted"),
      rejected:  s("rejected"),
      withdrawn: s("withdrawn"),
      ghosted:   s("ghosted"),
      total:     Object.values(statusMap).reduce((a, b) => a + b, 0),
    },
    kpi: {
      totalApplications: funnelApplied,
      active: s("applied") + s("oa") + s("interview"),
      offers: s("offer") + s("accepted"),
      acceptanceRate: pct(funnelAccepted, funnelApplied),
      ghostRate: pct(s("ghosted"), funnelApplied),
    },
    funnel: [
      { stage: "Applied",   count: funnelApplied,   conversion: 100 },
      { stage: "OA",        count: funnelOA,        conversion: pct(funnelOA, funnelApplied) },
      { stage: "Interview", count: funnelInterview, conversion: pct(funnelInterview, funnelApplied) },
      { stage: "Offer",     count: funnelOffer,     conversion: pct(funnelOffer, funnelApplied) },
      { stage: "Accepted",  count: funnelAccepted,  conversion: pct(funnelAccepted, funnelApplied) },
    ],
    byMonth:   result.byMonth   ?? [],
    bySource:  result.bySource  ?? [],
    byJobType: result.byJobType ?? [],
  };
};

// ─── Offers ───────────────────────────────────────────────────────────────────

export const getOffers = async (userId) => {
  return Application.find({
    user: new mongoose.Types.ObjectId(userId),
    status: { $in: ["offer", "accepted"] },
  })
    .select("company role jobType status offer outcomeReason createdAt updatedAt")
    .sort({ updatedAt: -1 });
};

// ─── Calendar ─────────────────────────────────────────────────────────────────

export const getCalendarEvents = async (userId) => {
  const applications = await Application.find({
    user: new mongoose.Types.ObjectId(userId),
    status: { $in: ["wishlist", "oa", "interview", "offer"] },
  }).select("company role jobType status deadline oa interviews offer");

  const events = [];

  for (const app of applications) {
    const base = {
      applicationId: app._id,
      company: app.company,
      role: app.role,
      jobType: app.jobType,
    };

    if (app.status === "wishlist" && app.deadline) {
      events.push({ ...base, type: "apply_deadline", date: app.deadline, label: "Apply-by Deadline" });
    }

    if (app.status === "oa" && app.oa?.scheduledAt) {
      events.push({ ...base, type: "oa", date: app.oa.scheduledAt, label: "Online Assessment" });
    }

    if (app.status === "interview") {
      for (const iv of app.interviews ?? []) {
        if (iv.scheduledAt && iv.result === "pending") {
          events.push({
            ...base,
            type: "interview",
            date: iv.scheduledAt,
            label: `Round ${iv.round} – ${iv.type.replace(/_/g, " ")}`,
            round: iv.round,
            interviewType: iv.type,
          });
        }
      }
    }

    if (app.status === "offer" && app.offer?.deadline) {
      events.push({ ...base, type: "offer_deadline", date: app.offer.deadline, label: "Offer Deadline" });
    }
  }

  // Sort chronologically
  events.sort((a, b) => new Date(a.date) - new Date(b.date));

  return events;
};

// ─── Stats ────────────────────────────────────────────────────────────────────

export const getApplicationStats = async (userId) => {
  const result = await Application.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // Build zero-filled object for all statuses so UI never has undefined
  const stats = Object.fromEntries(
    Object.values(APPLICATION_STATUS).map((s) => [s, 0])
  );

  let total = 0;
  result.forEach(({ _id, count }) => {
    stats[_id] = count;
    total += count;
  });

  stats.total = total;

  return stats;
};
