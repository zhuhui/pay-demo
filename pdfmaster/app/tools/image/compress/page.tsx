"use client";

import { useState } from "react";
import ToolLayout, {
  UploadZone,
  StepHeader,
  ActionButton,
  Card,
  ResultCard,
  formatFileSize,
} from "@/components/ToolLayout";

export default function ImageCompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(85);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    originalSize: number;
    compressedSize: number;
  } | null>(null);

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
      setResult(null);
    }
  };

  const handleFileSelect = (fileList: FileList | null) => {
    if (fileList && fileList[0]) {
      setFile(fileList[0]);
      setResult(null);
    }
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("quality", quality.toString());

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/image/compress`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Compression failed");
      }

      const originalSize = parseInt(response.headers.get("X-Original-Size") || "0");
      const compressedSize = parseInt(response.headers.get("X-Compressed-Size") || "0");

      setResult({
        originalSize,
        compressedSize,
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `compressed_${file.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to compress image");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Compress Image"
      description="Reduce image file size while maintaining quality. Supports JPG, PNG, and WebP."
      icon="fa-image"
      iconBg="bg-purple-100"
      iconColor="text-purple-600"
      category="Image"
      currentTool="Compress Image"
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
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-image text-purple-500"></i>
              </div>
              <div>
                <p className="font-medium text-[#1E1B4B]">{file.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setResult(null);
              }}
              className="p-2 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
      </Card>

      {/* Step 2: Options */}
      {file && (
        <Card className="mb-6">
          <StepHeader step={2} title="Quality Settings" />
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-[#1E1B4B]">
                Image Quality
              </label>
              <span className="text-sm text-[#6366F1] font-medium">{quality}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#6366F1]"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Smaller File</span>
              <span>High Quality</span>
            </div>
          </div>
        </Card>
      )}

      {/* Step 3: Compress */}
      {file && (
        <Card className="mb-6">
          <StepHeader step={3} title="Compress & Download" />
          <ActionButton
            onClick={handleCompress}
            loading={isProcessing}
            loadingText="Compressing..."
            text="Compress Image"
          />
        </Card>
      )}

      {/* Result */}
      {result && (
        <ResultCard
          originalSize={result.originalSize}
          processedSize={result.compressedSize}
          originalLabel="Original"
          processedLabel="Compressed"
        />
      )}
    </ToolLayout>
  );
}
