import User from "../user/user.model.js";
import Token from "../token/token.model.js";
import { findSession } from "../session/session.service.js";
import AppError from "../../errors/AppError.js";
import env from "../../config/env.js";

import {
    createSession,
    deleteUserSessions,
    deleteSession,
} from "../session/session.service.js";

import {
    hashPassword,
    comparePassword,
} from "../../utils/password.js";

import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../../utils/jwt.js";

import {
    createEmailVerificationToken,
    createPasswordResetToken,
    findVerificationToken,
    findPasswordResetToken,
} from "../token/token.service.js";

import { sendEmail } from "../../services/email.service.js";

import verifyEmailTemplate from "../../mail/verifyEmail.template.js";
import resetPasswordTemplate from "../../mail/resetPassword.template.js";

/**
 * Register User
 */
export const registerUser = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new AppError("Email already registered.", 409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({ name, email, password: hashedPassword });

    const verificationToken = await createEmailVerificationToken(user._id);

    const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    await sendEmail({
        to: user.email,
        subject: "Verify your StudentOS Account",
        html: verifyEmailTemplate({ name: user.name, verificationUrl }),
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
    };
};

/**
 * Login User
 */
export const loginUser = async ({ email, password, userAgent, ipAddress }) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new AppError("Invalid email or password.", 401);
    }

    const passwordMatched = await comparePassword(password, user.password);

    if (!passwordMatched) {
        throw new AppError("Invalid email or password.", 401);
    }

    if (!user.isVerified) {
        throw new AppError("Please verify your email before logging in.", 403);
    }

    const payload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await createSession({ userId: user._id, refreshToken, userAgent, ipAddress });

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        accessToken,
        refreshToken,
    };
};

/**
 * Get Current User
 */
export const getCurrentUser = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError("User not found.", 404);
    }

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
    };
};

/**
 * Verify Email
 */
export const verifyEmail = async (token) => {
    const verification = await findVerificationToken(token);

    if (!verification) {
        throw new AppError("Verification link is invalid or expired.", 400);
    }

    verification.user.isVerified = true;
    await verification.user.save();

    await Token.deleteOne({ _id: verification._id });

    return true;
};

/**
 * Forgot Password
 */
export const forgotPassword = async ({ email }) => {
    const user = await User.findOne({ email });

    // Do not reveal whether the account exists
    if (!user) {
        return true;
    }

    const resetToken = await createPasswordResetToken(user._id);

    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${resetToken}`;

    await sendEmail({
        to: user.email,
        subject: "Reset your StudentOS Password",
        html: resetPasswordTemplate({ name: user.name, resetUrl }),
    });

    return true;
};

/**
 * Reset Password
 */
export const resetPassword = async ({ token, password }) => {
    const passwordReset = await findPasswordResetToken(token);

    if (!passwordReset) {
        throw new AppError("Password reset link is invalid or expired.", 400);
    }

    const user = await User.findById(passwordReset.user._id).select("+password");

    if (!user) {
        throw new AppError("User not found.", 404);
    }

    const isSamePassword = await comparePassword(password, user.password);

    if (isSamePassword) {
        throw new AppError(
            "New password must be different from your current password.",
            400
        );
    }

    const hashedPassword = await hashPassword(password);

    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    await Token.deleteOne({ _id: passwordReset._id });

    await deleteUserSessions(user._id);

    return true;
};

/**
 * Validate Password Reset Token (used internally to check before rendering reset page)
 */
export const validatePasswordResetToken = async (token) => {
    const passwordReset = await findPasswordResetToken(token);

    if (!passwordReset) {
        throw new AppError("Password reset link is invalid or expired.", 400);
    }

    return true;
};

/**
 * Logout User
 */
export const logoutUser = async ({ refreshToken }) => {
    if (!refreshToken) {
        return true;
    }

    await deleteSession(refreshToken);

    return true;
};

/**
 * Refresh Access Token
 */
export const refreshUser = async ({ refreshToken }) => {
    if (!refreshToken) {
        throw new AppError("Refresh token missing.", 401);
    }

    try {
        verifyRefreshToken(refreshToken);
    } catch {
        throw new AppError("Invalid or expired refresh token.", 401);
    }

    const session = await findSession(refreshToken);

    if (!session) {
        throw new AppError("Session expired. Please login again.", 401);
    }

    const user = session.user;

    if (!user) {
        throw new AppError("User not found.", 401);
    }

    if (!user.isVerified) {
        throw new AppError("Please verify your email.", 403);
    }

    const accessToken = generateAccessToken({
        userId: user._id,
        email: user.email,
        role: user.role,
    });

    return {
        accessToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
        },
    };
};
