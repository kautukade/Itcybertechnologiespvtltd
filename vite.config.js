import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("three") || id.includes("@react-three")) return "three-vendor";
          if (id.includes("@supabase")) return "supabase-vendor";
          if (id.includes("framer-motion")) return "motion-vendor";
          if (id.includes("recharts")) return "charts-vendor";
          if (id.includes("react") || id.includes("scheduler")) return "react-vendor";
          return "vendor";
        },
      },
    },
  },
});
