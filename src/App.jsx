import { useState, useCallback, useRef, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import SeqNode from './components/SeqNode'
import ConnectionEdge from './components/ConnectionEdge'
import { INITIAL_NODES, INITIAL_EDGES } from './data/graphData'
import { TRANSFORMATIONS } from './data/transformations'

const nodeTypes = { seqNode: SeqNode }
const edgeTypes = { connection: ConnectionEdge }

const FILTERABLE_TRANSFORMS = TRANSFORMATIONS.filter(t => t.filterable)
const TRANSFORM_COLOR = Object.fromEntries(
  FILTERABLE_TRANSFORMS.map(t => [t.id, t.color])
)
const FILTERABLE_IDS = new Set(FILTERABLE_TRANSFORMS.map(t => t.id))

const TYPE_FILTERS = [
  { id: 'seed',        label: 'S', name: 'Seeds',       color: '#ff2d55' },
  { id: 'poly',        label: 'P', name: 'Poly',         color: '#00d4ff' },
  { id: 'exponential', label: 'E', name: 'Exp',          color: '#ff9500' },
  { id: 'recurrence',  label: 'R', name: 'Rec',          color: '#00ff88' },
  { id: 'alternating', label: 'A', name: 'Alt',          color: '#bf5af2' },
]

function buildMergedEdges(rawEdges) {
  const map = {}
  for (const e of rawEdges) {
    const isSelf = e.source === e.target
    const [a, b] = isSelf ? [e.source, e.source] : [e.source, e.target].sort()
    const key = isSelf ? `${a}~~self` : `${a}~~${b}`
    if (!map[key]) {
      map[key] = { nodeAId: a, nodeBId: b, forward: [], backward: [], selfLoop: isSelf }
    }
    const slot = isSelf || e.source === a ? 'forward' : 'backward'
    map[key][slot].push({ label: e.label, operator: e.operator ?? null, steps: e.steps ?? 1 })
  }
  return Object.entries(map).map(([key, conn]) => ({
    id: `conn-${key}`,
    source: conn.nodeAId,
    target: conn.nodeBId,
    type: 'connection',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#2a2a4a', width: 14, height: 14 },
    data: { ...conn, pulse: false, selfLoop: conn.selfLoop ?? false },
  }))
}

const BASE_MERGED_EDGES = buildMergedEdges(INITIAL_EDGES)

const OPPOSITE = { right: 'left', left: 'right', top: 'bottom', bottom: 'top' }

function edgeSide(dx, dy) {
  return Math.abs(dx) >= Math.abs(dy)
    ? (dx >= 0 ? 'right' : 'left')
    : (dy >= 0 ? 'bottom' : 'top')
}

function getHandles(srcId, tgtId, nodePos) {
  const posA = nodePos[srcId]
  const posB = nodePos[tgtId]
  if (!posA || !posB) return { sourceHandle: 'source-right', targetHandle: 'target-left' }
  const side = edgeSide(posB.x - posA.x, posB.y - posA.y)
  return { sourceHandle: `source-${side}`, targetHandle: `target-${OPPOSITE[side]}` }
}

const ALL_TYPE_IDS = ['seed', 'poly', 'exponential', 'recurrence', 'alternating']
const ALL_TRANSFORM_IDS = FILTERABLE_TRANSFORMS.map(t => t.id)

function loadSet(key, defaults) {
  try {
    const saved = JSON.parse(localStorage.getItem(key))
    if (Array.isArray(saved)) return new Set(saved)
  } catch {}
  return new Set(defaults)
}

export default function App() {
  const [activeTypes, setActiveTypes] = useState(() => loadSet('seq-activeTypes', ALL_TYPE_IDS))
  const [activeTransforms, setActiveTransforms] = useState(() => loadSet('seq-activeTransforms', ALL_TRANSFORM_IDS))
  const [pulseEdgeId, setPulseEdgeId] = useState(null)
const pulseTimer = useRef(null)

  const [allNodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES)

  const resetPositions = useCallback(() => {
    setNodes(INITIAL_NODES)
  }, [setNodes])

  const hideAllTypes = useCallback(() => {
    setActiveTypes(new Set())
    localStorage.setItem('seq-activeTypes', JSON.stringify([]))
  }, [])

  const hideAllTransforms = useCallback(() => {
    setActiveTransforms(new Set())
    localStorage.setItem('seq-activeTransforms', JSON.stringify([]))
  }, [])

  const visibleNodes = useMemo(() =>
    allNodes.filter(n => activeTypes.has(n.data.type)),
    [allNodes, activeTypes]
  )

  const visibleNodeIds = useMemo(() =>
    new Set(visibleNodes.map(n => n.id)),
    [visibleNodes]
  )

  const displayEdges = useMemo(() => {
    if (activeTransforms.size === 0) return []

    const nodePos = Object.fromEntries(allNodes.map(n => [n.id, n.position]))
    const result = []

    for (const edge of BASE_MERGED_EDGES) {
      if (!visibleNodeIds.has(edge.source) || !visibleNodeIds.has(edge.target)) continue

      const fwdPaths = edge.data.forward ?? []
      const bwdPaths = edge.data.backward ?? []
      const isSelf = edge.data.selfLoop

      const pathVisible = paths => paths.some(p => activeTransforms.has(p.operator))

      const activeMinSteps = paths => {
        const active = paths.filter(p => p.operator && activeTransforms.has(p.operator))
        return active.length ? Math.min(...active.map(p => p.steps ?? 1)) : 1
      }

      if (pathVisible(fwdPaths)) {
        const activeOp = fwdPaths.map(p => p.operator).filter(Boolean).find(op => activeTransforms.has(op))
        const transformColor = activeOp ? TRANSFORM_COLOR[activeOp] : null
        const markerColor = transformColor ?? '#2a2a4a'
        const handles = isSelf ? {} : getHandles(edge.source, edge.target, nodePos)
        const edgeId = `${edge.id}-fwd`
        const minSteps = activeMinSteps(fwdPaths)
        result.push({
          ...edge,
          id: edgeId,
          source: edge.source,
          target: edge.target,
          ...handles,
          markerEnd: { type: MarkerType.ArrowClosed, color: markerColor, width: 14, height: 14 },
          data: { ...edge.data, forward: fwdPaths, backward: [], pulse: pulseEdgeId === edgeId, transformColor, minSteps },
        })
      }

      if (!isSelf && pathVisible(bwdPaths)) {
        const activeOp = bwdPaths.map(p => p.operator).filter(Boolean).find(op => activeTransforms.has(op))
        const transformColor = activeOp ? TRANSFORM_COLOR[activeOp] : null
        const markerColor = transformColor ?? '#2a2a4a'
        const handles = getHandles(edge.target, edge.source, nodePos)
        const edgeId = `${edge.id}-bwd`
        const minSteps = activeMinSteps(bwdPaths)
        result.push({
          ...edge,
          id: edgeId,
          source: edge.target,
          target: edge.source,
          ...handles,
          markerEnd: { type: MarkerType.ArrowClosed, color: markerColor, width: 14, height: 14 },
          data: { ...edge.data, forward: bwdPaths, backward: [], pulse: pulseEdgeId === edgeId, transformColor, minSteps },
        })
      }
    }

    return result
  }, [visibleNodeIds, activeTransforms, pulseEdgeId, allNodes])

  const toggleType = useCallback((id) => {
    setActiveTypes(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      localStorage.setItem('seq-activeTypes', JSON.stringify([...next]))
      return next
    })
  }, [])

  const toggleTransform = useCallback((id) => {
    setActiveTransforms(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      localStorage.setItem('seq-activeTransforms', JSON.stringify([...next]))
      return next
    })
  }, [])

  const onEdgeClick = useCallback((_, edge) => {
    clearTimeout(pulseTimer.current)
    setPulseEdgeId(edge.id)
    pulseTimer.current = setTimeout(() => setPulseEdgeId(null), 900)
  }, [])

  const onPaneClick = useCallback(() => setPulseEdgeId(null), [])

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: '#0d0d0f' }}>
      <div className="relative flex-1 scanlines" style={{ height: '100%' }}>

        {/* Title bar */}
        <div
          className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-2"
          style={{
            background: 'linear-gradient(180deg, #0a0a10 0%, transparent 100%)',
            borderBottom: '1px solid #1e1e2e',
          }}
        >
          <div>
            <span className="font-bold text-sm" style={{ color: '#00d4ff' }}>SEQUENCE SYNTHESIZER</span>
            <span className="ml-3 text-xs" style={{ color: '#3a3a5a' }}>Horizon of Seeds Map</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { label: 'reset layout',    onClick: resetPositions,  title: 'Reset node positions' },
              { label: 'hide types',      onClick: hideAllTypes,    title: 'Hide all node types' },
              { label: 'hide transforms', onClick: hideAllTransforms, title: 'Hide all transform edges' },
            ].map(({ label, onClick, title }) => (
              <button
                key={label}
                onClick={onClick}
                title={title}
                style={{
                  padding: '3px 10px',
                  borderRadius: 4,
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  background: '#0d0d0f',
                  border: '1px solid #3a3a6a',
                  color: '#7070a8',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#00d4ff'; e.currentTarget.style.color = '#00d4ff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#3a3a6a'; e.currentTarget.style.color = '#7070a8' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Transform filter column — top left */}
        <div
          className="absolute z-10"
          style={{ top: 41, left: 6, pointerEvents: 'none' }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              padding: '6px 0',
              pointerEvents: 'all',
            }}
          >
            {FILTERABLE_TRANSFORMS.map(t => {
              const active = activeTransforms.has(t.id)
              return (
                <button
                  key={t.id}
                  onClick={() => toggleTransform(t.id)}
                  title={t.name}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    background: active ? t.color + '22' : '#0d0d0f',
                    border: `1px solid ${active ? t.color : '#2a2a4a'}`,
                    color: active ? t.color : '#3a3a5a',
                    boxShadow: active ? `0 0 6px ${t.color}44` : 'none',
                    transition: 'all 0.15s',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t.id}
                </button>
              )
            })}
          </div>
        </div>

        {/* Type filter column — top right */}
        <div
          className="absolute z-10"
          style={{ top: 41, right: 6, pointerEvents: 'none' }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              padding: '6px 0',
              pointerEvents: 'all',
              alignItems: 'stretch',
            }}
          >
            {TYPE_FILTERS.map(t => {
              const active = activeTypes.has(t.id)
              return (
                <button
                  key={t.id}
                  onClick={() => toggleType(t.id)}
                  title={t.name}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    background: active ? t.color + '22' : '#0d0d0f',
                    border: `1px solid ${active ? t.color : '#2a2a4a'}`,
                    color: active ? t.color : '#3a3a5a',
                    boxShadow: active ? `0 0 6px ${t.color}44` : 'none',
                    transition: 'all 0.15s',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t.name}
                </button>
              )
            })}
          </div>
        </div>

        <ReactFlow
          nodes={visibleNodes}
          edges={displayEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          minZoom={0.2}
          maxZoom={2}
        >
          <Background color="#1a1a2a" gap={32} size={1} />
          <Controls
            style={{ background: '#13131a', border: '1px solid #1e1e2e', borderRadius: 8 }}
          />
          <MiniMap
            nodeColor={n => {
              const c = n.data?.color
              return c === 'red' ? '#ff2d55'
                : c === 'blue' ? '#00d4ff'
                : c === 'green' ? '#00ff88'
                : c === 'orange' ? '#ff9500'
                : '#bf5af2'
            }}
            style={{ background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 8 }}
            maskColor="#0d0d0f99"
          />
        </ReactFlow>

        <div
          className="absolute bottom-6 left-1/2 text-xs pointer-events-none"
          style={{ transform: 'translateX(-50%)', color: '#2a2a4a' }}
        >
          Click edge to highlight · Drag to rearrange
        </div>
      </div>

    </div>
  )
}
