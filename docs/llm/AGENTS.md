# Using @patternize/components from an LLM agent

This guide is written for an LLM (e.g. Claude) that has been given a paper, a
figure, or a concept and must emit React code that renders a faithful, animated
visualization. The library is the **atomic toolkit** you call.

The single source of truth for the API is [`../../catalog.json`](../../catalog.json)
(also published as `@patternize/components/catalog.json`). It lists every
component, its props (name, type, required, description) and runnable examples.
**Read the catalog, then emit a component call.**

## Mental model

- **Everything is data-driven and presentational.** You compute the numbers
  (or let a component synthesize them) and pass them in. To animate a process,
  render successive snapshots of the data and step `key`/state over time.
- **Compose atoms.** Build new diagrams from `Matrix`, `Operator`, `Arrow`,
  `TokenColumn` rather than asking for a bespoke component. Most paper figures
  are a row of colored tensors joined by operators and arrows.
- **One theme.** Wrap output in `<ThemeProvider primary="#hex">`. Never
  hard-code colors when a themed default exists; use `scale`/`color` props for
  data-dependent color.

## Recipes

### A weight / activation matrix
```tsx
import { Matrix } from '@patternize/components';
<Matrix data={W} scale="diverging" shape showValues highlight={{ rows: [2] }} />
```
Use `scale="diverging"` for signed weights (blue↔red), `"sequential"` for
non-negative magnitudes, `"grayscale"` for embeddings/bias. Large matrices
(e.g. 768×2304) auto-render on canvas; small ones use crisp SVG with hover.

### Self-attention Q·K·V projection (the "embeddings × W + bias = QKV" figure)
```tsx
import { QKVProjection } from '@patternize/components';
<QKVProjection tokens={tokens} dModel={768} dProj={768} />
```
Pass real tensors via `data={{ embeddings, wq, wk, wv, bias, q, k, v }}` or let
it synthesize a representative texture.

### An attention map
```tsx
import { AttentionHeatmap } from '@patternize/components';
<AttentionHeatmap tokens={tokens} weights={attn} causal />   // weights optional
```

### A 3D tensor / activation volume (CNN feature maps, hidden states)
```tsx
import { Tensor3D } from '@patternize/components/three';   // note the subpath
<Tensor3D shape={[16, 8, 8]} spin />                       // or data={volume}
```

### Wiring stages together (layers, blocks)
Render an overlay `<svg>` and place `Arrow`s between element coordinates:
```tsx
<svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
  <Arrow from={{ x: 120, y: 60 }} to={{ x: 320, y: 60 }} label="add & norm" animate />
</svg>
```

### Data structures
`Array` (sliding window / sorting), `PriorityQueue` (binary heap),
`Graph`, `Tree`, `LinkedList`. All take a data snapshot + optional `highlight`.

## Turning a paper figure into calls

1. Identify the **tensors** (boxes) and their shapes → one `Matrix` (2D) or
   `Tensor3D` (3D) each. Choose a `scale` per semantics.
2. Identify the **operations** between them (matmul, add, concat, softmax,
   arrow) → `Operator` / `Arrow`.
3. Identify **labels** (tokens, channels) → `TokenColumn`, `rowLabels`,
   `colLabels`, `shape`.
4. Lay them out in a flexbox row; wrap in `ThemeProvider`.
5. If the figure shows a *process*, drive it from an array of snapshots and a
   step index.

## Conventions & gotchas

- Sizes are CSS pixels. Matrices accept `width`/`height` or `cellSize`.
- `animate` fades/scales a component in; theme `animation` controls timing.
- `Tensor3D` needs the `three` peer deps and the `/three` import subpath; keep
  it out of the core import so non-3D pages stay light.
- Prefer `shape` captions and labels — they make diagrams self-documenting.
- The catalog's `examples[].props` are valid, runnable prop objects; start from
  the closest example and adjust.
