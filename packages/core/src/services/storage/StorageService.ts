/**
 * Storage Service Interface
 *
 * This interface abstracts file storage operations, allowing the application
 * to work with different storage providers (S3, MinIO, etc.) without changing code.
 */

export interface UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  acl?: 'private' | 'public-read' | 'public-read-write';
}

export interface UploadResult {
  key: string;
  url: string;
  size: number;
}

export interface StorageService {
  /**
   * Upload a file to storage
   */
  upload(
    key: string,
    data: Buffer | Uint8Array | string,
    options?: UploadOptions
  ): Promise<UploadResult>;

  /**
   * Download a file from storage
   */
  download(key: string): Promise<Buffer>;

  /**
   * Get a signed URL for temporary access to a file
   */
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;

  /**
   * Delete a file from storage
   */
  delete(key: string): Promise<void>;

  /**
   * Check if a file exists
   */
  exists(key: string): Promise<boolean>;

  /**
   * List files with a given prefix
   */
  list(prefix: string, maxResults?: number): Promise<string[]>;

  /**
   * Copy a file within storage
   */
  copy(sourceKey: string, destinationKey: string): Promise<void>;
}
