const fs = require('fs')
const seqs = require('../src/data/sequences.json')
const mappings = require('../src/data/mappings.json')

const nzero = {
  id: 'nzero', label: '-(0^x)', formula: '-(0^x) = -[10*]',
  values: [-1, 0, 0, 0], type: 'seed', position: { x: 0, y: 410 }
}
const newSeqs = [...seqs, nzero]
fs.writeFileSync('./src/data/sequences.json', JSON.stringify(newSeqs, null, 2))
console.log('nzero added')

const newEdges = [
  // Neg: alt/nalt cross-connections
  { id: 'e-neg-alt4-nalt3',  source: 'alt4',  target: 'nalt3', label: 'Neg', operator: 'Neg' },
  { id: 'e-neg-nalt4-alt3',  source: 'nalt4', target: 'alt3',  label: 'Neg', operator: 'Neg' },
  { id: 'e-neg-nalt3-alt2',  source: 'nalt3', target: 'alt2',  label: 'Neg', operator: 'Neg' },
  { id: 'e-neg-nalt2-alt1',  source: 'nalt2', target: 'alt1',  label: 'Neg', operator: 'Neg' },
  { id: 'e-neg-nalt1-zero',  source: 'nalt1', target: 'zero',  label: 'Neg', operator: 'Neg' },
  { id: 'e-neg-alt3-nalt2',  source: 'alt3',  target: 'nalt2', label: 'Neg', operator: 'Neg' },
  { id: 'e-neg-alt2-nalt1',  source: 'alt2',  target: 'nalt1', label: 'Neg', operator: 'Neg' },
  { id: 'e-neg-zero-ne1x',   source: 'zero',  target: 'ne1x',  label: 'Neg', operator: 'Neg' },
  // DL0: alt/nalt cross
  { id: 'e-dl0-nalt3-alt4',  source: 'nalt3', target: 'alt4',  label: 'DL0', operator: 'DL0' },
  { id: 'e-dl0-nalt2-alt3',  source: 'nalt2', target: 'alt3',  label: 'DL0', operator: 'DL0' },
  { id: 'e-dl0-nalt1-alt2',  source: 'nalt1', target: 'alt2',  label: 'DL0', operator: 'DL0' },
  { id: 'e-dl0-alt3-nalt4',  source: 'alt3',  target: 'nalt4', label: 'DL0', operator: 'DL0' },
  { id: 'e-dl0-alt2-nalt3',  source: 'alt2',  target: 'nalt3', label: 'DL0', operator: 'DL0' },
  { id: 'e-dl0-alt1-nalt2',  source: 'alt1',  target: 'nalt2', label: 'DL0', operator: 'DL0' },
  { id: 'e-dl0-zero-nalt1',  source: 'zero',  target: 'nalt1', label: 'DL0', operator: 'DL0' },
  // H0/H1: alt/nalt <-> exp/nexp
  { id: 'e-h0-alt4-e3x',     source: 'alt4',  target: 'e3x',   label: 'H0', operator: 'H0' },
  { id: 'e-h1-alt4-ne3x',    source: 'alt4',  target: 'ne3x',  label: 'H1', operator: 'H1' },
  { id: 'e-h0-nalt4-ne3x',   source: 'nalt4', target: 'ne3x',  label: 'H0', operator: 'H0' },
  { id: 'e-h1-nalt4-e3x',    source: 'nalt4', target: 'e3x',   label: 'H1', operator: 'H1' },
  { id: 'e-h0-nalt3-ne2x',   source: 'nalt3', target: 'ne2x',  label: 'H0', operator: 'H0' },
  { id: 'e-h1-nalt3-e2x',    source: 'nalt3', target: 'e2x',   label: 'H1', operator: 'H1' },
  { id: 'e-h0-nalt2-ne1x',   source: 'nalt2', target: 'ne1x',  label: 'H0', operator: 'H0' },
  { id: 'e-h1-nalt2-x0',     source: 'nalt2', target: 'x0',    label: 'H1', operator: 'H1' },
  { id: 'e-h0-alt3-e2x',     source: 'alt3',  target: 'e2x',   label: 'H0', operator: 'H0' },
  { id: 'e-h1-alt3-ne2x',    source: 'alt3',  target: 'ne2x',  label: 'H1', operator: 'H1' },
  { id: 'e-h0-alt2-x0',      source: 'alt2',  target: 'x0',    label: 'H0', operator: 'H0' },
  { id: 'e-h1-alt2-ne1x',    source: 'alt2',  target: 'ne1x',  label: 'H1', operator: 'H1' },
  { id: 'e-h0-alt1-zero',    source: 'alt1',  target: 'zero',  label: 'H0', operator: 'H0' },
  { id: 'e-h0-zero-alt1',    source: 'zero',  target: 'alt1',  label: 'H0', operator: 'H0' },
  { id: 'e-h0-e3x-alt4',     source: 'e3x',   target: 'alt4',  label: 'H0', operator: 'H0' },
  { id: 'e-h1-e3x-nalt4',    source: 'e3x',   target: 'nalt4', label: 'H1', operator: 'H1' },
  // V0/V1: alt/nalt <-> exp/nexp
  { id: 'e-v0-nalt3-e4x',    source: 'nalt3', target: 'e4x',   label: 'V0', operator: 'V0' },
  { id: 'e-v1-nalt3-ne4x',   source: 'nalt3', target: 'ne4x',  label: 'V1', operator: 'V1' },
  { id: 'e-v0-nalt2-e3x',    source: 'nalt2', target: 'e3x',   label: 'V0', operator: 'V0' },
  { id: 'e-v1-nalt2-ne3x',   source: 'nalt2', target: 'ne3x',  label: 'V1', operator: 'V1' },
  { id: 'e-v0-nalt1-e2x',    source: 'nalt1', target: 'e2x',   label: 'V0', operator: 'V0' },
  { id: 'e-v1-nalt1-ne2x',   source: 'nalt1', target: 'ne2x',  label: 'V1', operator: 'V1' },
  { id: 'e-v0-alt3-ne4x',    source: 'alt3',  target: 'ne4x',  label: 'V0', operator: 'V0' },
  { id: 'e-v1-alt3-e4x',     source: 'alt3',  target: 'e4x',   label: 'V1', operator: 'V1' },
  { id: 'e-v0-alt2-ne3x',    source: 'alt2',  target: 'ne3x',  label: 'V0', operator: 'V0' },
  { id: 'e-v1-alt2-e3x',     source: 'alt2',  target: 'e3x',   label: 'V1', operator: 'V1' },
  { id: 'e-v0-alt1-ne2x',    source: 'alt1',  target: 'ne2x',  label: 'V0', operator: 'V0' },
  { id: 'e-v1-alt1-e2x',     source: 'alt1',  target: 'e2x',   label: 'V1', operator: 'V1' },
  { id: 'e-v0-e2x-nalt1',    source: 'e2x',   target: 'nalt1', label: 'V0', operator: 'V0' },
  { id: 'e-v1-e2x-alt1',     source: 'e2x',   target: 'alt1',  label: 'V1', operator: 'V1' },
  { id: 'e-v0-e3x-nalt2',    source: 'e3x',   target: 'nalt2', label: 'V0', operator: 'V0' },
  { id: 'e-v1-e3x-alt2',     source: 'e3x',   target: 'alt2',  label: 'V1', operator: 'V1' },
  { id: 'e-v0-e4x-nalt3',    source: 'e4x',   target: 'nalt3', label: 'V0', operator: 'V0' },
  { id: 'e-v1-e4x-alt3',     source: 'e4x',   target: 'alt3',  label: 'V1', operator: 'V1' },
  { id: 'e-v0-ne2x-alt1',    source: 'ne2x',  target: 'alt1',  label: 'V0', operator: 'V0' },
  { id: 'e-v1-ne2x-nalt1',   source: 'ne2x',  target: 'nalt1', label: 'V1', operator: 'V1' },
  { id: 'e-v0-ne3x-alt2',    source: 'ne3x',  target: 'alt2',  label: 'V0', operator: 'V0' },
  { id: 'e-v1-ne3x-nalt2',   source: 'ne3x',  target: 'nalt2', label: 'V1', operator: 'V1' },
  { id: 'e-v0-ne4x-alt3',    source: 'ne4x',  target: 'alt3',  label: 'V0', operator: 'V0' },
  { id: 'e-v1-ne4x-nalt3',   source: 'ne4x',  target: 'nalt3', label: 'V1', operator: 'V1' },
  // V0/V1: seed/poly row
  { id: 'e-v0-s010-x1',      source: 's010',  target: 'x1',    label: 'V0', operator: 'V0' },
  { id: 'e-v0-x1-s010',      source: 'x1',    target: 's010',  label: 'V0', operator: 'V0' },
  { id: 'e-v1-x0-zero',      source: 'x0',    target: 'zero',  label: 'V1', operator: 'V1' },
  { id: 'e-v0-ne1x-zero',    source: 'ne1x',  target: 'zero',  label: 'V0', operator: 'V0' },
  { id: 'e-v0-zero-ne1x',    source: 'zero',  target: 'ne1x',  label: 'V0', operator: 'V0' },
  { id: 'e-v1-zero-x0',      source: 'zero',  target: 'x0',    label: 'V1', operator: 'V1' },
  // SeedGen
  { id: 'e-sg-nalt1-s010',   source: 'nalt1', target: 's010',  label: 'M', operator: 'SeedGen' },
  { id: 'e-sg-per01-x1',     source: 'per01', target: 'x1',    label: 'M', operator: 'SeedGen' },
  { id: 'e-sg-n110-s0120',   source: 'n110',  target: 's0120', label: 'M', operator: 'SeedGen' },
  { id: 'e-sg-fib-x2',       source: 'fib',   target: 'x2',    label: 'M', operator: 'SeedGen' },
  { id: 'e-sg-tri-x3',       source: 'tri',   target: 'x3',    label: 'M', operator: 'SeedGen' },
  // P
  { id: 'e-p-n110-s010',     source: 'n110',  target: 's010',  label: 'P', operator: 'P' },
  { id: 'e-p-s0110-s0120',   source: 's0110', target: 's0120', label: 'P', operator: 'P' },
  // nzero edges
  { id: 'e-pos-nzero-ne1x',  source: 'nzero', target: 'ne1x',  label: 'Pos', operator: 'Pos' },
  { id: 'e-neg-nzero-x0',    source: 'nzero', target: 'x0',    label: 'Neg', operator: 'Neg' },
  { id: 'e-dl1-nzero-nalt1', source: 'nzero', target: 'nalt1', label: 'DL1', operator: 'DL1' },
  { id: 'e-dl0-nzero-alt1',  source: 'nzero', target: 'alt1',  label: 'DL0', operator: 'DL0' },
  { id: 'e-h0-nzero-nalt1',  source: 'nzero', target: 'nalt1', label: 'H0',  operator: 'H0' },
  { id: 'e-h1-nzero-alt1',   source: 'nzero', target: 'alt1',  label: 'H1',  operator: 'H1' },
  { id: 'e-v0-nzero-x0',     source: 'nzero', target: 'x0',    label: 'V0',  operator: 'V0' },
  { id: 'e-v1-nzero-ne1x',   source: 'nzero', target: 'ne1x',  label: 'V1',  operator: 'V1' },
  { id: 'e-dl0-x0-nzero',    source: 'x0',    target: 'nzero', label: 'DL0', operator: 'DL0' },
  { id: 'e-v0-x0-nzero',     source: 'x0',    target: 'nzero', label: 'V0',  operator: 'V0' },
  { id: 'e-dl1-ne1x-nzero',  source: 'ne1x',  target: 'nzero', label: 'DL1', operator: 'DL1' },
  { id: 'e-v1-ne1x-nzero',   source: 'ne1x',  target: 'nzero', label: 'V1',  operator: 'V1' },
  { id: 'e-pos-nalt1-nzero', source: 'nalt1', target: 'nzero', label: 'Pos', operator: 'Pos' },
  { id: 'e-h0-nalt1-nzero',  source: 'nalt1', target: 'nzero', label: 'H0',  operator: 'H0' },
  { id: 'e-neg-alt1-nzero',  source: 'alt1',  target: 'nzero', label: 'Neg', operator: 'Neg' },
  { id: 'e-h1-alt1-nzero',   source: 'alt1',  target: 'nzero', label: 'H1',  operator: 'H1' },
]

const allMappings = [...mappings, ...newEdges]
fs.writeFileSync('./src/data/mappings.json', JSON.stringify(allMappings, null, 2))
console.log('Added', newEdges.length, 'new edges, total:', allMappings.length)
