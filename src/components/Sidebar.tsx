import { useState } from "react"
import { TreeNode } from "../TreeModel/TreeNode"
import { TreeNodeData } from "./ButtonNode"

export type SidebarState = {
  visible: boolean,
  selectedNode: TreeNodeData | null,
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
    
    const rootNode = sidebarState.selectedNode!.rootNodeRef
    sidebarState.selectedNode?.nodeRef.children.push(new TreeNode(descendantValue, []))
    sidebarState.selectedNode!.updateNodesAndEdgesFn(rootNode)
    console.log(descendantValue)
  }

  function handleInputChange(e) {
    setDescendantValue(e.target.value)
  }

  return (
    <div id="sidebar">
      <div>{previousSidebarState.selectedNode?.nodeRef.name}</div>
      <div>{previousSidebarState.selectedNode?.nodeRef.X}</div>
      <div>{previousSidebarState.selectedNode?.nodeRef.mod}</div>


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