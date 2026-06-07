import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Edges, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../theme/ThemeProvider';
import { Theme } from '../../theme/tokens';
import { mix, alpha } from '../../theme/color';

// ── Public data model ───────────────────────────────────────────────────────

export type LayerKind =
  | 'embedding'
  | 'positional'
  | 'attention'
  | 'masked-attention'
  | 'cross-attention'
  | 'addnorm'
  | 'ffn'
  | 'linear'
  | 'softmax'
  | 'output';

export interface TransformerLayerSpec {
  id: string;
  kind: LayerKind;
  label: string;
  /** Smaller caption shown under the label in the info panel. */
  sublabel?: string;
}

export interface TransformerStackSpec {
  title: string;
  /** Render the repeated-block group with an "N×" depth stack. */
  repeat?: number;
  /** Indices into `layers` that belong to the repeated group (contiguous). */
  repeatRange?: [number, number];
  layers: TransformerLayerSpec[];
}

export interface Transformer3DProps {
  /** Left stack. Defaults to a standard Transformer encoder. */
  encoder?: TransformerStackSpec;
  /** Right stack. Defaults to a standard Transformer decoder. Pass `null` to
   *  render an encoder-only model (e.g. BERT-style). */
  decoder?: TransformerStackSpec | null;
  width?: number | string;
  height?: number;
  /** Slowly auto-orbit when nothing is selected. */
  spin?: boolean;
  /** Animate data-flow pulses travelling up each stack. */
  showFlow?: boolean;
  /** Start with the info panel for this layer id open. */
  initialSelected?: string;
  /** Called when a block is selected (or null when cleared). */
  onSelect?: (layer: TransformerLayerSpec | null) => void;
  background?: string;
  style?: React.CSSProperties;
}

// ── Default architecture (Vaswani et al., 2017) ─────────────────────────────

const DEFAULT_ENCODER: TransformerStackSpec = {
  title: 'Encoder',
  repeat: 6,
  repeatRange: [2, 5],
  layers: [
    { id: 'e-emb', kind: 'embedding', label: 'Input Embedding', sublabel: 'tokens → vectors' },
    { id: 'e-pos', kind: 'positional', label: 'Positional Encoding', sublabel: '+ position signal' },
    { id: 'e-mha', kind: 'attention', label: 'Multi-Head Attention', sublabel: 'self-attention' },
    { id: 'e-an1', kind: 'addnorm', label: 'Add & Norm', sublabel: 'residual + LayerNorm' },
    { id: 'e-ffn', kind: 'ffn', label: 'Feed Forward', sublabel: 'position-wise MLP' },
    { id: 'e-an2', kind: 'addnorm', label: 'Add & Norm', sublabel: 'residual + LayerNorm' }
  ]
};

const DEFAULT_DECODER: TransformerStackSpec = {
  title: 'Decoder',
  repeat: 6,
  repeatRange: [2, 7],
  layers: [
    { id: 'd-emb', kind: 'embedding', label: 'Output Embedding', sublabel: 'shifted right' },
    { id: 'd-pos', kind: 'positional', label: 'Positional Encoding', sublabel: '+ position signal' },
    { id: 'd-mha', kind: 'masked-attention', label: 'Masked Multi-Head Attention', sublabel: 'causal self-attention' },
    { id: 'd-an1', kind: 'addnorm', label: 'Add & Norm', sublabel: 'residual + LayerNorm' },
    { id: 'd-cra', kind: 'cross-attention', label: 'Cross Attention', sublabel: 'attends to encoder' },
    { id: 'd-an2', kind: 'addnorm', label: 'Add & Norm', sublabel: 'residual + LayerNorm' },
    { id: 'd-ffn', kind: 'ffn', label: 'Feed Forward', sublabel: 'position-wise MLP' },
    { id: 'd-an3', kind: 'addnorm', label: 'Add & Norm', sublabel: 'residual + LayerNorm' },
    { id: 'd-lin', kind: 'linear', label: 'Linear', sublabel: 'project to vocab' },
    { id: 'd-sm', kind: 'softmax', label: 'Softmax', sublabel: 'output probabilities' }
  ]
};

// ── Layout constants ────────────────────────────────────────────────────────

