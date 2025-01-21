import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env.SUPABASE_PROJECT_ID': JSON.stringify('skocnzoyobnoyyegfzdt'),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrb2Nuem95b2Jub3l5ZWdmemR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxNDIxODksImV4cCI6MjA1MjcxODE4OX0.Ql_yqfY3VoILYMG1iYHiNxD-aOM4dSLIMiPAN4CFQog'),
  },
}));