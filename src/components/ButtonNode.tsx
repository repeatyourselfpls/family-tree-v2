import { NodeProps, Node, Handle, Position } from '@xyflow/react';

export type ButtonNode = Node<
  {
    x: number,
    mod: number,
    label: string,
  },
  'buttonNode'
>

function editNode() {
  const container = document.querySelector("#container")!

  if (container?.classList.contains("container-show-sidebar")) {
    container.classList.remove("container-show-sidebar")
  } else {
    container.classList.add("container-show-sidebar")
  }
}

export default function ButtonNode(props: NodeProps<ButtonNode>) {
  return (
    <div className="button-node" onClick={editNode}>
      <Handle 
        type="target"
        position={Position.Top}
        isConnectable={props.isConnectable}
      />
      <div>      
        {props.data?.label}
      </div>
      <div>      
        {props.data?.x}
      </div>
      <div>      
        {props.data?.mod}
      </div>
      <Handle 
        type="source"
        position={Position.Bottom}
        isConnectable={props.isConnectable}
      />
    </div>
  )
}