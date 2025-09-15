import { addEdge, applyEdgeChanges, applyNodeChanges, Background, Controls, Edge, Node, ReactFlow, ReactFlowInstance } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useState } from 'react';
import { RADIUS, retrieveNodes, treeTwo } from './TreeModel/initializeTree';

import { TreeNode } from './TreeModel/TreeNode';
import Sidebar, { SidebarState } from './components/Sidebar';
import SpouseNode from './components/SpouseNode';
import { TreeNodeData } from './components/types';
import { TreeContext, TreeContextType } from './context/TreeContext';
import MainNode from './components/MainNode';
import BridgeNode from './components/BridgeNode';
import { Navbar } from './components/Navbar';
import Toast, { ToastState } from './components/Toast';

const nodeTypes = {
  mainNode: MainNode,
  spouseNode: SpouseNode,
  bridgeNode: BridgeNode,
} // prevent re-renderings

function App() {
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [rootNode, setRootNode] = useState<TreeNode>(treeTwo)
  const [treeVersion, setTreeVersion] = useState(0)

  const [theme, setTheme] = useState("light")
  const [bgColor, setBgColor] = useState("white")

  const [nodes, setNodes] = useState([] as Node[])
  const [edges, setEdges] = useState([] as Edge[])

  const [sidebarState, setSidebarState] = useState<SidebarState>({
    visible: false,
    selectedNode: null,
  })

  const [toastState, setToastState] = useState<ToastState>({
    visible: false,
    type: 'none',
    message: ''
  })

  // on component mount
  useEffect(() => {
    // load theme
    const localTheme = localStorage.getItem('theme')
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (localTheme) {
      setTheme(localTheme)
    } else {
      setTheme(systemDark ? "dark" : "light");
    }

    // load localstorage tree
    const jsonSerialization = localStorage.getItem('family-tree')
    if (jsonSerialization) setRootNode(deserializeTreeJSON(jsonSerialization))
  }, []);

  // Theme configuration
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)

    const rootStyle = getComputedStyle(document.documentElement)
    const color = rootStyle.getPropertyValue("--background").trim()
    setBgColor(color)
  }, [theme])

  // Layout configuration
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
    calculateLayout(rootNode)

    const timeoutId = setTimeout(() => {
      const serialized = serializeTreeJSON(rootNode)
      localStorage.setItem('family-tree', serialized)
      console.log('Auto-save tree:', serialized)
    }, 1000)

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootNode, treeVersion])

  // Trigger toast animation on toast state change
  useEffect(() => {
    if (!toastState.visible) return

    const timeoutId = setTimeout(() => {
      setToastState({ visible: false, message: '', type: 'none' })
    }, 3000)
    return () => clearTimeout(timeoutId)
  }, [toastState.visible])

  const addDescendant = (parentNode: TreeNode, descendantName: string) => {
    const newChild = new TreeNode(descendantName, [])
    parentNode.children.push(newChild)

    setTreeVersion(prevVersion => prevVersion + 1)

    setSidebarState({ visible: false, selectedNode: null })
  }

  const updateNodeName = (nodeToUpdate: TreeNode, newName: string) => {
    TreeNode.updateName(nodeToUpdate, newName)
    setTreeVersion(prevVersion => prevVersion + 1)
  }

  const updateSpouse = (parentNode: TreeNode, spouseName: string) => {
    TreeNode.updateSpouse(parentNode, spouseName)
    setTreeVersion(prevVersion => prevVersion + 1)
  }

  const serializeTree = (): string => {
    return TreeNode.serializeTree(rootNode)
  }

  const deserializeTree = (serialization: string): TreeNode | null => {
    return TreeNode.deserializeTree(serialization)
  }

  const serializeTreeJSON = (node: TreeNode): string => {
    return TreeNode.serializeTreeJSON(node)
  }

  const deserializeTreeJSON = (serialization: string): TreeNode => {
    return TreeNode.deserializeTreeJSON(serialization)
  }

  // need to figure out what to do with such a large context object
  // is it possible to put state initialized in a sub component into a global context
  // object without initializing state in a global component / place
  const contextValue: TreeContextType = {
    setSidebarState,
    setToastState,
    addDescendant,
    updateNodeName,
    updateSpouse,
    setRootNode,
    serializeTree,
    deserializeTree,
    serializeTreeJSON,
    deserializeTreeJSON,

    rootNode,
    toastState,

    theme,
    toggleTheme,

    reactFlowInstance,
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
          onInit={setReactFlowInstance}
        >
          <Background bgColor={bgColor} />
          <Controls />
        </ReactFlow>

        <Sidebar
          sidebarState={sidebarState}
        />

        <Toast toastState={toastState} />
        <Navbar />
      </div>
    </TreeContext.Provider>
  )
}

export default App
