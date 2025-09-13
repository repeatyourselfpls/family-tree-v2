import { useEffect, useState } from "react"
import { useTree } from "../context/TreeContext"
import { TreeNodeData } from "./types"

export type SidebarState = {
  visible: boolean,
  selectedNode: TreeNodeData | null,
}

export type SidebarProps = {
  sidebarState: SidebarState
}

export default function Sidebar({ sidebarState }: SidebarProps) {
  const { addDescendant, updateNodeName, updateSpouse } = useTree()

  const [descendantValue, setDescendantValue] = useState('')
  const [nameValue, setNameValue] = useState('')
  const [spouseNameValue, setSpouseNameValue] = useState(sidebarState.selectedNode?.nodeRef.spouse?.name || '')

  useEffect(() => {
    setNameValue(sidebarState.selectedNode?.nodeRef.name || '')
    setDescendantValue('')
  }, [sidebarState.selectedNode])

  function handleDescendantUpdate(e) {
    e.preventDefault()

    if (sidebarState.selectedNode && descendantValue !== '') {
      addDescendant(sidebarState.selectedNode.nodeRef, descendantValue)
    }
  }

  function handleNameUpdate(e) {
    e.preventDefault()
    if (sidebarState.selectedNode && nameValue !== '') {
      updateNodeName(sidebarState.selectedNode.nodeRef, nameValue)
    }
  }

  function handleSpouseUpdate(e) {
    e.preventDefault()
    if (sidebarState.selectedNode && spouseNameValue) {
      updateSpouse(sidebarState.selectedNode.nodeRef, spouseNameValue)
    }
  }

  function handleNameChange(e) {
    setNameValue(e.target.value)
  }

  function handleDescendantInputChange(e) {
    setDescendantValue(e.target.value)
  }

  function handleSpouseInputChange(e) {
    setSpouseNameValue(e.target.value)
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


      {!sidebarState.selectedNode?.nodeRef.isSpouse &&
        <>
          <hr />
          <label htmlFor="descendant-name">Descendant Name</label>
          <div>
            <input
              type="text"
              name="descendant-name"
              id="descendant-name"
              placeholder="Enter descendant name"
              value={descendantValue}
              onChange={handleDescendantInputChange}
            />
          </div>
          <input type="button" value="Add descendant" onClick={handleDescendantUpdate} />

          <hr />
          <label htmlFor="spouse-name">Spouse Name</label>
          <div>
            <input
              type="text"
              name="spouse-name"
              id="spouse-name"
              placeholder="Enter spouse name"
              value={spouseNameValue}
              onChange={handleSpouseInputChange}
            />
          </div>
          <input type="button" value="Add or update existing spouse" onClick={handleSpouseUpdate} />
        </>
      }
    </div>
  )
}