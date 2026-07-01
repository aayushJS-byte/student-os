import { Router } from "express";
import protect from "../../middlewares/auth.middleware.js";
import { updateProfileController, changePasswordController } from "./user.controller.js";

const router = Router();

router.use(protect);

router.patch("/profile", updateProfileController);
router.patch("/password", changePasswordController);

export default router;
