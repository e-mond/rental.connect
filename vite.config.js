import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      host: "0.0.0.0",
      strictPort: true,
      cors: true,
      proxy: mode === "development"
        ? {
            "/api": {
              target: env.VITE_API_BASE_URL || "http://localhost:8080",
              changeOrigin: true,
              secure: false,
            },
          }
        : undefined,
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
  };
});
