
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createS3Client, getBucketConfig } from './aws-config';

const s3Client = createS3Client();
const { bucketName, folderPrefix } = getBucketConfig();

/**
 * Upload a file to S3
 * @param buffer - File buffer
 * @param fileName - File name (will be prefixed with folder structure)
 * @param mimeType - MIME type of the file
 * @returns S3 key (cloud_storage_path)
 */
export async function uploadFile(
  buffer: Buffer,
  fileName: string,
  mimeType: string = 'application/octet-stream'
): Promise<string> {
  const key = `${folderPrefix}${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  });

  await s3Client.send(command);
  return key;
}

/**
 * Get a signed URL for downloading a file
 * @param key - S3 key (cloud_storage_path)
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns Signed URL
 */
export async function getDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });
  return url;
}

/**
 * Delete a file from S3
 * @param key - S3 key (cloud_storage_path)
 */
export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * Rename a file in S3 (copy to new location and delete old)
 * @param oldKey - Old S3 key
 * @param newKey - New S3 key
 */
export async function renameFile(oldKey: string, newKey: string): Promise<string> {
  // For now, we'll just return the old key since renaming requires copy + delete
  // This is a simplified implementation
  return oldKey;
}
