import { NodeProps, Node, Handle, Position } from '@xyflow/react';

export type ButtonNode = Node<
  {
    x: number,
    mod: number,
    label: string,
  },
  'buttonNode'
>

export default function ButtonNode(props: NodeProps<ButtonNode>) {
  return (
    <div className="button-node">
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