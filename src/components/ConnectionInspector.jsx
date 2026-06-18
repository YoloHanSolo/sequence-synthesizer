import React from 'react'
import { MATRICES, FUNCTIONS, SEEDGEN_FULL_5x5, P_FULL_5x5 } from '../math/matrices'
import { M, mathFmt } from '../math/format.jsx'

const COLOR_MAP = {
  red:    '#ff2d55',
  blue:   '#00d4ff',
  green:  '#00ff88',
  purple: '#bf5af2',
}

export default function ConnectionInspector({ connection, nodes }) {
  if (!connection) return null

  const { nodeAId, nodeBId, forward, backward } = connection

  const nodeA = nodes.find(n => n.id === nodeAId)
  const nodeB = nodes.find(n => n.id === nodeBId)
  if (!nodeA || !nodeB) return null

  const accentA = COLOR_MAP[nodeA.data.color] || '#00d4ff'
  const accentB = COLOR_MAP[nodeB.data.color] || '#00d4ff'

  return (
    <div className="flex flex-col gap-3 p-4 h-full overflow-y-auto font-mono text-xs" style={{ color: '#c0c0e0' }}>
      {/* Header */}
      <div>
        <div className="text-xs font-bold mb-2" style={{ color: '#4a4a6a' }}>CONNECTION</div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold" style={{ color: accentA }}><M>{nodeA.data.label}</M></span>
          <span style={{ color: '#3a3a5a' }}>↔</span>
          <span className="font-bold" style={{ color: accentB }}><M>{nodeB.data.label}</M></span>
        </div>
      </div>

      <hr style={{ borderColor: '#1e1e2e' }} />

      <PathGroup
        label={nodeA.data.label + ' → ' + nodeB.data.label}
        ops={forward}
        srcVec={nodeA.data.values}
        tgtVec={nodeB.data.values}
        srcAccent={accentA}
        tgtAccent={accentB}
      />

      <hr style={{ borderColor: '#1e1e2e' }} />

      <PathGroup
        label={nodeB.data.label + ' → ' + nodeA.data.label}
        ops={backward}
        srcVec={nodeB.data.values}
        tgtVec={nodeA.data.values}
        srcAccent={accentB}
        tgtAccent={accentA}
      />
    </div>
  )
}

function PathGroup({ label, ops, srcVec, tgtVec, srcAccent, tgtAccent }) {
  return (
    <div>
      <div className="font-bold mb-2" style={{ color: '#6a6a8a', fontSize: 10 }}>
        <M>{label}</M>
      </div>
      {ops.length === 0 ? (
        <div style={{ color: '#2a2a4a' }}>no direct path</div>
      ) : (
        <div className="flex flex-col gap-2">
          {ops.map((op, i) => (
            <OpRow key={i} op={op} srcVec={srcVec} tgtVec={tgtVec} srcAccent={srcAccent} tgtAccent={tgtAccent} />
          ))}
        </div>
      )}
    </div>
  )
}

function OpRow({ op, srcVec, tgtVec, srcAccent, tgtAccent }) {
  const Mmat   = op.operator ? MATRICES[op.operator] : null
  const fn     = op.operator ? FUNCTIONS[op.operator] : null
  const result = Mmat
    ? Mmat.map(row => row.reduce((s, c, j) => s + c * srcVec[j], 0))
    : fn ? fn(srcVec)
    : null
  const valid  = result ? result.every((v, i) => v === tgtVec[i]) : null

  const cleanLabel = op.operator ?? op.label

  return (
    <div className="rounded p-2" style={{ background: '#0d0d14', border: '1px solid #1e1e2e' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold" style={{ color: '#bf5af2' }}>{cleanLabel}</span>
        {valid !== null && (
          <span style={{ color: valid ? '#00ff88' : '#ff2d55', fontSize: 9 }}>
            {valid ? '✓ verified' : '✗ mismatch'}
          </span>
        )}
        {valid === null && (
          <span style={{ color: '#3a3a5a', fontSize: 9 }}>label only</span>
        )}
      </div>

      <div className="flex items-center gap-1 flex-wrap">
        <VecDisplay vec={srcVec} accent={srcAccent} />
        <span style={{ color: '#3a3a5a' }}>→</span>
        <VecDisplay
          vec={result ?? tgtVec}
          accent={result ? (valid ? '#00ff88' : '#ff2d55') : tgtAccent}
        />
      </div>

      {Mmat && <MatrixMini M={Mmat} accent={srcAccent} opName={op.operator} />}
    </div>
  )
}

function VecDisplay({ vec, accent }) {
  return (
    <div className="flex gap-0.5">
      {vec.map((v, i) => (
        <span key={i}
          className="px-1 rounded"
          style={{
            background: '#1a1a2a',
            color: v === 0 ? '#3a3a5a' : v > 0 ? accent : '#ff2d55',
            fontSize: 10,
            minWidth: 22,
            textAlign: 'center',
          }}>
          {v}
        </span>
      ))}
    </div>
  )
}

function MatrixMini({ M: mat, accent, opName }) {
  const [open, setOpen] = React.useState(false)
  const isSeedGen = opName === 'SeedGen'
  const isP       = opName === 'P'
  const displayMat = isSeedGen ? SEEDGEN_FULL_5x5 : isP ? P_FULL_5x5 : mat

  return (
    <div className="mt-1">
      <button onClick={() => setOpen(o => !o)} style={{ color: '#3a3a5a', fontSize: 9 }} className="flex items-center gap-1">
        {open ? '▼' : '▶'} {isSeedGen ? 'full 5×5 matrix M' : isP ? 'full 5×5 matrix P' : 'matrix'}
      </button>
      {open && (
        <div className="mt-1">
          {(isSeedGen || isP) && (
            <div className="mb-1" style={{ color: '#3a3a5a', fontSize: 9 }}>
              (4×4 truncation used for computation)
            </div>
          )}
          {displayMat.map((row, ri) => (
            <div key={ri} className="flex gap-1">
              {row.map((cell, ci) => (
                <span key={ci}
                  className="w-5 text-center rounded"
                  style={{
                    fontSize: 9,
                    color: cell === 0 ? '#2a2a4a' : cell > 0 ? accent : '#ff2d55',
                  }}>
                  {cell}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
