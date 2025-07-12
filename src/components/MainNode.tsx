import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { useTree } from '../context/TreeContext';
import { TreeNodeData } from './types';

export type MainNodeType = Node<
  TreeNodeData,
  'mainNode'
>

export default function MainNode(props: NodeProps<MainNodeType>) {
  const { updateSidebarState } = useTree()

  function handleNodeClick() {
    updateSidebarState({
      selectedNode: props.data,
      visible: true
    })
  }

  return (
    <div className="main-node" onClick={handleNodeClick}>
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

      {
        props.data?.nodeRef.spouse ?
        <>
          <Handle
            type="source"
            position={Position.Right}
            isConnectable={props.isConnectable}
          />
        </>
        :
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            isConnectable={props.isConnectable}
          />
        </>
      }

    </div>
  )
}