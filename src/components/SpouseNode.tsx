import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { useTree } from '../context/TreeContext';
import { TreeNodeData } from './types';

export type SpouseNodeType = Node<TreeNodeData, 'spouseNode'>;

export default function SpouseNode(props: NodeProps<SpouseNodeType>) {
  const { setSidebarState: updateSidebarState } = useTree();

  function handleNodeClick() {
    updateSidebarState({
      selectedNode: props.data,
      visible: true,
    });
  }

  return (
    <div className="spouse-node" onClick={handleNodeClick}>
      <Handle
        type="source"
        position={Position.Left}
        isConnectable={props.isConnectable}
      />
      <div>{props.data?.nodeRef.name}</div>
      <div>{props.data?.nodeRef.X}</div>
      <div>{props.data?.nodeRef.mod}</div>
    </div>
  );
}
