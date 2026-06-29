import asyncHandler from "../../errors/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { registerUser } from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
    const user = await registerUser(req.validatedData);

    return ApiResponse.success(
        res,
        user,
        "Registration successful.",
        201
    );
});