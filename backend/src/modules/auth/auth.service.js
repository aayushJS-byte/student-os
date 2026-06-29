import User from "../user/user.model.js";
import Token from "../token/token.model.js";

import AppError from "../../errors/AppError.js";
import env from "../../config/env.js";
import { createSession } from "../session/session.service.js";
import { hashPassword, comparePassword } from "../../utils/password.js";

import {
    generateAccessToken,
    generateRefreshToken,
} from "../../utils/jwt.js";

import {
    createEmailVerificationToken,
    findVerificationToken,
} from "../token/token.service.js";

import { sendEmail } from "../../services/email.service.js";

import verifyEmailTemplate from "../../mail/verifyEmail.template.js";

/**
 * Register User
 */
export const registerUser = async ({
    name,
    email,
    password,
}) => {
    const existingUser = await User.findOne({
        email,
    });

    if (existingUser) {
        throw new AppError(
            "Email already registered.",
            409
        );
    }

    const hashedPassword =
        await hashPassword(password);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    // Generate verification token
    const verificationToken =
        await createEmailVerificationToken(
            user._id
        );

    const verificationUrl =
        `http://localhost:${env.PORT}/api/v1/auth/verify-email?token=${verificationToken}`;

    // Send verification email
    await sendEmail({
        to: user.email,
        subject: "Verify your StudentOS Account",
        html: verifyEmailTemplate({
            name: user.name,
            verificationUrl,
        }),
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
export const loginUser = async ({
    email,
    password,
    userAgent,
    ipAddress,
}) => {
    const user = await User.findOne({
        email,
    }).select("+password");

    if (!user) {
        throw new AppError(
            "Invalid email or password.",
            401
        );
    }

    const passwordMatched =
        await comparePassword(
            password,
            user.password
        );

    if (!passwordMatched) {
        throw new AppError(
            "Invalid email or password.",
            401
        );
    }

    if (!user.isVerified) {
        throw new AppError(
            "Please verify your email before logging in.",
            403
        );
    }

    const payload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };

    const accessToken =
        generateAccessToken(payload);

    const refreshToken =
        generateRefreshToken(payload);

    await createSession({
        userId: user._id,
        refreshToken,
        userAgent,
        ipAddress,
    });

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
 * Verify Email
 */
export const verifyEmail = async (token) => {
    const verification =
        await findVerificationToken(token);

    if (!verification) {
        throw new AppError(
            "Verification link is invalid or expired.",
            400
        );
    }

    verification.user.isVerified = true;

    await verification.user.save();

    await Token.deleteOne({
        _id: verification._id,
    });

    return true;
};