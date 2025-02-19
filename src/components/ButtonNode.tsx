import { NodeProps, Node, Handle, Position } from '@xyflow/react';
import { SidebarState } from './Sidebar';
import { TreeNode } from '../TreeModel/TreeNode';
import { NodesAndEdges } from '../TreeModel/initializeTree';

export type ButtonNodeType = Node<
  {
    nodeRef: TreeNode,
    rootNodeRef: TreeNode,
    sidebarStateUpdaterFn: (sidebarState: SidebarState) => void,
    nodesAndEdgesUpdaterFn: (nodesAndEdges: NodesAndEdges) => void,
  },
  'buttonNode'
>

export default function ButtonNode(props: NodeProps<ButtonNodeType>) {
  function updateSidebarState() {
    props.data.sidebarStateUpdaterFn({
      selectedNode: props.data.nodeRef,
      visible: true,
      rootNodeRef: props.data.rootNodeRef,
      nodesAndEdgesUpdaterFn: props.data.nodesAndEdgesUpdaterFn
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