import User from "../modules/user/user.model.js";
import AppError from "../errors/AppError.js";

import { verifyAccessToken } from "../utils/jwt.js";

const protect = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            throw new AppError(
                "Authentication required.",
                401
            );
        }

        const payload = verifyAccessToken(token);

        const user = await User.findById(
            payload.userId
        );

        if (!user) {
            throw new AppError(
                "User not found.",
                401
            );
        }

        req.user = user;

        next();

    } catch (error) {
        next(error);
    }
};

export default protect;