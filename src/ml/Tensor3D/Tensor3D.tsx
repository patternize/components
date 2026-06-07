import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../theme/ThemeProvider';
import { Theme } from '../../theme/tokens';
import { mix } from '../../theme/color';
import { makeRng } from '../shared/random';

export interface Tensor3DProps {
  /** 3D data as `data[depth][height][width]`. Synthesized when omitted. */
  data?: number[][][];
  /** Shape `[depth, height, width]` used when synthesizing data. */
  shape?: [number, number, number];
  /** Base color for the voxel ramp (defaults to the theme primary). */
  color?: string;
  /** Gap between voxels as a fraction of voxel size (0..1). */
  gap?: number;
  /** Auto-rotate the tensor. */
  spin?: boolean;
  /** Allow click-drag orbit. */
  controls?: boolean;
  /** Cap on rendered voxels; larger tensors are downsampled to fit. */
  maxVoxels?: number;
  width?: number | string;
  height?: number;
  seed?: number;
  style?: React.CSSProperties;
}

const synthTensor = (
  d: number,
  h: number,
  w: number,
  seed: number
): number[][][] => {
  const rng = makeRng(seed);
  const out: number[][][] = [];
  for (let z = 0; z < d; z++) {
    const plane: number[][] = [];
    for (let y = 0; y < h; y++) {
      const row: number[] = [];
      for (let x = 0; x < w; x++) row.push(rng());
      plane.push(row);
    }
    out.push(plane);
  }
  return out;
};

interface VoxelsProps {
  data: number[][][];
  color: string;
  gap: number;
  theme: Theme;
}

const Voxels = ({ data, color, gap, theme }: VoxelsProps) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const d = data.length;
  const h = data[0]?.length ?? 0;
  const w = data[0]?.[0]?.length ?? 0;
  const count = d * h * w;

  // Normalize the data domain for coloring.
  const { min, max } = useMemo(() => {
    let lo = Infinity;
    let hi = -Infinity;
    for (const plane of data)
      for (const row of plane)
        for (const v of row) {
          if (v < lo) lo = v;
          if (v > hi) hi = v;
        }
    if (!isFinite(lo)) return { min: 0, max: 1 };
    return { min: lo, max: hi };
  }, [data]);

  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const cellColor = new THREE.Color();
    const step = 1 + gap;
    const offX = ((w - 1) * step) / 2;
    const offY = ((h - 1) * step) / 2;
    const offZ = ((d - 1) * step) / 2;
    let i = 0;
    for (let z = 0; z < d; z++) {
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          dummy.position.set(x * step - offX, offY - y * step, z * step - offZ);
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
          const t = max === min ? 0.5 : (data[z][y][x] - min) / (max - min);
          cellColor.set(mix('#ffffff', color, 0.15 + 0.85 * t));
          mesh.setColorAt(i, cellColor);
          i++;
        }
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [data, color, gap, d, h, w, min, max]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.55} metalness={0.05} />
    </instancedMesh>
  );
};

/**
 * Renders a 3D tensor as a block of colored voxels (a literal cube of
 * numbers) with orbit + auto-spin. This is the building block for showing
 * activation volumes / feature maps in CNNs and transformer hidden states.
 *
 * Imported from the optional `@patternize/components/three` entry point so the
 * core package never forces three.js on consumers.
 */
export const Tensor3D = ({
  data,
  shape = [4, 6, 6],
  color,
  gap = 0.12,
  spin = true,
  controls = true,
  maxVoxels = 4096,
  width = 360,
  height = 320,
  seed = 11,
  style
}: Tensor3DProps) => {
  const theme = useTheme();

  const tensor = useMemo(() => {
    const raw = data ?? synthTensor(shape[0], shape[1], shape[2], seed);
    // Downsample if the tensor exceeds the voxel budget.
    const d = raw.length;
    const h = raw[0]?.length ?? 0;
    const w = raw[0]?.[0]?.length ?? 0;
    if (d * h * w <= maxVoxels) return raw;
    const scale = Math.cbrt(maxVoxels / (d * h * w));
    const nd = Math.max(1, Math.floor(d * scale));
    const nh = Math.max(1, Math.floor(h * scale));
    const nw = Math.max(1, Math.floor(w * scale));
    const out: number[][][] = [];
    for (let z = 0; z < nd; z++) {
      const plane: number[][] = [];
      for (let y = 0; y < nh; y++) {
        const row: number[] = [];
        for (let x = 0; x < nw; x++) {
          row.push(
            raw[Math.floor((z / nd) * d)][Math.floor((y / nh) * h)][
              Math.floor((x / nw) * w)
            ]
          );
        }
        plane.push(row);
      }
      out.push(plane);
    }
    return out;
  }, [data, shape, seed, maxVoxels]);

  const dims: [number, number, number] = [
    tensor.length,
    tensor[0]?.length ?? 0,
    tensor[0]?.[0]?.length ?? 0
  ];

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        borderRadius: theme.radius,
        background: theme.colors.surface,
        ...style
      }}
    >
      <Canvas camera={{ position: [6, 5, 8], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.1} />
        <directionalLight position={[-5, -3, -5]} intensity={0.3} />
        <group rotation={[0, spin ? 0 : 0, 0]}>
          <Voxels
            data={tensor}
            color={color ?? theme.primary}
            gap={gap}
            theme={theme}
          />
        </group>
        {controls && (
          <OrbitControls
            autoRotate={spin}
            autoRotateSpeed={1.2}
            enablePan={false}
          />
        )}
      </Canvas>
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: theme.monoFamily,
          fontSize: 13,
          color: theme.colors.textMuted,
          pointerEvents: 'none'
        }}
      >
        ({dims[0]}, {dims[1]}, {dims[2]})
      </div>
    </div>
  );
};
