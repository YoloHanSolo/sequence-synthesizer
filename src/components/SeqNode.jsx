import { Handle, Position } from '@xyflow/react'
import { M } from '../math/format.jsx'

const COLOR_MAP = {
  red:    { border: '#ff2d55', glow: '#ff2d5588', text: '#ff2d55', bg: '#1a0a0f' },
  blue:   { border: '#00d4ff', glow: '#00d4ff88', text: '#00d4ff', bg: '#0a141a' },
  green:  { border: '#00ff88', glow: '#00ff8888', text: '#00ff88', bg: '#0a1a0f' },
  purple: { border: '#bf5af2', glow: '#bf5af288', text: '#bf5af2', bg: '#130a1a' },
  orange: { border: '#ff9500', glow: '#ff950088', text: '#ff9500', bg: '#1a0d00' },
}

// Top:    left=25%(in/target)  right=75%(out/source)
// Bottom: left=25%(out/source) right=75%(in/target)
// Left:   top=25%(in/target)   bot=75%(out/source)
// Right:  top=25%(out/source)  bot=75%(in/target)
const HANDLES = [
  { id: 'target-top',    type: 'target', position: Position.Top,    style: { left:   '25%' } },
  { id: 'source-top',    type: 'source', position: Position.Top,    style: { left:   '75%' } },
  { id: 'source-bottom', type: 'source', position: Position.Bottom, style: { left:   '25%' } },
  { id: 'target-bottom', type: 'target', position: Position.Bottom, style: { left:   '75%' } },
  { id: 'target-left',   type: 'target', position: Position.Left,   style: { top:    '25%' } },
  { id: 'source-left',   type: 'source', position: Position.Left,   style: { top:    '75%' } },
  { id: 'source-right',  type: 'source', position: Position.Right,  style: { top:    '25%' } },
  { id: 'target-right',  type: 'target', position: Position.Right,  style: { top:    '75%' } },
]

export default function SeqNode({ data, selected }) {
  const c = COLOR_MAP[data.color] || COLOR_MAP.blue

  const handleStyle = {
    width: 6,
    height: 6,
    background: c.border,
    border: 'none',
    borderRadius: '50%',
    opacity: 0.6,
  }

  return (
    <div
      className="seq-node relative px-3 py-2 rounded-lg text-xs font-mono cursor-pointer select-none"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        boxShadow: selected
          ? `0 0 12px ${c.glow}, 0 0 30px ${c.glow}, inset 0 0 12px ${c.glow}33`
          : `0 0 6px ${c.glow}`,
        minWidth: 120,
        maxWidth: 160,
        transition: 'box-shadow 0.15s',
      }}
    >
      {HANDLES.map(h => (
        <Handle
          key={h.id}
          id={h.id}
          type={h.type}
          position={h.position}
          isConnectable={false}
          style={{ ...handleStyle, ...h.style }}
        />
      ))}

      <div style={{ color: c.text }} className="font-bold text-center leading-tight mb-1">
        <M>{data.label}</M>
      </div>
      <div className="text-center" style={{ color: '#7a7a9a', fontSize: '10px' }}>
        [{data.values.join(', ')}]
      </div>
    </div>
  )
}
