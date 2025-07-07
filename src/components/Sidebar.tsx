import { useEffect, useState } from "react"
import { TreeNodeData } from "./ButtonNode"
import { useTree } from "../context/TreeContext"

export type SidebarState = {
  visible: boolean,
  selectedNode: TreeNodeData | null,
}

export type SidebarProps = {
  sidebarState: SidebarState
}

export default function Sidebar({ sidebarState }: SidebarProps) {
  const { addDescendant, updateNodeName } = useTree()

  const [descendantValue, setDescendantValue] = useState('')
  const [nameValue, setNameValue] = useState('')

  useEffect(() => {
    setNameValue(sidebarState.selectedNode?.nodeRef.name || '')
    setDescendantValue('')
  }, [sidebarState.selectedNode])

  function handleAddDescendant(e) {
    e.preventDefault()

    if (sidebarState.selectedNode && descendantValue) {
      addDescendant(sidebarState.selectedNode.nodeRef, descendantValue)
    }
  }

  function handleNameUpdate(e) {
    e.preventDefault()
    if (sidebarState.selectedNode && nameValue) {
      updateNodeName(sidebarState.selectedNode.nodeRef, nameValue)
    }
  }

  function handleNameChange(e) {
    setNameValue(e.target.value)
  }

  function handleInputChange(e) {
    setDescendantValue(e.target.value)
  }

  return (
    <div id="sidebar">
      <h3>{sidebarState.selectedNode?.nodeRef.name}</h3>
      <div>X: {sidebarState.selectedNode?.nodeRef.X} | Y: {sidebarState.selectedNode?.nodeRef.Y}</div>
      <div>MOD: {sidebarState.selectedNode?.nodeRef.mod} </div>
      <hr />

      <label htmlFor="node-name">Update Name</label>
      <div>
        <input
          type="text"
          name="node-name"
          id="node-name"
          value={nameValue}
          onChange={handleNameChange}
        />
      </div>
      <input type="button" value="Update Name" onClick={handleNameUpdate} />

      <hr />

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
      <input type="button" value="Add descendant" onClick={handleAddDescendant} />

    </div>
  )
}