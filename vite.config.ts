import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

function maplibreWorkerPlugin() {
  return {
    name: 'maplibre-worker-copy',
    buildStart() {
      const publicMaplibreDir = path.resolve(__dirname, 'public/maplibre');
      const distDir = path.resolve(__dirname, 'node_modules/maplibre-gl/dist');
      if (fs.existsSync(distDir)) {
        if (!fs.existsSync(publicMaplibreDir)) {
          fs.mkdirSync(publicMaplibreDir, { recursive: true });
        }
        const filesToCopy = [
          'maplibre-gl-worker.mjs',
          'maplibre-gl-worker-dev.mjs',
          'maplibre-gl-shared.mjs',
          'maplibre-gl-shared-dev.mjs',
        ];
        for (const file of filesToCopy) {
          const src = path.join(distDir, file);
          const dest = path.join(publicMaplibreDir, file);
          if (fs.existsSync(src) && !fs.existsSync(dest)) {
            fs.copyFileSync(src, dest);
          }
        }
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), maplibreWorkerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

