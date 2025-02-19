import { useCallback, useState } from 'react';
import { ReactFlow, Background, Controls, applyNodeChanges, applyEdgeChanges, addEdge, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css'
import { NodesAndEdges, retrieveNodesAndEdges, treeOne, treeTwo } from './TreeModel/initializeTree';
import ButtonNode from './components/ButtonNode';

import Sidebar, { SidebarState } from './components/Sidebar';

const nodeTypes = {
  buttonNode: ButtonNode,
} // prevent re-renderings

function App() {
  const rootNode = treeOne;

  const [sidebarState, setSidebarState] = useState({
    visible: false,
    selectedNode: null,
    rootNodeRef: rootNode,
    nodesAndEdgesUpdaterFn: null,
  } as SidebarState)

  const updateSidebarState = (newSidebarState: SidebarState) => { 
    setSidebarState(newSidebarState)
  }

  const updateNodesAndEdges = (nodesAndEdges: NodesAndEdges) => {
    setNodes(nodesAndEdges.nodes)
    setEdges(nodesAndEdges.edges)
  } 
  
  const { nodes: calculatedNodes,  edges: calculatedEdges } = retrieveNodesAndEdges(rootNode, updateSidebarState, updateNodesAndEdges)
  const [nodes, setNodes] = useState(calculatedNodes)
  const [edges, setEdges] = useState(calculatedEdges)

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
    <div id="container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        proOptions={{ hideAttribution: true }}
        onPaneClick={() => setSidebarState({ visible: false, selectedNode: null })}
      >
        <Background bgColor={'wheat'} />
        <Controls />
      </ReactFlow>

      <Sidebar sidebarState={sidebarState}/>
    </div>
  )
}

export default App
