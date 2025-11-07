
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Try to find the auth secrets file in multiple locations
function getAuthSecretsPath(): string {
  // Build the default path dynamically
  const homeDir = os.homedir();
  const defaultPath = path.join(homeDir, '.config', 'abacusai_auth_secrets.json');
  
  const possiblePaths = [
    process.env.AUTH_SECRETS_PATH || '',
    defaultPath,
    path.join(process.cwd(), '.config', 'abacusai_auth_secrets.json'),
  ];

  for (const p of possiblePaths) {
    if (p && fs.existsSync(p)) {
      return p;
    }
  }

  throw new Error('Auth secrets file not found');
}

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
}

export async function getGoogleDriveClient() {
  try {
    // Check if auth secrets file exists
    let authSecretsPath: string;
    try {
      authSecretsPath = getAuthSecretsPath();
    } catch (error) {
      throw new Error('GOOGLE_DRIVE_NOT_CONFIGURED');
    }

    // Read the auth secrets
    const authSecretsData = fs.readFileSync(authSecretsPath, 'utf-8');
    const authSecrets = JSON.parse(authSecretsData);
    
    const googleDriveSecrets = authSecrets['googledriveuser']?.secrets;
    if (!googleDriveSecrets?.access_token?.value) {
      throw new Error('GOOGLE_DRIVE_NOT_CONFIGURED');
    }

    const accessToken = googleDriveSecrets.access_token.value;

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    
    return drive;
  } catch (error: any) {
    if (error.message === 'GOOGLE_DRIVE_NOT_CONFIGURED') {
      throw error;
    }
    console.error('Error creating Google Drive client:', error);
    throw new Error('GOOGLE_DRIVE_NOT_CONFIGURED');
  }
}

export async function listGoogleDriveFiles(
  folderId?: string,
  pageSize: number = 50,
  pageToken?: string
): Promise<{ files: GoogleDriveFile[]; nextPageToken?: string }> {
  try {
    const drive = await getGoogleDriveClient();

    let query = "trashed=false";
    
    if (folderId) {
      query += ` and '${folderId}' in parents`;
    } else {
      // Show files in root or "My Drive"
      query += " and 'root' in parents";
    }

    const response = await drive.files.list({
      q: query,
      pageSize: pageSize,
      pageToken: pageToken,
      fields: 'nextPageToken, files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, iconLink, thumbnailLink)',
      orderBy: 'folder,name',
    });

    return {
      files: (response.data.files as GoogleDriveFile[]) || [],
      nextPageToken: response.data.nextPageToken || undefined,
    };
  } catch (error: any) {
    if (error.message === 'GOOGLE_DRIVE_NOT_CONFIGURED') {
      throw error;
    }
    console.error('Error listing Google Drive files:', error);
    throw new Error('Failed to list Google Drive files');
  }
}

export async function downloadGoogleDriveFile(fileId: string): Promise<{
  data: Buffer;
  filename: string;
  mimeType: string;
}> {
  try {
    const drive = await getGoogleDriveClient();

    // Get file metadata first
    const fileMetadata = await drive.files.get({
      fileId: fileId,
      fields: 'name, mimeType',
    });

    const filename = fileMetadata.data.name || 'unknown';
    const mimeType = fileMetadata.data.mimeType || 'application/octet-stream';

    // Download file content
    const response = await drive.files.get(
      {
        fileId: fileId,
        alt: 'media',
      },
      { responseType: 'arraybuffer' }
    );

    const buffer = Buffer.from(response.data as ArrayBuffer);

    return {
      data: buffer,
      filename,
      mimeType,
    };
  } catch (error: any) {
    if (error.message === 'GOOGLE_DRIVE_NOT_CONFIGURED') {
      throw error;
    }
    console.error('Error downloading Google Drive file:', error);
    throw new Error('Failed to download file from Google Drive');
  }
}

export async function searchGoogleDriveFiles(
  searchQuery: string,
  pageSize: number = 50
): Promise<GoogleDriveFile[]> {
  try {
    const drive = await getGoogleDriveClient();

    const query = `trashed=false and name contains '${searchQuery}'`;

    const response = await drive.files.list({
      q: query,
      pageSize: pageSize,
      fields: 'files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, iconLink, thumbnailLink)',
      orderBy: 'name',
    });

    return (response.data.files as GoogleDriveFile[]) || [];
  } catch (error: any) {
    if (error.message === 'GOOGLE_DRIVE_NOT_CONFIGURED') {
      throw error;
    }
    console.error('Error searching Google Drive files:', error);
    throw new Error('Failed to search Google Drive files');
  }
}
