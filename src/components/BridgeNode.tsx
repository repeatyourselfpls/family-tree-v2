import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { TreeNodeData } from './types';

export type BridgeNodeType = Node<TreeNodeData, 'bridgeNode'>;

export const BRIDGE_OFFSET = 4; // we need a slight offset for straight lines since the handles take space

// A thin strip that lies in midpoint of the left spouse and right spouse gap
// It connects to itself, connects spouses to it, and connects children from it
export default function BridgeNode(props: NodeProps<BridgeNodeType>) {
  return (
    <div className="bridge-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={props.isConnectable}
        id="spouseTarget"
        style={{ visibility: 'hidden' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={props.isConnectable}
        id="childrenSource"
        style={{ visibility: 'hidden' }}
      />
    </div>
  );
}
