import asyncHandler from "../../errors/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
  addInterview,
  updateInterview,
  deleteInterview,
  getApplicationStats,
} from "./application.service.js";

export const create = asyncHandler(async (req, res) => {
  const application = await createApplication(req.user._id, req.validatedData);
  return ApiResponse.success(res, application, "Application created.", 201);
});

export const list = asyncHandler(async (req, res) => {
  const result = await getApplications(req.user._id, req.query);
  return ApiResponse.success(res, result, "Applications fetched.");
});

export const stats = asyncHandler(async (req, res) => {
  const result = await getApplicationStats(req.user._id);
  return ApiResponse.success(res, result, "Stats fetched.");
});

export const get = asyncHandler(async (req, res) => {
  const application = await getApplicationById(req.user._id, req.params.id);
  return ApiResponse.success(res, application, "Application fetched.");
});

export const update = asyncHandler(async (req, res) => {
  const application = await updateApplication(
    req.user._id,
    req.params.id,
    req.validatedData
  );
  return ApiResponse.success(res, application, "Application updated.");
});

export const updateStatus = asyncHandler(async (req, res) => {
  const application = await updateApplicationStatus(
    req.user._id,
    req.params.id,
    req.validatedData.status
  );
  return ApiResponse.success(res, application, "Status updated.");
});

export const remove = asyncHandler(async (req, res) => {
  await deleteApplication(req.user._id, req.params.id);
  return ApiResponse.success(res, null, "Application deleted.");
});

export const addInterviewRound = asyncHandler(async (req, res) => {
  const application = await addInterview(
    req.user._id,
    req.params.id,
    req.validatedData
  );
  return ApiResponse.success(res, application, "Interview added.", 201);
});

export const updateInterviewRound = asyncHandler(async (req, res) => {
  const application = await updateInterview(
    req.user._id,
    req.params.id,
    req.params.interviewId,
    req.validatedData
  );
  return ApiResponse.success(res, application, "Interview updated.");
});

export const deleteInterviewRound = asyncHandler(async (req, res) => {
  const application = await deleteInterview(
    req.user._id,
    req.params.id,
    req.params.interviewId
  );
  return ApiResponse.success(res, application, "Interview removed.");
});
