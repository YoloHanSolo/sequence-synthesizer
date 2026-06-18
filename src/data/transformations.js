import { matMul } from '../math/matrices'

const m = matrix => v => matMul(matrix, v)

export const TRANSFORMATIONS = [
  {
    id: 'DL1',
    name: 'Diagonal Left 1',
    color: '#fbbf24',
    filterable: true,
    description: 'c^x → (c-1)^x',
    matrix: [[ 1, 0, 0, 0], [-1, 1, 0, 0], [ 1,-2, 1, 0], [-1, 3,-3, 1]],
    fn: m([[ 1, 0, 0, 0], [-1, 1, 0, 0], [ 1,-2, 1, 0], [-1, 3,-3, 1]]),
  },
  {
    id: 'DL0',
    name: 'Diagonal Left 0',
    color: '#f87171',
    filterable: true,
    description: 'c^x → -(c-1)^x',
    matrix: [[-1, 0, 0, 0], [ 1,-1, 0, 0], [-1, 2,-1, 0], [ 1,-3, 3,-1]],
    fn: m([[-1, 0, 0, 0], [ 1,-1, 0, 0], [-1, 2,-1, 0], [ 1,-3, 3,-1]]),
  },
  {
    id: 'H0',
    name: 'Horizontal 0',
    color: '#60a5fa',
    filterable: true,
    description: 'c^x → (-1-c)^x',
    matrix: [[ 1, 0, 0, 0], [-1,-1, 0, 0], [ 1, 2, 1, 0], [-1,-3,-3,-1]],
    fn: m([[ 1, 0, 0, 0], [-1,-1, 0, 0], [ 1, 2, 1, 0], [-1,-3,-3,-1]]),
  },
  {
    id: 'H1',
    name: 'Horizontal 1',
    color: '#c084fc',
    filterable: true,
    description: 'c^x → -(-1-c)^x',
    matrix: [[-1, 0, 0, 0], [ 1, 1, 0, 0], [-1,-2,-1, 0], [ 1, 3, 3, 1]],
    fn: m([[-1, 0, 0, 0], [ 1, 1, 0, 0], [-1,-2,-1, 0], [ 1, 3, 3, 1]]),
  },
  {
    id: 'V0',
    name: 'Vertical 0',
    color: '#34d399',
    filterable: true,
    description: 'c^x → -(1+c)^x',
    matrix: [[-1, 0, 0, 0], [-1, 1, 0, 0], [-1, 2,-1, 0], [-1, 3,-3, 1]],
    fn: m([[-1, 0, 0, 0], [-1, 1, 0, 0], [-1, 2,-1, 0], [-1, 3,-3, 1]]),
  },
  {
    id: 'V1',
    name: 'Vertical 1',
    color: '#22d3ee',
    filterable: true,
    description: 'c^x → (1-c)^x',
    matrix: [[ 1, 0, 0, 0], [ 1,-1, 0, 0], [ 1,-2, 1, 0], [ 1,-3, 3,-1]],
    fn: m([[ 1, 0, 0, 0], [ 1,-1, 0, 0], [ 1,-2, 1, 0], [ 1,-3, 3,-1]]),
  },
  {
    id: 'Pos',
    name: 'Positive',
    color: '#f472b6',
    filterable: true,
    description: 'c^x → (c+1)^x',
    matrix: [[ 1, 0, 0, 0], [ 1, 1, 0, 0], [ 1, 2, 1, 0], [ 1, 3, 3, 1]],
    fn: m([[ 1, 0, 0, 0], [ 1, 1, 0, 0], [ 1, 2, 1, 0], [ 1, 3, 3, 1]]),
  },
  {
    id: 'Neg',
    name: 'Negative',
    color: '#a3e635',
    filterable: true,
    description: 'c^x → -(c+1)^x',
    matrix: [[-1, 0, 0, 0], [-1,-1, 0, 0], [-1,-2,-1, 0], [-1,-3,-3,-1]],
    fn: m([[-1, 0, 0, 0], [-1,-1, 0, 0], [-1,-2,-1, 0], [-1,-3,-3,-1]]),
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
    matrix: [[0, 0, 0, 0], [0, 1, 0, 0], [0, 2, 2, 0], [0, 0, 3, 3]],
    fn: m([[0, 0, 0, 0], [0, 1, 0, 0], [0, 2, 2, 0], [0, 0, 3, 3]]),
  },
  {
    id: 'P',
    name: 'Polynomial Step',
    color: '#38bdf8',
    filterable: true,
    description: 'x^k → x^{k+1}  (×x)',
    matrix: [[0, 0, 0, 0], [0, 1, 0, 0], [0, 0, 2, 0], [0, 0, 0, 3]],
    fn: m([[0, 0, 0, 0], [0, 1, 0, 0], [0, 0, 2, 0], [0, 0, 0, 3]]),
  },
]

export const TRANSFORM_MAP = Object.fromEntries(TRANSFORMATIONS.map(t => [t.id, t]))

export function applyOp(opName, v) {
  const t = TRANSFORM_MAP[opName]
  if (!t) throw new Error(`Unknown operator: ${opName}`)
  return t.fn(v)
}
