import asyncHandler from "../../errors/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import {
    registerUser,
    loginUser,
} from "./auth.service.js";

import {
    accessCookieOptions,
    refreshCookieOptions,
} from "../../utils/cookies.js";

export const register = asyncHandler(async (req, res) => {
    const user = await registerUser(req.validatedData);

    return ApiResponse.success(
        res,
        user,
        "Registration successful.",
        201
    );
});

export const login = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } =
        await loginUser(req.validatedData);

    res.cookie(
        "accessToken",
        accessToken,
        accessCookieOptions
    );

    res.cookie(
        "refreshToken",
        refreshToken,
        refreshCookieOptions
    );

    return ApiResponse.success(
        res,
        user,
        "Login successful."
    );
});