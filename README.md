# Sequence Synthesizer

An interactive visualization of discrete integer sequence transformations via binomial matrices — the **Horizon of Seeds** map.

![Cyberpunk dark-mode graph of sequence nodes connected by transformation edges](https://raw.githubusercontent.com/YoloHanSolo/sequence-synthesizer/main/docs/preview.png)

## Concept

Sequences are **nodes/states**. 4×4 binomial/Pascal matrices are **directed edges/gates**. Click any connection to see every valid transformation path between two sequences, with full matrix-vector multiplication verified live.

The graph is organized around the **Seeds Horizon** — a dividing line between:

| Tier | Color | Examples |
|------|-------|---------|
| Alternating world | Purple | `(-1)^x · n^x` |
| Seeds horizon | Red | `0^x`, `[010*]`, `[0120*]`, `[01660*]` |
| Polynomial curves | Blue | `x^0`, `x^1`, `x^2`, `x^3` |
| Recurrences | Green | `F_n`, `n!`, `!n` |

## The 8 Binomial Matrix Operators

| Name | Maps | Matrix |
|------|------|--------|
| **Pos** | `c^x → (c+1)^x` | Pascal lower-triangular |
| **Neg** | `c^x → -(c+1)^x` | Signed Pascal |
| **DL1** | `c^x → (c-1)^x` | Backward difference |
| **DL0** | `c^x → -(c-1)^x` | |
| **H0**  | `c^x → (-1-c)^x` | Horizontal reflection |
| **H1**  | `c^x → -(-1-c)^x` | |
| **V0**  | `c^x → -(1+c)^x` | Vertical reflection |
| **V1**  | `c^x → (1-c)^x` | |

Plus the **Seed-Generator M** (5×5, truncated to 4×4 for computation) that steps horizontally along the seed row: `010* → 0120* → 01660* → …`

## Features

- **Force-directed graph** — drag nodes, zoom, pan
- **Click a node** — inspect sequence vector, formula, all 8 operator previews
- **Click an edge** — see every A→B and B→A path with live matrix-vector multiplication and ✓/✗ verification
- **Pipeline Sandbox** — input any 4-element vector, chain any sequence of operators, trace the full output step-by-step
- **Math formatting** — exponents and subscripts rendered as proper superscripts (`x^2` → x²)

## Stack

- React 18 + Vite
- [@xyflow/react](https://reactflow.dev/) for the graph
- Tailwind CSS
- Pure JS math engine — no external math libraries

## Run locally

```bash
npm install
npm run dev
```

## Math engine

All matrix operations are vanilla JS nested loops — no dependencies. The core:

```js
function matMul(M, v) {
  const result = [0, 0, 0, 0]
  for (let row = 0; row < 4; row++)
    for (let col = 0; col < 4; col++)
      result[row] += M[row][col] * v[col]
  return result
}
```
