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

      <div className="person-avatar">
        {props.data.nodeRef.personData.profilePicture ? (
          <img
            src={props.data?.nodeRef.personData?.profilePicture}
            alt={`${props.data.nodeRef.name} avatar`}
            className="avatar-image"
          />
        ) : (
          <div className="avatar-initials">
            {props.data?.nodeRef.getInitials()}
          </div>
        )}
      </div>

      <div>{props.data?.nodeRef.getTruncatedDisplayName()}</div>

      {props.data?.nodeRef.getAge() && (
        <div>Age {props.data?.nodeRef.getAge()}</div>
      )}

      {props.data?.nodeRef.personData.occupation && (
        <div>{props.data?.nodeRef.getTruncatedOccupation()}</div>
      )}

      <div>{props.data?.nodeRef.X}</div>
      <div>{props.data?.nodeRef.mod}</div>
    </div>
  );
}
