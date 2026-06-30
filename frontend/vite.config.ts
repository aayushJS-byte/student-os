import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },

    server: {
        proxy: {
            // All /api requests are forwarded to the backend — browser sees same origin
            "/api": {
                target: "http://localhost:8000",
                changeOrigin: true,
            },
        },
    },
});
