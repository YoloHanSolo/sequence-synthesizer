import React from 'react'
import { TRANSFORMATIONS, applyOp } from '../data/transformations'
import { M } from '../math/format.jsx'

const COLOR_MAP = {
  red:    '#ff2d55',
  blue:   '#00d4ff',
  green:  '#00ff88',
  purple: '#bf5af2',
}

export default function Inspector({ node }) {
  if (!node) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6" style={{ color: '#3a3a5a' }}>
        <div className="text-4xl mb-4">◈</div>
        <div className="text-sm">Click a node to inspect</div>
        <div className="text-xs mt-2" style={{ color: '#2a2a4a' }}>or click an edge to see all paths</div>
      </div>
    )
  }

  const { data } = node
  const accent = COLOR_MAP[data.color] || '#00d4ff'

  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto font-mono text-xs" style={{ color: '#c0c0e0' }}>
      {/* Header */}
      <div>
        <div className="text-base font-bold mb-1" style={{ color: accent }}>
          <M>{data.label}</M>
        </div>
        <div style={{ color: '#6a6a8a' }}>
          <M>{data.formula}</M>
        </div>
        <div className="mt-1 px-2 py-0.5 rounded text-xs inline-block"
          style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}44` }}>
          {data.tier}
        </div>
      </div>

      <hr style={{ borderColor: '#1e1e2e' }} />

      {/* Sequence values */}
      <div>
        <div className="mb-2 font-bold" style={{ color: '#6a6a8a' }}>SEQUENCE VECTOR</div>
        <div className="grid grid-cols-4 gap-1">
          {data.values.map((v, i) => (
            <div key={i} className="flex flex-col items-center rounded p-1"
              style={{ background: '#1a1a2a', border: `1px solid ${accent}33` }}>
              <span style={{ color: '#4a4a6a', fontSize: '9px' }}>x={i}</span>
              <span style={{ color: accent }} className="font-bold">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <hr style={{ borderColor: '#1e1e2e' }} />

      <OperatorPreview values={data.values} accent={accent} />
    </div>
  )
}

function OperatorPreview({ values, accent }) {
  const [open, setOpen] = React.useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left font-bold mb-2 flex items-center gap-2"
        style={{ color: '#6a6a8a' }}
      >
        <span>OPERATOR PREVIEW</span>
        <span>{open ? '▼' : '▶'}</span>
      </button>
      {open && (
        <div className="flex flex-col gap-2">
          {TRANSFORMATIONS.map(t => {
            const res = applyOp(t.id, values)
            return (
              <div key={t.id} className="rounded p-2" style={{ background: '#0d0d14', border: '1px solid #1e1e2e' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold" style={{ color: accent }}>{t.id}</span>
                  <span style={{ color: '#3a3a5a', fontSize: '9px' }}>
                    <M>{t.description}</M>
                  </span>
                </div>
                {t.matrix ? (
                  <div className="flex flex-col gap-0.5">
                    {t.matrix.map((row, ri) => (
                      <div key={ri} className="flex gap-1 items-center">
                        <span style={{ color: '#2a2a4a', fontSize: '9px', width: 12 }}>{ri}</span>
                        {row.map((cell, ci) => (
                          <span key={ci}
                            className="w-6 text-center rounded"
                            style={{
                              color: cell === 0 ? '#2a2a4a' : cell > 0 ? '#00d4ff' : '#ff2d55',
                              fontSize: '10px',
                            }}>
                            {cell}
                          </span>
                        ))}
                        <span style={{ color: '#4a4a6a' }}>→</span>
                        <span style={{ color: '#ffd60a', fontSize: '10px' }} className="font-bold">{res[ri]}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-1 items-center">
                    <span style={{ color: '#4a4a6a', fontSize: '9px' }}>→</span>
                    {res.map((v, i) => (
                      <span key={i}
                        className="w-6 text-center rounded"
                        style={{
                          color: v === 0 ? '#3a3a5a' : '#ffd60a',
                          fontSize: '10px',
                          background: '#1a1a2a',
                        }}>
                        {v}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
