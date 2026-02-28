"use client";

import { useState, useCallback } from "react";
import ToolLayout, {
  UploadZone,
  StepHeader,
  ActionButton,
  Card,
  formatFileSize,
} from "@/components/ToolLayout";

export default function CropImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
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

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (fileList: FileList | null) => {
    if (!fileList || !fileList[0]) return;
    
    const selectedFile = fileList[0];
    if (selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
    }
  };

  const handleCrop = async () => {
    if (!file) return;

    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("x", x.toString());
    formData.append("y", y.toString());
    if (width) formData.append("width", width);
    if (height) formData.append("height", height);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/image/crop`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to crop image");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cropped_${file.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error cropping image:", error);
      alert("Failed to crop image");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Crop Image"
      description="Crop image to custom dimensions."
      icon="fa-crop"
      iconBg="bg-[#8B5CF6]/10"
      iconColor="text-[#8B5CF6]"
      category="Image"
      currentTool="Crop Image"
    >
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
          <div className="mt-6">
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-100">
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
                onClick={() => setFile(null)}
                className="p-2 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}
      </Card>

      {file && (
        <Card className="mb-6">
          <StepHeader step={2} title="Crop Dimensions" />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1E1B4B] mb-2">X Position</label>
              <input
                type="number"
                value={x}
                onChange={(e) => setX(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6366F1]"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E1B4B] mb-2">Y Position</label>
              <input
                type="number"
                value={y}
                onChange={(e) => setY(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6366F1]"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E1B4B] mb-2">Width (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6366F1]"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E1B4B] mb-2">Height (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6366F1]"
                placeholder="Optional"
              />
            </div>
          </div>
        </Card>
      )}

      {file && (
        <Card>
          <StepHeader step={3} title="Crop & Download" />
          <ActionButton
            onClick={handleCrop}
            loading={isProcessing}
            loadingText="Cropping..."
            text="Crop Image"
          />
        </Card>
      )}
    </ToolLayout>
  );
}
