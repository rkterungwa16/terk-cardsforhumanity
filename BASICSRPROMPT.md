# Basic Server-Side Rendering Implementation Guide for Cards for Humanity

## Overview

This guide provides detailed instructions for implementing Server-Side Rendering (SSR) in the Cards for Humanity project. SSR improves initial page load performance, enhances SEO, and provides a better user experience by rendering React components on the server before sending HTML to the client.

## Prerequisites

- Node.js (v14+)
- npm/yarn
- Express.js backend
- React frontend using Vite

## Implementation Roadmap

1. Configure project dependencies
2. Create server entry point
3. Update client entry for hydration
4. Configure Vite for SSR builds
5. Create build scripts
6. Test and deploy

## Detailed Implementation Steps

### 1. Install Required Dependencies

```bash
npm install compression express react react-dom react-router-dom
```

### 2. Configure Vite for SSR Support

Update `vite.config.ts` to support both client and server builds:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === "production";
  const isSsr = process.env.SSR === "true";

  return {
    plugins: [react()],
    build: {
      minify: isProduction,
      ssr: isSsr ? "./src/entry-server.tsx" : false,
      outDir: isSsr ? "dist/server" : "dist/client",
      rollupOptions: {
        input: isSsr
          ? "./src/entry-server.tsx"
          : resolve(__dirname, "index.html"),
        output: {
          format: isSsr ? "cjs" : "es",
        },
      },
      manifest: !isSsr,
      ssrManifest: !isSsr,
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    server: {
      port: 3000,
    },
  };
});
```

### 3. Create Server-Side Entry Point

Create a server entry point file at `src/entry-server.tsx`:

```tsx
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
```

### 4. Create Client-Side Entry for Hydration

Update the client entry point at `src/client/main.tsx`:

```tsx
import { StrictMode } from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./app.tsx";