const BLOCK_W = 3.2;
const BLOCK_H = 0.7;
const BLOCK_D = 1.4;
const GAP = 0.55;
const STACK_GAP = 5.2; // horizontal distance between encoder & decoder centers

interface PlacedLayer extends TransformerLayerSpec {
  position: [number, number, number];
  stack: 'encoder' | 'decoder';
}

const colorForKind = (kind: LayerKind, theme: Theme): string => {
  const c = theme.channels;
  switch (kind) {
    case 'attention':
      return c.query;
    case 'masked-attention':
      return c.key;
    case 'cross-attention':
      return mix(c.query, c.value, 0.5);
    case 'ffn':
      return theme.primary;
    case 'embedding':
      return c.neutral;
    case 'positional':
      return mix(c.neutral, theme.primary, 0.4);
    case 'addnorm':
      return mix(theme.colors.border, theme.colors.textMuted, 0.4);
    case 'linear':
      return mix(theme.primary, c.neutral, 0.4);
    case 'softmax':
      return theme.colors.accent;
    case 'output':
      return theme.primary;
    default:
      return c.neutral;
  }
};

const layoutStack = (
  spec: TransformerStackSpec,
  centerX: number,
  stack: 'encoder' | 'decoder'
): PlacedLayer[] => {
  const step = BLOCK_H + GAP;
  return spec.layers.map((layer, i) => ({
    ...layer,
    stack,
    position: [centerX, i * step, 0] as [number, number, number]
  }));
};

// ── A single interactive block ──────────────────────────────────────────────

interface BlockProps {
  layer: PlacedLayer;
  theme: Theme;
  selected: boolean;
  dimmed: boolean;
  repeated: boolean;
  onSelect: (layer: PlacedLayer) => void;
}

const Block = ({ layer, theme, selected, dimmed, repeated, onSelect }: BlockProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const baseColor = colorForKind(layer.kind, theme);
  const target = useRef(1);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    target.current = hovered || selected ? 1.08 : 1;
    const k = 1 - Math.pow(0.001, delta);
    g.scale.lerp(
      new THREE.Vector3(target.current, target.current, target.current),
      k
    );
  });

  const opacity = dimmed ? 0.18 : 1;

  return (
    <group position={layer.position}>
      {/* "N×" depth copies behind the front block to imply repetition */}
      {repeated &&
        [1, 2].map((d) => (
          <mesh key={d} position={[0, 0, -d * 0.28]}>
            <boxGeometry args={[BLOCK_W, BLOCK_H, BLOCK_D]} />
            <meshStandardMaterial
              color={baseColor}
              transparent
              opacity={0.12 * opacity}
              roughness={0.7}
            />
          </mesh>
        ))}

      <group
        ref={groupRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(layer);
        }}
      >
        <RoundedBox args={[BLOCK_W, BLOCK_H, BLOCK_D]} radius={0.12} smoothness={4}>
          <meshStandardMaterial
            color={baseColor}
            transparent
            opacity={opacity}
            roughness={0.4}
            metalness={0.1}
            emissive={baseColor}
            emissiveIntensity={selected ? 0.5 : hovered ? 0.28 : 0.08}
          />
          <Edges
            threshold={15}
            color={selected ? theme.colors.text : alpha(theme.colors.text, 0.35)}
          />
        </RoundedBox>

        {/* DOM label — crisp, themeable, scales with zoom */}
        <Html
          center
          distanceFactor={9}
          position={[0, 0, BLOCK_D / 2 + 0.02]}
          style={{ pointerEvents: 'none', opacity: dimmed ? 0.3 : 1 }}
        >
          <div
            style={{
              fontFamily: theme.fontFamily,
              fontSize: 13,
              fontWeight: 600,
              color: '#fff',
              textShadow: '0 1px 3px rgba(0,0,0,0.55)',
              whiteSpace: 'nowrap',
              textAlign: 'center'
            }}
          >
            {layer.label}
          </div>
        </Html>
      </group>
    </group>
  );
};

// ── Animated data-flow pulses travelling up a stack ─────────────────────────

