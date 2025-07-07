import { useCallback, useEffect, useRef, useState } from 'react';
import { ReactFlow, Background, Controls, applyNodeChanges, applyEdgeChanges, addEdge, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css'
import { retrieveNodes, treeTwo } from './TreeModel/initializeTree';
import ButtonNode, { TreeNodeData } from './components/ButtonNode';

import Sidebar, { SidebarState } from './components/Sidebar';
import { TreeNode } from './TreeModel/TreeNode';
import { TreeContext, TreeContextType } from './context/TreeContext';

const nodeTypes = {
  buttonNode: ButtonNode,
} // prevent re-renderings

function App() {
  const rootNodeRef = useRef(treeTwo)

  const [nodes, setNodes] = useState([] as Node[])
  const [edges, setEdges] = useState([] as Edge[])

  const [sidebarState, setSidebarState] = useState({
    visible: false,
    selectedNode: null,
  } as SidebarState)

  const calculateLayout = useCallback((rootNode: TreeNode) => {
    const traversedNodes = retrieveNodes(rootNode)
    const calculatedNodes: Node[] = []
    const calculatedEdges: Edge[] = []

    for (const n of traversedNodes) {
      const nodeData: TreeNodeData = {
        nodeRef: n,
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
  }, []) 

  useEffect(() => {
    calculateLayout(rootNodeRef.current)
  }, [calculateLayout])

  const addDescendant = useCallback((parentNode: TreeNode, descendantName: string) => {
    const newChild = new TreeNode(descendantName, [])
    parentNode.children.push(newChild)

    calculateLayout(rootNodeRef.current)

    setSidebarState({ visible: false, selectedNode: null })
  }, [calculateLayout])

  const updateNodeName = useCallback((nodeToUpdate: TreeNode, newName: string) => {
    nodeToUpdate.name = newName
    calculateLayout(rootNodeRef.current)
  }, [calculateLayout])

  const contextValue: TreeContextType = {
    updateSidebarState: setSidebarState,
    addDescendant,
    updateNodeName
  }

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
    <TreeContext.Provider value={contextValue}>
      <div id="container" className={sidebarState.visible ? "container-show-sidebar" : ""}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          proOptions={{ hideAttribution: true }}
          onPaneClick={() => setSidebarState({ visible: false, selectedNode: null })}
          fitView={true}
        >
          <Background bgColor={'wheat'} />
          <Controls />
        </ReactFlow>

        <Sidebar
          sidebarState={sidebarState}
        />
      </div>
    </TreeContext.Provider>
  )
}

export default App
