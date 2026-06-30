import asyncHandler from "../../errors/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import {
    registerUser,
    loginUser,
    verifyEmail,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    validatePasswordResetToken,
    logoutUser,
    refreshUser
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

/**
 * Forgot Password
 */
export const forgot = asyncHandler(
    async (req, res) => {

        await forgotPassword(
            req.validatedData
        );

        return ApiResponse.success(
            res,
            null,
            "If an account exists, a password reset link has been sent."
        );

    }
);

/**
 * Reset Password
 */
export const reset = asyncHandler(
    async (req, res) => {

        await resetPassword(
            req.validatedData
        );

        return ApiResponse.success(
            res,
            null,
            "Password reset successful."
        );

    }
);

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
export const me = asyncHandler(async (req, res) => {

    const user = await getCurrentUser(
        req.user._id
    );

    return ApiResponse.success(
        res,
        user,
        "Current user fetched successfully."
    );

});

export const resetPage = asyncHandler(
    async (req, res) => {

        const { token } = req.query;

        await validatePasswordResetToken(
            token
        );

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
">

<div
style="
background:white;
padding:40px;
border-radius:12px;
text-align:center;
">

<h1>🔑 Password Reset</h1>

<p>
Reset token is valid.
</p>

<p>
Use Postman to send a
<b>POST</b>
request to
</p>

<p>
/api/v1/auth/reset-password
</p>

</div>

</body>

</html>
`);

    }
);


export const logout = asyncHandler(
    async (req, res) => {

        await logoutUser({
            refreshToken:
                req.cookies.refreshToken,
        });

        res.clearCookie(
            "accessToken",
            accessCookieOptions
        );

        res.clearCookie(
            "refreshToken",
            refreshCookieOptions
        );

        return ApiResponse.success(
            res,
            null,
            "Logout successful."
        );

    }
);

export const refresh = asyncHandler(
    async (req, res) => {

        const {
            accessToken,
            user,
        } = await refreshUser({
            refreshToken:
                req.cookies.refreshToken,
        });

        res.cookie(
            "accessToken",
            accessToken,
            accessCookieOptions
        );

        return ApiResponse.success(
            res,
            user,
            "Access token refreshed."
        );

    }
);