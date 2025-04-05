import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  entryPoints: [
    'src/index.ts'
  ],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  ...options,
}))
