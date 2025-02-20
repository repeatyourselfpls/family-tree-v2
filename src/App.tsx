import { useCallback, useState } from 'react';
import { ReactFlow, Background, Controls, applyNodeChanges, applyEdgeChanges, addEdge, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css'
import { retrieveNodes, treeTwo } from './TreeModel/initializeTree';
import ButtonNode, { TreeNodeData } from './components/ButtonNode';

import Sidebar, { SidebarState } from './components/Sidebar';
import { TreeNode } from './TreeModel/TreeNode';

const nodeTypes = {
  buttonNode: ButtonNode,
} // prevent re-renderings

function App() {
  const rootNode = treeTwo;

  const [sidebarState, setSidebarState] = useState({
    visible: false,
    selectedNode: null,
  } as SidebarState)

  const updateSidebarState = (newSidebarState: SidebarState) => {
    setSidebarState(newSidebarState)
  }

  const updateNodesAndEdges = (rootNode: TreeNode) => {  
    console.log('this loopin')
    const traversedNodes = retrieveNodes(rootNode)
    const calculatedNodes: Node[] = []
    const calculatedEdges: Edge[] = [] 
  
    for (const n of traversedNodes) {
      const nodeData: TreeNodeData = {
        nodeRef: n,
        rootNodeRef: rootNode,
        updateSidebarStateFn: updateSidebarState,
        updateNodesAndEdgesFn: updateNodesAndEdges,
      }
      calculatedNodes.push(
        {
          id: n.name,
          position: { x: n.positionedX, y: n.positionedY },
          data: nodeData,
          type: 'buttonNode',
        }
      )
  
      if (n.parent) {
        calculatedEdges.push(
          {
            id: `${n.parent}-${n.name}`,
            source: n.parent.name,
            target: n.name,
            type: 'step',
          }
        )
      }
    }
    setNodes(calculatedNodes)
    setEdges(calculatedEdges)
  }

  const traversedNodes = retrieveNodes(rootNode)
  const calculatedNodes: Node[] = []
  const calculatedEdges: Edge[] = [] 

  for (const n of traversedNodes) {
    const nodeData: TreeNodeData = {
      nodeRef: n,
      rootNodeRef: rootNode,
      updateSidebarStateFn: updateSidebarState,
      updateNodesAndEdgesFn: updateNodesAndEdges,
    }
    calculatedNodes.push(
      {
        id: n.name,
        position: { x: n.positionedX, y: n.positionedY },
        data: nodeData,
        type: 'buttonNode',
      }
    )

    if (n.parent) {
      calculatedEdges.push(
        {
          id: `${n.parent}-${n.name}`,
          source: n.parent.name,
          target: n.name,
          type: 'step',
        }
      )
    }
  }

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

      <Sidebar sidebarState={sidebarState} />
    </div>
  )
}

export default App
