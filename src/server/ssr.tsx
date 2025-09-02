import { Request, Response } from "express";
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "../client/app";
import fs from "fs";
import path from "path";
import { createAppLogger } from "./middlewares/logger.middleware";

const logger = createAppLogger("SSR");

// Read the index.html template
const getTemplate = () => {
  try {
    // When running from dist/server-entry.js, client files are in dist/client
    const templatePath = path.resolve(__dirname, "../client/index.html");
    return fs.readFileSync(templatePath, "utf-8");
  } catch (err) {
    logger.log({
      level: "error",
      message: `Failed to read index.html template: ${err}`,
    });
    // Try alternative path as fallback
    try {
      const altPath = path.resolve(__dirname, "../../dist/client/index.html");
      return fs.readFileSync(altPath, "utf-8");
    } catch (altErr) {
      logger.log({
        level: "error",
        message: `Failed to read index.html from alternate path: ${altErr}`,
      });
      return "";
    }
  }
};

// Server-side render function
export const render = (req: Request, res: Response) => {
  try {
    const url = req.originalUrl;
    const template = getTemplate();

    if (!template) {
      return res.status(500).send("Server error: Template not found");
    }

    // Clean the URL for React Router
    const cleanUrl = url.split("?")[0];

    // Render the React app to string
    let appHtml;
    try {
      appHtml = renderToString(
        <StrictMode>
          <StaticRouter location={cleanUrl}>
            <App />
          </StaticRouter>
        </StrictMode>,
      );
    } catch (renderError) {
      logger.log({
        level: "error",
        message: `Failed to render React app: ${renderError}`,
      });
      appHtml = `<div id="root">
        <h1>Error rendering page</h1>
        <p>The application encountered an error while rendering.</p>
      </div>`;
    }

    // Replace the root div with our server-rendered HTML
    const html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`,
    );

    // Send the rendered HTML back to the client
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (error) {
    logger.log({
      level: "error",
      message: `SSR error: ${error}`,
    });
    res.status(500).send("Server error during rendering");
  }
};

// Middleware for handling SSR
export const ssrMiddleware = (req: Request, res: Response, next: Function) => {
  // Skip API routes and static asset routes
  if (
    req.path.startsWith("/api") ||
    req.path.startsWith("/assets/") ||
    req.path.includes(".")
  ) {
    return next();
  }

  // Log the attempt to render a page
  logger.log({
    level: "info",
    message: `SSR rendering page: ${req.originalUrl}`,
  });

  render(req, res);
};
