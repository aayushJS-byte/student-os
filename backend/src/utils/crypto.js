import crypto from "crypto";

/**
 * Generates a secure random token.
 */
export const generateToken = () => {
    return crypto.randomBytes(32).toString("hex");
};

/**
 * Hashes a token before storing it.
 */
export const hashToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};