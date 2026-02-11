"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  category: string;
  featured?: boolean;
}

const tools: Tool[] = [
  // PDF Tools
  {
    id: "pdf-merge",
    name: "Merge PDF",
    description: "Combine multiple PDF files into one",
    icon: "fa-object-group",
    href: "/tools/pdf/merge",
    category: "PDF",
    featured: true,
  },
  {
    id: "pdf-compress",
    name: "Compress PDF",
    description: "Reduce PDF file size without losing quality",
    icon: "fa-compress-arrows-alt",
    href: "/tools/pdf/compress",
    category: "PDF",
    featured: true,
  },
  {
    id: "pdf-split",
    name: "Split PDF",
    description: "Separate pages or extract specific pages",
    icon: "fa-cut",
    href: "/tools/pdf/split",
    category: "PDF",
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Convert PDF to editable Word document",
    icon: "fa-file-word",
    href: "/tools/pdf/to-word",
    category: "PDF",
    featured: true,
  },
  // Image Tools
  {
    id: "image-compress",
    name: "Compress Image",
    description: "Reduce image file size",
    icon: "fa-image",
    href: "/tools/image/compress",
    category: "Image",
    featured: true,
  },
  {
    id: "image-resize",
    name: "Resize Image",
    description: "Adjust image dimensions",
    icon: "fa-expand",
    href: "/tools/image/resize",
    category: "Image",
    featured: true,
  },
  {
    id: "image-convert",
    name: "Convert Image",
    description: "Change image format (JPG, PNG, WebP)",
    icon: "fa-exchange-alt",
    href: "/tools/image/convert",
    category: "Image",
    featured: true,
  },
  {
    id: "image-crop",
    name: "Crop Image",
    description: "Crop image to desired area",
    icon: "fa-crop",
    href: "/tools/image/crop",
    category: "Image",
  },
];

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "PDF", "Image"];

  const filteredTools =
    selectedCategory === "All"
      ? tools
      : tools.filter((tool) => tool.category === selectedCategory);

  const featuredTools = tools.filter((tool) => tool.featured);

  return (
    <main className="min-h-screen bg-[#F5F3FF]">
      <Navigation />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#1E1B4B] mb-4">
              All Tools
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Free online tools for PDF and image processing. No registration
              required.
            </p>
          </div>

          {/* Featured Tools */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#1E1B4B] mb-6">
              Featured Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} featured />
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-1 inline-flex">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-[#6366F1] text-white"
                      : "text-gray-600 hover:text-[#6366F1]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* All Tools */}
          <div>
            <h2 className="text-2xl font-bold text-[#1E1B4B] mb-6">
              {selectedCategory === "All" ? "All Tools" : `${selectedCategory} Tools`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ToolCard({ tool, featured = false }: { tool: Tool; featured?: boolean }) {
  return (
    <a
      href={tool.href}
      className={`block bg-white rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-1 ${
        featured ? "border-2 border-[#6366F1]" : "border border-gray-100"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
          featured ? "bg-[#6366F1] text-white" : "bg-[#6366F1]/10 text-[#6366F1]"
        }`}
      >
        <i className={`fas ${tool.icon} text-xl`}></i>
      </div>
      <h3 className="font-semibold text-[#1E1B4B] mb-2">{tool.name}</h3>
      <p className="text-sm text-gray-500">{tool.description}</p>
    </a>
  );
}
