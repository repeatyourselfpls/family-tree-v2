import { NodeProps, Node, Handle, Position } from '@xyflow/react';
import { TreeNode } from '../TreeModel/TreeNode';
import { useTree } from '../context/TreeContext';

export type TreeNodeData = {
  nodeRef: TreeNode,
}

export type ButtonNodeType = Node<
  TreeNodeData,
  'buttonNode'
>

export default function ButtonNode(props: NodeProps<ButtonNodeType>) {
  const { updateSidebarState } = useTree()

  function handleNodeClick() {
    updateSidebarState({
      selectedNode: props.data,
      visible: true
    })
  }

  return (
    <div className="button-node" onClick={handleNodeClick}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={props.isConnectable}
      />
      <div>
        {props.data?.nodeRef.name}
      </div>
      <div>
        {props.data?.nodeRef.X}
      </div>
      <div>
        {props.data?.nodeRef.mod}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={props.isConnectable}
      />
    </div>
  )
}