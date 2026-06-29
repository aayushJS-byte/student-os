import User from "../user/user.model.js";
import { hashPassword } from "../../utils/password.js";
import AppError from "../../errors/AppError.js";

export const registerUser = async (data) => {
    const { name, email, password } = data;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new AppError("Email already registered.", 409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
    };
};