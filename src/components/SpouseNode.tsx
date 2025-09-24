import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { useEffect, useRef } from 'react';
import { useTree } from '../context/TreeContext';
import { MAX_NODE_HEIGHT, MAX_NODE_WIDTH } from '../TreeModel/initializeTree';
import { TreeNodeData } from './types';

export type SpouseNodeType = Node<TreeNodeData, 'spouseNode'>;

export default function SpouseNode(props: NodeProps<SpouseNodeType>) {
  const { setSidebarState, cfg } = useTree();
  const spouseNodeRef = useRef<HTMLDivElement>(null);

  // on mount
  useEffect(() => {
    if (spouseNodeRef.current) {
      spouseNodeRef.current.style.setProperty(
        'width',
        `${MAX_NODE_WIDTH}px`,
        'important',
      );
      spouseNodeRef.current.style.setProperty(
        'height',
        `${MAX_NODE_HEIGHT}px`,
        'important',
      );
    }
  }, []);

  function handleNodeClick() {
    setSidebarState({
      selectedNode: props.data,
      visible: true,
    });
  }

  return (
    <div ref={spouseNodeRef} className="spouse-node" onClick={handleNodeClick}>
      <Handle
        type="source"
        position={Position.Left}
        isConnectable={props.isConnectable}
        id="left"
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

      <div className="node-name">
        {props.data?.nodeRef.getTruncatedDisplayName()}
      </div>

      {props.data?.nodeRef.getFormattedLifespan() && (
        <div className="node-age">
          {props.data?.nodeRef.getFormattedLifespan()}
        </div>
      )}

      {props.data?.nodeRef.personData.occupation && (
        <div className="node-occupation">
          {props.data?.nodeRef.getTruncatedOccupation()}
        </div>
      )}
      {cfg.mode === 'dev' && (
        <>
          <div>{props.data?.nodeRef.X}</div>
          <div>{props.data?.nodeRef.mod}</div>
        </>
      )}
    </div>
  );
}
