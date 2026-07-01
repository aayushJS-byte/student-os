import Session from "./session.model.js";
import { hashToken } from "../../utils/crypto.js";

export const createSession = async ({
    userId,
    refreshToken,
    userAgent,
    ipAddress,
}) => {

    const refreshTokenHash =
        hashToken(refreshToken);

    const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    await Session.create({
        user: userId,
        refreshTokenHash,
        expiresAt,
        userAgent,
        ipAddress,
    });
};

export const findSession = async (
    refreshToken
) => {

    const refreshTokenHash =
        hashToken(refreshToken);

    return Session.findOne({
        refreshTokenHash,
    }).populate("user");
};

export const deleteSession = async (
    refreshToken
) => {

    const refreshTokenHash =
        hashToken(refreshToken);

    await Session.deleteOne({
        refreshTokenHash,
    });
};

/**
 * Delete all sessions for a user.
 */
export const deleteUserSessions = async (
    userId
) => {

    await Session.deleteMany({
        user: userId,
    });

};