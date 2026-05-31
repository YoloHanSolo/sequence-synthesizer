export const MATRICES = {
  Pos:     [[1,0,0,0],[1,1,0,0],[1,2,1,0],[1,3,3,1]],
  Neg:     [[-1,0,0,0],[-1,-1,0,0],[-1,-2,-1,0],[-1,-3,-3,-1]],
  DL1:     [[1,0,0,0],[-1,1,0,0],[1,-2,1,0],[-1,3,-3,1]],
  DL0:     [[-1,0,0,0],[1,-1,0,0],[-1,2,-1,0],[1,-3,3,-1]],
  H0:      [[1,0,0,0],[-1,-1,0,0],[1,2,1,0],[-1,-3,-3,-1]],
  H1:      [[-1,0,0,0],[1,1,0,0],[-1,-2,-1,0],[1,3,3,1]],
  V0:      [[-1,0,0,0],[-1,1,0,0],[-1,2,-1,0],[-1,3,-3,1]],
  V1:      [[1,0,0,0],[1,-1,0,0],[1,-2,1,0],[1,-3,3,-1]],
  // 4×4 truncation of the 5×5 Seed-Generator M
  // M×010* = 0120* ✓   M×0120* = 01660* ✓
  SeedGen: [[0,0,0,0],[0,1,0,0],[0,2,2,0],[0,0,3,3]],
  // 4×4 truncation of 5×5 diagonal P (multiply-by-x)
  // P×x^k = x^(k+1): P×x^0=x^1 ✓  P×x^1=x^2 ✓  P×x^2=x^3 ✓  P×x^3=x^4 ✓
  P:       [[0,0,0,0],[0,1,0,0],[0,0,2,0],[0,0,0,3]],
}

export const MATRIX_LABELS = Object.keys(MATRICES)

export const MATRIX_DESCRIPTIONS = {
  Pos:     'c^x → (c+1)^x',
  Neg:     'c^x → -(c+1)^x',
  DL1:     'c^x → (c-1)^x',
  DL0:     'c^x → -(c-1)^x',
  H0:      'c^x → (-1-c)^x',
  H1:      'c^x → -(-1-c)^x',
  V0:      'c^x → -(1+c)^x',
  V1:      'c^x → (1-c)^x',
  SeedGen: 'seed_k → seed_{k+1}',
  P:       'x^k → x^{k+1}  (×x)',
}

/** Full 5×5 P matrix (for display only) */
export const P_FULL_5x5 = [
  [0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 2, 0, 0],
  [0, 0, 0, 3, 0],
  [0, 0, 0, 0, 4],
]

/** Full 5×5 Seed-Generator matrix (for display only) */
export const SEEDGEN_FULL_5x5 = [
  [0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 2, 2, 0, 0],
  [0, 0, 3, 3, 0],
  [0, 0, 0, 4, 4],
]

/** Multiply 4x4 matrix M by 4-element column vector v */
export function matMul(M, v) {
  const result = [0, 0, 0, 0]
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      result[row] += M[row][col] * v[col]
    }
  }
  return result
}

/** Apply a named operator to a vector */
export function applyOp(opName, v) {
  return matMul(MATRICES[opName], v)
}

/** Format vector for display */
export function fmtVec(v) {
  return '[' + v.map(n => String(n)).join(', ') + ']'
}

/** Check if two 4-vectors are equal */
export function vecEqual(a, b) {
  return a.every((v, i) => v === b[i])
}
