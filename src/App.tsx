import { useCallback, useEffect, useState } from 'react';
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

  const [isSidebarVisible, setSidebarVisiblity] = useState(false)

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []
  )

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []
  )

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)), []
  )

  const hideSidebar = useCallback(() => {
    document.querySelector("#container")?.classList.remove("container-show-sidebar")
  }, [])

  // useEffect(() => {
  //   if (isSidebarVisible) {
  //     document.querySelector("#container")?.classList.add("container-show-sidebar")
  //   } else {
  //     document.querySelector("#container")?.classList.remove("container-show-sidebar")
  //   }
  // }, [isSidebarVisible])

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
        onPaneClick={() => { hideSidebar() }}
      >
        <Background bgColor={'wheat'} />
        <Controls />
      </ReactFlow>

      <Sidebar />
    </div>
  )
}

export default App
