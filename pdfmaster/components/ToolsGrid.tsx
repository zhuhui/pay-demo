"use client";

import Link from "next/link";

const tools = [
  {
    icon: "fa-object-group",
    iconBg: "bg-[#6366F1]/10",
    iconColor: "text-[#6366F1]",
    title: "Merge PDF",
    description: "Combine multiple PDFs into one document",
    href: "/tools/merge-pdf",
  },
  {
    icon: "fa-compress-arrows-alt",
    iconBg: "bg-green-100",
    iconColor: "text-green-500",
    title: "Compress PDF",
    description: "Reduce file size while maintaining quality",
    href: "/tools/pdf/compress",
  },
  {
    icon: "fa-image",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-500",
    title: "Compress Image",
    description: "Reduce image file size",
    href: "/tools/image/compress",
  },
  {
    icon: "fa-expand",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    title: "Resize Image",
    description: "Adjust image dimensions",
    href: "/tools/image/resize",
  },
  {
    icon: "fa-exchange-alt",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    title: "Convert Image",
    description: "Change image format",
    href: "/tools/image/convert",
  },
  {
    icon: "fa-th-large",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-500",
    title: "More Tools",
    description: "Explore all PDF & Image tools",
    href: "/tools",
    isMore: true,
  },
];

export default function ToolsGrid() {
  return (
    <section id="tools" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1E1B4B] mb-4">Popular Tools</h2>
          <p className="text-gray-600">Everything you need to work with PDFs and Images</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <Link
              key={index}
              href={tool.href}
              className={`tool-card bg-white rounded-2xl p-8 cursor-pointer block ${
                tool.isMore ? "border-dashed border-2" : ""
              }`}
            >
              <div className={`w-14 h-14 ${tool.iconBg} rounded-xl flex items-center justify-center mb-6`}>
                <i className={`fas ${tool.icon} ${tool.iconColor} text-2xl`}></i>
              </div>
              <h3 className="text-xl font-semibold text-[#1E1B4B] mb-2">{tool.title}</h3>
              <p className="text-gray-500 text-sm mb-4">{tool.description}</p>
              <div className="flex items-center text-[#6366F1] font-medium text-sm">
                <span>{tool.isMore ? "View All" : "Use Tool"}</span>
                <i className="fas fa-arrow-right ml-2"></i>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
