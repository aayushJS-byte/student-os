import asyncHandler from "../../errors/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import {
    registerUser,
    loginUser,
    verifyEmail,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    logoutUser,
    refreshUser,
} from "./auth.service.js";

import {
    accessCookieOptions,
    refreshCookieOptions,
} from "../../utils/cookies.js";

export const register = asyncHandler(async (req, res) => {
    const user = await registerUser(req.validatedData);

    return ApiResponse.success(res, user, "Registration successful.", 201);
});

export const login = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await loginUser({
        ...req.validatedData,
        userAgent: req.headers["user-agent"] || "",
        ipAddress: req.ip,
    });

    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return ApiResponse.success(res, user, "Login successful.");
});

export const forgot = asyncHandler(async (req, res) => {
    await forgotPassword(req.validatedData);

    return ApiResponse.success(
        res,
        null,
        "If an account exists, a password reset link has been sent."
    );
});

// token arrives via query param (?token=...), password from validated body
export const reset = asyncHandler(async (req, res) => {
    await resetPassword({
        token: req.query.token,
        ...req.validatedData,
    });

    return ApiResponse.success(res, null, "Password reset successful.");
});

export const verify = asyncHandler(async (req, res) => {
    const { token } = req.query;

    await verifyEmail(token);

    return ApiResponse.success(res, null, "Email verified successfully.");
});

export const me = asyncHandler(async (req, res) => {
    const user = await getCurrentUser(req.user._id);

    return ApiResponse.success(res, user, "Current user fetched successfully.");
});

export const logout = asyncHandler(async (req, res) => {
    await logoutUser({ refreshToken: req.cookies.refreshToken });

    res.clearCookie("accessToken", accessCookieOptions);
    res.clearCookie("refreshToken", refreshCookieOptions);

    return ApiResponse.success(res, null, "Logout successful.");
});

export const refresh = asyncHandler(async (req, res) => {
    const { accessToken, user } = await refreshUser({
        refreshToken: req.cookies.refreshToken,
    });

    res.cookie("accessToken", accessToken, accessCookieOptions);

    return ApiResponse.success(res, user, "Access token refreshed.");
});
