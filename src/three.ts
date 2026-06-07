/**
 * Optional three.js-powered entry point.
 *
 *   import { Tensor3D, Transformer3D } from '@patternize/components/three';
 *
 * Requires the peer deps `three`, `@react-three/fiber` and
 * `@react-three/drei`. Kept separate so the core package stays lightweight.
 */
export { Tensor3D } from './ml/Tensor3D/Tensor3D';
export type { Tensor3DProps } from './ml/Tensor3D/Tensor3D';

export { Transformer3D } from './ml/Transformer3D/Transformer3D';
export type {
  Transformer3DProps,
  TransformerStackSpec,
  TransformerLayerSpec,
  LayerKind
} from './ml/Transformer3D/Transformer3D';
