import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes } from "react-router";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import ProtectedRoute from "./ProtectedRoute";

import "./index.css";
import App from "./App.tsx";
import Profile from "./Profile.tsx";
import Room from "./Room.tsx";

// CLERK
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

// CONVEX
import Layout from "./Layout.tsx";
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <Layout>
            <Routes>
              <Route path="/" element={<App />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/room/:room_id" element={<Room />} />
            </Routes>
          </Layout>
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
);
