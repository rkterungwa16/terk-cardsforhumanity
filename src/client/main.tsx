import { StrictMode } from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./app.tsx";

/**
 * Client-side entry point for the application
 * Handles both hydration (for SSR) and regular rendering
 */

// Get the DOM element where we'll mount our app
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// Create the app element with proper routing
const app = (
  <StrictMode>
    <BrowserRouter basename="/">
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Check if the app was server-rendered by looking for content
const hasPrerenderedContent = rootElement.innerHTML.trim().length > 0;

if (hasPrerenderedContent) {
  // For SSR: Hydrate the existing DOM content
  hydrateRoot(rootElement, app);
} else {
  // For development/CSR: Create a new root
  createRoot(rootElement).render(app);
}
