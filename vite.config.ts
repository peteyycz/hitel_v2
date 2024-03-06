import { defineConfig } from "vite";

export default defineConfig({
  build: {
    manifest: true,
    rollupOptions: {
      input: "/src/client.tsx",
    },
  },
  server: {
    cors: true,
  },
});
