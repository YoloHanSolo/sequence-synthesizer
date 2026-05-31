import { useState, useCallback, useRef, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import SeqNode from './components/SeqNode'
import Inspector from './components/Inspector'
import ConnectionInspector from './components/ConnectionInspector'
import PipelineSandbox from './components/PipelineSandbox'
import ConnectionEdge from './components/ConnectionEdge'
import { INITIAL_NODES, INITIAL_EDGES } from './data/graphData'

const nodeTypes = { seqNode: SeqNode }
const edgeTypes = { connection: ConnectionEdge }

/** Merge raw directed edges into one display-edge per unordered node pair */
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
    map[key][slot].push({ label: e.label, operator: e.operator ?? null })
  }

  return Object.entries(map).map(([key, conn]) => ({
    id: `conn-${key}`,
    source: conn.nodeAId,
    target: conn.nodeBId,
    type: 'connection',
    markerEnd:   { type: MarkerType.ArrowClosed, color: '#2a2a4a', width: 14, height: 14 },
    markerStart: { type: MarkerType.ArrowClosed, color: '#2a2a4a', width: 14, height: 14 },
    data: { ...conn, pulse: false, active: false, selfLoop: conn.selfLoop ?? false },
  }))
}

export default function App() {
  const mergedEdges = useMemo(() => buildMergedEdges(INITIAL_EDGES), [])

  const [nodes, , onNodesChange] = useNodesState(INITIAL_NODES)
  const [edges, setEdges, onEdgesChange] = useEdgesState(mergedEdges)

  const [selectedNode, setSelectedNode]       = useState(null)
  const [selectedConn, setSelectedConn]       = useState(null)
  const [showSandbox, setShowSandbox]         = useState(false)
  const pulseTimers = useRef({})

  const clearActive = useCallback(() => {
    setEdges(eds => eds.map(e => ({ ...e, data: { ...e.data, active: false, pulse: false } })))
  }, [setEdges])

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node)
    setSelectedConn(null)
    clearActive()
  }, [clearActive])

  const onEdgeClick = useCallback((_, edge) => {
    clearActive()
    setSelectedNode(null)
    setSelectedConn(edge.data)

    // Highlight + pulse
    setEdges(eds => eds.map(e =>
      e.id === edge.id
        ? { ...e, data: { ...e.data, active: true, pulse: true } }
        : e
    ))
    clearTimeout(pulseTimers.current[edge.id])
    pulseTimers.current[edge.id] = setTimeout(() => {
      setEdges(eds => eds.map(e =>
        e.id === edge.id ? { ...e, data: { ...e.data, pulse: false } } : e
      ))
    }, 900)
  }, [clearActive, setEdges])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    setSelectedConn(null)
    clearActive()
  }, [clearActive])

  const inspectorContent = selectedConn
    ? <ConnectionInspector connection={selectedConn} nodes={nodes} />
    : <Inspector node={selectedNode} />

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: '#0d0d0f' }}>
      {/* Graph panel */}
      <div className="relative flex-1 scanlines" style={{ height: '100%' }}>
        {/* Title bar */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-2"
          style={{
            background: 'linear-gradient(180deg, #0a0a10 0%, transparent 100%)',
            borderBottom: '1px solid #1e1e2e',
          }}>
          <div>
            <span className="font-bold text-sm" style={{ color: '#00d4ff' }}>SEQUENCE SYNTHESIZER</span>
            <span className="ml-3 text-xs" style={{ color: '#3a3a5a' }}>Horizon of Seeds Map</span>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: '#3a3a5a' }}>
            <span><span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: '#ff2d55' }}></span>Seeds</span>
            <span><span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: '#00d4ff' }}></span>Polynomials</span>
            <span><span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: '#00ff88' }}></span>Recurrences</span>
            <span><span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: '#bf5af2' }}></span>Alternating</span>
            <button
              onClick={() => setShowSandbox(true)}
              className="px-3 py-1 rounded font-bold"
              style={{
                background: '#bf5af222',
                border: '1px solid #bf5af2',
                color: '#bf5af2',
                marginLeft: 8,
              }}
            >
              ◈ PIPELINE
            </button>
          </div>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
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
              return c === 'red' ? '#ff2d55' : c === 'blue' ? '#00d4ff' : c === 'green' ? '#00ff88' : '#bf5af2'
            }}
            style={{ background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 8 }}
            maskColor="#0d0d0f99"
          />
        </ReactFlow>

        {!selectedNode && !selectedConn && (
          <div className="absolute bottom-6 left-1/2 text-xs pointer-events-none"
            style={{ transform: 'translateX(-50%)', color: '#2a2a4a' }}>
            Click node to inspect · Click edge to see all A↔B paths
          </div>
        )}
      </div>

      {/* Inspector panel */}
      <div className="flex flex-col overflow-hidden"
        style={{ width: 300, minWidth: 260, background: '#0d0d14', borderLeft: '1px solid #1e1e2e' }}>
        <div className="px-4 py-2 flex-shrink-0"
          style={{ borderBottom: '1px solid #1e1e2e', background: '#0a0a10' }}>
          <span className="font-bold text-xs" style={{ color: '#00d4ff44' }}>
            {selectedConn ? 'CONNECTION PATHS' : 'DATA INSPECTOR'}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {inspectorContent}
        </div>
      </div>

      {showSandbox && <PipelineSandbox onClose={() => setShowSandbox(false)} />}
    </div>
  )
}
