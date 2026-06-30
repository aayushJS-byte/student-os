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
  const application = await Application.findOne({ _id: id, deletedAt: null });
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

  const filter = { user: new mongoose.Types.ObjectId(userId), deletedAt: null };

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
  application.deletedAt = new Date();
  await application.save();
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

// ─── Stats ────────────────────────────────────────────────────────────────────

export const getApplicationStats = async (userId) => {
  const result = await Application.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        deletedAt: null,
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
