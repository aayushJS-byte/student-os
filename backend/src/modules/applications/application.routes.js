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
  listOffers,
  stats,
  analyticsOverview,
  calendar,
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

// Named sub-routes — must be before /:id to avoid being treated as IDs
router.get("/stats/summary", stats);
router.get("/analytics", analyticsOverview);
router.get("/offers", listOffers);
router.get("/calendar", calendar);

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
