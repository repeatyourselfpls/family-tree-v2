import { useTree } from "../context/TreeContext"
import { TreeNode } from "../TreeModel/TreeNode"
import { CiUndo, CiLight, CiSaveDown2, CiDark, CiCircleInfo } from "react-icons/ci";

// Used to create a new, empty tree
export const Navbar = () => {
  const { updateRootNode, saveTree, toggleTheme, theme, reactFlowInstance } = useTree()
  
  const reset = () => {
    updateRootNode(new TreeNode("Add your first descendant", []))
    reactFlowInstance!.fitView()
  }

  const toggleInformation = () => {
    //TODO: Maybe pop a modal that explains how to use this app
  }
  
  return <>
    <div id="navbar">
      <button onClick={toggleInformation}>
        <CiCircleInfo className="navbar-icons"/>
      </button>
      <div id="navbar-divider"></div>
      <button onClick={reset}>
        <CiUndo className="navbar-icons"/>
      </button>
      <button onClick={() => saveTree}>
        <CiSaveDown2 className="navbar-icons"/>
      </button>

      <button onClick={toggleTheme}>
        {theme === "light" && <CiLight className="navbar-icons"/> }
        {theme === "dark" && <CiDark className="navbar-icons"/> }
      </button>
    </div>
  </>
}
