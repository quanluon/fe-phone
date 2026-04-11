"use client";

import React, { useState } from "react";
import { Upload, message, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps, RcFile } from "antd/es/upload/interface";
import { adminFilesApi } from "@/lib/api/admin";
import axios from "axios";
import NextImage from "next/image";

interface ImageUploadProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  maxCount?: number;
  folder?: string;
}

const SUPPORTED_UPLOAD_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]);

const SUPPORTED_UPLOAD_EXTENSIONS = [
  ".jpeg",
  ".jpg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
];

function hasSupportedUploadExtension(fileName: string) {
  const lowerFileName = fileName.toLowerCase();
  return SUPPORTED_UPLOAD_EXTENSIONS.some((extension) =>
    lowerFileName.endsWith(extension),
  );
}

function shouldNormalizeBeforeUpload(file: RcFile) {
  return (
    file.type.startsWith("image/") &&
    (!SUPPORTED_UPLOAD_MIME_TYPES.has(file.type.toLowerCase()) ||
      !hasSupportedUploadExtension(file.name))
  );
}

async function normalizeImageForUpload(file: RcFile): Promise<File> {
  if (!shouldNormalizeBeforeUpload(file)) {
    return file;
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/files/normalize-image", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorMessage =
      (await response.text()) || "Không thể chuyển đổi ảnh trước khi tải lên.";
    throw new Error(errorMessage);
  }

  const normalizedBlob = await response.blob();
  const normalizedFileName =
    response.headers.get("x-file-name") || file.name.replace(/\.[^.]+$/, ".jpg");
  const normalizedFileType =
    response.headers.get("content-type") ||
    normalizedBlob.type ||
    "image/jpeg";

  return new File([normalizedBlob], normalizedFileName, {
    type: normalizedFileType,
    lastModified: Date.now(),
  });
}

export default function ImageUpload({
  value = [],
  onChange,
  maxCount = 8,
  folder = "products",
}: ImageUploadProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  // Convert string array to UploadFile array
  const fileList: UploadFile[] = value.map((url, index) => ({
    uid: url || `-${index}`,
    name: url.split("/").pop() || `image-${index}.jpg`,
    status: "done",
    url: url,
    thumbUrl: url,
  }));

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1),
    );
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    // We only update parent when files are actually "done" or "removed"
    const urls = newFileList
      .filter((file) => file.status === "done" && file.url)
      .map((file) => file.url as string);

    if (onChange) {
      onChange(urls);
    }
  };

  const customRequest: UploadProps["customRequest"] = async (options) => {
    const { file, onSuccess, onError, onProgress } = options;
    const rcFile = file as RcFile;

    try {
      const uploadFile = await normalizeImageForUpload(rcFile);

      // 1. Get presigned URL
      const { data } = await adminFilesApi.getPresignedUrl(
        uploadFile.name,
        uploadFile.type,
        folder,
      );
      const { uploadUrl, publicUrl } = data;

      // 2. Upload directly to S3
      await axios.put(uploadUrl, uploadFile, {
        headers: {
          "Content-Type": uploadFile.type,
        },
        onUploadProgress: (event) => {
          if (event.total && onProgress) {
            onProgress({
              percent: Math.round((event.loaded / event.total) * 100),
            });
          }
        },
      });

      // 3. Mark as success and set URL
      if (onSuccess) onSuccess({ url: publicUrl });

      // Update form state
      const currentUrls = [...value, publicUrl];
      if (onChange) onChange(currentUrls);

      message.success(`${rcFile.name} tải lên thành công`);
    } catch (err: unknown) {
      console.error("Upload error:", err);
      const error = err as Error;
      if (onError) onError(error);
      message.error(`${rcFile.name} tải lên thất bại.`);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
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
        <div className="relative w-full aspect-square">
          <NextImage
            alt="preview"
            fill
            className="object-contain"
            src={previewImage}
          />
        </div>
      </Modal>
    </>
  );
}
