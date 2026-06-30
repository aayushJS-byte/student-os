import { ZodError } from "zod";

import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";

const errorHandler = (err, req, res, next) => {
    // Only log genuine server errors — auth/validation failures are operational
    const isExpected =
        err.statusCode ||
        err instanceof ZodError ||
        err.name === "TokenExpiredError" ||
        err.name === "JsonWebTokenError";

    if (!isExpected) {
        console.error(err);
    }

    // Zod Validation
    if (err instanceof ZodError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: MESSAGES.VALIDATION.FAILED,
            errors: err.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }

    // Custom AppError (401, 403, 404, 409, etc.)
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    // Mongoose Duplicate Key
    if (err.code === 11000) {
        return res.status(HTTP_STATUS.CONFLICT).json({
            success: false,
            message: "Duplicate value found.",
        });
    }

    // JWT Expired
    if (err.name === "TokenExpiredError") {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            message: "Access token expired.",
        });
    }

    // Invalid JWT
    if (err.name === "JsonWebTokenError") {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            message: "Invalid access token.",
        });
    }

    // Unknown
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.SERVER.INTERNAL_ERROR,
    });
};

export default errorHandler;
