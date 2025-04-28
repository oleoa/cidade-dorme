import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";

import "./index.css";
import App from "./App.tsx";

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
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ConvexProvider client={convex}>
        <Layout>
          <App />
        </Layout>
      </ConvexProvider>
    </ClerkProvider>
  </StrictMode>
);
