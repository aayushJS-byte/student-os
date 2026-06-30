import { Navigate, Route, Routes } from "react-router-dom";

import RootLayout from "@/layouts/RootLayout";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

import HomePage from "@/pages/home/HomePage";
import LoginPage from "@/pages/auth/Login/LoginPage";
import RegisterPage from "@/pages/auth/Register/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPassword/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPassword/ResetPasswordPage";
import VerifyEmailPage from "@/pages/auth/VerifyEmail/VerifyEmailPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import NotFoundPage from "@/pages/error/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Guest-only (redirect to /dashboard if authenticated) */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Protected (redirect to /login if unauthenticated) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
