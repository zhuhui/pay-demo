"use client";

import { useState, useCallback } from "react";
import ToolLayout, {
  UploadZone,
  StepHeader,
  ActionButton,
  Card,
  formatFileSize,
} from "@/components/ToolLayout";

interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  preview?: string;
}

export default function JPGToPDFPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith("image/")
    );

    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = (fileList: FileList | null) => {
    if (!fileList) return;
    
    const selectedFiles = Array.from(fileList).filter(
      (file) => file.type.startsWith("image/")
    );

    addFiles(selectedFiles);
  };

  const addFiles = (newFiles: File[]) => {
    const fileItems: FileItem[] = newFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      name: file.name,
      size: file.size,
    }));

    setFiles((prev) => [...prev, ...fileItems]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index > 0) {
      setFiles((prev) => {
        const newFiles = [...prev];
        [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
        return newFiles;
      });
    } else if (direction === "down" && index < files.length - 1) {
      setFiles((prev) => {
        const newFiles = [...prev];
        [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
        return newFiles;
      });
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);

    const formData = new FormData();
    files.forEach((fileItem) => {
      formData.append("files", fileItem.file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/pdf/from-jpg`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to convert images to PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error converting JPG to PDF:", error);
      alert(error instanceof Error ? error.message : "Failed to convert images to PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="JPG to PDF"
      description="Combine images (JPG, PNG) into a single PDF document."
      icon="fa-file-pdf"
      iconBg="bg-[#10B981]/10"
      iconColor="text-[#10B981]"
      category="PDF"
      currentTool="JPG to PDF"
    >
      {/* Step 1: Upload */}
      <Card className="mb-6">
        <StepHeader step={1} title="Upload Images" />
        <UploadZone
          onFileSelect={handleFileSelect}
          accept="image/*"
          multiple={true}
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          title="Drop images here"
          subtitle="or click to select files (JPG, PNG, WebP)"
        />

        {files.length > 0 && (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-gray-600 font-medium">
              {files.length} image{files.length !== 1 ? "s" : ""} ready to convert
            </p>
            {files.map((fileItem, index) => (
              <div
                key={fileItem.id}
                className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-100"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-image text-blue-500"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1E1B4B] truncate">{fileItem.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(fileItem.size)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => moveFile(index, "up")}
                    disabled={index === 0}
                    className="p-2 hover:bg-gray-200 rounded-lg disabled:opacity-30 transition-colors"
                    title="Move up"
                  >
                    <i className="fas fa-arrow-up text-gray-600"></i>
                  </button>
                  <button
                    onClick={() => moveFile(index, "down")}
                    disabled={index === files.length - 1}
                    className="p-2 hover:bg-gray-200 rounded-lg disabled:opacity-30 transition-colors"
                    title="Move down"
                  >
                    <i className="fas fa-arrow-down text-gray-600"></i>
                  </button>
                  <button
                    onClick={() => removeFile(fileItem.id)}
                    className="p-2 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                    title="Remove"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Step 2: Convert */}
      {files.length > 0 && (
        <Card>
          <StepHeader step={2} title="Convert & Download" />
          <ActionButton
            onClick={handleConvert}
            loading={isProcessing}
            loadingText="Converting images to PDF..."
            text={`Convert to PDF (${files.length} images)`}
          />
        </Card>
      )}
    </ToolLayout>
  );
}
