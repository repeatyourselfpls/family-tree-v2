import { useState } from 'react';
import {
  MdAdd,
  MdOutlineDelete,
  MdOutlineEdit,
  MdOutlineSave,
} from 'react-icons/md';
import { useTree } from '../context/TreeContext';
import { TreeNode } from '../TreeModel/TreeNode';

type DescendantListProps = {
  parent: TreeNode;
  onNavigate: (node: TreeNode) => void;
};

export function DescendantsList({ parent, onNavigate }: DescendantListProps) {
  const { addDescendant, removeDescendant, updateNodeName } = useTree();
  const [newChildName, setNewChildName] = useState('');
  const [editingChild, setEditingChild] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  function handleAddChild() {
    if (newChildName) {
      addDescendant(parent, newChildName);
      setNewChildName('');
    }
  }

  function startEdit(child: TreeNode) {
    setEditValue(child.name); // a temp value of the editing node
    setEditingChild(child.name); // the id of the child, basically toggles edit mode
  }

  function saveEdit(child: TreeNode) {
    if (editValue && editValue !== child.name) {
      updateNodeName(child, editValue);
    }
    setEditingChild(null);
  }

  return (
    <div className="descendants-list">
      <h4>Children ({parent.children.length})</h4>

      {parent.children.map((child) => (
        <div key={child.name} className="descendant-item">
          {editingChild === child.name ? (
            // Edit mode - input with save and delete buttons
            <>
              <input
                autoFocus
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit(child);
                  if (e.key === 'Escape') {
                    setEditingChild(null);
                    setEditValue('');
                  }
                }}
              />
              <button
                className="descendant-save-button"
                onClick={() => saveEdit(child)}
              >
                <MdOutlineSave />
              </button>
              <button
                className="descendant-delete-button"
                onClick={() => {
                  if (confirm(`Delete ${child.name}?`))
                    removeDescendant(parent, child);
                }}
              >
                <MdOutlineDelete />
              </button>
            </>
          ) : (
            // View mode - name is clickable, buttons visible
            <>
              <span onClick={() => onNavigate(child)}>{child.name}</span>
              <button
                className="descendant-edit-button"
                onClick={() => startEdit(child)}
              >
                <MdOutlineEdit />
              </button>
              <button
                className="descendant-delete-button"
                onClick={() => {
                  if (confirm(`Delete ${child.name}?`))
                    removeDescendant(parent, child);
                }}
              >
                <MdOutlineDelete />
              </button>
            </>
          )}
        </div>
      ))}

      {/* Add new child */}
      <div className="add-descendant">
        <input
          value={newChildName}
          onChange={(e) => setNewChildName(e.target.value)}
          placeholder="Add child..."
          onKeyDown={(e) => e.key === 'Enter' && handleAddChild()}
        />
        <button onClick={handleAddChild}>
          <MdAdd />
        </button>
      </div>
    </div>
  );
}
