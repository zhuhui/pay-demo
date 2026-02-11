"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[#6366F1] rounded-xl flex items-center justify-center">
              <i className="fas fa-file-pdf text-white text-xl"></i>
            </div>
            <span className="text-xl font-bold text-[#1E1B4B]">PDF Master</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#tools" className="text-gray-600 hover:text-[#6366F1] transition-colors">
              Tools
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-[#6366F1] transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="text-gray-600 hover:text-[#6366F1] transition-colors">
              FAQ
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-[#6366F1] transition-colors hidden sm:block">
              Sign In
            </button>
            <button className="bg-[#6366F1] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#818CF8] transition-all">
              Get Started
            </button>
            <button
              className="md:hidden text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"} text-xl`}></i>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link href="#tools" className="text-gray-600 hover:text-[#6366F1] transition-colors">
                Tools
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-[#6366F1] transition-colors">
                Pricing
              </Link>
              <Link href="#faq" className="text-gray-600 hover:text-[#6366F1] transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
