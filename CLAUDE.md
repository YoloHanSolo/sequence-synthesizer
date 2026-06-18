# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run preview   # Preview production build
```

No test or lint commands exist — project has no testing/linting setup.

## Architecture

React + Vite SPA visualizing discrete integer sequence transformations via 4×4 binomial matrices.

**Entry:** `index.html → src/main.jsx → src/App.jsx`

### Data flow

```
src/data/graphData.js     → 32 nodes (sequence vectors), 60+ directed edges
src/math/matrices.js      → 10 operators (8 binomial + SeedGen + P), matMul()
App.jsx                   → merges directed edges into bidirectional display edges,
                            manages selection state (selectedNode, selectedConn)
```

### Key files

| File | Role |
|------|------|
| `src/data/graphData.js` | All graph content: node positions, labels, 4-vectors, tier/color, edge operator mappings |
| `src/math/matrices.js` | Math engine: 10 named 4×4 matrices, `matMul(M, v)`, utility fns — no external math libs |
| `src/math/format.jsx` | `mathFmt()` converts `^x`/`_n` notation to HTML `<sup>`/`<sub>`; `M` component |
| `src/App.jsx` | Graph state, edge-merge logic, click handlers, panel coordination |
| `src/components/SeqNode.jsx` | Custom React Flow node — label + 4-vector display |
| `src/components/ConnectionEdge.jsx` | Custom React Flow edge — Bezier/self-loop, operator badge, pulse animation |
| `src/components/Inspector.jsx` | Right panel for selected node — vector grid + all 8 operators applied live |
| `src/components/ConnectionInspector.jsx` | Right panel for selected edge — forward/backward paths with ✓/✗ verification |
| `src/components/PipelineSandbox.jsx` | Modal for manual vector + operator chaining with step-by-step trace |

### Math model

- Each sequence node carries a 4-element integer vector `[f(0), f(1), f(2), f(3)]`
- Operators are 4×4 matrices; applying one transforms a vector to another node's vector
- 8 binomial operators: `Pos, Neg, DL1, DL0, H0, H1, V0, V1`
- 2 special matrices: `SeedGen` (truncated 5×5 Stirling), `P` (multiply-by-x for polynomial chains)
- Edge verification: live `matMul` confirms source → target matches stored target vector

### Node tiers (color-coded)

| Tier | Color | Examples |
|------|-------|---------|
| Alternating world | Purple | `(-1)^x · n^x` sequences |
| Seeds horizon | Red | `[010*]`, `[0120*]` seeds |
| Polynomial curves | Blue | `x^0`, `x^1`, `x^2`, `x^3` |
| Recurrences | Green | Fibonacci, Factorials, Subfactorials |

### Styling

Tailwind CSS + custom CSS (`src/index.css`). Cyberpunk aesthetic: `#0d0d0f` background, neon glow classes (`.glow-red`, `.glow-blue`, etc.), scanline overlay, JetBrains Mono font. Custom cyber color palette in `tailwind.config.js`.

### Adding new nodes/edges

All graph content lives in `src/data/graphData.js`. New operators go in `src/math/matrices.js`. The Inspector auto-applies all operators listed in `MATRICES` — no wiring needed beyond adding to that object.