const FlowPulses = ({
  bottom,
  top,
  x,
  color,
  count = 3
}: {
  bottom: number;
  top: number;
  x: number;
  color: string;
  count?: number;
}) => {
  const refs = useRef<THREE.Mesh[]>([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const phase = (t * 0.35 + i / count) % 1;
      m.position.y = bottom + phase * (top - bottom);
      const mat = m.material as THREE.MeshStandardMaterial;
      // fade in/out at the ends
      mat.opacity = Math.sin(phase * Math.PI) * 0.9;
    });
  });
  return (
    <>
      {new Array(count).fill(0).map((_, i) => (
        <mesh key={i} ref={(el) => el && (refs.current[i] = el)} position={[x, bottom, BLOCK_D / 2 + 0.5]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.2}
            transparent
          />
        </mesh>
      ))}
    </>
  );
};

// ── Connectors (vertical data path + cross-attention link) ──────────────────

const Connectors = ({
  encoder,
  decoder,
  theme
}: {
  encoder: PlacedLayer[];
  decoder: PlacedLayer[];
  theme: Theme;
}) => {
  const lineColor = alpha(theme.colors.textMuted, 0.5);

  const verticalPath = (layers: PlacedLayer[]): [number, number, number][] => {
    if (!layers.length) return [];
    const x = layers[0].position[0];
    const yBottom = layers[0].position[1] - BLOCK_H / 2;
    const yTop = layers[layers.length - 1].position[1] + BLOCK_H / 2;
    return [
      [x, yBottom, 0],
      [x, yTop, 0]
    ];
  };

  const encPath = verticalPath(encoder);
  const decPath = verticalPath(decoder);

  // Cross-attention link: from encoder top → decoder cross-attention block.
  const cross = useMemo(() => {
    if (!encoder.length || !decoder.length) return null;
    const encTop = encoder[encoder.length - 1].position;
    const crossBlock = decoder.find((l) => l.kind === 'cross-attention');
    if (!crossBlock) return null;
    const start = new THREE.Vector3(encTop[0] + BLOCK_W / 2, encTop[1], 0);
    const end = new THREE.Vector3(
      crossBlock.position[0] - BLOCK_W / 2,
      crossBlock.position[1],
      0
    );
    const mid = new THREE.Vector3(
      (start.x + end.x) / 2,
      Math.max(start.y, end.y) + 1.4,
      1.2
    );
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return curve.getPoints(40).map((p) => [p.x, p.y, p.z] as [number, number, number]);
  }, [encoder, decoder]);

  return (
    <>
      {encPath.length === 2 && <Line points={encPath} color={lineColor} lineWidth={2} />}
      {decPath.length === 2 && <Line points={decPath} color={lineColor} lineWidth={2} />}
      {cross && (
        <Line
          points={cross}
          color={theme.channels.query}
          lineWidth={2.5}
          dashed
          dashSize={0.25}
          gapSize={0.15}
        />
      )}
    </>
  );
};

// ── Camera rig: smoothly flies to the focus target ──────────────────────────

interface FocusState {
  target: THREE.Vector3;
  camPos: THREE.Vector3;
}

const CameraRig = ({
  focus,
  controlsRef
}: {
  focus: FocusState;
  controlsRef: React.MutableRefObject<any>;
}) => {
  const { camera } = useThree();
  // Only fly while transitioning to a new focus; once we arrive, hand control
  // back to OrbitControls so the user's orbit/zoom/pan isn't overridden.
  const flying = useRef(true);
  useEffect(() => {
    flying.current = true;
  }, [focus]);

  useFrame((_, delta) => {
    if (!flying.current) return;
    const k = 1 - Math.pow(0.0015, delta);
    camera.position.lerp(focus.camPos, k);
    const ctrl = controlsRef.current;
    if (ctrl) {
      ctrl.target.lerp(focus.target, k);
      ctrl.update();
    }
    // Arrived → stop animating and yield to user input.
    if (
      camera.position.distanceTo(focus.camPos) < 0.05 &&
      (!ctrl || ctrl.target.distanceTo(focus.target) < 0.05)
    ) {
      flying.current = false;
    }
  });
  return null;
};

// ── Scene ───────────────────────────────────────────────────────────────────

