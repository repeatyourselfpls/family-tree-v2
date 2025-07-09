import { createContext, useContext } from "react";
import { SidebarState } from "../components/Sidebar";
import { TreeNode } from "../TreeModel/TreeNode";

export type TreeContextType = {
  updateSidebarState: (newState: SidebarState) => void
  addDescendant: (parentNode: TreeNode, descendantName: string) => void
  updateNodeName: (nodeToUpdate: TreeNode, newName: string) => void
}

export const TreeContext = createContext<TreeContextType | null>(null);

export const useTree = () => {
  const context = useContext(TreeContext)
  if (!context) {
    throw new Error('useTree must be used within the TreeProvider')
  }

  return context
}
