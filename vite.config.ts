import { defineConfig } from 'vite';
import solid from '@solidjs/vite-plugin';
import path from "path";
import { buildInfo } from "@mgcrea/vite-plugin-build-info";

export default defineConfig({
  plugins: [
    solid({ start: true, diagnostics: false, ssr : false }),
    buildInfo(),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    assetsInlineLimit: 0,
  },
  resolve: {
        alias: {
            "~": path.resolve(import.meta.dirname, "src")
        }
    },
});
