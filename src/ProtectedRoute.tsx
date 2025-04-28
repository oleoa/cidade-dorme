import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null; // or a loading spinner

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
