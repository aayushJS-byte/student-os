import { api } from "@/api/axios";
import type { ApiResponse } from "@/types/api";
import type {
  AuthResponse,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  RegisterResponse,
  ResetPasswordInput,
} from "@/types/auth";
import type { User } from "@/types/user";

export const AuthService = {
  // confirmPassword is a frontend-only field; backend validates only name/email/password
  register({ confirmPassword: _c, ...rest }: RegisterInput) {
    return api.post<ApiResponse<RegisterResponse>>("/auth/register", rest);
  },

  login(data: LoginInput) {
    return api.post<ApiResponse<AuthResponse>>("/auth/login", data);
  },

  logout() {
    return api.post<ApiResponse<null>>("/auth/logout");
  },

  me() {
    return api.get<ApiResponse<User>>("/auth/me");
  },

  refresh() {
    return api.post<ApiResponse<User>>("/auth/refresh");
  },

  forgotPassword(data: ForgotPasswordInput) {
    return api.post<ApiResponse<null>>("/auth/forgot-password", data);
  },

  // token goes as query param; confirmPassword is frontend-only
  resetPassword(token: string, { confirmPassword: _c, password }: ResetPasswordInput) {
    return api.post<ApiResponse<null>>(
      `/auth/reset-password?token=${token}`,
      { password }
    );
  },

  verifyEmail(token: string) {
    return api.get<ApiResponse<null>>(`/auth/verify-email?token=${token}`);
  },
};
