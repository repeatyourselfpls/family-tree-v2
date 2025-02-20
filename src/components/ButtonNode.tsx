import { NodeProps, Node, Handle, Position } from '@xyflow/react';
import { SidebarState } from './Sidebar';
import { TreeNode } from '../TreeModel/TreeNode';

export type TreeNodeData = {
  nodeRef: TreeNode,
  rootNodeRef: TreeNode,
  updateSidebarStateFn: (sidebarState: SidebarState) => void,
  updateNodesAndEdgesFn: (rootNode: TreeNode) => void,
}

export type ButtonNodeType = Node<
  TreeNodeData,
  'buttonNode'
>

export default function ButtonNode(props: NodeProps<ButtonNodeType>) {
  function updateSidebarState() {
    props.data.updateSidebarStateFn({
      selectedNode: props.data,
      visible: true,
    })
  }

  return (
    <div className="button-node" onClick={updateSidebarState}>
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