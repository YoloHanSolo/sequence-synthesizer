const fs = require('fs')
const seqs = require('../src/data/sequences.json')
const mappings = require('../src/data/mappings.json')

const MATRICES = {
  Pos:    [[1,0,0,0],[1,1,0,0],[1,2,1,0],[1,3,3,1]],
  Neg:    [[-1,0,0,0],[-1,-1,0,0],[-1,-2,-1,0],[-1,-3,-3,-1]],
  DL1:    [[1,0,0,0],[-1,1,0,0],[1,-2,1,0],[-1,3,-3,1]],
  DL0:    [[-1,0,0,0],[1,-1,0,0],[-1,2,-1,0],[1,-3,3,-1]],
  H0:     [[1,0,0,0],[-1,-1,0,0],[1,2,1,0],[-1,-3,-3,-1]],
  H1:     [[-1,0,0,0],[1,1,0,0],[-1,-2,-1,0],[1,3,3,1]],
  V0:     [[-1,0,0,0],[-1,1,0,0],[-1,2,-1,0],[-1,3,-3,1]],
  V1:     [[1,0,0,0],[1,-1,0,0],[1,-2,1,0],[1,-3,3,-1]],
  SeedGen:[[0,0,0,0],[0,1,0,0],[0,2,2,0],[0,0,3,3]],
  P:      [[0,0,0,0],[0,1,0,0],[0,0,2,0],[0,0,0,3]],
}

const FUNCTIONS = {
  AbsDiff: v => [Math.abs(v[1]-v[0]), Math.abs(v[2]-v[1]), Math.abs(v[3]-v[2]), 0],
}

function matMul(M, v) {
  return M.map(row => row.reduce((s, m, c) => s + m * v[c], 0))
}

function applyOp(opName, v) {
  if (MATRICES[opName]) return matMul(MATRICES[opName], v)
  if (FUNCTIONS[opName]) return FUNCTIONS[opName](v)
  return null
}

const nodeMap = Object.fromEntries(seqs.map(n => [n.id, n]))

const bad = []
const skip = [] // null operator edges — no matrix to verify

for (const e of mappings) {
  const src = nodeMap[e.source]
  const tgt = nodeMap[e.target]

  if (!src) { bad.push({ id: e.id, reason: `source '${e.source}' not in sequences.json` }); continue }
  if (!tgt) { bad.push({ id: e.id, reason: `target '${e.target}' not in sequences.json` }); continue }

  if (e.operator === null || e.operator === undefined) {
    skip.push(e.id)
    continue
  }

  const result = applyOp(e.operator, src.values)
  if (result === null) { bad.push({ id: e.id, reason: `unknown operator '${e.operator}'` }); continue }
  const match = result.every((v, i) => v === tgt.values[i])
  if (!match) {
    bad.push({
      id: e.id,
      reason: `math mismatch`,
      detail: `${e.source}[${src.values}] --[${e.operator}]--> expected ${JSON.stringify(tgt.values)}, got ${JSON.stringify(result)}`
    })
  }
}

console.log(`Verified ${mappings.length} edges, skipped ${skip.length} null-op`)
console.log(`BAD: ${bad.length}`)
for (const b of bad) {
  console.log(`  ${b.id}: ${b.reason}`)
  if (b.detail) console.log(`    ${b.detail}`)
}

if (bad.length > 0) {
  const badIds = new Set(bad.map(b => b.id))
  const clean = mappings.filter(e => !badIds.has(e.id))
  fs.writeFileSync('./src/data/mappings.json', JSON.stringify(clean, null, 2))
  console.log(`\nRemoved ${bad.length} bad edges. New total: ${clean.length}`)
} else {
  console.log('All edges correct.')
}
