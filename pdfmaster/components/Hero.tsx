"use client";

import { useCallback } from "react";

export default function Hero() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("Files dropped:", acceptedFiles);
  }, []);

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200 mb-8">
          <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></span>
          <span className="text-sm text-gray-600">Free to use • No registration required</span>
        </div>
        
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1E1B4B] mb-6 leading-tight">
          All-in-One<br />
          <span className="bg-gradient-to-r from-[#6366F1] to-[#10B981] bg-clip-text text-transparent">
            PDF Tools
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Merge, split, compress, and convert PDFs online. 
          Secure, fast, and completely free.
        </p>

        {/* Upload Zone */}
        <div className="upload-zone rounded-2xl p-8 sm:p-12 max-w-3xl mx-auto cursor-pointer mb-8">
          <div className="w-20 h-20 bg-[#6366F1]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-cloud-upload-alt text-[#6366F1] text-3xl"></i>
          </div>
          <h3 className="text-2xl font-semibold text-[#1E1B4B] mb-3">Drop your PDF files here</h3>
          <p className="text-gray-500 mb-6">or click to browse files</p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-400">
            <span className="flex items-center space-x-1">
              <i className="fas fa-check-circle text-[#10B981]"></i>
              <span>PDF</span>
            </span>
            <span className="flex items-center space-x-1">
              <i className="fas fa-check-circle text-[#10B981]"></i>
              <span>Word</span>
            </span>
            <span className="flex items-center space-x-1">
              <i className="fas fa-check-circle text-[#10B981]"></i>
              <span>Excel</span>
            </span>
            <span className="flex items-center space-x-1">
              <i className="fas fa-check-circle text-[#10B981]"></i>
              <span>PPT</span>
            </span>
          </div>
        </div>

        <button className="bg-[#10B981] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-600 transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/30">
          Start Free <i className="fas fa-arrow-right ml-2"></i>
        </button>
      </div>
    </section>
  );
}
