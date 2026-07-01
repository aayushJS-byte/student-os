import env from "../config/env.js";

const isProduction = env.NODE_ENV === "production";

// In production, frontend (Vercel) and backend (Render) are on different domains.
// SameSite must be "none" + Secure:true to allow cross-origin cookies.
// In development, "lax" works fine over localhost with the Vite proxy.
export const accessCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
};

export const refreshCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};