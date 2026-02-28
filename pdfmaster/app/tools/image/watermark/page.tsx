"use client";

import { useState, useCallback } from "react";
import ToolLayout, {
  UploadZone,
  StepHeader,
  ActionButton,
  Card,
  formatFileSize,
} from "@/components/ToolLayout";

export default function WatermarkImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [text, setText] = useState("");
  const [position, setPosition] = useState("center");
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

  const handleWatermark = async () => {
    if (!file || !text) return;

    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("text", text);
    formData.append("position", position);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/image/watermark`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add watermark");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `watermarked_${file.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error adding watermark:", error);
      alert("Failed to add watermark");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Add Watermark"
      description="Add text watermark to your images."
      icon="fa-tint"
      iconBg="bg-[#06B6D4]/10"
      iconColor="text-[#06B6D4]"
      category="Image"
      currentTool="Add Watermark"
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
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-image text-cyan-500"></i>
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
          <StepHeader step={2} title="Watermark Settings" />
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1E1B4B] mb-2">Watermark Text</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6366F1]"
                placeholder="Enter watermark text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1E1B4B] mb-2">Position</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "center", label: "Center" },
                  { value: "top-right", label: "Top Right" },
                  { value: "bottom-right", label: "Bottom Right" },
                ].map((pos) => (
                  <button
                    key={pos.value}
                    onClick={() => setPosition(pos.value)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      position === pos.value
                        ? "border-[#6366F1] bg-[#6366F1]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="text-sm font-medium text-[#1E1B4B]">{pos.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {file && text && (
        <Card>
          <StepHeader step={3} title="Add Watermark" />
          <ActionButton
            onClick={handleWatermark}
            loading={isProcessing}
            loadingText="Adding watermark..."
            text="Add Watermark"
          />
        </Card>
      )}
    </ToolLayout>
  );
}
