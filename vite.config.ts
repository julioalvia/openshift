import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "core": path.resolve(__dirname, "./src/core"),
      "presentation": path.resolve(__dirname, "./src/presentation"),
      "shared": path.resolve(__dirname, "./src/shared"),
      "utils": path.resolve(__dirname, "./src/utils"),
      "store": path.resolve(__dirname, "./src/store"),
      "routing": path.resolve(__dirname, "./src/routing"),
    },
  },
})