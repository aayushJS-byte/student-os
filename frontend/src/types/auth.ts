export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  password: string;
  confirmPassword: string;
}

// Shape returned by POST /auth/register
export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
}

// Shape returned by POST /auth/login (tokens are in HttpOnly cookies)
export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}
