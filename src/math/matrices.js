/** Multiply N×N matrix M by N-element column vector v */
export function matMul(M, v) {
  const n = M.length
  const result = new Array(n).fill(0)
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      result[row] += M[row][col] * v[col]
    }
  }
  return result
}

/** Format vector for display */
export function fmtVec(v) {
  return '[' + v.map(n => String(n)).join(', ') + ']'
}

/** Check if two 4-vectors are equal */
export function vecEqual(a, b) {
  return a.every((v, i) => v === b[i])
}