const Scene = ({
  encoder,
  decoder,
  theme,
  spin,
  showFlow,
  selectedId,
  onSelectLayer
}: {
  encoder: { spec: TransformerStackSpec; placed: PlacedLayer[] };
  decoder: { spec: TransformerStackSpec; placed: PlacedLayer[] } | null;
  theme: Theme;
  spin: boolean;
  showFlow: boolean;
  selectedId: string | null;
  onSelectLayer: (l: PlacedLayer | null) => void;
}) => {
  const controlsRef = useRef<any>(null);

  const allPlaced = useMemo(
    () => [...encoder.placed, ...(decoder?.placed ?? [])],
    [encoder, decoder]
  );

  // Center of the whole model (for overview framing).
  const bounds = useMemo(() => {
    const ys = allPlaced.map((l) => l.position[1]);
    const xs = allPlaced.map((l) => l.position[0]);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const height = Math.max(...ys) - Math.min(...ys) + 2;
    return { cx, cy, height };
  }, [allPlaced]);

  const overview: FocusState = useMemo(
    () => ({
      target: new THREE.Vector3(bounds.cx, bounds.cy, 0),
      camPos: new THREE.Vector3(bounds.cx + 1, bounds.cy + 1.5, bounds.height * 1.15 + 6)
    }),
    [bounds]
  );

  const [focus, setFocus] = useState<FocusState>(overview);
  useEffect(() => setFocus(overview), [overview]);

  const handleSelect = useCallback(
    (l: PlacedLayer | null) => {
      onSelectLayer(l);
      if (!l) {
        setFocus(overview);
        return;
      }
      const [x, y] = l.position;
      setFocus({
        target: new THREE.Vector3(x, y, 0),
        camPos: new THREE.Vector3(x + 2.4, y + 0.8, 5.5)
      });
    },
    [onSelectLayer, overview]
  );

  const repeatIds = useMemo(() => {
    const ids = new Set<string>();
    const collect = (s: TransformerStackSpec | undefined) => {
      if (!s?.repeatRange) return;
      const [a, b] = s.repeatRange;
      for (let i = a; i <= b; i++) if (s.layers[i]) ids.add(s.layers[i].id);
    };
    collect(encoder.spec);
    collect(decoder?.spec);
    return ids;
  }, [encoder, decoder]);

  return (
    <>
      <color attach="background" args={[theme.colors.background]} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[6, 12, 8]} intensity={1.1} />
      <directionalLight position={[-6, -2, -6]} intensity={0.35} />

      <CameraRig focus={focus} controlsRef={controlsRef} />

      {/* click empty space to clear selection */}
      <mesh
        position={[bounds.cx, bounds.cy, -6]}
        onClick={() => handleSelect(null)}
      >
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <Connectors encoder={encoder.placed} decoder={decoder?.placed ?? []} theme={theme} />

      {showFlow && (
        <>
          <FlowPulses
            bottom={encoder.placed[0].position[1]}
            top={encoder.placed[encoder.placed.length - 1].position[1]}
            x={encoder.placed[0].position[0]}
            color={theme.channels.query}
          />
          {decoder && (
            <FlowPulses
              bottom={decoder.placed[0].position[1]}
              top={decoder.placed[decoder.placed.length - 1].position[1]}
              x={decoder.placed[0].position[0]}
              color={theme.channels.value}
            />
          )}
        </>
      )}

      {/* stack titles */}
      {[
        { spec: encoder.spec, placed: encoder.placed },
        ...(decoder ? [{ spec: decoder.spec, placed: decoder.placed }] : [])
      ].map(({ spec, placed }) => {
        const x = placed[0].position[0];
        const yTop = placed[placed.length - 1].position[1] + BLOCK_H + 1;
        return (
          <Html key={spec.title} center position={[x, yTop, 0]} distanceFactor={11}>
            <div
              style={{
                fontFamily: theme.fontFamily,
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: 'uppercase',
                color: theme.colors.textMuted,
                whiteSpace: 'nowrap'
              }}
            >
              {spec.title}
              {spec.repeat ? `  ·  ${spec.repeat}×` : ''}
            </div>
          </Html>
        );
      })}

      {allPlaced.map((layer) => (
        <Block
          key={layer.id}
          layer={layer}
          theme={theme}
          selected={selectedId === layer.id}
          dimmed={selectedId !== null && selectedId !== layer.id}
          repeated={repeatIds.has(layer.id)}
          onSelect={handleSelect}
        />
      ))}

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan
        enableZoom
        minDistance={3}
        maxDistance={40}
        autoRotate={spin && selectedId === null}
        autoRotateSpeed={0.6}
      />
    </>
  );
};

