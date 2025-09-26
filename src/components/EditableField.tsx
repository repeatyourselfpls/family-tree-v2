import { useEffect, useState } from 'react';
import { TreeNode } from '../TreeModel/TreeNode';
import { useTree } from '../context/TreeContext';

type FieldType =
  | 'name'
  | 'spouse'
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
  const {
    updateNodeName,
    addSpouse,
    removeSpouse,
    addDescendant,
    removeDescendant,
    updatePersonData,
  } = useTree();

  const [isEditing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(
    getCurrentValue(fieldType, nodeRef),
  );

  useEffect(() => {
    setLocalValue(getCurrentValue(fieldType, nodeRef));
    setEditing(false);
  }, [nodeRef, nodeRef.name, nodeRef.spouse, nodeRef.personData, fieldType]);

  function getCurrentValue(fieldType: FieldType, nodeRef: TreeNode) {
    switch (fieldType) {
      case 'name':
        return nodeRef.getDisplayName();
      case 'spouse':
        return nodeRef.getSpouseName();
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
        return 'Name ';
      case 'spouse':
        if (localValue === '') return 'Add a spouse';
        return 'Spouse: ';
      case 'birthDate':
        if (localValue === '') return 'Add a birthday';
        return 'Born: ';
      case 'deathDate':
        if (localValue === '') return 'Add day of death';
        return 'Died: ';
      case 'occupation':
        if (localValue === '') return 'Add occupation';
        return 'Occupation: ';
      case 'bio':
        if (localValue === '') return 'Add bio';
        return 'Biography: ';
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
      case 'spouse':
        if (!nodeRef.isSpouse) {
          removeSpouse(nodeRef);
        }
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
      case 'spouse':
        if (nodeRef.spouse !== null) {
          updateNodeName(nodeRef.spouse, localValue);
        } else {
          addSpouse(nodeRef, localValue);
        }
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

  return isEditing ? (
    <div className="editable-field">
      <label htmlFor={fieldType}>{generateLabel(fieldType)}</label>
      {fieldType === 'bio' ? (
        <div>
          <textarea
            name={fieldType}
            className="editable-field-textarea"
            value={localValue}
            placeholder={placeholder}
            onChange={(e) => {
              setLocalValue(e.target.value);
            }}
          ></textarea>
        </div>
      ) : (
        <input
          name={fieldType}
          className="editable-field-input"
          type={inputType}
          value={localValue}
          placeholder={placeholder}
          onChange={(e) => {
            setLocalValue(e.target.value);
          }}
        />
      )}
      <button
        className="editable-field-save-button"
        onClick={() => {
          setEditing(false);
          handleSave(fieldType, nodeRef);
        }}
      >
        Save
      </button>
      <button
        className="editable-field-delete-button"
        onClick={() => {
          setEditing(false);
          handleDelete(fieldType, nodeRef);
        }}
      >
        Delete
      </button>
    </div>
  ) : (
    <div
      className={'editable-label'}
      onClick={() => {
        if (nodeRef.isSpouse && fieldType === 'spouse') return;
        setEditing(true);
      }}
    >
      <strong>{generateLabel(fieldType)}</strong>
      {localValue}
    </div>
  );
};
