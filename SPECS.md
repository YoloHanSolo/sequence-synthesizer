# Software Spec: "The Sequence Synthesizer" - An Interactive Matrix State Graph

## Project Overview

Build a single-page web application (React, Tailwind CSS, and HTML5 Canvas or a physics-based graph library like React-Flow or Vis.js Network) that visualizes a custom transformation map of discrete integer sequences. The core concept treats sequences as "nodes/states" and 4x4 Binomial/Pascal matrix operations as "directed edges/gates". The user should be able to click sequences, apply matrix operators, and watch data dynamically compute and flow along graph paths.

## Aesthetic & UI/UX Style

- **Theme:** Dark Mode, Cyberpunk/Sci-Fi Synthesizer aesthetic. Deep charcoal background, glowing neon nodes (Red for Seeds, Blue for Polynomials, Green for Factorials/Recurrences).
- **Layout:** Two-Panel Split view.
  - **Left Panel (70%):** The interactive force-directed graph canvas displaying the "Horizon of Seeds" map.
  - **Right Panel (30%):** Contextual Data Inspector. When a node is clicked, show its sequence vector values up to $x=6$, its formula, and a grid view of the matrix that generated it.
- **Micro-interactions:** When a path operator is clicked, render a small particle pulse animation along the edge line to show data processing from input node to output node.

## Core Mathematical Engine (Data Structures)

Implement a unified JS engine that handles 4-element arrays (from $x=0$ to $x=3$) representing sequence states, and 4x4 lower-triangular matrices representing transformation operations.

### The 8 Binomial Matrix Operators

Define these exact 4x4 matrix matrices as accessible functions:

1. **Pos (Positive Binomial):** `[[1,0,0,0],[1,1,0,0],[1,2,1,0],[1,3,3,1]]` (Maps: $c^x \rightarrow (c+1)^x$)
2. **Neg (Negative Binomial):** `[[-1,0,0,0],[-1,-1,0,0],[-1,-2,-1,0],[-1,-3,-3,-1]]` (Maps: $c^x \rightarrow -(c+1)^x$)
3. **DL1 (Diagonal Left/Right 1):** `[[1,0,0,0],[-1,1,0,0],[1,-2,1,0],[-1,3,-3,1]]` (Maps: $c^x \rightarrow (c-1)^x$)
4. **DL0 (Diagonal Left/Right 0):** `[[-1,0,0,0],[1,-1,0,0],[-1,2,-1,0],[1,-3,3,-1]]` (Maps: $c^x \rightarrow -(c-1)^x$)
5. **H0 (Horizontal 0):** `[[1,0,0,0],[-1,-1,0,0],[1,2,1,0],[-1,-3,-3,-1]]` (Maps: $c^x \rightarrow (-1-c)^x$)
6. **H1 (Horizontal 1):** `[[-1,0,0,0],[1,1,0,0],[-1,-2,-1,0],[1,3,3,1]]` (Maps: $c^x \rightarrow -(-1-c)^x$)
7. **V0 (Vertical 0):** `[[-1,0,0,0],[-1,1,0,0],[-1,2,-1,0],[-1,3,-3,1]]` (Maps: $c^x \rightarrow -(1+c)^x$)
8. **V1 (Vertical 1):** `[[1,0,0,0],[1,-1,0,0],[1,-2,1,0],[1,-3,3,-1]]` (Maps: $c^x \rightarrow (1-c)^x$)

## Initial Graph Nodes & Map Topology

Arrange the graph in three explicit horizontal tiers to honor the "Horizon of Seeds" concept:

### 1. The Upper Tier (Alternating World)

- **Node:** `(-1)^x * 1^x` (Values: `[1, -1, 1, -1]`)
- **Node:** `(-1)^x * 2^x` (Values: `[1, -2, 4, -8]`)
- **Node:** `(-1)^x * 3^x` (Values: `[1, -3, 9, -27]`)

### 2. The Center Equator (The "Seeds" Horizon)

- **Node:** `0^x` / `10*` (Values: `[1, 0, 0, 0]`) -> _The Ultimate Anchor_
- **Node:** `010*` (Values: `[0, 1, 0, 0]`)
- **Node:** `0120*` (Values: `[0, 1, 2, 0]`)
- **Node:** `01660*` (Values: `[0, 1, 6, 6]`)
- **Node:** Periodic `[01]*` (Values: `[0, 1, 0, 1]`)
- **Node:** Periodic `[10]*` (Values: `[1, 0, 1, 0]`)

### 3. The Lower Tier (Polynomial Curves)

- **Node:** `1^x` / `x^0` (Values: `[1, 1, 1, 1]`)
- **Node:** `x^1` (Values: `[0, 1, 2, 3]`)
- **Node:** `x^2` (Values: `[0, 1, 4, 9]`)
- **Node:** `x^3` (Values: `[0, 1, 8, 27]`)

### 4. The Right Outposts (Recurrences & Combinatorics)

- **Node:** Fibonacci `F_n` (Values: `[0, 1, 1, 2]`)
- **Node:** Factorial `n!` (Values: `[1, 1, 2, 6]`)
- **Node:** Subfactorial `!n` (Values: `[1, 0, 1, 2]`)

## Explicit Interactive Edges & Validations

Wire up the connections with labeled edges. Clicking an edge should visually trigger standard matrix-vector multiplication `M * v = v_new` to validate the link:

- Edge from `0^x` to `(-1)^x * 1^x` labeled with operator **H0**
- Edge from `(-1)^x * 1^x` back to `0^x` labeled with operator **H0**
- Edge from `1^x` to `(-1)^x * 2^x` labeled with operator **H0**
- Edge from `0^x` to `1^x` labeled with operator **Pos**
- Edge from `1^x` to `x^1` labeled with dynamic difference combinations **DL1**
- Edge from `010*` to `x^1` using operator **V0**
- Double-arrow loops between `010*` and `[01]*` showing inverse toggles via sign filters.
- Edges from `[10]*` pointing towards `n!` to show the Factorial Engine.

## Requirements for Initial Implementation

1. Create a reactive sandbox interface utilizing a robust network layout library.
2. Ensure the math engine runs pure matrix multiplication via vanilla JS loops—no external math libraries required.
3. Add a "Pipeline Sandbox Mode" where a user can manually input a raw 4-element vector, choose a sequence of matrix multipliers from a dropdown array, and dynamically output the resulting vector array.
