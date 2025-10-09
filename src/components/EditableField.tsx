import { useEffect, useState } from 'react';
import { MdDeleteOutline, MdOutlineSave } from 'react-icons/md';
import { TreeNode } from '../TreeModel/TreeNode';
import { useTree } from '../context/TreeContext';

type FieldType =
  | 'name'
  | 'birthDate'
  | 'deathDate'
  | 'occupation'
  | 'location'
  | 'bio';

type EditableFieldProps = {
  fieldType: FieldType;
  nodeRef: TreeNode;
  placeholder?: string;
  inputType?: 'text' | 'date' | 'textarea';
};

export const EditableField = ({
  fieldType,
  nodeRef,
  placeholder,
  inputType,
}: EditableFieldProps) => {
  const { updateNodeName, updatePersonData } = useTree();

  const [isEditing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(
    getCurrentValue(fieldType, nodeRef),
  );

  const currentValue = getCurrentValue(fieldType, nodeRef);

  useEffect(() => {
    setLocalValue(currentValue);
    setEditing(false);
  }, [currentValue, fieldType]);

  function getCurrentValue(fieldType: FieldType, nodeRef: TreeNode) {
    switch (fieldType) {
      case 'name':
        return nodeRef.getDisplayName();
      case 'birthDate':
        return nodeRef.getBirthday();
      case 'deathDate':
        return nodeRef.getDeathday();
      case 'occupation':
        return nodeRef.getOccupation();
      case 'bio':
        return nodeRef.getBio();
      default:
        console.error('Default label generated for field type');
        return 'DEFAULT_LABEL';
    }
  }

  function generateLabel(fieldType: FieldType) {
    switch (fieldType) {
      case 'name':
        if (localValue === '') return 'Add a name';
        return 'Name';
      case 'birthDate':
        if (localValue === '') return 'Add a birthday';
        return 'Born';
      case 'deathDate':
        if (localValue === '') return 'Add day of death';
        return 'Died';
      case 'occupation':
        if (localValue === '') return 'Add occupation';
        return 'Occupation';
      case 'bio':
        if (localValue === '') return 'Add bio';
        return 'Biography';
      default:
        console.error('Default label generated for field type');
        return 'DEFAULT_LABEL';
    }
  }

  function handleDelete(fieldType: FieldType, nodeRef: TreeNode) {
    switch (fieldType) {
      case 'name':
        updateNodeName(nodeRef, '');
        break;
      case 'birthDate':
        updatePersonData(nodeRef, {
          ...nodeRef.personData,
          birthDate: undefined,
        });
        break;
      case 'deathDate':
        updatePersonData(nodeRef, {
          ...nodeRef.personData,
          deathDate: undefined,
        });
        break;
      case 'occupation':
        updatePersonData(nodeRef, {
          ...nodeRef.personData,
          occupation: undefined,
        });
        break;
      case 'bio':
        updatePersonData(nodeRef, {
          ...nodeRef.personData,
          bio: undefined,
        });
        break;
    }
    return;
  }

  function handleSave(fieldType: FieldType, nodeRef: TreeNode) {
    switch (fieldType) {
      case 'name':
        updateNodeName(nodeRef, localValue);
        break;
      case 'birthDate':
        updatePersonData(nodeRef, {
          ...nodeRef.personData,
          birthDate: localValue,
        });
        break;
      case 'deathDate':
        updatePersonData(nodeRef, {
          ...nodeRef.personData,
          deathDate: localValue,
        });
        break;
      case 'occupation':
        updatePersonData(nodeRef, {
          ...nodeRef.personData,
          occupation: localValue,
        });
        break;
      case 'bio':
        updatePersonData(nodeRef, {
          ...nodeRef.personData,
          bio: localValue,
        });
        break;
    }
    return;
  }

  function renderButtons() {
    return (
      <>
        <button
          className="editable-field-save-button"
          onClick={() => {
            setEditing(false);
            handleSave(fieldType, nodeRef);
          }}
        >
          <MdOutlineSave />
        </button>
        <button
          className="editable-field-delete-button"
          onClick={() => {
            if (fieldType === 'name') {
              if (
                confirm(
                  `Delete ${nodeRef.getDisplayName()}'s name? \n(If you want to delete this node, delete it from ${nodeRef.getDisplayName()}'s parent or spouse.)`,
                )
              ) {
                setEditing(false);
                handleDelete(fieldType, nodeRef);
              }
            } else {
              setEditing(false);
              handleDelete(fieldType, nodeRef);
            }
          }}
        >
          <MdDeleteOutline />
        </button>
      </>
    );
  }

  return isEditing ? (
    <div className="editable-field">
      <span>
        <label htmlFor={fieldType}>{generateLabel(fieldType)}</label>
      </span>
      {fieldType === 'bio' ? (
        <>
          <textarea
            autoFocus
            name={fieldType}
            className="editable-field-textarea"
            value={localValue}
            placeholder={placeholder}
            onChange={(e) => {
              setLocalValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setEditing(false);
                handleSave(fieldType, nodeRef);
              }
              if (e.key === 'Escape') {
                setEditing(false);
              }
            }}
          ></textarea>
          <div className={`editable-field-buttons align-right`}>
            {renderButtons()}
          </div>
        </>
      ) : (
        <div className="editable-field-non-bio">
          <input
            autoFocus
            name={fieldType}
            className="editable-field-input"
            type={inputType}
            value={localValue}
            placeholder={placeholder}
            onChange={(e) => {
              setLocalValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setEditing(false);
                handleSave(fieldType, nodeRef);
              }
              if (e.key === 'Escape') {
                setEditing(false);
              }
            }}
          />
          <div className={`editable-field-buttons`}>{renderButtons()}</div>
        </div>
      )}
    </div>
  ) : (
    <div className={'editable-label'} onClick={() => setEditing(true)}>
      <div className="editable-label-heading">{generateLabel(fieldType)}</div>
      <div>{localValue}</div>
    </div>
  );
};
