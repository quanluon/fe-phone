"use client";

import React, { useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { adminFilesApi } from "@/lib/api/admin";
import axios from "axios";
import { message } from "antd";

// Dynamic import for ReactQuill to avoid SSR issues
import type ReactQuillType from "react-quill-new";

type ReactQuillProps = React.ComponentProps<typeof ReactQuillType>;

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    // eslint-disable-next-line react/display-name
    return ({
      forwardedRef,
      ...props
    }: {
      forwardedRef: React.RefObject<ReactQuillType | null>;
    } & ReactQuillProps) => (
      <RQ ref={forwardedRef} {...props} />
    );
  },
  {
    ssr: false,
    loading: () => (
      <div className="h-56 bg-gray-50 animate-pulse border rounded-md" />
    ),
  },
);

interface RichTextProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: number | string;
}

export default function RichText({
  value,
  onChange,
  placeholder,
  height = 420,
}: RichTextProps) {
  const quillRef = useRef<ReactQuillType>(null);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const hide = message.loading("Đang tải ảnh lên...", 0);
      try {
        // 1. Get presigned URL
        const { data } = await adminFilesApi.getPresignedUrl(
          file.name,
          file.type,
          "content",
        );
        const { uploadUrl, publicUrl } = data;

        // 2. Upload to S3
        await axios.put(uploadUrl, file);

        // 3. Insert into Editor
        const quill = quillRef.current?.getEditor();
        const range = quill?.getSelection();
        if (quill && range) {
          quill.insertEmbed(range.index, "image", publicUrl);
          quill.setSelection(range.index + 1);
        }

        message.success("Tải ảnh thành công");
      } catch (error: unknown) {
        console.error("Upload failed:", error);
        const err = error as Error;
        message.error(
          err.message || "Không thể tải ảnh lên. Vui lòng thử lại.",
        );
      } finally {
        hide();
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image", "clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [],
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "link",
    "image",
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        forwardedRef={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        style={{ height, marginBottom: "40px" }}
        placeholder={placeholder}
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          background-color: #f9fafb;
        }
        .rich-text-editor .ql-editor {
          min-height: ${typeof height === "number" ? `${Math.max(height - 42, 240)}px` : "360px"};
          font-size: 15px;
          line-height: 1.6;
        }
        .rich-text-editor .ql-editor img {
          max-width: 100%;
          border-radius: 8px;
          margin: 10px 0;
        }
      `}</style>
    </div>
  );
}
