import Token from "./token.model.js";

import { generateToken, hashToken } from "../../utils/crypto.js";
import { TOKEN_TYPES } from "../../constants/tokenTypes.js";

/**
 * Generic Token Creator
 */
export const createToken = async ({
    userId,
    type,
    expiresInMs,
}) => {
    await Token.deleteMany({
        user: userId,
        type,
    });

    const rawToken = generateToken();

    const tokenHash = hashToken(rawToken);

    const expiresAt = new Date(
        Date.now() + expiresInMs
    );

    await Token.create({
        user: userId,
        tokenHash,
        type,
        expiresAt,
    });

    return rawToken;
};

/**
 * Generic Token Finder
 */
export const findToken = async ({
    token,
    type,
}) => {
    const tokenHash = hashToken(token);

    return await Token.findOne({
        tokenHash,
        type,
    }).populate("user");
};

/**
 * Delete Token
 */
export const deleteToken = async (tokenId) => {
    await Token.deleteOne({
        _id: tokenId,
    });
};

/**
 * Email Verification Token
 */
export const createEmailVerificationToken =
    async (userId) => {
        return createToken({
            userId,
            type: TOKEN_TYPES.EMAIL_VERIFICATION,
            expiresInMs: 60 * 60 * 1000,
        });
    };

export const findVerificationToken =
    async (token) => {
        return findToken({
            token,
            type: TOKEN_TYPES.EMAIL_VERIFICATION,
        });
    };

/**
 * Password Reset Token
 */
export const createPasswordResetToken =
    async (userId) => {
        return createToken({
            userId,
            type: TOKEN_TYPES.PASSWORD_RESET,
            expiresInMs: 15 * 60 * 1000,
        });
    };

export const findPasswordResetToken =
    async (token) => {
        return findToken({
            token,
            type: TOKEN_TYPES.PASSWORD_RESET,
        });
    };