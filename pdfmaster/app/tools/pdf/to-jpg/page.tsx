"use client";

import { useState, useCallback } from "react";
import ToolLayout, {
  UploadZone,
  StepHeader,
  ActionButton,
  Card,
  formatFileSize,
} from "@/components/ToolLayout";

export default function PDFToJPGPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dpi, setDpi] = useState(150);
  const [format, setFormat] = useState<"jpg" | "png">("jpg");
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
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (fileList: FileList | null) => {
    if (!fileList || !fileList[0]) return;
    
    const selectedFile = fileList[0];
    if (selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("dpi", dpi.toString());
    formData.append("format", format);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/pdf/to-jpg`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to convert PDF to images");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pdf_images.zip";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error converting PDF to JPG:", error);
      alert(error instanceof Error ? error.message : "Failed to convert PDF to images");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="PDF to JPG"
      description="Convert PDF pages to high-quality images (JPG or PNG)."
      icon="fa-file-image"
      iconBg="bg-[#F59E0B]/10"
      iconColor="text-[#F59E0B]"
      category="PDF"
      currentTool="PDF to JPG"
    >
      {/* Step 1: Upload */}
      <Card className="mb-6">
        <StepHeader step={1} title="Upload PDF File" />
        <UploadZone
          onFileSelect={handleFileSelect}
          accept=".pdf"
          multiple={false}
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          title="Drop PDF file here"
          subtitle="or click to select file"
        />

        {file && (
          <div className="mt-6">
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-file-pdf text-red-500"></i>
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

      {/* Step 2: Options */}
      {file && (
        <Card className="mb-6">
          <StepHeader step={2} title="Output Options" />
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#1E1B4B] mb-3">
                Output Format
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setFormat("jpg")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    format === "jpg"
                      ? "border-[#6366F1] bg-[#6366F1]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <i className="fas fa-image text-2xl mb-2 text-[#6366F1]"></i>
                  <p className="font-medium text-[#1E1B4B]">JPG</p>
                  <p className="text-sm text-gray-500">Smaller file size</p>
                </button>
                <button
                  onClick={() => setFormat("png")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    format === "png"
                      ? "border-[#6366F1] bg-[#6366F1]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <i className="fas fa-file-image text-2xl mb-2 text-[#6366F1]"></i>
                  <p className="font-medium text-[#1E1B4B]">PNG</p>
                  <p className="text-sm text-gray-500">Better quality</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1E1B4B] mb-3">
                Quality (DPI): {dpi}
              </label>
              <input
                type="range"
                min="72"
                max="300"
                step="72"
                value={dpi}
                onChange={(e) => setDpi(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>72 (Screen)</span>
                <span>150 (Standard)</span>
                <span>300 (Print)</span>
              </div>
            </div>
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
            loadingText="Converting PDF to images..."
            text="Convert to Images"
          />
        </Card>
      )}
    </ToolLayout>
  );
}
