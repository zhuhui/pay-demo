"use client";

const steps = [
  {
    number: "1",
    title: "The Problem",
    description: "PDF software is too expensive and complicated. Online tools have limits, watermarks, or security concerns.",
    borderColor: "border-red-400",
    bgColor: "bg-red-100",
    textColor: "text-red-500",
    icon: "fa-exclamation-circle",
    iconColor: "text-red-400",
  },
  {
    number: "2",
    title: "Our Solution",
    description: "100% free online tools. No installation needed. Process files instantly with bank-level security.",
    borderColor: "border-orange-400",
    bgColor: "bg-orange-100",
    textColor: "text-orange-500",
    icon: "fa-lightbulb",
    iconColor: "text-orange-400",
  },
  {
    number: "3",
    title: "Take Action",
    description: "Drag files, process with one click, download instantly. Files are automatically deleted after 1 hour.",
    borderColor: "border-[#10B981]",
    bgColor: "bg-green-100",
    textColor: "text-[#10B981]",
    icon: "fa-check-circle",
    iconColor: "text-[#10B981]",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1E1B4B] mb-4">How It Works</h2>
          <p className="text-gray-600">Simple 3-step process</p>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-8 border-l-4 ${step.borderColor}`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className={`w-12 h-12 ${step.bgColor} ${step.textColor} rounded-full flex items-center justify-center font-semibold text-xl`}>
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#1E1B4B] mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                <i className={`fas ${step.icon} ${step.iconColor} text-3xl hidden md:block`}></i>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="bg-[#10B981] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-600 transition-all">
            Start Now <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
