import { useRef } from 'react';
import {
  CiDark,
  CiLight,
  CiSaveDown2,
  CiSaveUp2,
  CiUndo,
} from 'react-icons/ci';
import { useTree } from '../context/TreeContext';
import { TreeNode } from '../TreeModel/TreeNode';

// Used to create a new, empty tree
export const Navbar = () => {
  const {
    setRootNode,
    serializeTree,
    showToast,
    deserializeTree,
    rootNode,
    toggleTheme,
    theme,
  } = useTree();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setRootNode(new TreeNode('Start your legacy...', []));
  };

  const toggleInformation = () => {
    //TODO: Pop a modal that explains how to use this app
  };

  const uploadFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSave = () => {
    try {
      const serialization = serializeTree(rootNode);

      const blob = new Blob([serialization], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'tree.ftree';
      a.click();

      URL.revokeObjectURL(url);

      showToast('File download started', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error saving file', 'error');
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!file.name.endsWith('.ftree'))
        throw new Error('Please select a .ftree file');

      // Read file content asynchrnously and wait for it
      const fileContent = await readFileAsync(file);
      processUploadedFile(fileContent);

      showToast('File uploaded', 'success');
    } catch (err) {
      console.error('File upload error:', err);
      showToast('Error uploading file', 'error');
    }
  };

  const readFileAsync = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          resolve(reader.result as string);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(reader.error);

      reader.readAsText(file);
    });
  };

  const processUploadedFile = (fileInput: string) => {
    if (!fileInput.includes('#') || fileInput.length === 0) {
      throw new Error(
        "Error processing uploaded file. Please ensure it's in proper format.",
      );
    }

    const node = deserializeTree(fileInput);
    if (node !== null) {
      setRootNode(node);
    }
  };

  return (
    <>
      <div id="navbar">
        <button onClick={toggleInformation}>KinSketch</button>
        <div id="navbar-divider"></div>
        <button onClick={reset} title="Reset tree">
          <CiUndo className="navbar-icons" />
        </button>
        <button onClick={handleFileSave} title="Save tree">
          <CiSaveDown2 className="navbar-icons" />
        </button>
        <button onClick={uploadFile} title="Load tree">
          <CiSaveUp2 className="navbar-icons" />
          <input
            type="file"
            ref={fileInputRef}
            accept=".ftree"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </button>
        <div id="navbar-divider"></div>
        <button
          onClick={toggleTheme}
          title={`Toggle ${theme === 'light' ? 'dark mode' : 'light mode'}`}
        >
          {theme === 'light' && <CiLight className="navbar-icons" />}
          {theme === 'dark' && <CiDark className="navbar-icons" />}
        </button>
      </div>
    </>
  );
};
