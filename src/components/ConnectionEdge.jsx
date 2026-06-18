import { getBezierPath, BaseEdge } from '@xyflow/react'

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
  data, markerEnd,
}) {
  const isSelf = data?.selfLoop

  let edgePath
  if (isSelf) {
    edgePath = selfLoopPath(sourceX, sourceY).path
  } else {
    ;[edgePath] = getBezierPath({
      sourceX, sourceY, sourcePosition,
      targetX, targetY, targetPosition,
    })
  }

  const pulse          = data?.pulse
  const transformColor = data?.transformColor ?? null
  const lineColor      = transformColor ?? '#2a2a4a'
  const glowColor      = transformColor ? transformColor + '66' : 'none'

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
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

    </>
  )
}
