"use client";

import { useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// 工具数据
const toolCategories = [
  {
    id: "pdf",
    name: "PDF Tools",
    icon: "fa-file-pdf",
    color: "text-red-500",
    bgColor: "bg-red-50",
    description: "Merge, compress, convert, and edit PDF files",
    featured: [
      { name: "Merge PDF", desc: "Combine multiple PDFs", icon: "fa-object-group", href: "/tools/merge-pdf" },
      { name: "Compress PDF", desc: "Reduce file size", icon: "fa-compress-arrows-alt", href: "/tools/pdf/compress" },
      { name: "PDF to Word", desc: "Convert to editable DOC", icon: "fa-file-word", href: "/tools/pdf/to-word" },
      { name: "Split PDF", desc: "Extract pages", icon: "fa-cut", href: "/tools/pdf/split" },
    ],
    tools: [
      { name: "PDF to JPG", href: "/tools/pdf/to-jpg" },
      { name: "JPG to PDF", href: "/tools/pdf/from-jpg" },
      { name: "PDF to Excel", href: "/tools/pdf/to-excel" },
      { name: "PDF to PPT", href: "/tools/pdf/to-ppt" },
      { name: "Protect PDF", href: "/tools/pdf/protect" },
      { name: "Unlock PDF", href: "/tools/pdf/unlock" },
    ],
  },
  {
    id: "image",
    name: "Image Tools",
    icon: "fa-image",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    description: "Compress, resize, convert, and enhance images",
    featured: [
      { name: "Compress Image", desc: "Reduce image size", icon: "fa-image", href: "/tools/image/compress" },
      { name: "Resize Image", desc: "Change dimensions", icon: "fa-expand", href: "/tools/image/resize" },
      { name: "Convert Image", desc: "Change format", icon: "fa-exchange-alt", href: "/tools/image/convert" },
      { name: "Crop Image", desc: "Crop to size", icon: "fa-crop", href: "/tools/image/crop" },
    ],
    tools: [
      { name: "Remove Background", href: "/tools/image/remove-bg" },
      { name: "Image to PDF", href: "/tools/image/to-pdf" },
      { name: "Rotate Image", href: "/tools/image/rotate" },
      { name: "Add Watermark", href: "/tools/image/watermark" },
      { name: "Blur Background", href: "/tools/image/blur-bg" },
      { name: "All Image Tools", href: "/tools/image" },
    ],
  },
  {
    id: "video",
    name: "Video Tools",
    icon: "fa-video",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    description: "Compress, convert, and edit video files",
    featured: [
      { name: "Compress Video", desc: "Reduce video size", icon: "fa-compress", href: "/tools/video/compress" },
      { name: "Video to GIF", desc: "Create animated GIF", icon: "fa-film", href: "/tools/video/to-gif" },
      { name: "Trim Video", desc: "Cut video clips", icon: "fa-scissors", href: "/tools/video/trim" },
      { name: "MP4 to MP3", desc: "Extract audio", icon: "fa-headphones", href: "/tools/video/mp4-to-mp3" },
    ],
    tools: [
      { name: "Video to WebP", href: "/tools/video/to-webp" },
      { name: "Resize Video", href: "/tools/video/resize" },
      { name: "Merge Videos", href: "/tools/video/merge" },
      { name: "Rotate Video", href: "/tools/video/rotate" },
      { name: "Add Watermark", href: "/tools/video/watermark" },
      { name: "All Video Tools", href: "/tools/video" },
    ],
  },
  {
    id: "file",
    name: "File Tools",
    icon: "fa-folder",
    color: "text-green-500",
    bgColor: "bg-green-50",
    description: "Convert between document formats",
    featured: [
      { name: "Excel to PDF", desc: "Spreadsheet to PDF", icon: "fa-file-excel", href: "/tools/file/excel-to-pdf" },
      { name: "Word to PDF", desc: "Document to PDF", icon: "fa-file-word", href: "/tools/file/word-to-pdf" },
      { name: "PPT to PDF", desc: "Presentation to PDF", icon: "fa-file-powerpoint", href: "/tools/file/ppt-to-pdf" },
      { name: "CSV Tools", desc: "CSV converter", icon: "fa-table", href: "/tools/file/csv" },
    ],
    tools: [
      { name: "JSON to CSV", href: "/tools/file/json-to-csv" },
      { name: "XML to JSON", href: "/tools/file/xml-to-json" },
      { name: "Split Excel", href: "/tools/file/split-excel" },
      { name: "Merge Excel", href: "/tools/file/merge-excel" },
      { name: "File Compress", href: "/tools/file/zip" },
      { name: "All File Tools", href: "/tools/file" },
    ],
  },
];

// 热门工具
const popularTools = [
  { name: "Merge PDF", category: "PDF", href: "/tools/merge-pdf", icon: "fa-object-group" },
  { name: "Compress PDF", category: "PDF", href: "/tools/pdf/compress", icon: "fa-compress-arrows-alt" },
  { name: "Image Compress", category: "Image", href: "/tools/image/compress", icon: "fa-image" },
  { name: "Remove BG", category: "Image", href: "/tools/image/remove-bg", icon: "fa-magic" },
  { name: "Video Compress", category: "Video", href: "/tools/video/compress", icon: "fa-video" },
  { name: "PDF to Word", category: "PDF", href: "/tools/pdf/to-word", icon: "fa-file-word" },
  { name: "Resize Image", category: "Image", href: "/tools/image/resize", icon: "fa-expand" },
  { name: "Excel to PDF", category: "File", href: "/tools/file/excel-to-pdf", icon: "fa-file-excel" },
];

// 统计数据
const stats = [
  { value: "100K+", label: "Active Users" },
  { value: "1M+", label: "Files Processed" },
  { value: "20+", label: "Free Tools" },
  { value: "50K+", label: "PDFs Created" },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // 搜索过滤
  const filteredTools = popularTools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#F5F3FF]">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#6366F1]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#10B981]/10 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1E1B4B] mb-6 leading-tight">
            Free Tools to Make
            <br />
            <span className="text-[#6366F1]">Your Work</span> Easier
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            PDF, image, video, and file conversion tools. 
            No registration, no limits, completely free.
          </p>

          {/* 搜索框 */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <i className="fas fa-search absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
              <input
                type="text"
                placeholder="Search tools (e.g., 'compress pdf', 'resize image')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-gray-200 text-lg focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/20 transition-all shadow-lg"
              />
            </div>

            {/* 搜索结果下拉 */}
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                {filteredTools.length > 0 ? (
                  filteredTools.map((tool, idx) => (
                    <Link
                      key={idx}
                      href={tool.href}
                      className="flex items-center px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                    >
                      <i className={`fas ${tool.icon} text-[#6366F1] w-8`}></i>
                      <span className="font-medium text-[#1E1B4B]">{tool.name}</span>
                      <span className="ml-auto text-sm text-gray-400">{tool.category}</span>
                    </Link>
                  ))
                ) : (
                  <div className="px-6 py-4 text-gray-500">No tools found</div>
                )}
              </div>
            )}
          </div>

          {/* 快速链接 */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="text-gray-500">Popular:</span>
            {["Merge PDF", "Compress Image", "Video to GIF", "PDF to Word"].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-4 py-2 bg-white rounded-full text-sm text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-colors border border-[#6366F1]/20"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 工具分类展示 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* 分类导航 */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-2xl p-2 inline-flex flex-wrap justify-center shadow-sm">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeCategory === null
                    ? "bg-[#6366F1] text-white"
                    : "text-gray-600 hover:text-[#6366F1]"
                }`}
              >
                All Tools
              </button>
              {toolCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    activeCategory === cat.id
                      ? "bg-[#6366F1] text-white"
                      : "text-gray-600 hover:text-[#6366F1]"
                  }`}
                >
                  <i className={`fas ${cat.icon}`}></i>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* 分类卡片 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {toolCategories
              .filter((cat) => !activeCategory || cat.id === activeCategory)
              .map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow"
                >
                  {/* 分类头部 */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 ${category.bgColor} rounded-2xl flex items-center justify-center`}>
                      <i className={`fas ${category.icon} ${category.color} text-2xl`}></i>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#1E1B4B]">{category.name}</h2>
                      <p className="text-gray-500 text-sm">{category.description}</p>
                    </div>
                  </div>

                  {/* Featured Tools */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {category.featured.map((tool, idx) => (
                      <Link
                        key={idx}
                        href={tool.href}
                        className="group p-4 rounded-2xl bg-gray-50 hover:bg-[#6366F1]/5 transition-colors border border-gray-100 hover:border-[#6366F1]/20"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                            <i className={`fas ${tool.icon} text-[#6366F1]`}></i>
                          </div>
                          <div>
                            <h3 className="font-semibold text-[#1E1B4B] group-hover:text-[#6366F1] transition-colors">
                              {tool.name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">{tool.desc}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Other Tools */}
                  <div className="flex flex-wrap gap-2">
                    {category.tools.map((tool, idx) => (
                      <Link
                        key={idx}
                        href={tool.href}
                        className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-[#6366F1] hover:text-white transition-colors"
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* 统计数据 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#6366F1]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 热门工具 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1E1B4B] text-center mb-12">
            Most Popular Tools
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {popularTools.map((tool, idx) => (
              <Link
                key={idx}
                href={tool.href}
                className="group p-6 rounded-2xl border border-gray-200 hover:border-[#6366F1] hover:shadow-lg transition-all text-center"
              >
                <div className="w-14 h-14 bg-[#6366F1]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#6366F1] transition-colors">
                  <i className={`fas ${tool.icon} text-[#6366F1] text-xl group-hover:text-white transition-colors`}></i>
                </div>
                <h3 className="font-semibold text-[#1E1B4B] mb-1">{tool.name}</h3>
                <p className="text-xs text-gray-500">{tool.category}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 特色功能 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1E1B4B] mb-4">Why Choose Us?</h2>
            <p className="text-gray-600">Free tools that you'd usually pay for</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "fa-bolt",
                title: "Fast & Easy",
                desc: "No software to install. Process files in seconds directly in your browser.",
              },
              {
                icon: "fa-shield-alt",
                title: "Secure & Private",
                desc: "Files are automatically deleted after 1 hour. We never share your data.",
              },
              {
                icon: "fa-gift",
                title: "Completely Free",
                desc: "No registration required. No watermarks. No limits on free tier.",
              },
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-8">
                <div className="w-16 h-16 bg-[#6366F1]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className={`fas ${feature.icon} text-[#6366F1] text-2xl`}></i>
                </div>
                <h3 className="text-xl font-semibold text-[#1E1B4B] mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
