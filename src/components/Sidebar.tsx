import { useEffect, useState } from 'react';
import { useTree } from '../context/TreeContext';
import { PersonData } from '../TreeModel/TreeNode';
import { TreeNodeData } from './types';

export type SidebarState = {
  visible: boolean;
  selectedNode: TreeNodeData | null;
};

export type SidebarProps = {
  sidebarState: SidebarState;
};

export default function Sidebar({ sidebarState }: SidebarProps) {
  const { addDescendant, updateNodeName, updateSpouse, updatePersonData } =
    useTree();

  const [isEditMode, setIsEditMode] = useState(false);
  const [descendantValue, setDescendantValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [spouseNameValue, setSpouseNameValue] = useState(
    sidebarState.selectedNode?.nodeRef.spouse?.name || '',
  );
  const [personData, setPersonData] = useState<PersonData>({});

  useEffect(() => {
    const node = sidebarState.selectedNode?.nodeRef;

    if (node) {
      setNameValue(node.name);
      setSpouseNameValue(node.spouse?.name || '');
      setPersonData({ ...node.personData });
      setDescendantValue('');
      setIsEditMode(false);
    }
  }, [sidebarState.selectedNode]);

  function handleDescendantUpdate(e) {
    e.preventDefault();
    if (sidebarState.selectedNode && descendantValue !== '') {
      addDescendant(sidebarState.selectedNode.nodeRef, descendantValue);
    }
  }

  function handleSave() {
    const node = sidebarState.selectedNode?.nodeRef;
    if (!node) return;

    if (nameValue !== node.name) {
      updateNodeName(node, nameValue);
    }

    if (spouseNameValue !== (node.spouse?.name || '')) {
      updateSpouse(node, spouseNameValue);
    }

    updatePersonData(node, personData);
    setIsEditMode(false);
  }

  function handleCancel() {
    const node = sidebarState.selectedNode?.nodeRef;
    if (node) {
      setNameValue(node.name);
      setSpouseNameValue(node.spouse?.name || '');
      setPersonData({ ...node.personData });
    }
    setIsEditMode(false);
  }

  function updatePersonField(field: keyof PersonData, value: string) {
    setPersonData((prev) => ({
      ...prev,
      [field]: value || undefined,
    }));
  }

  const node = sidebarState.selectedNode?.nodeRef;
  if (!node) return null;

  return (
    sidebarState.visible && (
      <div id="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-avatar">
            {node.personData?.profilePicture ? (
              <img
                src={node.personData.profilePicture}
                alt={`${node.name} avatar`}
                className="sidebar-avatar-image"
              />
            ) : (
              <div className="sidebar-avatar-initials">
                {node.getInitials()}
              </div>
            )}
          </div>
          <div className="sidebar-header-info">
            <h3>{node.getDisplayName()}</h3>
            {node.getAge() && <p>Age {node.getAge()}</p>}
          </div>
          <div className="sidebar-header-actions">
            {!isEditMode ? (
              <button onClick={() => setIsEditMode(true)} className="edit-btn">
                ✏️ Edit
              </button>
            ) : (
              <div className="edit-actions">
                <button onClick={handleSave} className="save-btn">
                  ✅ Save
                </button>
                <button onClick={handleCancel} className="cancel-btn">
                  ❌ Cancel
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Main Content */}
        <div className="sidebar-content">
          {isEditMode ? (
            /* Edit Mode - Form Fields */
            <div className="edit-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="nickname">Nickname</label>
                <input
                  type="text"
                  id="nickname"
                  value={personData.nickname || ''}
                  onChange={(e) =>
                    updatePersonField('nickname', e.target.value)
                  }
                  placeholder="Optional nickname"
                />
              </div>

              <div className="form-group">
                <label htmlFor="birthDate">Birth Date</label>
                <input
                  type="date"
                  id="birthDate"
                  value={personData.birthDate || ''}
                  onChange={(e) =>
                    updatePersonField('birthDate', e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="occupation">Occupation</label>
                <input
                  type="text"
                  id="occupation"
                  value={personData.occupation || ''}
                  onChange={(e) =>
                    updatePersonField('occupation', e.target.value)
                  }
                  placeholder="Job title"
                />
              </div>

              {!node.isSpouse && (
                <div className="form-group">
                  <label htmlFor="spouse">Spouse Name</label>
                  <input
                    type="text"
                    id="spouse"
                    value={spouseNameValue}
                    onChange={(e) => setSpouseNameValue(e.target.value)}
                    placeholder="Enter spouse name"
                  />
                </div>
              )}
            </div>
          ) : (
            /* View Mode - Display Info */
            <div className="view-info">
              {node.personData?.birthDate && (
                <div className="info-row">
                  <strong>Born:</strong> {node.personData.birthDate}
                </div>
              )}

              {node.personData?.occupation && (
                <div className="info-row">
                  <strong>Occupation:</strong> {node.personData.occupation}
                </div>
              )}

              {node.spouse && (
                <div className="info-row">
                  <strong>Spouse:</strong> {node.spouse.name}
                </div>
              )}

              {!node.personData?.birthDate &&
                !node.personData?.occupation &&
                !node.spouse && (
                  <div className="info-row">
                    <em>
                      No additional information available. Click Edit to add
                      details!
                    </em>
                  </div>
                )}
            </div>
          )}

          {/* Add Descendant Section */}
          {!node.isSpouse && (
            <div className="descendant-section">
              <h4>Add Descendant</h4>
              <div className="form-group">
                <input
                  type="text"
                  value={descendantValue}
                  onChange={(e) => setDescendantValue(e.target.value)}
                  placeholder="Enter descendant name"
                />
                <button
                  onClick={handleDescendantUpdate}
                  disabled={!descendantValue}
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="debug-info">
          <div>
            X: {node.X} | Y: {node.Y}
          </div>
          <div>MOD: {node.mod}</div>
        </div>
      </div>
    )
  );
}
