import { api } from './config';

export interface PresignedUrlResponse {
  url: string;
  key: string;
  publicUrl: string;
}

export interface MultiplePresignedUrlsResponse {
  uploadUrls: Array<{
    fileName: string;
    fileType: string;
    fileSize?: number;
    url: string;
    key: string;
    publicUrl: string;
  }>;
}

export interface MoveToPermanentResponse {
  key: string;
  publicUrl: string;
}

export interface MoveMultipleToPermanentResponse {
  results: Array<{
    key: string;
    publicUrl: string;
  }>;
}

export const fileApi = {
  // Get presigned URL for single file upload
  getPresignedUrl: async (
    fileName: string,
    fileType: string,
    folder: string = 'uploads'
  ): Promise<PresignedUrlResponse> => {
    const response = await api.post<PresignedUrlResponse>('/files/upload-url', {
      fileName,
      fileType,
      folder
    });
    return response.data;
  },

  // Get presigned URLs for multiple files
  getMultiplePresignedUrls: async (
    files: Array<{
      fileName: string;
      fileType: string;
      fileSize?: number;
    }>,
    folder: string = 'uploads'
  ): Promise<MultiplePresignedUrlsResponse> => {
    const response = await api.post<MultiplePresignedUrlsResponse>('/files/upload-urls', {
      files,
      folder
    });
    return response.data;
  },

  // Move file from upload folder to permanent folder
  moveToPermanent: async (
    fileKey: string,
    folder: string = 'products'
  ): Promise<MoveToPermanentResponse> => {
    const response = await api.post<MoveToPermanentResponse>('/files/move-permanent', {
      fileKey,
      folder
    });
    return response.data;
  },

  // Move multiple files from upload folder to permanent folder
  moveMultipleToPermanent: async (
    fileKeys: string[],
    folder: string = 'products'
  ): Promise<MoveMultipleToPermanentResponse> => {
    const response = await api.post<MoveMultipleToPermanentResponse>('/files/move-multiple-permanent', {
      fileKeys,
      folder
    });
    return response.data;
  },

  // Delete file from S3
  deleteFile: async (fileKey: string): Promise<void> => {
    await api.delete('/files/delete', {
      data: { fileKey }
    });
  },

  // Get file info (public URL)
  getFileInfo: async (fileKey: string): Promise<{
    fileKey: string;
    publicUrl: string;
  }> => {
    const response = await api.get<{
      fileKey: string;
      publicUrl: string;
    }>(`/files/info/${fileKey}`);
    return response.data;
  }
};
