"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { CloudArrowUpIcon, XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import { fileApi } from "@/lib/api/files";

interface FileUploadProps {
  onFilesUploaded: (fileKeys: string[]) => void;
  onFilesRemoved: (fileKeys: string[]) => void;
  uploadedFiles?: string[];
  maxFiles?: number;
  accept?: string;
  folder?: string;
  disabled?: boolean;
  className?: string;
}

interface UploadedFile {
  file: File;
  key: string;
  publicUrl: string;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
}

export function FileUpload({
  onFilesUploaded,
  onFilesRemoved,
  uploadedFiles = [],
  maxFiles = 5,
  accept = "image/*",
  folder = "uploads",
  disabled = false,
  className = ""
}: FileUploadProps) {
  const t = useTranslations('common');
  const tFile = useTranslations('fileUpload');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const fileArray = Array.from(selectedFiles);
    const newFiles: UploadedFile[] = [];

    // Validate file count
    if (files.length + fileArray.length > maxFiles) {
      alert(tFile('maxFiles', { count: maxFiles }));
      return;
    }

    // Validate file types and sizes
    for (const file of fileArray) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert(`${file.name} - ${tFile('maxFileSize', { size: 10 })}`);
        continue;
      }

      newFiles.push({
        file,
        key: '',
        publicUrl: '',
        uploading: false,
        uploaded: false
      });
    }

    setFiles(prev => [...prev, ...newFiles]);

    // Upload files
    for (let i = 0; i < newFiles.length; i++) {
      const fileIndex = files.length + i;
      await uploadFile(fileIndex, newFiles[i].file);
    }
  };

  const uploadFile = async (fileIndex: number, file: File) => {
    try {
      // Update file status to uploading
      setFiles(prev => prev.map((f, index) => 
        index === fileIndex ? { ...f, uploading: true } : f
      ));

      // Get presigned URL
      const uploadData = await fileApi.getPresignedUrl(
        file.name,
        file.type,
        folder
      );

      // Upload to S3
      const uploadResponse = await fetch(uploadData.url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      // Update file status to uploaded
      setFiles(prev => prev.map((f, index) => 
        index === fileIndex ? {
          ...f,
          key: uploadData.key,
          publicUrl: uploadData.publicUrl,
          uploading: false,
          uploaded: true
        } : f
      ));

      // Notify parent component
      const uploadedKeys = files
        .filter(f => f.uploaded && f.key)
        .map(f => f.key);
      
      if (uploadedKeys.length > 0) {
        onFilesUploaded(uploadedKeys);
      }

    } catch (error) {
      console.error('Upload error:', error);
        setFiles(prev => prev.map((f, index) => 
        index === fileIndex ? {
          ...f,
          uploading: false,
          error: tFile('uploadFailed')
        } : f
      ));
    }
  };

  const removeFile = async (fileIndex: number) => {
    const file = files[fileIndex];
    
    if (file.uploaded && file.key) {
      try {
        await fileApi.deleteFile(file.key);
        onFilesRemoved([file.key]);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }

    setFiles(prev => prev.filter((_, index) => index !== fileIndex));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const openFileDialog = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
        
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              {tFile('clickToUpload')}
            </span>{" "}
            {tFile('or')} {tFile('dragAndDrop')}
          </p>
          <p className="text-xs text-gray-500">
            {tFile('fileTypes')} ({tFile('maxFiles', { count: maxFiles })})
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">{tFile('uploadedFiles')}</h4>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {file.file.type.startsWith('image/') && (
                  <img
                    src={file.uploaded ? file.publicUrl : URL.createObjectURL(file.file)}
                    alt={file.file.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {file.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {file.uploading && (
                  <div className="flex items-center space-x-1">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-xs text-gray-500">{tFile('uploading')}</span>
                  </div>
                )}
                
                {file.error && (
                  <span className="text-xs text-red-600">{file.error}</span>
                )}
                
                {file.uploaded && (
                  <span className="text-xs text-green-600">✓ {tFile('uploaded')}</span>
                )}
                
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-800"
                  disabled={file.uploading}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Existing Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">{tFile('currentFiles')}</h4>
          {uploadedFiles.map((url, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={url}
                  alt={`File ${index + 1}`}
                  className="w-10 h-10 object-cover rounded"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {tFile('noImage')} {index + 1}
                  </p>
                  <p className="text-xs text-gray-500">{tFile('currentFiles')}</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => onFilesRemoved([url])}
                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors duration-200"
                title={tFile('removeFile')}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
