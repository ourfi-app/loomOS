import { S3StorageService } from './S3StorageService';
import { StorageConfig } from '../config/ServiceConfig';

/**
 * MinIO Storage Service Implementation
 *
 * MinIO is S3-compatible, so we extend the S3StorageService
 * with MinIO-specific configuration validation.
 */
export class MinIOStorageService extends S3StorageService {
  constructor(config: StorageConfig) {
    // MinIO requires explicit endpoint
    if (!config.endpoint) {
      throw new Error('MinIO endpoint is required. Please set STORAGE_ENDPOINT in your environment.');
    }

    // MinIO typically uses 'us-east-1' as default region
    super({
      ...config,
      region: config.region || 'us-east-1'
    });
  }
}
