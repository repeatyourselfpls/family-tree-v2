import { useState } from "react"
import { TreeNode } from "../TreeModel/TreeNode"
import { NodesAndEdges, retrieveNodesAndEdges } from "../TreeModel/initializeTree"

export type SidebarState = {
  visible: boolean,
  selectedNode: TreeNode | null,
  rootNodeRef: TreeNode | null,
  nodesAndEdgesUpdaterFn: ((nodesAndEdges: NodesAndEdges) => void) | null,
}

export type SidebarProps = {
  sidebarState: SidebarState
}

export default function Sidebar({ sidebarState }: SidebarProps) {
  const [previousSidebarState, setPreviousSidebarState] = useState(sidebarState)
  const [descendantValue, setDescendantValue] = useState('')

  if (previousSidebarState !== sidebarState) {
    if (previousSidebarState.visible !== sidebarState.visible) {
      toggleSidebar()
    }
    setPreviousSidebarState(sidebarState)
    setDescendantValue('')
  }

  function addDescendant(e) {
    e.preventDefault()
    
    sidebarState.selectedNode?.children.push(new TreeNode(descendantValue, []))
    sidebarState.nodesAndEdgesUpdaterFn(
      retrieveNodesAndEdges(sidebarState.rootNodeRef, null, null)
    )
    console.log(descendantValue)
  }

  function handleInputChange(e) {
    setDescendantValue(e.target.value)
  }

  return (
    <div id="sidebar">
      <div>{previousSidebarState.selectedNode?.name}</div>
      <div>{previousSidebarState.selectedNode?.X}</div>
      <div>{previousSidebarState.selectedNode?.mod}</div>


      <label htmlFor="descendant-name">Descendant Name</label>
      <div>
        <input 
          type="text" 
          name="descendant-name" 
          id="descendant-name" 
          placeholder="Enter descendant name"
          value={descendantValue}
          onChange={handleInputChange}
        />
      </div>

      <input type="button" value="Add descendant" onClick={addDescendant} />

    </div>
  )
}

function toggleSidebar() {
  const container = document.querySelector("#container")!

  if (container.classList.contains("container-show-sidebar")) {
    container.classList.remove("container-show-sidebar")
  } else {
    container.classList.add("container-show-sidebar")
  }
}