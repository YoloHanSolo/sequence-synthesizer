import { useState } from 'react'
import { MATRICES, MATRIX_LABELS, MATRIX_DESCRIPTIONS, matMul, fmtVec } from '../math/matrices'

export default function PipelineSandbox({ onClose }) {
  const [raw, setRaw] = useState('[1, 0, 0, 0]')
  const [pipeline, setPipeline] = useState([])
  const [steps, setSteps] = useState([])
  const [error, setError] = useState(null)

  function parseVec(str) {
    try {
      const cleaned = str.replace(/\s/g, '')
      const arr = JSON.parse(cleaned)
      if (!Array.isArray(arr) || arr.length !== 4) throw new Error('Need 4-element array')
      if (!arr.every(n => typeof n === 'number')) throw new Error('All elements must be numbers')
      return arr
    } catch (e) {
      throw new Error('Invalid vector: ' + e.message)
    }
  }

  function addOp(op) {
    setPipeline(p => [...p, op])
  }

  function removeOp(idx) {
    setPipeline(p => p.filter((_, i) => i !== idx))
  }

  function run() {
    setError(null)
    try {
      const initial = parseVec(raw)
      const history = [{ label: 'Input', vector: initial }]
      let current = initial
      for (const op of pipeline) {
        current = matMul(MATRICES[op], current)
        history.push({ label: op, vector: [...current] })
      }
      setSteps(history)
    } catch (e) {
      setError(e.message)
    }
  }

  function reset() {
    setPipeline([])
    setSteps([])
    setError(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative rounded-xl font-mono text-xs overflow-hidden"
        style={{
          background: '#0d0d14',
          border: '1px solid #00d4ff44',
          boxShadow: '0 0 40px #00d4ff33, 0 0 80px #00d4ff11',
          width: 680,
          maxHeight: '85vh',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: '1px solid #1e1e2e', background: '#0a0a10' }}>
          <span className="font-bold text-sm" style={{ color: '#00d4ff' }}>
            ◈ PIPELINE SANDBOX
          </span>
          <button onClick={onClose} style={{ color: '#4a4a6a' }} className="hover:text-white">✕</button>
        </div>

        <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 52px)' }}>
          {/* Input vector */}
          <div className="mb-4">
            <label className="block mb-1" style={{ color: '#6a6a8a' }}>INPUT VECTOR (4 elements)</label>
            <input
              value={raw}
              onChange={e => setRaw(e.target.value)}
              className="w-full rounded px-3 py-2 text-sm font-mono outline-none"
              style={{
                background: '#1a1a2a',
                border: '1px solid #00d4ff33',
                color: '#00d4ff',
                caretColor: '#00d4ff',
              }}
              placeholder="[1, 0, 0, 0]"
            />
            {error && <div className="mt-1" style={{ color: '#ff2d55' }}>{error}</div>}
          </div>

          {/* Operator buttons */}
          <div className="mb-4">
            <div className="mb-2" style={{ color: '#6a6a8a' }}>ADD OPERATOR</div>
            <div className="flex flex-wrap gap-2">
              {MATRIX_LABELS.map(op => (
                <button
                  key={op}
                  onClick={() => addOp(op)}
                  className="px-3 py-1 rounded text-xs font-bold transition-all"
                  style={{
                    background: '#1a1a2a',
                    border: '1px solid #bf5af244',
                    color: '#bf5af2',
                  }}
                  title={MATRIX_DESCRIPTIONS[op]}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>

          {/* Pipeline queue */}
          {pipeline.length > 0 && (
            <div className="mb-4">
              <div className="mb-2" style={{ color: '#6a6a8a' }}>PIPELINE</div>
              <div className="flex flex-wrap gap-2 items-center">
                {pipeline.map((op, i) => (
                  <div key={i} className="flex items-center gap-1">
                    {i > 0 && <span style={{ color: '#2a2a4a' }}>→</span>}
                    <button
                      onClick={() => removeOp(i)}
                      className="px-2 py-1 rounded font-bold"
                      style={{
                        background: '#2a1a3a',
                        border: '1px solid #bf5af2',
                        color: '#bf5af2',
                      }}
                      title="Click to remove"
                    >
                      {op} ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Run/Reset */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={run}
              className="px-5 py-2 rounded font-bold text-sm"
              style={{
                background: '#00d4ff22',
                border: '1px solid #00d4ff',
                color: '#00d4ff',
              }}
            >
              ▶ RUN
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 rounded font-bold text-sm"
              style={{
                background: '#ff2d5522',
                border: '1px solid #ff2d55',
                color: '#ff2d55',
              }}
            >
              ↺ RESET
            </button>
          </div>

          {/* Steps output */}
          {steps.length > 0 && (
            <div>
              <div className="mb-2" style={{ color: '#6a6a8a' }}>OUTPUT TRACE</div>
              <div className="flex flex-col gap-2">
                {steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 rounded p-2"
                    style={{ background: '#13131a', border: '1px solid #1e1e2e' }}>
                    <span className="w-16 font-bold" style={{ color: i === 0 ? '#6a6a8a' : '#bf5af2' }}>
                      {s.label}
                    </span>
                    <span style={{ color: '#4a4a6a' }}>→</span>
                    <div className="flex gap-2">
                      {s.vector.map((v, j) => (
                        <span key={j} className="px-2 py-0.5 rounded"
                          style={{
                            background: '#1a1a2a',
                            color: v === 0 ? '#3a3a5a' : v > 0 ? '#00d4ff' : '#ff2d55',
                            border: '1px solid #1e1e2e',
                          }}>
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
