import { useCallback, useState } from 'react';
import { ReactFlow, Background, Controls, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css'
import { retrieveNodesAndEdges } from './TreeModel/initializeTree';
import { EditableNode } from './EditableNode';
import ButtonNode from './ButtonNode';

const nodeTypes = { 
  editorNode: EditableNode,
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
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
    >
      <Background bgColor={'wheat'} />
      <Controls />
    </ReactFlow>
  )
}

export default App
