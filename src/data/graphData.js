// Verified operator mappings from transformation map image:
//   ∇ (nabla, going UP)  = DL1   e.g. DL1×[1,-1,1,-1]=[1,-2,4,-8] ✓
//   ⊕ (going DOWN)       = Pos   e.g. Pos×[1,-2,4,-8]=[1,-1,1,-1] ✓
//   Seed→Poly            = Pos   e.g. Pos×[0,1,0,0]=[0,1,2,3] ✓
//   Poly→Seed            = DL1   e.g. DL1×[0,1,2,3]=[0,1,0,0] ✓

export const INITIAL_NODES = [
  // ── 4th alternating (top of each column) ─────────────────────────────────
  // DL1×alt3=[1,-4,16,-64]=alt4 ✓  DL1×nalt3=[-1,4,-16,64]=nalt4 ✓
  {
    id: 'alt4',
    type: 'seqNode',
    position: { x: 0, y: -60 },
    data: {
      label: '(-1)^x · 4^x',
      formula: '(-1)^x · 4^x = (-4)^x',
      values: [1, -4, 16, -64],
      tier: 'upper',
      color: 'purple',
    },
  },
  {
    id: 'nalt4',
    type: 'seqNode',
    position: { x: 160, y: -60 },
    data: {
      label: '-(-1)^x · 4^x',
      formula: '-(-1)^x · 4^x',
      values: [-1, 4, -16, 64],
      tier: 'upper',
      color: 'purple',
    },
  },

  // ── Negated alternating column (2nd column, verified via H1) ─────────────
  // H1×[1,0,0,0]=[-1,1,-1,1]=nalt1 ✓  H1×[-1,1,-1,1]=[1,0,0,0]=zero ✓
  // H1×[1,1,1,1]=[-1,2,-4,8]=nalt2 ✓
  // DL1/Pos chain same as alt column ✓
  {
    id: 'nalt3',
    type: 'seqNode',
    position: { x: 160, y: 60 },
    data: {
      label: '-(-1)^x · 3^x',
      formula: '-(-1)^x · 3^x = -(-3)^x',
      values: [-1, 3, -9, 27],
      tier: 'upper',
      color: 'purple',
    },
  },
  {
    id: 'nalt2',
    type: 'seqNode',
    position: { x: 160, y: 180 },
    data: {
      label: '-(-1)^x · 2^x',
      formula: '-(-1)^x · 2^x',
      values: [-1, 2, -4, 8],
      tier: 'upper',
      color: 'purple',
    },
  },
  {
    id: 'nalt1',
    type: 'seqNode',
    position: { x: 160, y: 295 },
    data: {
      label: '-(-1)^x · 1^x',
      formula: '-(-1)^x',
      values: [-1, 1, -1, 1],
      tier: 'upper',
      color: 'purple',
    },
  },

  // ── Alternating column (left, vertical) ──────────────────────────────────
  {
    id: 'alt3',
    type: 'seqNode',
    position: { x: 0, y: 60 },
    data: {
      label: '(-1)^x · 3^x',
      formula: '(-1)^x · 3^x = (-3)^x',
      values: [1, -3, 9, -27],
      tier: 'upper',
      color: 'purple',
    },
  },
  {
    id: 'alt2',
    type: 'seqNode',
    position: { x: 0, y: 180 },
    data: {
      label: '(-1)^x · 2^x',
      formula: '(-1)^x · 2^x',
      values: [1, -2, 4, -8],
      tier: 'upper',
      color: 'purple',
    },
  },
  {
    id: 'alt1',
    type: 'seqNode',
    position: { x: 0, y: 295 },
    data: {
      label: '(-1)^x · 1^x',
      formula: '(-1)^x',
      values: [1, -1, 1, -1],
      tier: 'upper',
      color: 'purple',
    },
  },

  // ── Seeds horizon (horizontal row) ───────────────────────────────────────
  {
    id: 'zero',
    type: 'seqNode',
    position: { x: 80, y: 410 },
    data: {
      label: '0^x = [10*]',
      formula: '0^x  (anchor)',
      values: [1, 0, 0, 0],
      tier: 'seed',
      color: 'red',
    },
  },
  {
    id: 's010',
    type: 'seqNode',
    position: { x: 280, y: 410 },
    data: {
      label: '[010*]',
      formula: 'e₁ basis vector',
      values: [0, 1, 0, 0],
      tier: 'seed',
      color: 'red',
    },
  },
  {
    id: 's0120',
    type: 'seqNode',
    position: { x: 480, y: 410 },
    data: {
      label: '[0120*]',
      formula: 'Stirling S(n,2)',
      values: [0, 1, 2, 0],
      tier: 'seed',
      color: 'red',
    },
  },
  {
    id: 's01660',
    type: 'seqNode',
    position: { x: 680, y: 410 },
    data: {
      label: '[01660*]',
      formula: 'Stirling S(n,3)',
      values: [0, 1, 6, 6],
      tier: 'seed',
      color: 'red',
    },
  },

  // ── Seed for x^4: [01436*] ────────────────────────────────────────────────
  // DL1×x^4=[0,1,14,36] ✓  Pos×[0,1,14,36]=x^4 ✓
  // SeedGen×s01660=[0,1,14,36] ✓ — continues SeedGen chain
  {
    id: 's01436',
    type: 'seqNode',
    position: { x: 880, y: 410 },
    data: {
      label: '[0,1,14,36,24,0*]',
      formula: 'Stirling S(n,4)',
      values: [0, 1, 14, 36],
      tier: 'seed',
      color: 'red',
    },
  },

  // ── Pattern-seed rows (top-right cluster, each seed owns a horizontal row) ─
  //   Row 3  y=400:  [01]*  → F_n → F_n²
  {
    id: 'per01',
    type: 'seqNode',
    position: { x: 500, y: 130 },
    data: {
      label: '[01]*',
      formula: 'periodic 01',
      values: [0, 1, 0, 1],
      tier: 'seed',
      color: 'red',
    },
  },
  //   Row 4  y=560:  [0*] → [10]*  → !n → n!
  {
    id: 'zstar',
    type: 'seqNode',
    position: { x: -120, y: 410 },
    data: {
      label: '[0*]',
      formula: 'zero sequence',
      values: [0, 0, 0, 0],
      tier: 'seed',
      color: 'red',
    },
  },
  {
    id: 'per10',
    type: 'seqNode',
    position: { x: 500, y: -30 },
    data: {
      label: '[10]*',
      formula: 'periodic 10',
      values: [1, 0, 1, 0],
      tier: 'seed',
      color: 'red',
    },
  },

  //   Row 2  y=240:  [110*] → C[01²]*
  {
    id: 'n110',
    type: 'seqNode',
    position: { x: 500, y: -190 },
    data: {
      label: '[110*]',
      formula: 'indicator {0,1}',
      values: [1, 1, 0, 0],
      tier: 'seed',
      color: 'red',
    },
  },
  {
    id: 'cfib',
    type: 'seqNode',
    position: { x: 720, y: -190 },
    data: {
      label: 'C[01²]*',
      formula: 'conv([01]*²)',
      values: [0, 0, 1, 0],
      tier: 'recurrence',
      color: 'green',
    },
  },
  {
    id: 'fib',
    type: 'seqNode',
    position: { x: 720, y: 130 },
    data: {
      label: 'F_n  Fibonacci',
      formula: 'F(n)=F(n-1)+F(n-2)',
      values: [0, 1, 1, 2],
      tier: 'recurrence',
      color: 'green',
    },
  },
  {
    id: 'fib2',
    type: 'seqNode',
    position: { x: 940, y: 130 },
    data: {
      label: 'F_n^2',
      formula: 'F_n^2',
      values: [0, 1, 1, 4],
      tier: 'recurrence',
      color: 'green',
    },
  },

  // ── Recurrence right column ───────────────────────────────────────────────
  {
    id: 'subfact',
    type: 'seqNode',
    position: { x: 720, y: -30 },
    data: {
      label: '!n  Subfactorial',
      formula: '!n=(n-1)(!(n-1)+!(n-2))',
      values: [1, 0, 1, 2],
      tier: 'recurrence',
      color: 'green',
    },
  },
  {
    id: 'fact',
    type: 'seqNode',
    position: { x: 940, y: -30 },
    data: {
      label: 'n!  Factorial',
      formula: 'n!',
      values: [1, 1, 2, 6],
      tier: 'recurrence',
      color: 'green',
    },
  },

  // ── Positive exponential column (below x0, same x) ──────────────────────
  // Pos×1^x=2^x ✓  Pos×2^x=3^x ✓  DL1×3^x=2^x ✓  DL1×2^x=1^x ✓
  // Cross: H0×2^x=alt3 ✓  H1×2^x=nalt3 ✓
  {
    id: 'e2x',
    type: 'seqNode',
    position: { x: 80, y: 625 },
    data: {
      label: '2^x',
      formula: '2^x',
      values: [1, 2, 4, 8],
      tier: 'poly',
      color: 'blue',
    },
  },
  {
    id: 'e3x',
    type: 'seqNode',
    position: { x: 80, y: 725 },
    data: {
      label: '3^x',
      formula: '3^x',
      values: [1, 3, 9, 27],
      tier: 'poly',
      color: 'blue',
    },
  },

  // ── 4^x (4th positive exponential) ───────────────────────────────────────
  // Pos×3^x=[1,4,16,64]=4^x ✓  DL1×4^x=[1,3,9,27]=3^x ✓
  {
    id: 'e4x',
    type: 'seqNode',
    position: { x: 80, y: 825 },
    data: {
      label: '4^x',
      formula: '4^x',
      values: [1, 4, 16, 64],
      tier: 'poly',
      color: 'blue',
    },
  },

  // ── Triangular number seed + sequence ────────────────────────────────────
  // Pos×[0,1,1,0]=[0,1,3,6]=T_n ✓  DL1×[0,1,3,6]=[0,1,1,0] ✓
  {
    id: 's0110',
    type: 'seqNode',
    //   Row 1  y=80:   [0110*] → T_n
    position: { x: 500, y: -350 },
    data: {
      label: '[0110*]',
      formula: 'twin spark seed',
      values: [0, 1, 1, 0],
      tier: 'seed',
      color: 'red',
    },
  },
  {
    id: 'tri',
    type: 'seqNode',
    position: { x: 720, y: -350 },
    data: {
      label: 'T_n  (triangular)',
      formula: 'x(x+1)/2',
      values: [0, 1, 3, 6],
      tier: 'poly',
      color: 'blue',
    },
  },

  // ── Polynomial row (below seeds, same x as their seed) ───────────────────
  {
    id: 'x0',
    type: 'seqNode',
    position: { x: 80, y: 525 },
    data: {
      label: '1^x = x^0',
      formula: 'x^0 = 1',
      values: [1, 1, 1, 1],
      tier: 'poly',
      color: 'blue',
    },
  },
  {
    id: 'x1',
    type: 'seqNode',
    position: { x: 280, y: 525 },
    data: {
      label: 'x^1',
      formula: 'x^1',
      values: [0, 1, 2, 3],
      tier: 'poly',
      color: 'blue',
    },
  },
  {
    id: 'x2',
    type: 'seqNode',
    position: { x: 480, y: 525 },
    data: {
      label: 'x^2',
      formula: 'x^2',
      values: [0, 1, 4, 9],
      tier: 'poly',
      color: 'blue',
    },
  },
  {
    id: 'x3',
    type: 'seqNode',
    position: { x: 680, y: 525 },
    data: {
      label: 'x^3',
      formula: 'x^3',
      values: [0, 1, 8, 27],
      tier: 'poly',
      color: 'blue',
    },
  },

  // ── x^4 (4th polynomial) ─────────────────────────────────────────────────
  {
    id: 'x4',
    type: 'seqNode',
    position: { x: 880, y: 525 },
    data: {
      label: 'x^4',
      formula: 'x^4',
      values: [0, 1, 16, 81],
      tier: 'poly',
      color: 'blue',
    },
  },
]

