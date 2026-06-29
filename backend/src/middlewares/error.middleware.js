import { ZodError } from "zod";

import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";

const errorHandler = (err, req, res, next) => {
    console.error(err);

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

    // Custom AppError
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

    // Unknown Error
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.SERVER.INTERNAL_ERROR,
    });
};

export default errorHandler;