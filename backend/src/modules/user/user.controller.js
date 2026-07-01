import ApiResponse from "../../utils/ApiResponse.js";
import { updateProfile, changePassword } from "./user.service.js";
import { updateProfileSchema, changePasswordSchema } from "./user.validator.js";

export const updateProfileController = async (req, res) => {
    const data = updateProfileSchema.parse(req.body);
    const user = await updateProfile(req.user._id, data);
    return ApiResponse.success(res, { user }, "Profile updated.");
};

export const changePasswordController = async (req, res) => {
    const data = changePasswordSchema.parse(req.body);
    await changePassword(req.user._id, data);
    return ApiResponse.success(res, null, "Password changed successfully.");
};
