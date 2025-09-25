import { useState } from 'react';
import { PersonData } from '../TreeModel/TreeNode';

type FieldType = 'date' | 'textarea' | 'text';

export type EditableFieldProps = {
  onSave: (saveKey: keyof PersonData, value: string) => void;
  labelName: string;
  fieldType: FieldType;
  value: string;
  saveKey: keyof PersonData;
  placeholder: string;
};

export const EditableField = ({
  onSave,
  labelName,
  fieldType,
  saveKey,
  value,
  placeholder,
}: EditableFieldProps) => {
  const [isEditing, setEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);

  return isEditing ? (
    <div className="editable-field">
      <label htmlFor={labelName.toLowerCase()}>{labelName}: </label>
      {fieldType === 'textarea' ? (
        <div>
          <textarea
            name={labelName.toLowerCase()}
            className="editable-field-textarea"
            value={fieldValue}
            placeholder={placeholder}
            onChange={(e) => {
              setFieldValue(e.target.value);
            }}
          ></textarea>
        </div>
      ) : (
        <input
          name={labelName.toLowerCase()}
          className="editable-field-input"
          type={fieldType}
          value={fieldValue}
          placeholder={placeholder}
          onChange={(e) => {
            setFieldValue(e.target.value);
          }}
        />
      )}
      <button
        className="editable-field-button"
        onClick={() => {
          onSave(saveKey, fieldValue);
          setEditing(false);
        }}
      >
        Save
      </button>
    </div>
  ) : (
    <div
      className="editable-label"
      onClick={() => {
        setEditing(true);
      }}
    >
      <strong>{labelName}: </strong>
      {value}
    </div>
  );
};
