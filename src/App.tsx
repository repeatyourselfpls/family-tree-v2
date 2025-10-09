import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Edge,
  Node,
  ReactFlow,
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useState } from 'react';
import BridgeNode, { BRIDGE_OFFSET } from './components/BridgeNode';
import MainNode from './components/MainNode';
import { Navbar } from './components/Navbar';
import Sidebar, { SidebarState } from './components/Sidebar';
import SpouseNode from './components/SpouseNode';
import Toast from './components/Toast';
import { TreeNodeData } from './components/types';
import WelcomeModal from './components/WelcomeModal';
import { TreeContext, TreeContextType } from './context/TreeContext';
import { useToastManager } from './hooks/useToastManager';
import {
  GAP_X,
  MAX_NODE_HEIGHT,
  MAX_NODE_WIDTH,
  retrieveNodes,
  richTreeExample2,
} from './TreeModel/initializeTree';
import { PersonData, TreeNode } from './TreeModel/TreeNode';

const nodeTypes = {
  mainNode: MainNode,
  spouseNode: SpouseNode,
  bridgeNode: BridgeNode,
}; // prevent re-renderings

export type AppConfig = {
  mode: 'dev' | 'prd';
};

function App() {
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [rootNode, setRootNode] = useState<TreeNode>(richTreeExample2);
  const [treeVersion, setTreeVersion] = useState(0);

  const [theme, setTheme] = useState('light');
  const [bgColor, setBgColor] = useState('white');

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [sidebarState, setSidebarState] = useState<SidebarState>({
    visible: false,
    selectedNode: null,
  });

  const [welcomeModalVisible, setWelcomeModalVisible] = useState(false);

  const { toastState, showToast } = useToastManager(4000);

  // on component mount
  useEffect(() => {
    const localTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    if (localTheme) {
      setTheme(localTheme);
    } else {
      setTheme(systemDark ? 'dark' : 'light');
    }

    // load localstorage tree
    const jsonSerialization = localStorage.getItem('family-tree');
    if (jsonSerialization) setRootNode(deserializeTreeJSON(jsonSerialization));

    // check if user has seen welcome modal
    const hasSeenWelcome = localStorage.getItem('family-tree-welcome-seen');
    if (!hasSeenWelcome) {
      setWelcomeModalVisible(true);
    }
  }, [reactFlowInstance]);

  // Theme configuration
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    const rootStyle = getComputedStyle(document.documentElement);
    const color = rootStyle.getPropertyValue('--background').trim();
    setBgColor(color);
  }, [theme]);

  // Recalculate layout and save to local storage
  const calculateLayout = useCallback((rootNode: TreeNode) => {
    const traversedNodes = retrieveNodes(rootNode);
    const calculatedNodes: Node[] = [];
    const calculatedEdges: Edge[] = [];

    for (const n of traversedNodes) {
      const nodeData: TreeNodeData = {
        nodeRef: n,
      };

      calculatedNodes.push({
        id: n.uuid,
        position: { x: n.positionedX, y: n.positionedY },
        data: nodeData,
        type: n.isSpouse ? 'spouseNode' : 'mainNode',
      });

      if (n.spouse) {
        // Add the bridge node positioned in the gap between spouses
        // Bridge starts at midpoint and extends downward
        calculatedNodes.push({
          id: n.uuid + 'Bridge',
          position: {
            x: n.positionedX + MAX_NODE_WIDTH + GAP_X / 2, // Start at right edge of main node
            y: n.positionedY + MAX_NODE_HEIGHT / 2 + BRIDGE_OFFSET, // Start at vertical midpoint of nodes
          },
          data: nodeData,
          type: 'bridgeNode',
          width: 1,
          height: MAX_NODE_HEIGHT / 2 - BRIDGE_OFFSET,
          style: {
            width: 1,
            height: MAX_NODE_HEIGHT / 2 - BRIDGE_OFFSET,
            visibility: 'hidden',
            background: 'red',
            pointerEvents: 'none',
          },
          draggable: false,
        });

        // Add the spouses to bridge (T-junction)
        calculatedEdges.push(
          {
            id: `${n.uuid}-${n.uuid}Bridge`,
            source: `${n.uuid}`,
            target: n.uuid + 'Bridge',
            sourceHandle: 'right', // From right side of main
            targetHandle: 'spouseTarget', // To top of bridge
            type: 'straight',
          },
          {
            id: `${n.spouse.uuid}-${n.uuid}Bridge`,
            source: `${n.spouse.uuid}`,
            target: n.uuid + 'Bridge',
            sourceHandle: 'left', // From left side of spouse
            targetHandle: 'spouseTarget', // To same top point of bridge
            type: 'straight',
          },
        );
      }

      const isChildNodeWithSingleParent = n.parent && !n.isSpouse;
      const isChildNodeWithTwoParents =
        n.parent && !n.isSpouse && n.parent.spouse;
      if (isChildNodeWithTwoParents) {
        // Add bridge to descendants
        calculatedEdges.push(
          {
            id: `${n.parent!.uuid}Bridge-${n.uuid}`,
            source: `${n.parent!.uuid}Bridge`,
            target: n.uuid,
            sourceHandle: 'childrenSource', // From bottom of bridge
            type: 'smoothstep',
          },
          // edge through the bridge, so that it's visible
          {
            id: `${n.parent!.uuid}BridgeSource-self${n.uuid}`,
            source: n.parent!.uuid + 'Bridge',
            target: n.parent!.uuid + 'Bridge',
            sourceHandle: 'childrenSource', // From bottom bridge
            targetHandle: 'spouseTarget', // To top bridge
            type: 'straight',
          },
        );
      } else if (isChildNodeWithSingleParent) {
        // Add the connection from the parent
        calculatedEdges.push({
          id: `${n.parent!.uuid}-${n.uuid}`,
          source: n.parent!.uuid,
          target: n.uuid,
          type: 'smoothstep',
        });
      }
    }
    setNodes(calculatedNodes);
    setEdges(calculatedEdges);
  }, []);

  useEffect(() => {
    calculateLayout(rootNode);

    const timeoutId = setTimeout(() => {
      const serialized = serializeTreeJSON(rootNode);
      localStorage.setItem('family-tree', serialized);
    }, 2500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootNode, treeVersion]);

  // Refit whenever the entire root node is replaced
  useEffect(() => {
    reactFlowInstance?.fitView();
  }, [rootNode, reactFlowInstance]);

  const addDescendant = (parentNode: TreeNode, descendantName: string) => {
    const newChild = new TreeNode(descendantName, []);
    parentNode.children.push(newChild);

    setTreeVersion((prev) => prev + 1);
  };

  const removeDescendant = (parentNode: TreeNode, childToRemove: TreeNode) => {
    const i = parentNode.children.indexOf(childToRemove);
    if (i > -1) {
      parentNode.children.splice(i, 1);
    }

    setTreeVersion((prev) => prev + 1);
  };

  const addSpouse = (node: TreeNode, spouseName: string) => {
    TreeNode.addSpouse(node, spouseName);
    setTreeVersion((prev) => prev + 1);
  };

  const removeSpouse = (node: TreeNode) => {
    TreeNode.removeSpouse(node);
    setTreeVersion((prev) => prev + 1);
  };

  const updateNodeName = (nodeToUpdate: TreeNode, newName: string) => {
    TreeNode.updateName(nodeToUpdate, newName);
    setTreeVersion((prev) => prev + 1);
  };

  const updatePersonData = (nodeToUpdate: TreeNode, personData: PersonData) => {
    TreeNode.updatePersonData(nodeToUpdate, personData);
    setTreeVersion((prev) => prev + 1);
  };

  const serializeTree = (node: TreeNode): string => {
    return TreeNode.serializeTree(node);
  };

  const deserializeTree = (serialization: string): TreeNode | null => {
    return TreeNode.deserializeTree(serialization);
  };

  const serializeTreeJSON = (node: TreeNode): string => {
    return TreeNode.serializeTreeJSON(node);
  };

  const deserializeTreeJSON = (serialization: string): TreeNode => {
    return TreeNode.deserializeTreeJSON(serialization);
  };

  const showWelcomeModal = () => {
    setWelcomeModalVisible(true);
  };

  const hideWelcomeModal = () => {
    setWelcomeModalVisible(false);
    localStorage.setItem('family-tree-welcome-seen', 'true');
  };

  // need to figure out what to do with such a large context object
  // is it possible to put state initialized in a sub component into a global context
  // object without initializing state in a global component / place
  const contextValue: TreeContextType = {
    showToast,
    setSidebarState,
    addDescendant,
    removeDescendant,
    addSpouse,
    removeSpouse,
    updateNodeName,
    updatePersonData,
    setRootNode,
    serializeTree,
    deserializeTree,
    serializeTreeJSON,
    deserializeTreeJSON,

    rootNode,

    theme,
    toggleTheme,
    welcomeModalVisible,
    showWelcomeModal,
    hideWelcomeModal,
    cfg: { mode: 'prd' },
  };

  const onNodesChange = useCallback((changes) => {
    setNodes((previousNodes) => {
      const updatedNodes = applyNodeChanges(changes, previousNodes);

      return updatedNodes.map((node) => {
        if (node.type === 'bridgeNode') {
          const mainNodeId = node.id.replace('Bridge', '');
          const mainNode = updatedNodes.find((n) => n.id === mainNodeId);
          const spouseNode = updatedNodes.find(
            (n) =>
              n.id === (mainNode?.data as TreeNodeData).nodeRef.spouse?.uuid,
          );

          if (mainNode && spouseNode) {
            return {
              ...node,
              position: {
                x:
                  (mainNode.position.x +
                    MAX_NODE_WIDTH +
                    spouseNode.position.x) /
                  2,
                y:
                  (mainNode.position.y +
                    spouseNode.position.y +
                    MAX_NODE_HEIGHT +
                    BRIDGE_OFFSET * 2) /
                  2,
              },
            };
          }
        }
        return node;
      });
    });
  }, []);

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  return (
    <TreeContext.Provider value={contextValue}>
      <div
        id="container"
        className={sidebarState.visible ? 'container-show-sidebar' : ''}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          proOptions={{ hideAttribution: true }}
          onPaneClick={() =>
            setSidebarState({ visible: false, selectedNode: null })
          }
          fitView={true}
          onInit={setReactFlowInstance}
        >
          <Background bgColor={bgColor} />
          <Controls />
        </ReactFlow>

        <Sidebar sidebarState={sidebarState} />
        <Navbar />
        <WelcomeModal
          visible={welcomeModalVisible}
          onClose={hideWelcomeModal}
        />

        <Toast toastState={toastState} />
      </div>
    </TreeContext.Provider>
  );
}

export default App;
