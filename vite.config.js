import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173, // Match the port you’re using (from earlier logs)
    host: "0.0.0.0", // Allow access via IP (e.g., 192.168.0.191)
    strictPort: true, // Fail if port is already in use
    fs: {
      // Ensure Vite can access files in the src directory
      allow: ["."],
    },
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"], // Explicitly include .jsx
  },
});
