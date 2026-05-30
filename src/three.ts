/**
 * Optional three.js-powered entry point.
 *
 *   import { Tensor3D } from '@patternize/components/three';
 *
 * Requires the peer deps `three`, `@react-three/fiber` and
 * `@react-three/drei`. Kept separate so the core package stays lightweight.
 */
export { Tensor3D } from './ml/Tensor3D/Tensor3D';
export type { Tensor3DProps } from './ml/Tensor3D/Tensor3D';
