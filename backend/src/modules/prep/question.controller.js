import ApiResponse from "../../utils/ApiResponse.js";
import * as questionService from "./question.service.js";

// ─── Questions ────────────────────────────────────────────────────────────────

export const listCompanies = async (req, res) => {
  const companies = await questionService.getCompanies();
  return ApiResponse.success(res, { companies });
};

export const listSections = async (req, res) => {
  const { company } = req.query;
  if (!company) return ApiResponse.error(res, "company query param required", [], 400);
  const sections = await questionService.getSectionsForCompany(company);
  return ApiResponse.success(res, { sections });
};

export const listQuestions = async (req, res) => {
  const { company, section } = req.query;
  if (!company) return ApiResponse.error(res, "company query param required", [], 400);
  const questions = await questionService.getQuestions({ company, section });
  return ApiResponse.success(res, { questions });
};

export const getQuestion = async (req, res) => {
  const question = await questionService.getQuestionBySlug(req.params.slug);
  if (!question) return ApiResponse.error(res, "Question not found", [], 404);
  return ApiResponse.success(res, { question });
};

// ─── User Progress ────────────────────────────────────────────────────────────

export const getProgress = async (req, res) => {
  const progress = await questionService.getUserProgress(req.user._id);
  return ApiResponse.success(res, { progress });
};

export const getProgressStats = async (req, res) => {
  const stats = await questionService.getProgressStats(req.user._id);
  return ApiResponse.success(res, { stats });
};

export const updateProgress = async (req, res) => {
  const { slug } = req.params;
  const { status, notes } = req.body;

  if (!["todo", "attempted", "solved"].includes(status)) {
    return ApiResponse.error(res, "status must be todo, attempted, or solved", [], 400);
  }

  const record = await questionService.upsertProgress(req.user._id, slug, { status, notes });
  return ApiResponse.success(res, { record });
};
