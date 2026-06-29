import User from "../user/user.model.js";

import AppError from "../../errors/AppError.js";

import { hashPassword, comparePassword } from "../../utils/password.js";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../../utils/jwt.js";
import { createEmailVerificationToken } from "../token/token.service.js";
/**
 * Register User
 */
export const registerUser = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new AppError("Email already registered.", 409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });
    const verificationToken =
    await createEmailVerificationToken(user._id);

    console.log("Verification Token:", verificationToken);
    return {
        id: user._id,
        name: user.name,
        email: user.email,
    };
};

/**
 * Login User
 */
export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new AppError("Invalid email or password.", 401);
    }

    const isPasswordCorrect = await comparePassword(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        throw new AppError("Invalid email or password.", 401);
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

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

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