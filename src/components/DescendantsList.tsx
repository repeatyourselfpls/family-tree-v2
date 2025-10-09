import { useEffect, useState } from 'react';
import { MdOutlineDelete, MdOutlineEdit, MdOutlineSave } from 'react-icons/md';
import { useTree } from '../context/TreeContext';
import { TreeNode } from '../TreeModel/TreeNode';

type DescendantListProps = {
  parent: TreeNode;
  onNavigate: (node: TreeNode) => void;
};

export function DescendantsList({ parent, onNavigate }: DescendantListProps) {
  const { addDescendant, removeDescendant, updateNodeName } = useTree();
  const [isAdding, setIsAdding] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [editingChild, setEditingChild] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Reset add/edit state when parent changes
  useEffect(() => {
    setIsAdding(false);
    setNewChildName('');
    setEditingChild(null);
    setEditValue('');
  }, [parent.uuid]);

  function handleAddChild() {
    if (newChildName.trim()) {
      addDescendant(parent, newChildName);
    }
    setNewChildName('');
    setIsAdding(false);
  }

  function startEdit(child: TreeNode) {
    setEditValue(child.name); // a temp value of the editing node
    setEditingChild(child.uuid); // the id of the child, basically toggles edit mode
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
        <div key={child.uuid} className="descendant-item">
          {editingChild === child.uuid ? (
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
      {isAdding ? (
        <div className="add-descendant">
          <input
            autoFocus
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
            placeholder="Enter child name"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddChild();
              }
              if (e.key === 'Escape') {
                setIsAdding(false);
                setNewChildName('');
              }
            }}
          />
          <button onClick={handleAddChild}>
            <MdOutlineSave />
          </button>
        </div>
      ) : (
        <div className="add-descendant-empty">
          <span>Add child</span>
          <button
            className="descendant-edit-button"
            onClick={() => {
              setNewChildName('');
              setIsAdding(true);
            }}
          >
            <MdOutlineEdit />
          </button>
        </div>
      )}
    </div>
  );
}
