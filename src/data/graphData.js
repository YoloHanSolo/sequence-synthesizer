import sequences from './sequences.json'
import mappings from './mappings.json'

const TYPE_TO_COLOR = {
  seed:        'red',
  poly:        'blue',
  exponential: 'orange',
  recurrence:  'green',
  alternating: 'purple',
}

export const INITIAL_NODES = sequences.map(seq => ({
  id: seq.id,
  type: 'seqNode',
  position: seq.position,
  data: {
    label:   seq.label,
    formula: seq.formula,
    values:  seq.values,
    type:    seq.type,
    color:   TYPE_TO_COLOR[seq.type] ?? 'blue',
  },
}))

export const INITIAL_EDGES = mappings.map(m => ({
  id:       m.id,
  source:   m.source,
  target:   m.target,
  label:    m.label,
  operator: m.operator ?? null,
  steps:    m.steps ?? 1,
}))
