/** Multiply 4×4 matrix M by 4-element column vector v */
export function matMul(M, v) {
  const result = [0, 0, 0, 0]
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      result[row] += M[row][col] * v[col]
    }
  }
  return result
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

/** Format vector for display */
export function fmtVec(v) {
  return '[' + v.map(n => String(n)).join(', ') + ']'
}

/** Check if two 4-vectors are equal */
export function vecEqual(a, b) {
  return a.every((v, i) => v === b[i])
}
