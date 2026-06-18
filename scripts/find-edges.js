import { createRequire } from 'module'
import { TRANSFORMATIONS, applyOp } from '../src/data/transformations.js'

const require = createRequire(import.meta.url)
const seqs     = require('../src/data/sequences.json')
const mappings = require('../src/data/mappings.json')

const existing = new Set(mappings.map(e => `${e.source}|${e.target}|${e.operator}`))

// lookup: does this result vector match any known node's prefix?
function findMatchingNode(result) {
  return seqs.find(n => result.every((v, i) => v === n.values[i])) ?? null
}

const found = []

for (const src of seqs) {
  for (const t of TRANSFORMATIONS) {
    let cur = src.values
    let hitIntermediateNode = false

    for (let step = 1; step <= 10; step++) {
      cur = applyOp(t.id, cur)

      const tgt = findMatchingNode(cur)

      if (tgt) {
        const existsWithSteps = mappings.some(
          e => e.source === src.id && e.target === tgt.id && e.operator === t.id && (e.steps ?? 1) === step
        )

        found.push({
          src: src.id,
          op: t.id,
          tgt: tgt.id,
          step,
          isSelf: src.id === tgt.id,
          isNew: !existsWithSteps,
          // multi-step edge is redundant if we already passed through a node on the way
          hasShortcut: hitIntermediateNode,
          res: cur,
        })

        // mark: future steps pass through this node
        hitIntermediateNode = true
      }
    }
  }
}

const known = found.filter(e => !e.isNew)
// new, not a redundant shortcut (intermediate node exists), not self-loop with steps>1
const fresh = found.filter(e => e.isNew && !e.hasShortcut && !(e.isSelf && e.step > 1))

console.log(`=== KNOWN (${known.length}) ===`)
for (const e of known) {
  const stepStr = e.step > 1 ? ` x${e.step}` : ''
  console.log(`  ${e.src} -[${e.op}${stepStr}]-> ${e.tgt}${e.isSelf ? '  (self)' : ''}`)
}

// cut cycles: keep only first hit per (src, op, tgt)
const firstHit = new Map()
for (const e of fresh) {
  const key = `${e.src}|${e.op}|${e.tgt}`
  if (!firstHit.has(key) || e.step < firstHit.get(key).step) firstHit.set(key, e)
}
const display = [...firstHit.values()].filter(e => e.step === 1)

console.log(`\n=== NEW (${display.length}) ===`)
for (const e of display) {
  const stepStr = e.step > 1 ? e.step : ''
  const id = `e-${e.op.toLowerCase()}-${e.src}-${e.tgt}${stepStr}`
  const stepsField = e.step > 1 ? `, "steps": ${e.step}` : ''
  console.log(`  ${e.src} -[${e.op}${e.step > 1 ? ` x${e.step}` : ''}]-> ${e.tgt}${e.isSelf ? '  (self)' : ''}`)
  console.log(`    result: [${e.res}]`)
  console.log(`    json:   { "id": "${id}", "source": "${e.src}", "target": "${e.tgt}", "operator": "${e.op}"${stepsField} }`)
}

console.log(`\nTotal: ${found.length}  (${known.length} known, ${fresh.length} new after shortcut filter)`)
