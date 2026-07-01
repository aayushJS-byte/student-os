import User from "./user.model.js";
import AppError from "../../errors/AppError.js";
import { comparePassword, hashPassword } from "../../utils/password.js";

export const updateProfile = async (userId, { name }) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { name },
        { new: true, runValidators: true }
    );
    if (!user) throw new AppError("User not found.", 404);
    return { id: user._id, name: user.name, email: user.email, role: user.role };
};

export const changePassword = async (userId, { currentPassword, newPassword }) => {
    const user = await User.findById(userId).select("+password");
    if (!user) throw new AppError("User not found.", 404);

    const matches = await comparePassword(currentPassword, user.password);
    if (!matches) throw new AppError("Current password is incorrect.", 400);

    const same = await comparePassword(newPassword, user.password);
    if (same) throw new AppError("New password must be different from your current password.", 400);

    user.password = await hashPassword(newPassword);
    await user.save();
    return true;
};
