"use client";

import { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Link from "next/link";

interface ToolLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  icon: string;
  iconBg?: string;
  iconColor?: string;
  category: string;
  currentTool: string;
  breadcrumbs?: { label: string; href: string }[];
}

export default function ToolLayout({
  children,
  title,
  description,
  icon,
  iconBg = "bg-[#6366F1]/10",
  iconColor = "text-[#6366F1]",
  category,
  currentTool,
  breadcrumbs,
}: ToolLayoutProps) {
  const defaultBreadcrumbs = [
    { label: "Home", href: "/" },
    { label: category, href: `/tools#${category.toLowerCase()}` },
    { label: currentTool, href: "#" },
  ];

  const items = breadcrumbs || defaultBreadcrumbs;

  return (
    <main className="min-h-screen bg-[#F5F3FF]">
      <Navigation />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            {items.map((item, index) => (
              <span key={index} className="flex items-center">
                {index > 0 && <i className="fas fa-chevron-right text-xs mx-2"></i>}
                {index === items.length - 1 ? (
                  <span className="text-[#6366F1] font-medium">{item.label}</span>
                ) : (
                  <Link href={item.href} className="hover:text-[#6366F1] transition-colors">
                    {item.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          {/* Header */}
          <div className="text-center mb-10">
            <div className={`w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <i className={`fas ${icon} ${iconColor} text-2xl`}></i>
            </div>
            <h1 className="text-4xl font-bold text-[#1E1B4B] mb-3">{title}</h1>
            <p className="text-gray-600">{description}</p>
          </div>

          {/* Content */}
          {children}
        </div>
      </div>
    </main>
  );
}

// 通用组件：上传区域
interface UploadZoneProps {
  onFileSelect: (files: FileList | null) => void;
  accept: string;
  multiple?: boolean;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  title: string;
  subtitle: string;
  icon?: string;
}

export function UploadZone({
  onFileSelect,
  accept,
  multiple = false,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  title,
  subtitle,
  icon = "fa-cloud-upload-alt",
}: UploadZoneProps) {
  return (
    <div
      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
        isDragging
          ? "border-solid bg-[#E0E7FF] border-[#6366F1]"
          : "border-[#6366F1]/30 hover:border-[#6366F1] bg-gradient-to-br from-[#F5F3FF] to-[#EEF2FF]"
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => document.getElementById("file-upload")?.click()}
    >
      <input
        type="file"
        id="file-upload"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => onFileSelect(e.target.files)}
      />
      <div className="w-16 h-16 bg-[#6366F1]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
        <i className={`fas ${icon} text-[#6366F1] text-2xl`}></i>
      </div>
      <p className="text-lg font-medium text-[#1E1B4B] mb-2">{title}</p>
      <p className="text-gray-500 mb-4">{subtitle}</p>
      <p className="text-sm text-gray-400">Maximum file size: 10MB</p>
    </div>
  );
}

// 通用组件：步骤标题
interface StepHeaderProps {
  step: number;
  title: string;
}

export function StepHeader({ step, title }: StepHeaderProps) {
  return (
    <h2 className="text-xl font-semibold text-[#1E1B4B] mb-6 flex items-center">
      <span className="w-8 h-8 bg-[#6366F1] text-white rounded-full inline-flex items-center justify-center text-sm mr-3 flex-shrink-0">
        {step}
      </span>
      {title}
    </h2>
  );
}

// 通用组件：处理按钮
interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  text: string;
  icon?: string;
}

export function ActionButton({
  onClick,
  disabled = false,
  loading = false,
  loadingText = "Processing...",
  text,
  icon = "fa-magic",
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
        disabled
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-[#10B981] text-white hover:bg-emerald-600 transform hover:scale-[1.02] shadow-lg shadow-emerald-500/30"
      }`}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          {loadingText}
        </span>
      ) : (
        <>
          <i className={`fas ${icon} mr-2`}></i>
          {text}
        </>
      )}
    </button>
  );
}

// 通用组件：卡片容器
interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl p-8 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// 工具函数：格式化文件大小
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// 通用组件：结果显示
interface ResultCardProps {
  originalSize: number;
  processedSize: number;
  originalLabel?: string;
  processedLabel?: string;
}

export function ResultCard({
  originalSize,
  processedSize,
  originalLabel = "Original",
  processedLabel = "Processed",
}: ResultCardProps) {
  const reduction = ((originalSize - processedSize) / originalSize) * 100;

  return (
    <div className="bg-white rounded-2xl p-8">
      <h3 className="text-lg font-semibold text-[#1E1B4B] mb-4">Processing Result</h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500 mb-1">{originalLabel}</p>
          <p className="font-semibold text-[#1E1B4B]">{formatFileSize(originalSize)}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-xl">
          <p className="text-sm text-gray-500 mb-1">{processedLabel}</p>
          <p className="font-semibold text-[#10B981]">{formatFileSize(processedSize)}</p>
        </div>
        <div className="p-4 bg-[#6366F1]/10 rounded-xl">
          <p className="text-sm text-gray-500 mb-1">Saved</p>
          <p className="font-semibold text-[#6366F1]">{reduction.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}
