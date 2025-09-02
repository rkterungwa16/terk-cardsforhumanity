import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./client/app";

export function render(url: string, context: Record<string, any> = {}) {
  // Clean the URL for React Router to avoid parameter name errors
  const cleanUrl = url.split("?")[0];

  const html = renderToString(
    <StrictMode>
      <StaticRouter location={cleanUrl}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );

  return { html, context };
}
