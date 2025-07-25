import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { TreeNodeData } from "./types";

export type BridgeNodeType = Node<
  TreeNodeData,
  'bridgeNode'
>

export default function BridgeNode(props: NodeProps<BridgeNodeType>) {
  return (
    <div className="bridge-node">
      <Handle
        type="target"
        position={Position.Bottom}
        isConnectable={props.isConnectable}
        id="spouseTarget"
        style={{opacity: 0}}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={props.isConnectable}
        id="descendantSource"
        style={{opacity: 0}}

      />
    </div>
  )
}