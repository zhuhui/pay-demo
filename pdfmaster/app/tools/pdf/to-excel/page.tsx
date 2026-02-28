"use client";

import { useState, useCallback } from "react";
import ToolLayout, {
  UploadZone,
  StepHeader,
  ActionButton,
  Card,
  formatFileSize,
} from "@/components/ToolLayout";

export default function PDFToExcelPage() {
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

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/pdf/to-excel`, {
        method: "POST",
        body: JSON.stringify({ filename: file.name }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Conversion not available yet");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(".pdf", ".xlsx");
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error converting PDF to Excel:", error);
      alert("This feature is coming soon!");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="PDF to Excel"
      description="Convert PDF tables to editable Excel spreadsheets."
      icon="fa-file-excel"
      iconBg="bg-[#10B981]/10"
      iconColor="text-[#10B981]"
      category="PDF"
      currentTool="PDF to Excel"
    >
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

      {file && (
        <Card className="mb-6">
          <StepHeader step={2} title="Coming Soon" />
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <div className="flex items-start space-x-3">
              <i className="fas fa-clock text-amber-500 mt-1"></i>
              <div>
                <p className="font-medium text-[#1E1B4B]">Feature Coming Soon</p>
                <p className="text-sm text-gray-600 mt-1">
                  PDF to Excel conversion will extract tables from your PDF and convert them to editable Excel spreadsheets.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {file && (
        <Card>
          <StepHeader step={3} title="Notify Me" />
          <ActionButton
            onClick={handleConvert}
            loading={isProcessing}
            loadingText="Converting..."
            text="Coming Soon"
            disabled
          />
        </Card>
      )}
    </ToolLayout>
  );
}
