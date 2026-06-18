import { getBezierPath, EdgeLabelRenderer, BaseEdge } from '@xyflow/react'

/** Build an SVG path for a self-loop above the node */
function selfLoopPath(cx, cy, r = 36) {
  // Circle arc sitting above the node centre
  const x1 = cx - r
  const x2 = cx + r
  const y  = cy - 10
  return {
    path: `M ${x1} ${y} C ${x1} ${y - r * 2} ${x2} ${y - r * 2} ${x2} ${y}`,
    labelX: cx,
    labelY: cy - 10 - r * 2 + 6,
  }
}

export default function ConnectionEdge({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  data, markerEnd, markerStart,
}) {
  const isSelf = data?.selfLoop

  let edgePath, labelX, labelY
  if (isSelf) {
    const s = selfLoopPath(sourceX, sourceY)
    edgePath = s.path; labelX = s.labelX; labelY = s.labelY
  } else {
    ;[edgePath, labelX, labelY] = getBezierPath({
      sourceX, sourceY, sourcePosition,
      targetX, targetY, targetPosition,
    })
  }

  const hasFwd         = data?.forward?.length  > 0
  const hasBwd         = data?.backward?.length > 0
  const pulse          = data?.pulse
  const transformColor = data?.transformColor ?? null
  const opCount        = (data?.forward?.length ?? 0) + (data?.backward?.length ?? 0)
  const lineColor      = transformColor ?? '#2a2a4a'
  const glowColor      = transformColor ? transformColor + '66' : 'none'

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={isSelf || hasFwd ? markerEnd : undefined}
        markerStart={!isSelf && hasBwd ? markerStart : undefined}
        style={{
          stroke: lineColor,
          strokeWidth: transformColor ? 2 : 1.5,
          filter: transformColor ? `drop-shadow(0 0 4px ${glowColor})` : 'none',
          transition: 'stroke 0.2s, stroke-width 0.2s',
        }}
      />

      {pulse && (
        <path
          d={edgePath}
          fill="none"
          stroke={transformColor ?? '#ffd60a'}
          strokeWidth={3}
          strokeDasharray="20 80"
          style={{
            animation: 'pulse-along-edge 0.8s ease-out forwards',
            strokeDashoffset: 100,
          }}
        />
      )}

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            cursor: 'pointer',
          }}
          className="nodrag nopan"
          title={`${opCount} operator${opCount !== 1 ? 's' : ''}`}
        >
          <div style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: transformColor ? transformColor + '22' : '#13131a',
            border: `1px solid ${transformColor ?? '#2a2a5a'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9,
            fontFamily: 'JetBrains Mono, monospace',
            color: transformColor ?? '#3a3a6a',
            fontWeight: 'bold',
            transition: 'all 0.2s',
            boxShadow: transformColor ? `0 0 6px ${transformColor}88` : 'none',
          }}>
            {opCount > 9 ? '…' : opCount}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
