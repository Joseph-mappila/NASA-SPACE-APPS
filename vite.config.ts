import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// GitHub Pages serves project sites from https://<user>.github.io/<repo>/,
// so the bundle needs that sub-path. Local dev and the tests keep using '/'.
const env = (
  globalThis as { process?: { env?: Record<string, string | undefined> } }
).process?.env
const repository = env?.GITHUB_REPOSITORY?.split('/')[1]
const base =
  env?.GITHUB_ACTIONS === 'true' && repository ? `/${repository}/` : '/'

export default defineConfig({
  base,
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
