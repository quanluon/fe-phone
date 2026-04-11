'use client';

import React, { useState } from 'react';
import { Upload, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps, RcFile } from 'antd/es/upload/interface';
import { adminFilesApi } from '@/lib/api/admin';
import axios from 'axios';

interface ImageUploadProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  maxCount?: number;
  folder?: string;
}

export default function ImageUpload({ 
  value = [], 
  onChange, 
  maxCount = 8,
  folder = 'products'
}: ImageUploadProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  
  // Convert string array to UploadFile array
  const fileList: UploadFile[] = value.map((url, index) => ({
    uid: `-${index}`,
    name: url.split('/').pop() || `image-${index}.jpg`,
    status: 'done',
    url: url,
    thumbUrl: url,
  }));

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // We only update parent when files are actually "done" or "removed"
    const urls = newFileList
      .filter(file => file.status === 'done' && file.url)
      .map(file => file.url as string);
    
    // Also include currently uploading files to avoid flickering
    // but the actual value should only be the ones with URLs
    if (onChange) {
      onChange(urls);
    }
  };

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError, onProgress } = options;
    const rcFile = file as RcFile;

    try {
      // 1. Get presigned URL
      const { data } = await adminFilesApi.getPresignedUrl(rcFile.name, rcFile.type, folder);
      const { uploadUrl, publicUrl } = data;

      // 2. Upload directly to S3
      await axios.put(uploadUrl, rcFile, {
        onUploadProgress: (event) => {
          if (event.total) {
            onProgress({ percent: Math.round((event.loaded / event.total) * 100) });
          }
        },
      });

      // 3. Mark as success and set URL
      onSuccess({ url: publicUrl }, file);
      
      // Update form state
      const currentUrls = [...value, publicUrl];
      if (onChange) onChange(currentUrls);
      
      message.success(`${rcFile.name} uploaded successfully`);
    } catch (err: any) {
      console.error('Upload error:', err);
      onError(err);
      message.error(`${rcFile.name} upload failed.`);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </button>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        customRequest={customRequest}
        accept="image/*"
        multiple={maxCount > 1}
      >
        {fileList.length >= maxCount ? null : uploadButton}
      </Upload>
      <Modal 
        open={previewOpen} 
        title={previewTitle} 
        footer={null} 
        onCancel={handleCancel}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
}
