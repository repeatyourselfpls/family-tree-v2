import { useEffect, useState } from 'react';
import {
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
  const [isEditing, setEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [spouseName, setSpouseName] = useState('');

  // Reset add/edit state when node changes
  useEffect(() => {
    setIsAdding(false);
    setEditing(false);
    setSpouseName('');
  }, [node.uuid]);

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

  // Empty state - no spouse yet
  if (!node.spouse && !isAdding) {
    return (
      <div className="spouse-field-empty">
        <span>Add spouse</span>
        <button
          className="spouse-edit-button"
          onClick={() => {
            setSpouseName('');
            setIsAdding(true);
          }}
        >
          <MdOutlineEdit />
        </button>
      </div>
    );
  }

  // Adding new spouse
  if (!node.spouse && isAdding) {
    return (
      <div className="spouse-field">
        <input
          autoFocus
          type="text"
          value={spouseName}
          onChange={(e) => setSpouseName(e.target.value)}
          placeholder="Enter spouse name"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (spouseName.trim()) {
                addSpouse(node, spouseName);
              }
              setIsAdding(false);
            }
            if (e.key === 'Escape') {
              setIsAdding(false);
            }
          }}
        />
        <button
          className="spouse-save-button"
          onClick={() => {
            if (spouseName.trim()) {
              addSpouse(node, spouseName);
            }
            setIsAdding(false);
          }}
        >
          <MdOutlineSave />
        </button>
      </div>
    );
  }

  // Has spouse - view/edit mode
  if (node.spouse) {
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setEditing(false);
                  updateNodeName(node.spouse!, spouseName);
                }
                if (e.key === 'Escape') {
                  setEditing(false);
                }
              }}
            />
            <button
              className="spouse-save-button"
              onClick={() => {
                updateNodeName(node.spouse!, spouseName);
                setEditing(false);
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
                setEditing(true);
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

  return null;
}
