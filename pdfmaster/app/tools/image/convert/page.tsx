"use client";

import { useState } from "react";
import ToolLayout, {
  UploadZone,
  StepHeader,
  ActionButton,
  Card,
  formatFileSize,
} from "@/components/ToolLayout";

const formats = [
  { value: "jpg", label: "JPG", desc: "Best for photos" },
  { value: "png", label: "PNG", desc: "Best for transparency" },
  { value: "webp", label: "WebP", desc: "Best for web" },
  { value: "gif", label: "GIF", desc: "For animations" },
];

export default function ImageConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState("png");
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (fileList: FileList | null) => {
    if (fileList && fileList[0]) {
      setFile(fileList[0]);
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_format", targetFormat);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/image/convert`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Conversion failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `converted.${targetFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to convert image");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Convert Image"
      description="Convert images between different formats. Supports JPG, PNG, WebP, and GIF."
      icon="fa-exchange-alt"
      iconBg="bg-orange-100"
      iconColor="text-orange-600"
      category="Image"
      currentTool="Convert Image"
    >
      {/* Step 1: Upload */}
      <Card className="mb-6">
        <StepHeader step={1} title="Upload Image" />
        <UploadZone
          onFileSelect={handleFileSelect}
          accept="image/*"
          multiple={false}
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          title="Drop image here"
          subtitle="or click to select file"
        />

        {file && (
          <div className="mt-6 flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-image text-orange-500"></i>
              </div>
              <div>
                <p className="font-medium text-[#1E1B4B]">{file.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <button
              onClick={() => setFile(null)}
              className="p-2 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
      </Card>

      {/* Step 2: Select Format */}
      {file && (
        <Card className="mb-6">
          <StepHeader step={2} title="Select Target Format" />
          <div className="grid grid-cols-2 gap-4">
            {formats.map((format) => (
              <button
                key={format.value}
                onClick={() => setTargetFormat(format.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  targetFormat === format.value
                    ? "border-[#6366F1] bg-[#6366F1]/5"
                    : "border-gray-200 hover:border-[#6366F1]/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#1E1B4B]">{format.label}</span>
                  {targetFormat === format.value && (
                    <i className="fas fa-check-circle text-[#6366F1]"></i>
                  )}
                </div>
                <p className="text-xs text-gray-500">{format.desc}</p>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Step 3: Convert */}
      {file && (
        <Card>
          <StepHeader step={3} title="Convert & Download" />
          <ActionButton
            onClick={handleConvert}
            loading={isProcessing}
            loadingText="Converting..."
            text={`Convert to ${targetFormat.toUpperCase()}`}
          />
        </Card>
      )}
    </ToolLayout>
  );
}
