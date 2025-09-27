import { useTree } from '../context/TreeContext';
import { DescendantsList } from './DescendantsList';
import { EditableField } from './EditableField';
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
  const { setSidebarState } = useTree();
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
                placeholder=""
                fieldType="name"
                nodeRef={node}
                inputType="text"
              />
            </h3>
            {node.getAge() && <p>Age {node.getAge()}</p>}
          </div>
        </div>
        {/* Main Content */}
        <div className="sidebar-content">
          <h4>Basic Info</h4>
          <EditableField fieldType="name" nodeRef={node} />
          <EditableField fieldType="birthDate" nodeRef={node} />
          <EditableField fieldType="occupation" nodeRef={node} />

          <h4>Relationships</h4>
          <SpouseField node={node} />
          <DescendantsList
            parent={node}
            onNavigate={(child) =>
              setSidebarState({
                selectedNode: { nodeRef: child },
                visible: true,
              })
            }
          />
        </div>
        {/* <div className="debug-info">
          <div>
            X: {node.X} | Y: {node.Y}
          </div>
          <div>MOD: {node.mod}</div>
        </div> */}
      </div>
    )
  );
}