export const INITIAL_EDGES = [
  // ── 4th alternating nodes ────────────────────────────────────────────────
  { id: 'e-alt3-alt4',   source: 'alt3',  target: 'alt4',  label: '∇ DL1', operator: 'DL1' },
  { id: 'e-alt4-alt3',   source: 'alt4',  target: 'alt3',  label: '⊕ Pos', operator: 'Pos' },
  { id: 'e-nalt3-nalt4', source: 'nalt3', target: 'nalt4', label: '∇ DL1', operator: 'DL1' },
  { id: 'e-nalt4-nalt3', source: 'nalt4', target: 'nalt3', label: '⊕ Pos', operator: 'Pos' },
  // 4^x chain
  { id: 'e-e3x-e4x',    source: 'e3x',  target: 'e4x',  label: '⊕ Pos', operator: 'Pos' },
  { id: 'e-e4x-e3x',    source: 'e4x',  target: 'e3x',  label: '∇ DL1', operator: 'DL1' },
  // x^4 poly chain
  { id: 'e-x3-x4-P', source: 'x3', target: 'x4', label: 'P', operator: 'P' },

  // ── Alternating column: ∇=DL1 going UP, ⊕=Pos going DOWN ────────────────
  // (DL1×alt2=[1,-3,9,-27]=alt3 ✓  Pos×alt3=[1,-2,4,-8]=alt2 ✓)
  { id: 'e-alt2-alt3', source: 'alt2', target: 'alt3', label: '∇ DL1', operator: 'DL1' },
  { id: 'e-alt3-alt2', source: 'alt3', target: 'alt2', label: '⊕ Pos', operator: 'Pos' },
  // (DL1×alt1=[1,-2,4,-8]=alt2 ✓  Pos×alt2=[1,-1,1,-1]=alt1 ✓)
  { id: 'e-alt1-alt2', source: 'alt1', target: 'alt2', label: '∇ DL1', operator: 'DL1' },
  { id: 'e-alt2-alt1', source: 'alt2', target: 'alt1', label: '⊕ Pos', operator: 'Pos' },
  // (DL1×zero=[1,-1,1,-1]=alt1 ✓  Pos×alt1=[1,0,0,0]=zero ✓)
  { id: 'e-zero-alt1', source: 'zero', target: 'alt1', label: '∇ DL1', operator: 'DL1' },
  { id: 'e-alt1-zero', source: 'alt1', target: 'zero', label: '⊕ Pos', operator: 'Pos' },

  // ── H0 cross-connection: x0 → alt2 (from SPECS, H0×[1,1,1,1]=[1,-2,4,-8] ✓)
  { id: 'e-x0-alt2', source: 'x0', target: 'alt2', label: 'H0', operator: 'H0' },

  // ── Seed ↔ Polynomial columns: Pos down, DL1 up ──────────────────────────
  // (Pos×zero=[1,1,1,1]=x0 ✓  DL1×x0=[1,0,0,0]=zero ✓)
  { id: 'e-zero-x0', source: 'zero', target: 'x0', label: '⊕ Pos', operator: 'Pos' },
  { id: 'e-x0-zero', source: 'x0',   target: 'zero', label: '∇ DL1', operator: 'DL1' },
  // (Pos×s010=[0,1,2,3]=x1 ✓  DL1×x1=[0,1,0,0]=s010 ✓)
  { id: 'e-s010-x1', source: 's010', target: 'x1',  label: '⊕ Pos', operator: 'Pos' },
  { id: 'e-x1-s010', source: 'x1',   target: 's010', label: '∇ DL1', operator: 'DL1' },
  // (Pos×s0120=[0,1,4,9]=x2 ✓  DL1×x2=[0,1,2,0]=s0120 ✓)
  { id: 'e-s0120-x2',  source: 's0120',  target: 'x2',    label: '⊕ Pos', operator: 'Pos' },
  { id: 'e-x2-s0120',  source: 'x2',    target: 's0120',  label: '∇ DL1', operator: 'DL1' },
  // (Pos×s01660=[0,1,8,27]=x3 ✓  DL1×x3=[0,1,6,6]=s01660 ✓)
  { id: 'e-s01660-x3', source: 's01660', target: 'x3',    label: '⊕ Pos', operator: 'Pos' },
  { id: 'e-x3-s01660', source: 'x3',    target: 's01660', label: '∇ DL1', operator: 'DL1' },

  // ── Poly chain via P (diagonal ×x matrix, P×x^k=x^{k+1} ✓) ─────────────
  { id: 'e-x0-x1-P', source: 'x0', target: 'x1', label: 'P', operator: 'P' },
  { id: 'e-x1-x2-P', source: 'x1', target: 'x2', label: 'P', operator: 'P' },
  { id: 'e-x2-x3-P', source: 'x2', target: 'x3', label: 'P', operator: 'P' },

  // ── Triangular numbers: [0110]* ↔ T_n ────────────────────────────────────
  { id: 'e-s0110-tri', source: 's0110', target: 'tri', label: '⊕ Pos', operator: 'Pos' },
  { id: 'e-tri-s0110', source: 'tri', target: 's0110', label: '∇ DL1', operator: 'DL1' },

  // ── Seed for x^4 ↔ x^4 ──────────────────────────────────────────────────
  { id: 'e-s01436-x4', source: 's01436', target: 'x4',     label: '⊕ Pos', operator: 'Pos'     },
  { id: 'e-x4-s01436', source: 'x4',     target: 's01436', label: '∇ DL1', operator: 'DL1'     },

  // ── Seed-Generator M: steps horizontally along seed row ─────────────────
  // SeedGen×010*=[0,1,2,0]=0120* ✓  SeedGen×0120*=[0,1,6,6]=01660* ✓  SeedGen×01660*=[0,1,14,36]=01436* ✓
  { id: 'e-s010-s0120',    source: 's010',   target: 's0120',   label: 'M', operator: 'SeedGen' },
  { id: 'e-s0120-s01660',  source: 's0120',  target: 's01660',  label: 'M', operator: 'SeedGen' },
  { id: 'e-s01660-s01436', source: 's01660', target: 's01436',  label: 'M', operator: 'SeedGen' },

  // ── [01]* connections ─────────────────────────────────────────────────────
  // 010* ↔ [01]*: bidirectional Δ toggle
  { id: 'e-s010-per01',  source: 's010',  target: 'per01', label: 'Δ', operator: null },
  { id: 'e-per01-s010',  source: 'per01', target: 's010',  label: 'Δ', operator: null },
  // Larger seeds project into [01]* via iterated Δ
  { id: 'e-s0120-per01',  source: 's0120',  target: 'per01', label: 'Δ',   operator: null },
  { id: 'e-s01660-per01', source: 's01660', target: 'per01', label: '3·Δ', operator: null },

  // ── [10]* ↔ [01]* (infinite/oscillating dual) ────────────────────────────
  { id: 'e-per01-per10', source: 'per01', target: 'per10', label: '∞', operator: null },
  { id: 'e-per10-per01', source: 'per10', target: 'per01', label: '∞', operator: null },

  // ── 110* cluster connections ──────────────────────────────────────────────
  { id: 'e-n110-per01', source: 'n110', target: 'per01', label: 'Δ', operator: null },
  { id: 'e-n110-cfib',  source: 'n110', target: 'cfib',  label: 'Δ', operator: null },
  { id: 'e-cfib-n110',  source: 'cfib', target: 'n110',  label: 'Δ', operator: null },

  // ── C[01²]* self-loop via Δ ───────────────────────────────────────────────
  { id: 'e-cfib-self', source: 'cfib', target: 'cfib', label: 'Δ', operator: null },

  // ── C[01²]* ↔ F_n ─────────────────────────────────────────────────────────
  { id: 'e-cfib-fib',  source: 'cfib', target: 'fib', label: 'Δ', operator: null },
  { id: 'e-fib-cfib',  source: 'fib',  target: 'cfib', label: 'Δ', operator: null },

  // ── F_n ↔ F_n² ────────────────────────────────────────────────────────────
  { id: 'e-fib-fib2', source: 'fib',  target: 'fib2', label: 'Δ', operator: null },
  { id: 'e-fib2-fib', source: 'fib2', target: 'fib',  label: '⊕', operator: null },

  // ── Recurrence column: n! ↔ !n (Pos/DL1 verified) ───────────────────────
  // (Pos×subfact=[1,1,2,6]=fact ✓  DL1×fact=[1,0,1,2]=subfact ✓)
  { id: 'e-subfact-fact', source: 'subfact', target: 'fact',    label: '⊕ Pos', operator: 'Pos' },
  { id: 'e-fact-subfact', source: 'fact',    target: 'subfact', label: '∇ DL1', operator: 'DL1' },

  // ── [10]* → !n → n! (from image: arrows pointing left = DL1 direction) ───
  { id: 'e-fact-per10',    source: 'fact',    target: 'per10',   label: '∇ DL1', operator: 'DL1' },
  { id: 'e-subfact-per10', source: 'subfact', target: 'per10',   label: 'Δ',     operator: null  },

  // ── Positive exponential chain: 1^x ↔ 2^x ↔ 3^x ────────────────────────
  { id: 'e-x0-e2x',   source: 'x0',  target: 'e2x', label: '⊕ Pos', operator: 'Pos' },
  { id: 'e-e2x-x0',   source: 'e2x', target: 'x0',  label: '∇ DL1', operator: 'DL1' },
  { id: 'e-e2x-e3x',  source: 'e2x', target: 'e3x', label: '⊕ Pos', operator: 'Pos' },
  { id: 'e-e3x-e2x',  source: 'e3x', target: 'e2x', label: '∇ DL1', operator: 'DL1' },
  // Cross-links to alternating world
  { id: 'e-e2x-alt3',  source: 'e2x', target: 'alt3',  label: 'H0', operator: 'H0' },
  { id: 'e-e2x-nalt3', source: 'e2x', target: 'nalt3', label: 'H1', operator: 'H1' },

  // ── Negated alternating column ────────────────────────────────────────────
  // DL1/Pos chain (same structure as alt column)
  { id: 'e-nalt1-nalt2', source: 'nalt1', target: 'nalt2', label: '∇ DL1', operator: 'DL1' },
  { id: 'e-nalt2-nalt1', source: 'nalt2', target: 'nalt1', label: '⊕ Pos', operator: 'Pos' },
  { id: 'e-nalt2-nalt3', source: 'nalt2', target: 'nalt3', label: '∇ DL1', operator: 'DL1' },
  { id: 'e-nalt3-nalt2', source: 'nalt3', target: 'nalt2', label: '⊕ Pos', operator: 'Pos' },
  // zero ↔ nalt1 via H1 (H1×[1,0,0,0]=[-1,1,-1,1] ✓  H1×[-1,1,-1,1]=[1,0,0,0] ✓)
  { id: 'e-zero-nalt1',  source: 'zero',  target: 'nalt1', label: 'H1',    operator: 'H1'  },
  { id: 'e-nalt1-zero',  source: 'nalt1', target: 'zero',  label: 'H1',    operator: 'H1'  },
  // x0 → nalt2 via H1 (H1×[1,1,1,1]=[-1,2,-4,8] ✓)
  { id: 'e-x0-nalt2',    source: 'x0',    target: 'nalt2', label: 'H1',    operator: 'H1'  },
]
