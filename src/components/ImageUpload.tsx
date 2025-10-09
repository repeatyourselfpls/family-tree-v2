import { useEffect, useRef, useState } from 'react';
import {
  MdDeleteOutline,
  MdOutlineEdit,
  MdOutlineSave,
  MdUploadFile,
} from 'react-icons/md';
import {
  compressImage,
  estimateBase64Size,
  validateImageFile,
} from '../utils/imageCompression';

type ImageUploadProps = {
  currentImage?: string;
  onImageChange: (image: string) => void;
  onImageDelete: () => void;
  onShowToast: (message: string, type: 'success' | 'error') => void;
};

export function ImageUpload({
  currentImage,
  onImageChange,
  onImageDelete,
  onShowToast,
}: ImageUploadProps) {
  const [isEditing, setEditing] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditing(false);
    setUrlInput('');
  }, [currentImage]);

  const displayValue = currentImage
    ? currentImage.startsWith('data:image/')
      ? 'Uploaded image'
      : currentImage
    : '';

  async function handleSave() {
    if (!urlInput.trim()) {
      setEditing(false);
      return;
    }

    // Validate URL format
    if (
      !urlInput.startsWith('http://') &&
      !urlInput.startsWith('https://') &&
      !urlInput.startsWith('data:image/')
    ) {
      onShowToast('URL must start with http:// or https://', 'error');
      return;
    }

    onImageChange(urlInput.trim());
    setEditing(false);
    onShowToast('Image URL set successfully', 'success');
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    try {
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        onShowToast(validation.error!, 'error');
        return;
      }

      // Compress to JPEG
      const compressed = await compressImage(file, 300, 300, 0.7);

      // Show compressed size
      const sizeKB = Math.round(estimateBase64Size(compressed) / 1024);
      onShowToast(`Image compressed to ${sizeKB}KB`, 'success');

      // Update parent
      onImageChange(compressed);
      setEditing(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      onShowToast(errorMessage, 'error');
    } finally {
      setIsProcessing(false);
      // Reset file input
      event.target.value = '';
    }
  }

  function handleDelete() {
    onImageDelete();
    setUrlInput('');
    setEditing(false);
    onShowToast('Image deleted', 'success');
  }

  if (!currentImage && !isEditing) {
    return (
      <div className="image-field-empty">
        <span>Add profile picture</span>
        <button
          className="image-edit-button"
          onClick={() => {
            setUrlInput('');
            setEditing(true);
          }}
        >
          <MdOutlineEdit />
        </button>
      </div>
    );
  }

  return (
    <div className="image-field">
      {isEditing ? (
        <>
          {/* Edit mode */}
          <input
            autoFocus
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Enter image URL or upload"
            disabled={isProcessing}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') setEditing(false);
            }}
          />
          <button
            className="image-upload-file-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            title="Upload image file"
          >
            <MdUploadFile />
          </button>
          <button
            className="image-save-button"
            onClick={handleSave}
            disabled={isProcessing}
          >
            <MdOutlineSave />
          </button>
          <button
            className="image-delete-button"
            onClick={handleDelete}
            disabled={isProcessing}
          >
            <MdDeleteOutline />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            disabled={isProcessing}
          />
        </>
      ) : (
        <>
          {/* View mode */}
          <span title={displayValue}>Image uploaded</span>
          <button
            className="image-edit-button"
            onClick={() => {
              setUrlInput(currentImage || '');
              setEditing(true);
            }}
          >
            <MdOutlineEdit />
          </button>
          <button className="image-delete-button" onClick={handleDelete}>
            <MdDeleteOutline />
          </button>
        </>
      )}
    </div>
  );
}
