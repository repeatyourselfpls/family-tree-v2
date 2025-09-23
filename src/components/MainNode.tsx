import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { useTree } from '../context/TreeContext';
import { TreeNodeData } from './types';

export type MainNodeType = Node<TreeNodeData, 'mainNode'>;

export default function MainNode(props: NodeProps<MainNodeType>) {
  const { setSidebarState } = useTree();

  function handleNodeClick() {
    setSidebarState({
      selectedNode: props.data,
      visible: true,
    });
  }

  return (
    <div className="main-node" onClick={handleNodeClick}>
      {props.data?.nodeRef.parent && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={props.isConnectable}
        />
      )}

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

      <div>{props.data?.nodeRef.getDisplayName()}</div>

      {props.data?.nodeRef.getAge() && (
        <div>Age {props.data?.nodeRef.getAge()}</div>
      )}

      {props.data?.nodeRef.personData.occupation && (
        <div>Occupation {props.data?.nodeRef.personData.occupation}</div>
      )}

      <div>{props.data?.nodeRef.X}</div>
      <div>{props.data?.nodeRef.mod}</div>

      {props.data?.nodeRef.spouse ? (
        <>
          <Handle
            type="source"
            position={Position.Right}
            isConnectable={props.isConnectable}
            id="bridgeSource"
          />
        </>
      ) : (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            isConnectable={props.isConnectable}
          />
        </>
      )}
    </div>
  );
}
