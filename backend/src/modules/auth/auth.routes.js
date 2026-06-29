import { Router } from "express";

import validate from "../../middlewares/validate.middleware.js";

import {
    registerSchema,
    loginSchema,
} from "./auth.validator.js";

import {
    register,
    login,
    verify,
} from "./auth.controller.js";

const router = Router();

router.post(
    "/register",
    validate(registerSchema),
    register
);

router.post(
    "/login",
    validate(loginSchema),
    login
);

router.get(
    "/verify-email",
    verify
);

export default router;