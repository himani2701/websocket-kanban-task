import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    strictPort: true,
    open: true,
  },
  preview: {
    port: 3000,
    strictPort: true,
    open: true,
  },
  test: {
    mockReset: true,
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    // Adjusted to exclude your new root-level e2e folder
    exclude: ["node_modules", "tests/e2e/**"], 
    include: ["tests/unit/**/*.{test,spec}.{js,jsx}", "tests/integration/**/*.{test,spec}.{js,jsx}"],
  },
  plugins: [react()],
});