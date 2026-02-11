const features = [
  { name: "Free to Use", us: true, others: false },
  { name: "No Watermark", us: true, others: false },
  { name: "Privacy & Security", us: true, others: "maybe" },
  { name: "Fast Processing", us: true, others: "slow" },
  { name: "No Registration", us: true, others: false },
];

export default function Comparison() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1E1B4B] mb-4">Why Choose PDF Master?</h2>
          <p className="text-gray-600">See how we compare to alternatives</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-3 gap-0">
            <div className="p-6 bg-gray-50 font-semibold text-[#1E1B4B] border-b border-gray-200">
              Feature
            </div>
            <div className="p-6 bg-[#6366F1]/5 font-semibold text-[#6366F1] border-b border-gray-200 text-center">
              PDF Master
            </div>
            <div className="p-6 bg-gray-50 font-semibold text-gray-500 border-b border-gray-200 text-center">
              Others
            </div>

            {features.map((feature, index) => (
              <>
                <div key={`name-${index}`} className={`p-6 border-b border-gray-200 ${index === features.length - 1 ? "" : ""}`}>
                  {feature.name}
                </div>
                <div key={`us-${index}`} className={`p-6 border-b border-gray-200 text-center ${index === features.length - 1 ? "" : ""}`}>
                  {feature.us === true ? (
                    <i className="fas fa-check-circle text-[#10B981] text-2xl"></i>
                  ) : (
                    <i className="fas fa-question-circle text-gray-300 text-2xl"></i>
                  )}
                </div>
                <div key={`others-${index}`} className={`p-6 border-b border-gray-200 text-center ${index === features.length - 1 ? "" : ""}`}>
                  {feature.others === true ? (
                    <i className="fas fa-check-circle text-[#10B981] text-2xl"></i>
                  ) : feature.others === "maybe" ? (
                    <i className="fas fa-question-circle text-gray-300 text-2xl"></i>
                  ) : feature.others === "slow" ? (
                    <i className="fas fa-clock text-gray-300 text-2xl"></i>
                  ) : (
                    <i className="fas fa-times-circle text-gray-300 text-2xl"></i>
                  )}
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
