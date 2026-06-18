import { matMul } from '../math/matrices.js'

function C(n, k) {
  if (k < 0 || k > n) return 0
  if (k === 0 || k === n) return 1
  let r = 1
  for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1)
  return Math.round(r)
}

function binomialMatrix(signFn, size = 10) {
  return Array.from({ length: size }, (_, n) =>
    Array.from({ length: size }, (_, k) => k <= n ? signFn(n, k) * C(n, k) : 0)
  )
}

export const TRANSFORMATIONS = [
  {
    id: 'DL1',
    name: 'Diagonal Left 1',
    color: '#fbbf24',
    filterable: true,
    description: 'c^x → (c-1)^x',
    matrix: binomialMatrix((n, k) => (-1) ** (n - k)),
  },
  {
    id: 'DL0',
    name: 'Diagonal Left 0',
    color: '#f87171',
    filterable: true,
    description: 'c^x → -(c-1)^x',
    matrix: binomialMatrix((n, k) => (-1) ** (n - k + 1)),
  },
  {
    id: 'H0',
    name: 'Horizontal 0',
    color: '#60a5fa',
    filterable: true,
    description: 'c^x → (-1-c)^x',
    matrix: binomialMatrix((n, _k) => (-1) ** n),
  },
  {
    id: 'H1',
    name: 'Horizontal 1',
    color: '#c084fc',
    filterable: true,
    description: 'c^x → -(-1-c)^x',
    matrix: binomialMatrix((n, _k) => (-1) ** (n + 1)),
  },
  {
    id: 'V0',
    name: 'Vertical 0',
    color: '#34d399',
    filterable: true,
    description: 'c^x → -(1+c)^x',
    matrix: binomialMatrix((_n, k) => (-1) ** (k + 1)),
  },
  {
    id: 'V1',
    name: 'Vertical 1',
    color: '#22d3ee',
    filterable: true,
    description: 'c^x → (1-c)^x',
    matrix: binomialMatrix((_n, k) => (-1) ** k),
  },
  {
    id: 'Pos',
    name: 'Positive',
    color: '#f472b6',
    filterable: true,
    description: 'c^x → (c+1)^x',
    matrix: binomialMatrix(() => 1),
  },
  {
    id: 'Neg',
    name: 'Negative',
    color: '#a3e635',
    filterable: true,
    description: 'c^x → -(c+1)^x',
    matrix: binomialMatrix(() => -1),
  },
  {
    id: 'AbsDiff',
    name: 'Absolute Difference',
    color: '#fb923c',
    filterable: true,
    description: 'triangle left col: |Δ^k f(0)|',
    matrix: null,
    fn: v => {
      const a = [...v]
      const result = [a[0]]
      for (let len = v.length - 1; len > 0; len--) {
        for (let i = 0; i < len; i++) a[i] = Math.abs(a[i + 1] - a[i])
        result.push(a[0])
      }
      return result
    },
  },
  {
    id: 'SeedGen',
    name: 'Seed Generator',
    color: '#2dd4bf',
    filterable: true,
    description: 'seed_k → seed_{k+1}',
    matrix: Array.from({ length: 10 }, (_, n) =>
      Array.from({ length: 10 }, (_, k) =>
        k >= 1 && (k === n || k === n - 1) ? n : 0
      )
    ),
  },
  {
    id: 'P',
    name: 'Polynomial Step',
    color: '#38bdf8',
    filterable: true,
    description: 'x^k → x^{k+1}  (×x)',
    matrix: Array.from({ length: 10 }, (_, n) =>
      Array.from({ length: 10 }, (_, k) =>
        k === n && n >= 1 ? n : 0
      )
    ),
  },
  {
    id: 'Sierp',
    name: 'Sierpinski',
    color: '#e879f9',
    filterable: true,
    description: 'Pascal mod 2: S[n]=Σv[k] where C(n,k) odd',
    matrix: Array.from({ length: 10 }, (_, n) =>
      Array.from({ length: 10 }, (_, k) => k <= n ? C(n, k) % 2 : 0)
    ),
  },
].map(t => t.matrix ? { ...t, fn: v => matMul(t.matrix, v) } : t)

export const TRANSFORM_MAP = Object.fromEntries(TRANSFORMATIONS.map(t => [t.id, t]))

export function applyOp(opName, v) {
  const t = TRANSFORM_MAP[opName]
  if (!t) throw new Error(`Unknown operator: ${opName}`)
  return t.fn(v)
}
