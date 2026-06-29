import asyncHandler from "../../errors/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import {
    registerUser,
    loginUser,
    verifyEmail,
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
    const {
        user,
        accessToken,
        refreshToken,
    } = await loginUser({
        ...req.validatedData,
        userAgent: req.headers["user-agent"] || "",
        ipAddress: req.ip,
    });

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

export const verify = asyncHandler(async (req, res) => {
    const { token } = req.query;

    await verifyEmail(token);

    return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>StudentOS</title>
        </head>

        <body
            style="
                font-family:Arial;
                display:flex;
                justify-content:center;
                align-items:center;
                height:100vh;
                background:#f5f5f5;
            "
        >
            <div
                style="
                    background:white;
                    padding:40px;
                    border-radius:12px;
                    text-align:center;
                "
            >
                <h1>✅ Email Verified</h1>

                <p>
                    Your StudentOS account has been activated.
                </p>

                <p>
                    You can now login.
                </p>

            </div>
        </body>
        </html>
    `);
});