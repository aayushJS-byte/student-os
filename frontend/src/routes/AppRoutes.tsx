import { Navigate, Route, Routes } from "react-router-dom";

import RootLayout from "@/layouts/RootLayout";
import AppShell from "@/layouts/AppShell";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

import LoginPage from "@/pages/auth/Login/LoginPage";
import RegisterPage from "@/pages/auth/Register/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPassword/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPassword/ResetPasswordPage";
import VerifyEmailPage from "@/pages/auth/VerifyEmail/VerifyEmailPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import ApplicationsPage from "@/pages/applications/ApplicationsPage";
import ApplicationDetailPage from "@/pages/applications/ApplicationDetailPage";
import OffersPage from "@/pages/offers/OffersPage";
import PrepPage from "@/pages/prep/PrepPage";
import CalendarPage from "@/pages/calendar/CalendarPage";
import NotFoundPage from "@/pages/error/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Public */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth layout (split-screen landing + forms) */}
        <Route element={<AuthLayout />}>
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Guest-only (redirect to /dashboard if authenticated) */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>
        </Route>

        {/* Protected (redirect to /login if unauthenticated) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/applications/:id" element={<ApplicationDetailPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/prep" element={<PrepPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Route>
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
