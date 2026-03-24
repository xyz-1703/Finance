import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
<<<<<<< HEAD
    port: 5174,
    strictPort: true,
=======
    port: 5173,
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
  },
});
