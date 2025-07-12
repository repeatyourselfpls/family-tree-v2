import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { TreeNodeData } from "./types";

export type BridgeNodeType = Node<
  TreeNodeData,
  'bridgeNode'
>

export default function BridgeNode(props: NodeProps<BridgeNodeType>) {
  return (
    <div className="spouse-node">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={props.isConnectable}
      />
      <Handle
        type="target"
        position={Position.Right}
        isConnectable={props.isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={props.isConnectable}
      />
    </div>
  )
}