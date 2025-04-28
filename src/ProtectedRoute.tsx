import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router";
import { toast } from "sonner";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null; // or a loading spinner

  if (!isSignedIn) {
    toast.error("You must be signed in to access this page");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