// ── Public component ─────────────────────────────────────────────────────────

/**
 * Interactive 3D Transformer architecture. Orbit / zoom / pan the whole model,
 * click any block to fly the camera in and inspect it, and watch data-flow
 * pulses travel up the encoder and decoder stacks. Fully themed and
 * data-driven — pass your own `encoder` / `decoder` specs, or use the built-in
 * "Attention is All You Need" architecture.
 *
 * Imported from the optional `@patternize/components/three` entry point.
 */
export const Transformer3D = ({
  encoder = DEFAULT_ENCODER,
  decoder = DEFAULT_DECODER,
  width = '100%',
  height = 560,
  spin = true,
  showFlow = true,
  initialSelected,
  onSelect,
  background,
  style
}: Transformer3DProps) => {
  const theme = useTheme();
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelected ?? null
  );

  const hasDecoder = decoder !== null && decoder !== undefined;
  // Single-stack models sit in the middle; two-stack models straddle origin.
  const encX = hasDecoder ? -STACK_GAP / 2 : 0;
  const decX = STACK_GAP / 2;

  const encoderData = useMemo(
    () => ({ spec: encoder, placed: layoutStack(encoder, encX, 'encoder') }),
    [encoder, encX]
  );
  const decoderData = useMemo(
    () =>
      hasDecoder
        ? { spec: decoder as TransformerStackSpec, placed: layoutStack(decoder as TransformerStackSpec, decX, 'decoder') }
        : null,
    [decoder, decX, hasDecoder]
  );

  const selectedLayer = useMemo(
    () =>
      [...encoderData.placed, ...(decoderData?.placed ?? [])].find(
        (l) => l.id === selectedId
      ) ?? null,
    [encoderData, decoderData, selectedId]
  );

  const handleSelect = useCallback(
    (l: PlacedLayer | null) => {
      setSelectedId(l?.id ?? null);
      onSelect?.(l);
    },
    [onSelect]
  );

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: theme.radius,
        overflow: 'hidden',
        background: background ?? theme.colors.background,
        border: `1px solid ${theme.colors.border}`,
        ...style
      }}
    >
      <Canvas camera={{ position: [3, 6, 22], fov: 45 }} dpr={[1, 2]}>
        <Scene
          encoder={encoderData}
          decoder={decoderData}
          theme={theme}
          spin={spin}
          showFlow={showFlow}
          selectedId={selectedId}
          onSelectLayer={handleSelect}
        />
      </Canvas>

      {/* Info panel for the selected block */}
      {selectedLayer && (
        <div
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 240,
            padding: '14px 16px',
            borderRadius: theme.radius,
            background: alpha(theme.colors.surface, 0.96),
            border: `1px solid ${theme.colors.border}`,
            boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
            fontFamily: theme.fontFamily,
            color: theme.colors.text,
            backdropFilter: 'blur(6px)'
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 600,
              color: '#fff',
              background: colorForKind(selectedLayer.kind, theme),
              marginBottom: 8
            }}
          >
            {selectedLayer.kind}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{selectedLayer.label}</div>
          {selectedLayer.sublabel && (
            <div style={{ fontSize: 13, color: theme.colors.textMuted, marginTop: 4 }}>
              {selectedLayer.sublabel}
            </div>
          )}
          <button
            onClick={() => handleSelect(null)}
            style={{
              marginTop: 12,
              padding: '5px 10px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              color: theme.colors.textMuted,
              background: 'transparent',
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius / 1.5
            }}
          >
            ← Back to overview
          </button>
        </div>
      )}

      {/* Controls hint */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 14,
          fontFamily: theme.monoFamily,
          fontSize: 11,
          color: theme.colors.textMuted,
          pointerEvents: 'none'
        }}
      >
        drag to orbit · scroll to zoom · click a block to focus
      </div>
    </div>
  );
};
