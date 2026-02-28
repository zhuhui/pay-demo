"use client";

import { useState, useCallback } from "react";
import ToolLayout, {
  UploadZone,
  StepHeader,
  ActionButton,
  Card,
  formatFileSize,
} from "@/components/ToolLayout";

export default function SplitPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [splitMode, setSplitMode] = useState<"all" | "range">("all");
  const [pageRange, setPageRange] = useState("");
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      getPdfInfo(droppedFile);
    }
  }, []);

  const handleFileSelect = async (fileList: FileList | null) => {
    if (!fileList || !fileList[0]) return;
    
    const selectedFile = fileList[0];
    if (selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      getPdfInfo(selectedFile);
    }
  };

  const getPdfInfo = async (pdfFile: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", pdfFile);

      const response = await fetch(`${API_BASE_URL}/api/v1/pdf/info`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const info = await response.json();
        setTotalPages(info.pages);
      }
    } catch (error) {
      console.error("Error getting PDF info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSplit = async () => {
    if (!file) return;

    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("split_mode", splitMode === "all" ? "all" : "range");
    if (splitMode === "range" && pageRange) {
      formData.append("pages", pageRange);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/pdf/split`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to split PDF");
      }

      const contentType = response.headers.get("content-type");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      
      if (contentType?.includes("zip")) {
        a.download = "split_pages.zip";
      } else {
        a.download = "split.pdf";
      }
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error splitting PDF:", error);
      alert(error instanceof Error ? error.message : "Failed to split PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Split PDF"
      description="Separate PDF pages into individual files or extract specific pages."
      icon="fa-cut"
      iconBg="bg-[#EF4444]/10"
      iconColor="text-[#EF4444]"
      category="PDF"
      currentTool="Split PDF"
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
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)}
                    {totalPages && ` • ${totalPages} pages`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setTotalPages(null);
                  setPageRange("");
                }}
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
          <StepHeader step={2} title="Split Options" />
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1E1B4B] mb-3">
                Split Mode
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSplitMode("all")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    splitMode === "all"
                      ? "border-[#6366F1] bg-[#6366F1]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <i className="fas fa-th-large text-2xl mb-2 text-[#6366F1]"></i>
                  <p className="font-medium text-[#1E1B4B]">Split All Pages</p>
                  <p className="text-sm text-gray-500">Each page becomes a separate PDF</p>
                </button>
                <button
                  onClick={() => setSplitMode("range")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    splitMode === "range"
                      ? "border-[#6366F1] bg-[#6366F1]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <i className="fas fa-hand-point-right text-2xl mb-2 text-[#6366F1]"></i>
                  <p className="font-medium text-[#1E1B4B]">Extract Pages</p>
                  <p className="text-sm text-gray-500">Extract specific pages</p>
                </button>
              </div>
            </div>

            {splitMode === "range" && totalPages && (
              <div>
                <label className="block text-sm font-medium text-[#1E1B4B] mb-2">
                  Page Range
                </label>
                <input
                  type="text"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-all"
                  placeholder="e.g., 1,3,5-10"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Total pages: {totalPages}. Example: "1,3,5-10" extracts pages 1, 3, and 5 to 10.
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Step 3: Split */}
      {file && (
        <Card>
          <StepHeader step={3} title="Split & Download" />
          <ActionButton
            onClick={handleSplit}
            disabled={splitMode === "range" && !pageRange}
            loading={isProcessing}
            loadingText="Splitting PDF..."
            text={splitMode === "all" ? "Split All Pages" : "Extract Pages"}
          />
          {splitMode === "range" && !pageRange && (
            <p className="text-sm text-gray-500 text-center mt-3">
              Please enter page range to extract
            </p>
          )}
        </Card>
      )}
    </ToolLayout>
  );
}
