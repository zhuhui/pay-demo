"use client";

import { useState, useCallback } from "react";
import ToolLayout, {
  UploadZone,
  StepHeader,
  ActionButton,
  Card,
  formatFileSize,
} from "@/components/ToolLayout";

export default function PDFToWordPage() {
  const [file, setFile] = useState<File | null>(null);
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

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/pdf/to-word`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to convert PDF to Word");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const originalName = file.name.replace(/\.pdf$/i, "");
      a.download = `${originalName}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error converting PDF to Word:", error);
      alert(error instanceof Error ? error.message : "Failed to convert PDF to Word document");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="PDF to Word"
      description="Convert PDF to editable Word document (.docx)."
      icon="fa-file-word"
      iconBg="bg-[#3B82F6]/10"
      iconColor="text-[#3B82F6]"
      category="PDF"
      currentTool="PDF to Word"
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

      {/* Step 2: Info */}
      {file && (
        <Card className="mb-6">
          <StepHeader step={2} title="Conversion Info" />
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-start space-x-3">
              <i className="fas fa-info-circle text-blue-500 mt-1"></i>
              <div>
                <p className="font-medium text-[#1E1B4B]">What to expect</p>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>• Text will be extracted as editable text</li>
                  <li>• Images will be preserved where possible</li>
                  <li>• Complex layouts may need manual adjustment</li>
                  <li>• Output format: .docx (Microsoft Word)</li>
                </ul>
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
            loadingText="Converting PDF to Word..."
            text="Convert to Word Document"
          />
        </Card>
      )}
    </ToolLayout>
  );
}
