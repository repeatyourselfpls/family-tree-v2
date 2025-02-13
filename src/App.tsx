import { useCallback, useState } from 'react';
import { ReactFlow, Background, Controls, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css'
import { retrieveNodesAndEdges } from './TreeModel/initializeTree';
import ButtonNode from './components/ButtonNode';
import Sidebar from './components/Sidebar';

const nodeTypes = {
  buttonNode: ButtonNode,
} // prevent re-renderings

function App() {

  const { nodes: initialNodes, edges: initialEdges } = retrieveNodesAndEdges()
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []
  )

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []
  )

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)), []
  )

  return (
    <>
      <div id="container">
        <div id="flow-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            proOptions={{ hideAttribution: true }}
          >
            <Background bgColor={'wheat'} />
            <Controls />
          </ReactFlow>
        </div>

        <div id="sidebar-hidden"><Sidebar /></div>
      </div>
    </>
  )
}

export default App
