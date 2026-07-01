import { Router } from "express";
import protect from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";

import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} from "./auth.validator.js";

import {
    register,
    login,
    verify,
    forgot,
    reset,
    refresh,
    me,
    logout,
} from "./auth.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.post("/forgot-password", validate(forgotPasswordSchema), forgot);

// token via ?token= query param, password via body
router.post("/reset-password", validate(resetPasswordSchema), reset);

router.get("/verify-email", verify);

router.post("/refresh", refresh);

router.get("/me", protect, me);

router.post("/logout", logout);

export default router;
