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
}

export default function MergePDFPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [outputFilename, setOutputFilename] = useState("merged.pdf");
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
      (file) => file.type === "application/pdf"
    );

    const newFiles: FileItem[] = droppedFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      name: file.name,
      size: file.size,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleFileSelect = (fileList: FileList | null) => {
    if (!fileList) return;
    
    const selectedFiles = Array.from(fileList).filter(
      (file) => file.type === "application/pdf"
    );

    const newFiles: FileItem[] = selectedFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      name: file.name,
      size: file.size,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
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

  const handleMerge = async () => {
    if (files.length < 2) {
      alert("Please upload at least 2 PDF files");
      return;
    }

    setIsProcessing(true);

    const formData = new FormData();
    files.forEach((fileItem) => {
      formData.append("files", fileItem.file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/pdf/merge`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to merge PDFs");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = outputFilename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error merging PDFs:", error);
      alert(error instanceof Error ? error.message : "Failed to merge PDFs");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Merge PDF"
      description="Combine multiple PDF files into one document. Reorder pages as needed."
      icon="fa-object-group"
      iconBg="bg-[#6366F1]/10"
      iconColor="text-[#6366F1]"
      category="PDF"
      currentTool="Merge PDF"
    >
      {/* Step 1: Upload */}
      <Card className="mb-6">
        <StepHeader step={1} title="Upload PDF Files" />
        <UploadZone
          onFileSelect={handleFileSelect}
          accept=".pdf"
          multiple={true}
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          title="Drop PDF files here"
          subtitle="or click to select files"
        />

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-gray-600 font-medium">
              {files.length} file{files.length !== 1 ? "s" : ""} ready to merge
            </p>
            {files.map((fileItem, index) => (
              <div
                key={fileItem.id}
                className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-100"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-file-pdf text-red-500"></i>
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

      {/* Step 2: Options */}
      {files.length > 0 && (
        <Card className="mb-6">
          <StepHeader step={2} title="Output Options" />
          <div>
            <label className="block text-sm font-medium text-[#1E1B4B] mb-2">
              Output Filename
            </label>
            <input
              type="text"
              value={outputFilename}
              onChange={(e) => setOutputFilename(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-all"
              placeholder="merged.pdf"
            />
          </div>
        </Card>
      )}

      {/* Step 3: Merge */}
      {files.length > 0 && (
        <Card>
          <StepHeader step={3} title="Merge & Download" />
          <ActionButton
            onClick={handleMerge}
            disabled={files.length < 2}
            loading={isProcessing}
            loadingText="Merging PDFs..."
            text={`Merge PDF Files (${files.length})`}
          />
          {files.length < 2 && (
            <p className="text-sm text-gray-500 text-center mt-3">
              Please upload at least 2 PDF files to merge
            </p>
          )}
        </Card>
      )}
    </ToolLayout>
  );
}
