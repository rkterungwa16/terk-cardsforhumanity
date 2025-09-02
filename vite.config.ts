import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";

// https://vite.dev/config/
// export default defineConfig(({ command, mode }) => {
//   const isProduction = mode === "production";
//   const isSsr = process.env.SSR === "true";

//   return {
//     plugins: [react()],
//     build: {
//       minify: isProduction,
//       ssr: isSsr ? "./src/entry-server.tsx" : false,
//       outDir: isSsr ? "dist/server" : "dist/client",
//       rollupOptions: {
//         input: isSsr
//           ? "./src/entry-server.tsx"
//           : resolve(__dirname, "index.html"),
//         output: {
//           format: isSsr ? "cjs" : "es",
//         },
//       },
//       manifest: !isSsr,
//       ssrManifest: !isSsr,
//     },
//     resolve: {
//       alias: {
//         "@": resolve(__dirname, "src"),
//       },
//     },
//     server: {
//       port: 3000,
//       strictPort: true,
//     },
//     optimizeDeps: {
//       // Don't optimize these dependencies when building for SSR
//       disabled: isSsr,
//     },
//     // Use consistent chunk names for better SSR handling
//     assetsInclude: ["**/*.html"],
//   };
// });

export default defineConfig({
  plugins: [react()],
})
