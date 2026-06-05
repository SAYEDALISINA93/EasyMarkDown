import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { renameSync, existsSync, readFileSync, writeFileSync, rmSync } from "fs";

function fixExtensionPaths(html: string): string {
  return html.replace(/(src|href)="\/assets\//g, '$1="assets/');
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: "extension-html-fix",
      closeBundle() {
        const pairs: [string, string][] = [
          ["dist/src/popup/index.html", "dist/popup.html"],
          ["dist/src/viewer/index.html", "dist/viewer.html"],
        ];
        for (const [from, to] of pairs) {
          if (existsSync(from)) {
            writeFileSync(to, fixExtensionPaths(readFileSync(from, "utf-8")));
          }
        }
        // Remove the nested src/ directory left by Vite
        if (existsSync("dist/src")) {
          rmSync("dist/src", { recursive: true, force: true });
        }
      },
    },
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup/index.html"),
        viewer: resolve(__dirname, "src/viewer/index.html"),
      },
      output: {
        assetFileNames: "assets/[name]-[hash].[ext]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
  },
  publicDir: "public",
});
