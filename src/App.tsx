import { addEdge, applyEdgeChanges, applyNodeChanges, Background, Controls, Edge, Node, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { RADIUS, retrieveNodes, treeTwo } from './TreeModel/initializeTree';

import { TreeNode } from './TreeModel/TreeNode';
import Sidebar, { SidebarState } from './components/Sidebar';
import SpouseNode from './components/SpouseNode';
import { TreeNodeData } from './components/types';
import { TreeContext, TreeContextType } from './context/TreeContext';
import MainNode from './components/MainNode';
import BridgeNode from './components/BridgeNode';

const nodeTypes = {
  mainNode: MainNode,
  spouseNode: SpouseNode,
  bridgeNode: BridgeNode,
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
          type: n.isSpouse ? 'spouseNode' : 'mainNode',
        }
      )

      if (n.spouse) {
        // Add the bridge node
        calculatedNodes.push(
          {
            id: n.name + 'Bridge',
            position: { x: n.positionedX + RADIUS*2 + RADIUS, y: n.positionedY },
            data: nodeData,
            type: 'bridgeNode',
          }
        )
      }

      if (n.parent && n.parent.spouse) {
        // Add the connection from the middle if spouse
        calculatedEdges.push(
          {
            id: `${n.parent}Bridge-${n.name}`,
            source: n.parent.name + 'Bridge',
            target: n.name,
            type: 'step',
          }
        )
      } else if (n.parent) {
        // Add the connection from the parent if no spouse
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

  const updateSpouse = useCallback((parentNode: TreeNode, spouseName: string) => {
    TreeNode.updateSpouse(parentNode, spouseName)
    calculateLayout(rootNodeRef.current)
  }, [calculateLayout])

  const contextValue: TreeContextType = {
    updateSidebarState: setSidebarState,
    addDescendant,
    updateNodeName,
    updateSpouse,
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
          fitView={false}
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
