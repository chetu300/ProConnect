import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { user, checkingLogin } = useAuth();

  if (checkingLogin) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </main>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