// Get the DOM element where we'll mount our app
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// Create the app element with proper routing
const app = (
  <StrictMode>
    <BrowserRouter>
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
```

### 5. Create Simple Server Implementation

Create a file called `simple-server.js` in the project root:

```javascript
#!/usr/bin/env node

/**
 * Simple Server Script for Cards for Humanity with SSR
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const cors = require('cors');

// Load environment variables if dotenv is available
try {
  require('dotenv').config();
} catch (e) {
  console.log('dotenv not available, continuing without it');
}

// Create Express app
const app = express();
const port = process.env.PORT || 3200;

// Set up basic middleware
app.use(cors());
app.use(compression());
app.use(express.json());

// Define root directory for static assets
const rootPath = path.join(__dirname, 'dist');
const clientPath = path.join(rootPath, 'client');

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static assets from the client build directory
// Explicitly avoid serving index.html from static middleware
app.use(express.static(clientPath, { index: false }));

// Read the template once at startup
let htmlTemplate;
try {
  const templatePath = path.join(clientPath, 'index.html');
  htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
  console.log('HTML template loaded successfully');
} catch (error) {
  console.error(`Failed to load HTML template: ${error.message}`);
  htmlTemplate = `<!DOCTYPE html>
<html>
<head>
  <title>Cards for Humanity</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/client/main.tsx"></script>
</body>
</html>`;
}

// Helper function to render a page
function renderPage(req, res) {
  const content = `
    <div style="font-family: sans-serif; padding: 2rem; text-align: center;">
      <h1>Cards for Humanity</h1>
      <p>This page was rendered on the server at ${new Date().toISOString()}</p>
      <p>Path: ${req.originalUrl}</p>
      <nav style="margin-top: 20px;">
        <a href="/" style="margin-right: 15px;">Home</a>
        <a href="/dashboard" style="margin-right: 15px;">Dashboard</a>
        <a href="/play">Play Game</a>
      </nav>
    </div>
  `;

  const html = htmlTemplate.replace(
    '<div id="root"></div>',
    `<div id="root">${content}</div>`
  );

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}

// Define explicit routes instead of using wildcards
app.get('/', (req, res) => {
  renderPage(req, res);
});

app.get('/dashboard', (req, res) => {
  renderPage(req, res);
});

app.get('/play', (req, res) => {
  renderPage(req, res);
});

// Default route handler for any undefined routes
app.get('/404', (req, res) => {
  res.status(404);
  renderPage(req, res);
});

// Redirect any other GET requests to home
app.get('/:anything', (req, res) => {
  res.redirect('/');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(`Error processing request: ${err.message}`, err.stack);
  res.status(500).send('Server error occurred');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Visit: http://localhost:${port}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error(`Uncaught Exception: ${error.message}`, error.stack);
  // Avoid immediate exit to give pending requests a chance to complete
  setTimeout(() => process.exit(1), 1000);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
```

### 6. Update package.json Scripts

Update your `package.json` with the following scripts:

```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=production node simple-server.js",
    "build": "npm run build:client && npm run prepare:ssr",
    "build:client": "tsc -b tsconfig.client.json && vite build",
    "build:server": "tsc -b tsconfig.server.json && cross-env SSR=true vite build",
    "start:dev:ssr": "nodemon --exec \"npm run build:client && node simple-server.js\"",
    "prepare:ssr": "mkdir -p dist/server && echo '{\"ssr\":true}' > dist/server/ssr-manifest.json"
  }
}
```

### 7. Update App Component for SSR Compatibility

Ensure your React App component (`src/client/app.tsx`) is SSR-compatible:

```tsx
import { Component, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

// Component definitions
const HomePage = () => (
  <div style={{
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3rem",
    fontWeight: "600",
  }}>
    HOME
  </div>
);

const DashboardPage = () => (
  <div style={{
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3rem",
    fontWeight: "600",
  }}>
    DASHBOARD
  </div>
);

const PlayPage = () => (
  <div style={{
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3rem",
    fontWeight: "600",
  }}>
    PLAY
  </div>
);

class App extends Component {
  render() {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="dashboard"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <DashboardPage />
            </Suspense>
          }
        />
        <Route
          path="play"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <PlayPage />
            </Suspense>
          }
        />
      </Routes>
    );
  }
}

export default App;
```

### 8. Update HTML Template

Make sure your `index.html` is prepared for SSR:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cards for Humanity</title>
    <!--ssr-head-->
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/client/main.tsx"></script>
  </body>
</html>
```

## Build and Run Process

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the server:

   ```bash
   npm start
   ```

## Common Issues and Troubleshooting

### 1. path-to-regexp Error

If you encounter `TypeError: Missing parameter name at 1: https://git.new/pathToRegexpError`, this is typically due to issues with how Express and React Router handle wildcards. Solutions:

- Use explicit routes instead of wildcards
- Avoid using `app.use('*', ...)` and prefer `app.get('/:path', ...)`
- Clean URLs before passing them to React Router

### 2. Assets Not Found

If client-side assets aren't being served:

- Check static asset path configuration
- Verify the `dist/client` directory contains the expected files
- Make sure Express static middleware is configured correctly

### 3. Hydration Errors

If you see hydration mismatch warnings:

- Ensure the server and client render the same content
- Check for components that use browser-only APIs
- Use `useEffect` for browser-specific code

## Advanced Enhancements

Once basic SSR is working, consider these enhancements:

1. **Data Fetching**: Implement a data fetching strategy for SSR (Redux, React Query, etc.)
2. **Code Splitting**: Set up code splitting that works with SSR
3. **Performance Optimization**: Add caching and optimizations for frequently rendered pages
4. **SEO Improvements**: Add metadata and structured data for better SEO

## Testing Your SSR Implementation

1. View source on pages to confirm server-rendered HTML
2. Disable JavaScript and verify the page still displays content
3. Use Lighthouse or similar tools to measure performance improvements
4. Test with slow internet connections to see improved initial load times

## Conclusion

This implementation provides a basic but effective SSR setup for the Cards for Humanity project. It delivers the core benefits of SSR while maintaining the development experience of a modern React application.

Follow these steps carefully, paying special attention to the file paths and configurations specific to your project structure. Server-side rendering can significantly improve user experience and SEO for your application.
