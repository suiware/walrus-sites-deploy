import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  entryPoints: ['src/index.ts'],
  format: ['cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  ...options,
}))
