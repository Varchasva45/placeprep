import { defineConfig } from "vite";
import tailwindcss from "tailwindcss";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, './src/.env') });

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  define: {
    global: {},
  },
});
