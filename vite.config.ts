import { defineConfig } from 'vite';

// The map data (map/data) and the scenario (scenario/) are served by the dev server
// from their places in the repository, so nothing is copied.
export default defineConfig({
  // Live reloading is off: during a demo the page changes only when the presenter reloads it,
  // not every time the coding agent saves a file.
  server: { port: 5173, open: true, hmr: false },
  test: { include: ['tests/**/*.test.ts'] },
});
