import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    // Expose env variables
    define: {
      'process.env': env
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'ui-vendor': ['@radix-ui/react-icons', '@radix-ui/react-slot'],
          }
        }
      }
    },
    server: {
      // Add proper CORS headers for development
      cors: true,
      hmr: {
        overlay: false
      }
    }
  };
});
