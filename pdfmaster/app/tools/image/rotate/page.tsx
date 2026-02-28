"use client";

import { useState, useCallback } from "react";
import ToolLayout, {
  UploadZone,
  StepHeader,
  ActionButton,
  Card,
  formatFileSize,
} from "@/components/ToolLayout";

export default function RotateImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [angle, setAngle] = useState(90);
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

  const handleRotate = async () => {
    if (!file) return;

    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("angle", angle.toString());

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/image/rotate`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to rotate image");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rotated_${file.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error rotating image:", error);
      alert("Failed to rotate image");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Rotate Image"
      description="Rotate image by 90, 180, or 270 degrees."
      icon="fa-redo"
      iconBg="bg-[#EC4899]/10"
      iconColor="text-[#EC4899]"
      category="Image"
      currentTool="Rotate Image"
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
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-image text-pink-500"></i>
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
          <StepHeader step={2} title="Select Angle" />
          
          <div className="grid grid-cols-3 gap-4">
            {[90, 180, 270].map((a) => (
              <button
                key={a}
                onClick={() => setAngle(a)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  angle === a
                    ? "border-[#6366F1] bg-[#6366F1]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <i className={`fas fa-redo text-2xl mb-2 text-[#6366F1]`}></i>
                <p className="font-medium text-[#1E1B4B]">{a}°</p>
              </button>
            ))}
          </div>
        </Card>
      )}

      {file && (
        <Card>
          <StepHeader step={3} title="Rotate & Download" />
          <ActionButton
            onClick={handleRotate}
            loading={isProcessing}
            loadingText="Rotating..."
            text={`Rotate ${angle}°`}
          />
        </Card>
      )}
    </ToolLayout>
  );
}
