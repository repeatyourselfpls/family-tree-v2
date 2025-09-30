import { createContext, useContext } from 'react';
import { AppConfig } from '../App';
import { SidebarState } from '../components/Sidebar';
import { ToastType } from '../hooks/useToastManager';
import { PersonData, TreeNode } from '../TreeModel/TreeNode';

export type TreeContextType = {
  setRootNode: (node: TreeNode) => void;
  addDescendant: (parentNode: TreeNode, descendantName: string) => void;
  removeDescendant: (parentNode: TreeNode, childToRemove: TreeNode) => void;
  addSpouse: (node: TreeNode, spouseName: string) => void;
  removeSpouse: (node: TreeNode) => void;
  updateNodeName: (nodeToUpdate: TreeNode, newName: string) => void;
  updatePersonData: (nodeToUpdate: TreeNode, personData: PersonData) => void;

  setSidebarState: (newState: SidebarState) => void;

  serializeTree: (node: TreeNode) => string;
  serializeTreeJSON: (node: TreeNode) => string;
  deserializeTree: (serialization: string) => TreeNode | null;
  deserializeTreeJSON: (serialization: string) => TreeNode;

  rootNode: TreeNode;
  showToast: (message: string, type: ToastType) => void;

  theme: string;
  toggleTheme: () => void;

  welcomeModalVisible: boolean;
  showWelcomeModal: () => void;
  hideWelcomeModal: () => void;

  cfg: AppConfig;
};

export const TreeContext = createContext<TreeContextType | null>(null);

export const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error('useTree must be used within the TreeProvider');
  }

  return context;
};
