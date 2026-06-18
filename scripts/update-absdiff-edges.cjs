const fs = require('fs')

const OLD_IDS = new Set([
  'e-nzero-zero-absdiff',
  'e-fib-per10-absdiff',
  'e-n110-s010-absdiff',
  'e-s010-n110-absdiff',
  'e-s0110-per10-absdiff',
  'e-cfib-s0110-absdiff',
])

const NEW_EDGES = [
  { id: 'e-zero-x0-absdiff',      source: 'zero',    target: 'x0',      label: 'AbsDiff', operator: 'AbsDiff' },
  { id: 'e-x0-zero-absdiff',      source: 'x0',      target: 'zero',    label: 'AbsDiff', operator: 'AbsDiff' },
  { id: 'e-s010-per01-absdiff',   source: 's010',    target: 'per01',   label: 'AbsDiff', operator: 'AbsDiff' },
  { id: 'e-per01-s010-absdiff',   source: 'per01',   target: 's010',    label: 'AbsDiff', operator: 'AbsDiff' },
  { id: 'e-n110-per10-absdiff',   source: 'n110',    target: 'per10',   label: 'AbsDiff', operator: 'AbsDiff' },
  { id: 'e-per10-n110-absdiff',   source: 'per10',   target: 'n110',    label: 'AbsDiff', operator: 'AbsDiff' },
  { id: 'e-s0120-per01-absdiff',  source: 's0120',   target: 'per01',   label: 'AbsDiff', operator: 'AbsDiff' },
  { id: 'e-fib-s0110-absdiff',    source: 'fib',     target: 's0110',   label: 'AbsDiff', operator: 'AbsDiff' },
  { id: 'e-fib2-fib-absdiff',     source: 'fib2',    target: 'fib',     label: 'AbsDiff', operator: 'AbsDiff' },
  { id: 'e-subfact-n110-absdiff', source: 'subfact', target: 'n110',    label: 'AbsDiff', operator: 'AbsDiff' },
  { id: 'e-fact-subfact-absdiff', source: 'fact',    target: 'subfact', label: 'AbsDiff', operator: 'AbsDiff' },
  { id: 'e-e2x-x0-absdiff',      source: 'e2x',     target: 'x0',      label: 'AbsDiff', operator: 'AbsDiff' },
  { id: 'e-e3x-e2x-absdiff',     source: 'e3x',     target: 'e2x',     label: 'AbsDiff', operator: 'AbsDiff' },
  { id: 'e-e4x-e3x-absdiff',     source: 'e4x',     target: 'e3x',     label: 'AbsDiff', operator: 'AbsDiff' },
  { id: 'e-tri-s0110-absdiff',    source: 'tri',     target: 's0110',   label: 'AbsDiff', operator: 'AbsDiff' },
  { id: 'e-x1-s010-absdiff',      source: 'x1',      target: 's010',    label: 'AbsDiff', operator: 'AbsDiff' },
  { id: 'e-x2-s0120-absdiff',     source: 'x2',      target: 's0120',   label: 'AbsDiff', operator: 'AbsDiff' },
  { id: 'e-x3-s01660-absdiff',    source: 'x3',      target: 's01660',  label: 'AbsDiff', operator: 'AbsDiff' },
  { id: 'e-x4-s01436-absdiff',    source: 'x4',      target: 's01436',  label: 'AbsDiff', operator: 'AbsDiff' },
  { id: 'e-ne1x-nzero-absdiff',   source: 'ne1x',    target: 'nzero',   label: 'AbsDiff', operator: 'AbsDiff' },
]

const mappings = JSON.parse(fs.readFileSync('./src/data/mappings.json'))

// Remove old AbsDiff edges
const cleaned = mappings.filter(e => !OLD_IDS.has(e.id))

// Deduplicate new edges by id before appending
const existingIds = new Set(cleaned.map(e => e.id))
const toAdd = NEW_EDGES.filter(e => !existingIds.has(e.id))

const result = [...cleaned, ...toAdd]
fs.writeFileSync('./src/data/mappings.json', JSON.stringify(result, null, 2))
console.log(`Removed ${mappings.length - cleaned.length} old edges, added ${toAdd.length} new edges. Total: ${result.length}`)
