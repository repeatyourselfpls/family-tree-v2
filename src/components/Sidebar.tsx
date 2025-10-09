import { useTree } from '../context/TreeContext';
import { DescendantsList } from './DescendantsList';
import { EditableField } from './EditableField';
import { ImageUpload } from './ImageUpload';
import { SpouseField } from './SpouseField';
import { TreeNodeData } from './types';

export type SidebarState = {
  visible: boolean;
  selectedNode: TreeNodeData | null;
};

export type SidebarProps = {
  sidebarState: SidebarState;
};

export default function Sidebar({ sidebarState }: SidebarProps) {
  const { setSidebarState, updatePersonData, showToast } = useTree();
  const node = sidebarState.selectedNode?.nodeRef;
  if (!node) return null;

  // Determine the correct parent for children
  const childrenParent = node.isSpouse ? node.parent! : node;

  return (
    sidebarState.visible && (
      <div id="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-avatar sidebar-avatar-large">
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
            <h3 className="sidebar-header-name">{node.getDisplayName()}</h3>
            {node.getAge() && <p>Age {node.getAge()}</p>}
          </div>
        </div>
        {/* Main Content */}
        <div className="sidebar-content">
          <h4>Basic Info</h4>
          <EditableField fieldType="name" nodeRef={node} inputType="text" />
          <EditableField
            fieldType="birthDate"
            nodeRef={node}
            inputType="date"
          />
          <EditableField
            fieldType="deathDate"
            nodeRef={node}
            inputType="date"
          />
          <EditableField
            fieldType="occupation"
            nodeRef={node}
            inputType="text"
            placeholder="Ninja, doctor, teacher"
          />
          <EditableField
            fieldType="bio"
            nodeRef={node}
            inputType="textarea"
            placeholder={`${node.getDisplayName()} was an amazing...`}
          />

          <h4>Relationships</h4>
          <SpouseField
            node={node}
            onNavigate={(spouse) =>
              setSidebarState({
                selectedNode: { nodeRef: spouse },
                visible: true,
              })
            }
          />
          <DescendantsList
            parent={childrenParent}
            onNavigate={(child) =>
              setSidebarState({
                selectedNode: { nodeRef: child },
                visible: true,
              })
            }
          />

          <h4>Profile Picture</h4>
          <ImageUpload
            currentImage={node.personData.profilePicture}
            onImageChange={(newImage) => {
              updatePersonData(node, {
                ...node.personData,
                profilePicture: newImage,
              });
            }}
            onImageDelete={() => {
              updatePersonData(node, {
                ...node.personData,
                profilePicture: undefined,
              });
            }}
            onShowToast={(message, type) => {
              showToast(message, type);
            }}
          />
        </div>
        {/* <div className="debug-info">
          <div>
            X: {node.X} | Y: {node.Y}
          </div>
          <div>MOD: {node.mod}</div>
        </div> */}
        <div className="sidebar-footer">
          <a
            href="https://suryacodes.com"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-credit"
          >
            made by surya
          </a>
        </div>
      </div>
    )
  );
}
