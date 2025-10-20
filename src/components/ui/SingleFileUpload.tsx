"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { CloudArrowUpIcon, TrashIcon } from "@heroicons/react/24/outline";
import { fileApi } from "@/lib/api/files";
import { logger } from "@/lib/utils/logger";
import { NextImage } from "./NextImage";

interface SingleFileUploadProps {
  onFileUploaded: (fileKey: string) => void;
  onFileRemoved: () => void;
  uploadedFile?: string;
  accept?: string;
  folder?: string;
  disabled?: boolean;
  className?: string;
  maxFileSize?: number; // in MB
  showPreview?: boolean;
  compact?: boolean;
  placeholder?: string;
}

interface UploadedFile {
  file: File;
  key: string;
  publicUrl: string;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
}

export function SingleFileUpload({
  onFileUploaded,
  onFileRemoved,
  uploadedFile,
  accept = "image/*",
  folder = "uploads",
  disabled = false,
  className = "",
  maxFileSize = 10,
  showPreview = true,
  compact = false,
  placeholder,
}: SingleFileUploadProps) {
  const tFile = useTranslations("fileUpload");
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selectedFile: File | null) => {
    if (!selectedFile) return;

    // Validate file size
    if (selectedFile.size > maxFileSize * 1024 * 1024) {
      alert(
        `${selectedFile.name} - ${tFile("maxFileSize", { size: maxFileSize })}`
      );
      return;
    }

    const newFile: UploadedFile = {
      file: selectedFile,
      key: "",
      publicUrl: "",
      uploading: false,
      uploaded: false,
    };

    setFile(newFile);
    await uploadFile(newFile);
  };

  const uploadFile = async (fileData: UploadedFile) => {
    try {
      // Update file status to uploading
      setFile((prev) => (prev ? { ...prev, uploading: true } : null));

      // Get presigned URL
      const uploadData = await fileApi.getPresignedUrl(
        fileData.file.name,
        fileData.file.type,
        folder
      );

      // Upload to S3
      const uploadResponse = await fetch(uploadData.url, {
        method: "PUT",
        body: fileData.file,
        headers: {
          "Content-Type": fileData.file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      // Update file status to uploaded
      setFile((prev) =>
        prev
          ? {
              ...prev,
              key: uploadData.key,
              publicUrl: uploadData.publicUrl,
              uploading: false,
              uploaded: true,
            }
          : null
      );

      // Notify parent component
      onFileUploaded(uploadData.publicUrl);
    } catch (error) {
      logger.error({ error }, "Upload error");
      setFile((prev) =>
        prev
          ? {
              ...prev,
              uploading: false,
              error: tFile("uploadFailed"),
            }
          : null
      );
    }
  };

  const removeFile = async () => {
    if (file?.uploaded && file.key) {
      try {
        await fileApi.deleteFile(file.key);
        onFileRemoved();
      } catch (error) {
        logger.error({ error, fileKey: file.key }, "Delete error");
      } finally {
        setFile(null);
      }
    }
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

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFile(droppedFiles[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFile(selectedFiles[0]);
    }
  };

  const openFileDialog = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const currentFile =
    file ||
    (uploadedFile
      ? {
          file: new File([], "uploaded file"),
          key: uploadedFile,
          publicUrl: uploadedFile,
          uploading: false,
          uploaded: true,
        }
      : null);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
          dragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${
          compact ? "p-4" : "p-6"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        <CloudArrowUpIcon
          className={`mx-auto text-gray-400 ${
            compact ? "h-8 w-8" : "h-12 w-12"
          }`}
        />
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              {placeholder || tFile("clickToUpload")}
            </span>{" "}
            {tFile("or")} {tFile("dragAndDrop")}
          </p>
          <p className="text-xs text-gray-500">
            {tFile("fileTypes")} (1 {tFile("file")})
          </p>
        </div>
      </div>

      {/* File Preview */}
      {currentFile && showPreview && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            {tFile("uploadedFile")}
          </h4>
          <div
            className={`flex items-center justify-between bg-gray-50 rounded-lg ${
              compact ? "p-2" : "p-3"
            }`}
          >
            <div className="flex items-center space-x-3">
              {currentFile.file.type.startsWith("image/") && showPreview && (
                <NextImage
                  src={
                    currentFile.uploaded
                      ? currentFile.publicUrl
                      : URL.createObjectURL(currentFile.file)
                  }
                  alt={currentFile.file.name}
                  className={`object-cover rounded ${
                    compact ? "w-8 h-8" : "w-10 h-10"
                  }`}
                />
              )}
              <div>
                <p
                  className={`font-medium text-gray-900 ${
                    compact ? "text-xs" : "text-sm"
                  }`}
                >
                  {currentFile.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(currentFile.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {currentFile.uploading && (
                <div className="flex items-center space-x-1">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-xs text-gray-500">
                    {tFile("uploading")}
                  </span>
                </div>
              )}

              {currentFile.error && (
                <span className="text-xs text-red-600">
                  {currentFile.error}
                </span>
              )}

              {currentFile.uploaded && (
                <span className="text-xs text-green-600">
                  ✓ {tFile("uploaded")}
                </span>
              )}

              <button
                type="button"
                onClick={removeFile}
                className="text-red-600 hover:text-red-800"
                disabled={currentFile.uploading}
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
