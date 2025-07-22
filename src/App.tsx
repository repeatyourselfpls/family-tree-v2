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

export type AppConfig = {
  drawLinesFromBothSpouses: boolean
}

function App() {
  const [appConfig, setAppConfig] = useState<AppConfig>({ drawLinesFromBothSpouses: true })

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
        // Add the hidden bridge node
        calculatedNodes.push(
          {
            id: n.name + 'Bridge',
            position: { x: n.positionedX + RADIUS * 2, y: n.positionedY },
            data: nodeData,
            type: 'bridgeNode',
            // draggable: false,
          }
        )

        // Add the spouses to bridge 
        calculatedEdges.push(
          {
            id: `${n.name}-${n.name}Bridge`,
            source: `${n.name}`,
            target: n.name + 'Bridge',
            sourceHandle: 'bridgeSource',
            type: 'straight',
          },
          {
            id: `${n.spouse.name}-${n.name}Bridge`,
            source: `${n.spouse.name}`,
            target: n.name + 'Bridge',
            type: 'straight',
          }
        )
      }

      if (n.parent && n.parent.spouse) {
        // Add bridge to descendants
        calculatedEdges.push(
          {
            id: `${n.parent.name}Bridge-${n.name}`,
            source: `${n.parent.name}Bridge`,
            target: n.name,
            type: 'smoothstep',
          },
        )
      } else if (n.parent) {
        // Add the connection from the parent
        calculatedEdges.push(
          {
            id: `${n.parent.name}-${n.name}`,
            source: n.parent.name,
            target: n.name,
            type: 'smoothstep',
          }
        )
      }
    }
    setNodes(calculatedNodes)
    setEdges(calculatedEdges)
  }, [])

  useEffect(() => {
    calculateLayout(rootNodeRef.current)
  }, [calculateLayout, appConfig])

  const addDescendant = useCallback((parentNode: TreeNode, descendantName: string) => {
    const newChild = new TreeNode(descendantName, [])
    parentNode.children.push(newChild)

    calculateLayout(rootNodeRef.current)

    setSidebarState({ visible: false, selectedNode: null })
  }, [calculateLayout])

  const updateNodeName = useCallback((nodeToUpdate: TreeNode, newName: string) => {
    TreeNode.updateName(nodeToUpdate, newName)
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
    appConfig,
    setAppConfig,
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
