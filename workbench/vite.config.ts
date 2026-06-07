import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Array form with exact regex so the bare-package alias never swallows the
    // '/three' subpath. We point at the library SOURCE for instant HMR.
    alias: [
      {
        find: /^@patternize\/components\/three$/,
        replacement: r('../src/three.ts')
      },
      { find: /^@patternize\/components$/, replacement: r('../src/index.ts') },
      { find: /^@\//, replacement: r('./src/') }
    ],
    // Ensure a single copy of these is shared between the workbench and the
    // library source (which resolves them from the parent node_modules).
    dedupe: [
      'react',
      'react-dom',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      '@react-spring/web'
    ]
  },
  server: {
    fs: {
      // Allow importing files from the parent package (../src, ../node_modules).
      allow: [r('.'), r('..')]
    }
  },
  optimizeDeps: {
    include: ['react-jss', 'd3', '@visx/group', '@visx/shape']
  }
});
