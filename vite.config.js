import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import portfolioAdmin from './tools/portfolio-admin.js';

// Verify local public asset paths before offering links such as the resume.
function publicAssetManifest() {
  const id = 'virtual:public-assets';
  let root;
  return {
    name: 'public-asset-manifest',
    configResolved(config) {
      root = config.publicDir;
    },
    resolveId(source) {
      if (source === id) return `\0${id}`;
    },
    load(source) {
      if (source !== `\0${id}`) return;
      const walk = (directory, prefix = '') =>
        existsSync(directory)
          ? readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
              const path = `${prefix}/${entry.name}`;
              return entry.isDirectory() ? walk(resolve(directory, entry.name), path) : [path];
            })
          : [];
      return `export default ${JSON.stringify(walk(root))}`;
    },
    configureServer(server) {
      server.watcher.add(root);
      const refresh = (file) => {
        if (!file.startsWith(root)) return;
        const module = server.moduleGraph.getModuleById(`\0${id}`);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', refresh).on('unlink', refresh);
    },
  };
}
export default defineConfig({
  plugins: [react(), tailwindcss(), publicAssetManifest(), portfolioAdmin()],
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    include: ['tests/**/*.test.{js,jsx}'],
    css: false,
  },
});
