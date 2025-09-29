import { useState } from 'react';
import {
  MdAdd,
  MdDeleteOutline,
  MdOutlineEdit,
  MdOutlineSave,
} from 'react-icons/md';
import { useTree } from '../context/TreeContext';
import { TreeNode } from '../TreeModel/TreeNode';

type SpouseFieldProps = {
  node: TreeNode;
  onNavigate: (spouse: TreeNode) => void;
};

export function SpouseField({ node, onNavigate }: SpouseFieldProps) {
  const { addSpouse, removeSpouse, updateNodeName } = useTree();
  const [isEditing, setIsEditing] = useState(false);
  const [spouseName, setSpouseName] = useState('');

  if (node.isSpouse)
    return (
      <>
        <div className="spouse-field">
          <span onClick={() => onNavigate(node.parent!)}>
            <span id="spouse-label">Spouse</span>
            <span id="spouse-name">{node.parent!.name}</span>
          </span>
        </div>
      </>
    );

  if (!node.spouse) {
    return (
      <button
        className="add-spouse-button"
        onClick={() => {
          const name = prompt(
            'Enter a spouse name (only one spouse supported)',
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
        <>
          {/* Edit mode */}
          <input
            autoFocus
            type="text"
            value={spouseName}
            onChange={(e) => setSpouseName(e.target.value)}
          />
          <button
            className="spouse-save-button"
            onClick={() => {
              updateNodeName(node.spouse!, spouseName);
              setIsEditing(false);
            }}
          >
            <MdOutlineSave />
          </button>
          <button onClick={() => removeSpouse(node)}>
            <MdDeleteOutline />
          </button>
        </>
      ) : (
        <>
          {/* View mode */}
          <span onClick={() => onNavigate(node.spouse!)}>
            <span id="spouse-label">Spouse</span>
            <span id="spouse-name">{node.spouse.name}</span>
          </span>
          <button
            className="spouse-edit-button"
            onClick={() => {
              setSpouseName(node.spouse!.name);
              setIsEditing(true);
            }}
          >
            <MdOutlineEdit />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete ${node.spouse?.name}?`)) removeSpouse(node);
            }}
          >
            <MdDeleteOutline />
          </button>
        </>
      )}
    </div>
  );
}
