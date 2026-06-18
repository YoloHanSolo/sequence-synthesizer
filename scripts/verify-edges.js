import { createRequire } from 'module'
import { applyOp } from '../src/data/transformations.js'

const require = createRequire(import.meta.url)
const seqs     = require('../src/data/sequences.json')
const mappings = require('../src/data/mappings.json')

const nodeMap = Object.fromEntries(seqs.map(n => [n.id, n]))

let ok = 0, bad = 0, unknown = 0

for (const e of mappings) {
  const src = nodeMap[e.source]
  const tgt = nodeMap[e.target]

  if (!src) { console.error(`MISSING SOURCE  ${e.id}: ${e.source}`); bad++; continue }
  if (!tgt) { console.error(`MISSING TARGET  ${e.id}: ${e.target}`); bad++; continue }

  const steps = e.steps ?? 1
  let cur = src.values
  let res

  try {
    for (let s = 0; s < steps; s++) {
      res = applyOp(e.operator, cur)
      cur = res
    }
  } catch {
    console.error(`UNKNOWN OP      ${e.id}: ${e.operator}`)
    unknown++
    continue
  }

  // result length: 4 for matrix ops, 10 for AbsDiff — compare however many we produced
  const match = res.every((v, i) => v === tgt.values[i])
  if (match) {
    ok++
  } else {
    console.error(`MISMATCH        ${e.id}`)
    console.error(`  src[${e.source}] = [${src.values}]`)
    console.error(`  op=${e.operator}  steps=${steps}`)
    console.error(`  got    = [${res}]`)
    console.error(`  expect = [${tgt.values.slice(0, res.length)}]`)
    bad++
  }
}

console.log(`\n${mappings.length} edges: ${ok} OK  ${bad} BAD  ${unknown} UNKNOWN OP`)
if (bad === 0 && unknown === 0) console.log('All edges correct.')
