import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/three.ts'],
  format: ['esm', 'cjs'],
  // Explicit modern target so esbuild never falls back to swc (es5).
  target: 'es2020',
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  // Heavy / peer libraries should never be bundled into the package output.
  external: [
    'react',
    'react-dom',
    'three',
    '@react-three/fiber',
    '@react-three/drei'
  ]
});
