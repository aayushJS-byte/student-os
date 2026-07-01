import { Router } from "express";
import protect from "../../middlewares/auth.middleware.js";
import {
  listCompanies,
  listQuestions,
  listSections,
  getQuestion,
  getProgress,
  getProgressStats,
  updateProgress,
} from "./question.controller.js";

const router = Router();
router.use(protect);

// Questions
router.get("/companies", listCompanies);
router.get("/sections", listSections);         // ?company=Amazon
router.get("/questions", listQuestions);        // ?company=Amazon&section=OA
router.get("/questions/:slug", getQuestion);

// Progress
router.get("/progress", getProgress);
router.get("/progress/stats", getProgressStats);
router.patch("/questions/:slug/progress", updateProgress);

export default router;
