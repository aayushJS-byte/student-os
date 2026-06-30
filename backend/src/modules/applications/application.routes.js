import { Router } from "express";
import protect from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";

import {
  createApplicationSchema,
  updateApplicationSchema,
  updateStatusSchema,
  addInterviewSchema,
  updateInterviewSchema,
} from "./application.validator.js";

import {
  create,
  list,
  stats,
  get,
  update,
  updateStatus,
  remove,
  addInterviewRound,
  updateInterviewRound,
  deleteInterviewRound,
} from "./application.controller.js";

const router = Router();

// All application routes require authentication
router.use(protect);

// Stats — must be before /:id to avoid "summary" being treated as an id
router.get("/stats/summary", stats);

// Application CRUD
router.post("/", validate(createApplicationSchema), create);
router.get("/", list);
router.get("/:id", get);
router.put("/:id", validate(updateApplicationSchema), update);
router.patch("/:id/status", validate(updateStatusSchema), updateStatus);
router.delete("/:id", remove);

// Interview sub-resources
router.post("/:id/interviews", validate(addInterviewSchema), addInterviewRound);
router.put("/:id/interviews/:interviewId", validate(updateInterviewSchema), updateInterviewRound);
router.delete("/:id/interviews/:interviewId", deleteInterviewRound);

export default router;
