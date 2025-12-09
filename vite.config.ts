import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Map the GEMINI_API_KEY from Vercel to process.env.API_KEY for the app
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.API_KEY)
    }
  };
});