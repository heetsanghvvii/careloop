import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/firebase/firestore') || id.includes('@firebase/firestore')) {
            return 'vendor-firestore';
          }
          if (id.includes('node_modules/firebase/auth') || id.includes('@firebase/auth')) {
            return 'vendor-auth';
          }
          if (id.includes('node_modules/firebase') || id.includes('@firebase')) {
            return 'vendor-firebase';
          }
        },
      },
    },
  },
});
