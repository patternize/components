# API & atomicity review

A review of the component API as it stood, and the direction this upgrade takes
it. The guiding question: **are these components atomic enough to be called by an
LLM as a toolkit?**

## Findings in the original API

1. **The public API re-exported Storybook stories, not components.**
   `src/index.ts` exported `MergeSortStory`, `GraphDFSStory`, `BTreeInsertion`,
   etc. Stories are demos, not API. This coupled the published package to
   `@storybook/react`, leaked example data as "components", and meant several
   "components" (e.g. `Trie`) existed *only* as a story.
   → **Fixed:** the package now exports real components; demos live in the
   workbench.

2. **Inconsistent exports.** A mix of default and named exports for peers
   (`Graph` default vs `VerticalBarChart` named) with no rule.
   → Standardized toward **named exports** for new components; legacy defaults
   kept but re-exported by name where sensible.

3. **Some components were broken / incomplete.** `Array` imported a non-existent
   symbol and had an empty stylesheet; `Timeline` was a non-compiling stub with
   duplicated identifiers. The package did not type-check or build cleanly.
   → **Fixed:** `Array` and `Timeline` rewritten as real, themed components.

4. **No theming.** Colors were hard-coded per component (`#26deb0`, `#374469`,
   `green`, `black`). There was no way to recolor the set or match a brand.
   → **Fixed:** a single `ThemeProvider` drives color, channels, animation and
   radius. Default green, fully configurable.

5. **Imperative d3 rendering inside React.** `Array`, `BarChart`, `TreeChart`,
   `LinkedList`, `Graph` mutate the DOM via `d3.select`. This fights React,
   complicates SSR, and makes the components hard to compose or theme. They also
   imported d3 submodules (`d3-force`, `d3-hierarchy`, …) that weren't declared
   dependencies, so the package didn't bundle.
   → **Mitigated:** imports consolidated onto `d3`; new components are pure
   declarative React/SVG/canvas. These legacy files are marked `@ts-nocheck`
   (they carry pre-existing d3 typing errors) so the declaration build stays
   green. Migrating them to declarative rendering is the recommended follow-up.

6. **Props weren't granular enough to compose.** There was no primitive for "a
   colored matrix", "an operator", or "an arrow" — the exact atoms needed to
   assemble transformer/CNN figures. Everything was a closed, single-purpose
   chart.
   → **Fixed:** added `Matrix`, `Operator`, `Arrow`, `TokenColumn` as the
   composition primitives; `QKVProjection` and `AttentionHeatmap` are built
   *from* them and document the pattern.

## Atomicity rubric (applied to the new ML layer)

A component is "atomic enough" when:
- it does **one** visual job,
- it is **presentational** (data in, pixels out; no hidden state machine),
- its color comes from the **theme or an explicit `scale`/`color` prop**,
- it can be **composed** beside its siblings without layout surprises,
- its props are **serializable** (so they can live in `catalog.json` and be
  emitted by an LLM).

| Component | One job | Presentational | Themed | Composable | Serializable props |
|---|---|---|---|---|---|
| `Matrix` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `Operator` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `Arrow` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `TokenColumn` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `Tensor3D` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `QKVProjection` | composite | ✅ | ✅ | ✅ | ✅ |
| `AttentionHeatmap` | composite | ✅ | ✅ | ✅ | ✅ |
| `PriorityQueue` | ✅ | ✅ | ✅ | ✅ | ✅ |

Composites (`QKVProjection`, `AttentionHeatmap`) intentionally exist as
convenience wrappers, but are implemented purely by composing the atoms — so an
agent can either call the composite or assemble the atoms directly.

## Recommended follow-ups

- **Migrate legacy d3 components to declarative React** (`BarChart`, `TreeChart`,
  `LinkedList`, `Graph`, `Array`-style sorting) and route their colors through
  the theme. This removes the imperative DOM mutation and the `@ts-nocheck`
  pragmas in those files.
- **Add a `Pipeline`/`Layer` layout primitive** that auto-places a sequence of
  tensors and draws `Arrow`s between them (the common transformer-block figure).
- **Add `Conv2D` / `FeatureMap` helpers** on top of `Matrix`/`Tensor3D` for CNNs
  (kernel sliding window, channel stacks).
- **Generate `catalog.json` from the TypeScript types** (e.g. react-docgen) so
  the machine-readable API can't drift from the source.
- **Restore a test suite** (Vitest + Testing Library) — the previous
  `react-scripts test` setup was removed with the CRA/Storybook toolchain.
