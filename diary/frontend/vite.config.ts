import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import analyzer from "vite-bundle-analyzer";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  server: {
      open: false,
  },
  plugins: [
      react(),
      analyzer(),
  ],
    resolve: {
      alias: {
          "@": path.resolve(__dirname, "./src"),
      }
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vue: ['vue'],
                    'vendor': ['axios', 'pinia', 'vue-router'],
                }
            }
        }
    }
})
