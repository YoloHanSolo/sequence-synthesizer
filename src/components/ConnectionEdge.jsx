import { getBezierPath, BaseEdge } from '@xyflow/react'

/** Build an SVG path for a self-loop above the node */
function selfLoopPath(cx, cy, r = 36) {
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
  const isSelf    = data?.selfLoop
  const minSteps  = data?.minSteps ?? 1

  let edgePath, labelX, labelY
  if (isSelf) {
    const sl = selfLoopPath(sourceX, sourceY)
    edgePath = sl.path
    labelX   = sl.labelX
    labelY   = sl.labelY
  } else {
    ;[edgePath, labelX, labelY] = getBezierPath({
      sourceX, sourceY, sourcePosition,
      targetX, targetY, targetPosition,
    })
  }

  const pulse          = data?.pulse
  const transformColor = data?.transformColor ?? null
  const lineColor      = transformColor ?? '#2a2a4a'
  const glowColor      = transformColor ? transformColor + '66' : 'none'
  const badgeColor     = transformColor ?? '#6a6a8a'
  const r              = 9

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

      {minSteps > 1 && (
        <>
          <circle
            cx={labelX}
            cy={labelY}
            r={r}
            fill="#0d0d0f"
            stroke={badgeColor}
            strokeWidth={1}
          />
          <text
            x={labelX}
            y={labelY + 3.5}
            textAnchor="middle"
            fill={badgeColor}
            style={{
              fontSize: 9,
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 'bold',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {minSteps}
          </text>
        </>
      )}

    </>
  )
}
