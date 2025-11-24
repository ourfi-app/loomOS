/**
 * File Validation Utilities
 * 
 * Provides secure file validation including magic number (file signature) validation
 * to prevent file type spoofing attacks.
 */

/**
 * Image file signatures (magic numbers)
 * These are the first few bytes that identify genuine image files
 */
const IMAGE_SIGNATURES = {
  // JPEG: FF D8 FF
  jpeg: [0xFF, 0xD8, 0xFF],
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  png: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
  // GIF87a: 47 49 46 38 37 61
  gif87a: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
  // GIF89a: 47 49 46 38 39 61
  gif89a: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
  // WebP: 52 49 46 46 ... 57 45 42 50
  webp: [0x52, 0x49, 0x46, 0x46],
  // BMP: 42 4D
  bmp: [0x42, 0x4D],
  // ICO: 00 00 01 00
  ico: [0x00, 0x00, 0x01, 0x00],
  // TIFF (little-endian): 49 49 2A 00
  tiffLe: [0x49, 0x49, 0x2A, 0x00],
  // TIFF (big-endian): 4D 4D 00 2A
  tiffBe: [0x4D, 0x4D, 0x00, 0x2A],
};

/**
 * Check if a buffer starts with a specific byte sequence
 */
function bufferStartsWith(buffer: Buffer, signature: number[]): boolean {
  if (buffer.length < signature.length) {
    return false;
  }
  
  for (let i = 0; i < signature.length; i++) {
    if (buffer[i] !== signature[i]) {
      return false;
    }
  }
  
  return true;
}

/**
 * Validate if a file is a genuine image based on its magic number (file signature)
 * 
 * This provides protection against file type spoofing where an attacker
 * changes the file extension or MIME type but the actual file content
 * is not an image.
 * 
 * @param buffer - The file buffer to validate
 * @returns Object with validation result and detected image type
 */
export function validateImageMagicNumber(buffer: Buffer): {
  isValid: boolean;
  imageType?: string;
  error?: string;
} {
  if (!buffer || buffer.length === 0) {
    return {
      isValid: false,
      error: 'Empty or invalid file buffer'
    };
  }

  // Check JPEG
  if (bufferStartsWith(buffer, IMAGE_SIGNATURES.jpeg)) {
    return {
      isValid: true,
      imageType: 'jpeg'
    };
  }

  // Check PNG
  if (bufferStartsWith(buffer, IMAGE_SIGNATURES.png)) {
    return {
      isValid: true,
      imageType: 'png'
    };
  }

  // Check GIF87a
  if (bufferStartsWith(buffer, IMAGE_SIGNATURES.gif87a)) {
    return {
      isValid: true,
      imageType: 'gif'
    };
  }

  // Check GIF89a
  if (bufferStartsWith(buffer, IMAGE_SIGNATURES.gif89a)) {
    return {
      isValid: true,
      imageType: 'gif'
    };
  }

  // Check WebP (needs additional validation for full signature)
  if (bufferStartsWith(buffer, IMAGE_SIGNATURES.webp)) {
    // WebP has "WEBP" at bytes 8-11
    if (buffer.length >= 12 &&
        buffer[8] === 0x57 && // W
        buffer[9] === 0x45 && // E
        buffer[10] === 0x42 && // B
        buffer[11] === 0x50) { // P
      return {
        isValid: true,
        imageType: 'webp'
      };
    }
  }

  // Check BMP
  if (bufferStartsWith(buffer, IMAGE_SIGNATURES.bmp)) {
    return {
      isValid: true,
      imageType: 'bmp'
    };
  }

  // Check ICO
  if (bufferStartsWith(buffer, IMAGE_SIGNATURES.ico)) {
    return {
      isValid: true,
      imageType: 'ico'
    };
  }

  // Check TIFF (little-endian)
  if (bufferStartsWith(buffer, IMAGE_SIGNATURES.tiffLe)) {
    return {
      isValid: true,
      imageType: 'tiff'
    };
  }

  // Check TIFF (big-endian)
  if (bufferStartsWith(buffer, IMAGE_SIGNATURES.tiffBe)) {
    return {
      isValid: true,
      imageType: 'tiff'
    };
  }

  // No valid image signature found
  return {
    isValid: false,
    error: 'File does not match any known image format signature'
  };
}

/**
 * Validate image file with both MIME type and magic number checks
 * 
 * @param file - The File object to validate
 * @param buffer - The file buffer
 * @returns Validation result
 */
export async function validateImageFile(
  file: File,
  buffer: Buffer
): Promise<{
  isValid: boolean;
  error?: string;
  imageType?: string;
}> {
  // First check MIME type (quick check)
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: 'Invalid MIME type: Only image files are allowed'
    };
  }

  // Then validate magic number (secure check)
  const magicNumberValidation = validateImageMagicNumber(buffer);
  
  if (!magicNumberValidation.isValid) {
    return {
      isValid: false,
      error: magicNumberValidation.error || 'File signature does not match a valid image format'
    };
  }

  return {
    isValid: true,
    imageType: magicNumberValidation.imageType
  };
}

/**
 * Get human-readable file type name
 */
export function getImageTypeName(imageType: string): string {
  const typeNames: Record<string, string> = {
    jpeg: 'JPEG',
    png: 'PNG',
    gif: 'GIF',
    webp: 'WebP',
    bmp: 'BMP',
    ico: 'ICO',
    tiff: 'TIFF'
  };
  
  return typeNames[imageType] || imageType.toUpperCase();
}
