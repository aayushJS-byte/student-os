import Token from "./token.model.js";

import { generateToken, hashToken } from "../../utils/crypto.js";
import { TOKEN_TYPES } from "../../constants/tokenTypes.js";

export const createEmailVerificationToken = async (userId) => {
    await Token.deleteMany({
        user: userId,
        type: TOKEN_TYPES.EMAIL_VERIFICATION,
    });

    const rawToken = generateToken();

    const tokenHash = hashToken(rawToken);

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await Token.create({
        user: userId,
        tokenHash,
        type: TOKEN_TYPES.EMAIL_VERIFICATION,
        expiresAt,
    });

    return rawToken;
};
export const findVerificationToken = async (token) => {
    const tokenHash = hashToken(token);

    return await Token.findOne({
        tokenHash,
        type: TOKEN_TYPES.EMAIL_VERIFICATION,
    }).populate("user");
};