import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/FreedomTravelOS-P/",
  server: {
    watch: {
      // Ignore the release folder (contains large/locked files like the QR/zip)
      ignored: ['**/release/**']
    }
  }
});
