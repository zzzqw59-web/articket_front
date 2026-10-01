import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // /api로 시작하는 요청을 백엔드 Spring Boot 서버(8080)로 전달
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});