import { useEffect, useState } from 'react';
import { useTree } from '../context/TreeContext';
import { PersonData } from '../TreeModel/TreeNode';
import { EditableField } from './EditableField';
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
  }

  function updatePersonField(field: keyof PersonData, value: string) {
    setPersonData((prev) => ({
      ...prev,
      [field]: value || undefined,
    }));

    handleSave();
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
            <h3>
              <EditableField
                labelName="Name"
                onSave={() => {
                  console.log('saving');
                }}
                placeholder="Enter a name"
                type="text"
                value={node.getDisplayName()}
              />
            </h3>
            {node.getAge() && <p>Age {node.getAge()}</p>}
          </div>
        </div>
        {/* Main Content */}
        <div className="sidebar-content">
          <EditableField
            labelName="Birthday"
            onSave={updatePersonField}
            placeholder=""
            fieldType="date"
            saveKey="birthDate"
            value={node.personData.birthDate!}
          />
          <EditableField
            labelName="Deathday"
            onSave={updatePersonField}
            placeholder=""
            fieldType="date"
            saveKey="deathDate"
            value={node.personData.deathDate!}
          />
          <EditableField
            labelName="Occupation"
            onSave={updatePersonField}
            placeholder="Enter an occupation"
            fieldType="text"
            saveKey="occupation"
            value={node.personData.occupation || ''}
          />
          <EditableField
            labelName="Biography"
            onSave={updatePersonField}
            placeholder="Enter your biography here"
            fieldType="textarea"
            saveKey="bio"
            value={node.personData.occupation || ''}
          />
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
