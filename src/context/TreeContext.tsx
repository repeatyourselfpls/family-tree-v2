import { ReactFlowInstance } from '@xyflow/react';
import { createContext, useContext } from 'react';
import { SidebarState } from '../components/Sidebar';
import { ToastType } from '../hooks/useToastManager';
import { TreeNode } from '../TreeModel/TreeNode';

export type TreeContextType = {
  setRootNode: (node: TreeNode) => void;
  addDescendant: (parentNode: TreeNode, descendantName: string) => void;
  updateNodeName: (nodeToUpdate: TreeNode, newName: string) => void;
  updateSpouse: (parentNode: TreeNode, spouseName: string) => void;
  setSidebarState: (newState: SidebarState) => void;

  serializeTree: (node: TreeNode) => string;
  serializeTreeJSON: (node: TreeNode) => string;
  deserializeTree: (serialization: string) => TreeNode | null;
  deserializeTreeJSON: (serialization: string) => TreeNode | null;

  rootNode: TreeNode;
  showToast: (message: string, type: ToastType) => void;

  theme: string;
  toggleTheme: () => void;

  reactFlowInstance: ReactFlowInstance | null;
};

export const TreeContext = createContext<TreeContextType | null>(null);

export const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error('useTree must be used within the TreeProvider');
  }

  return context;
};
