import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Spinner from "@/components/ui/Spinner";

export default function ProtectedRoute() {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
