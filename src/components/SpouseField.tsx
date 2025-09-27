import { useState } from 'react';
import { MdAdd, MdDeleteOutline } from 'react-icons/md';
import { useTree } from '../context/TreeContext';
import { TreeNode } from '../TreeModel/TreeNode';

export function SpouseField({ node }: { node: TreeNode }) {
  const { addSpouse, removeSpouse, updateNodeName } = useTree();
  const [isEditing, setIsEditing] = useState(false);
  const [spouseName, setSpouseName] = useState('');

  if (node.isSpouse)
    return <div id="spouse-field">Spouse: {node.parent?.name}</div>;

  if (!node.spouse) {
    return (
      <button
        onClick={() => {
          const name = prompt(
            'Enter a spouse name, as of right now, you can only have one',
          );
          if (name) addSpouse(node, name);
        }}
      >
        <MdAdd />
      </button>
    );
  }

  return (
    <div className="spouse-field">
      {isEditing ? (
        <input
          autoFocus
          type="text"
          value={spouseName}
          onChange={(e) => setSpouseName(e.target.value)}
          onBlur={() => {
            updateNodeName(node.spouse!, spouseName);
            setIsEditing(false);
          }}
        />
      ) : (
        <>
          <span
            onClick={() => {
              setSpouseName(node.spouse!.name);
              setIsEditing(true);
            }}
          >
            Spouse: {node.spouse.name}
          </span>
          <button onClick={() => removeSpouse(node)}>
            <MdDeleteOutline />
          </button>
        </>
      )}
    </div>
  );
}
