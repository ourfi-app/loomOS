import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  CopyObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageService, UploadOptions, UploadResult } from './StorageService';
import { StorageConfig } from '../config/ServiceConfig';

/**
 * AWS S3 Storage Service Implementation
 *
 * Implements the StorageService interface using AWS S3.
 */
export class S3StorageService implements StorageService {
  private client: S3Client;
  private bucket: string;
  private publicUrlBase?: string;

  constructor(config: StorageConfig) {
    this.bucket = config.bucket;
    this.publicUrlBase = config.publicUrlBase;

    this.client = new S3Client({
      region: config.region || 'us-east-1',
      credentials: config.credentials,
      ...(config.endpoint && { endpoint: config.endpoint })
    });
  }

  async upload(
    key: string,
    data: Buffer | Uint8Array | string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: data,
      ContentType: options.contentType || 'application/octet-stream',
      Metadata: options.metadata,
      ACL: options.acl || 'private'
    });

    await this.client.send(command);

    const url = this.publicUrlBase
      ? `${this.publicUrlBase}/${key}`
      : `https://${this.bucket}.s3.amazonaws.com/${key}`;

    return {
      key,
      url,
      size: Buffer.byteLength(data)
    };
  }

  async download(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key
    });

    const response = await this.client.send(command);
    const chunks: Uint8Array[] = [];

    if (!response.Body) {
      throw new Error(`File not found: ${key}`);
    }

    // Convert the stream to a buffer
    for await (const chunk of response.Body as any) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key
    });

    return await getSignedUrl(this.client, command, { expiresIn });
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key
    });

    await this.client.send(command);
  }

  async exists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key
      });
      await this.client.send(command);
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  async list(prefix: string, maxResults = 1000): Promise<string[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: prefix,
      MaxKeys: maxResults
    });

    const response = await this.client.send(command);
    return response.Contents?.map(obj => obj.Key!) || [];
  }

  async copy(sourceKey: string, destinationKey: string): Promise<void> {
    const command = new CopyObjectCommand({
      Bucket: this.bucket,
      CopySource: `${this.bucket}/${sourceKey}`,
      Key: destinationKey
    });

    await this.client.send(command);
  }
}
