/**
 * Image Compression Utilities
 * Handles file validation, compression, and Base64 conversion
 */

const ACCEPTED_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
];

const REJECTED_FORMATS: Record<string, string> = {
  'image/heic':
    'HEIC format not supported. Please convert to JPG or PNG first.',
  'image/heif':
    'HEIF format not supported. Please convert to JPG or PNG first.',
  'image/svg+xml': 'SVG not supported. Please use a raster format (JPG, PNG).',
};

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

/**
 * Validates an image file before processing
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'Image must be under 3MB',
    };
  }

  // Check for explicitly rejected formats
  if (file.type in REJECTED_FORMATS) {
    return {
      valid: false,
      error: REJECTED_FORMATS[file.type],
    };
  }

  // Check for accepted formats
  if (!ACCEPTED_FORMATS.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload JPG, PNG, WebP, GIF, or BMP',
    };
  }

  return { valid: true };
}

/**
 * Compresses an image file to JPEG format with specified dimensions and quality
 * @param file - The image file to compress
 * @param maxWidth - Maximum width (default 300px)
 * @param maxHeight - Maximum height (default 300px)
 * @param quality - JPEG quality 0-1 (default 0.7 = 70%)
 * @returns Promise resolving to Base64 data URL
 */
export async function compressImage(
  file: File,
  maxWidth = 300,
  maxHeight = 300,
  quality = 0.7,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        try {
          // Calculate dimensions maintaining aspect ratio
          const scale = Math.min(
            maxWidth / img.width,
            maxHeight / img.height,
            1,
          ); // Don't upscale

          const width = Math.round(img.width * scale);
          const height = Math.round(img.height * scale);

          // Create canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Add white background for PNG transparency
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);

          // Enable image smoothing for better quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw image
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to JPEG data URL
          const dataURL = canvas.toDataURL('image/jpeg', quality);

          resolve(dataURL);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          reject(new Error(`Failed to process image: ${errorMessage}`));
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Checks if a string is a Base64 data URL
 */
export function isBase64Image(str: string): boolean {
  return str.startsWith('data:image/');
}

/**
 * Estimates the size of a Base64 string in bytes
 * Base64 encoding adds ~33% overhead
 */
export function estimateBase64Size(base64: string): number {
  // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
  const base64Data = base64.split(',')[1] || base64;

  // Each Base64 character represents 6 bits
  // Padding characters don't add to size
  const padding = (base64Data.match(/=/g) || []).length;
  const dataLength = base64Data.length - padding;

  return Math.floor((dataLength * 6) / 8);
}
