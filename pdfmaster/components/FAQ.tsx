"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Is PDF Master free to use?",
    answer: "Yes! Our free plan includes 3 tasks per day with files up to 10MB. No credit card required, no hidden fees.",
  },
  {
    question: "Are my files secure?",
    answer: "Absolutely. All file transfers use SSL encryption. Files are automatically deleted from our servers after 1 hour. We never access or share your content.",
  },
  {
    question: "What file formats are supported?",
    answer: "We support PDF, Word (DOC/DOCX), Excel (XLS/XLSX), PowerPoint (PPT/PPTX), and image formats (JPG, PNG). You can convert between most formats.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No account needed for the free plan. Simply visit our website and start processing files immediately. Optional signup for Pro features.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time with no questions asked. You'll continue to have access until the end of your billing period.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1E1B4B] mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600">Everything you need to know</p>
        </div>

        <div className="space-y-0">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item py-6 border-b border-gray-200">
              <button
                className="w-full flex items-center justify-between text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-medium text-[#1E1B4B]">{faq.question}</span>
                <i
                  className={`fas fa-chevron-down text-gray-400 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                ></i>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-40 mt-4" : "max-h-0"
                }`}
              >
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
