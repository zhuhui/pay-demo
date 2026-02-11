"use client";

import { useState } from "react";
import ToolLayout, {
  UploadZone,
  StepHeader,
  ActionButton,
  Card,
  formatFileSize,
} from "@/components/ToolLayout";

export default function ImageResizePage() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    originalWidth: number;
    originalHeight: number;
    newWidth: number;
    newHeight: number;
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

  const handleResize = async () => {
    if (!file || (!width && !height)) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", file);
    if (width) formData.append("width", width);
    if (height) formData.append("height", height);
    formData.append("maintain_aspect", maintainAspect.toString());

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/image/resize`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Resize failed");
      }

      const originalWidth = parseInt(response.headers.get("X-Original-Width") || "0");
      const originalHeight = parseInt(response.headers.get("X-Original-Height") || "0");
      const newWidth = parseInt(response.headers.get("X-New-Width") || "0");
      const newHeight = parseInt(response.headers.get("X-New-Height") || "0");

      setResult({
        originalWidth,
        originalHeight,
        newWidth,
        newHeight,
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resized_${file.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to resize image");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Resize Image"
      description="Adjust image dimensions for web, social media, or print."
      icon="fa-expand"
      iconBg="bg-blue-100"
      iconColor="text-blue-600"
      category="Image"
      currentTool="Resize Image"
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
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-image text-blue-500"></i>
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

      {/* Step 2: Resize Options */}
      {file && (
        <Card className="mb-6">
          <StepHeader step={2} title="Resize Options" />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1E1B4B] mb-2">
                  Width (px)
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="Auto"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E1B4B] mb-2">
                  Height (px)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Auto"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-all"
                />
              </div>
            </div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={maintainAspect}
                onChange={(e) => setMaintainAspect(e.target.checked)}
                className="w-5 h-5 text-[#6366F1] rounded focus:ring-[#6366F1]"
              />
              <span className="text-sm text-gray-600">Maintain aspect ratio</span>
            </label>
          </div>
        </Card>
      )}

      {/* Step 3: Resize */}
      {file && (
        <Card className="mb-6">
          <StepHeader step={3} title="Resize & Download" />
          <ActionButton
            onClick={handleResize}
            disabled={!width && !height}
            loading={isProcessing}
            loadingText="Resizing..."
            text="Resize Image"
          />
          {!width && !height && (
            <p className="text-sm text-gray-500 text-center mt-3">
              Please enter width or height
            </p>
          )}
        </Card>
      )}

      {/* Result */}
      {result && (
        <Card>
          <h3 className="text-lg font-semibold text-[#1E1B4B] mb-4">Resize Result</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Original Size</p>
              <p className="font-semibold text-[#1E1B4B]">
                {result.originalWidth} x {result.originalHeight}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">New Size</p>
              <p className="font-semibold text-[#10B981]">
                {result.newWidth} x {result.newHeight}
              </p>
            </div>
          </div>
        </Card>
      )}
    </ToolLayout>
  );
}
