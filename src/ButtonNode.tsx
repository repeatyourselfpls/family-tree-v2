import { NodeProps, Node } from '@xyflow/react';

export type ButtonNode = Node<
  {
    x: number,
    mod: number,
    label: string,
  }
>

export default function ButtonNode(props: NodeProps<ButtonNode>) {
  return (
    <div className="button-node">
      <div>      
        {props.data?.label}
      </div>
      <div>      
        {props.data?.x}
      </div>
      <div>      
        {props.data?.mod}
      </div>
    </div>
  )
}