import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes } from "react-router";

import "./index.css";
import App from "./App.tsx";
import Profile from "./Profile.tsx";
// CLERK
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

// CONVEX
import { ConvexProvider, ConvexReactClient } from "convex/react";
import Layout from "./Layout.tsx";
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <ConvexProvider client={convex}>
          <Layout>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Layout>
        </ConvexProvider>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
);
