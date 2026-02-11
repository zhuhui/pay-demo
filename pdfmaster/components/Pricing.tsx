"use client";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "Forever free",
    features: [
      "3 tasks per day",
      "Max 10MB file size",
      "Basic features",
      "Standard support",
    ],
    buttonText: "Get Started",
    buttonClass: "border-2 border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9.9",
    period: "per month",
    features: [
      "Unlimited tasks",
      "Max 100MB file size",
      "All features",
      "Priority support",
      "No ads",
    ],
    buttonText: "Upgrade to Pro",
    buttonClass: "bg-[#6366F1] text-white hover:bg-[#818CF8]",
    popular: true,
  },
  {
    name: "Business",
    price: "$29",
    period: "per month",
    features: [
      "Unlimited everything",
      "Max 500MB file size",
      "API access",
      "Dedicated support",
      "Team collaboration",
    ],
    buttonText: "Contact Sales",
    buttonClass: "border-2 border-gray-300 text-gray-700 hover:border-[#6366F1] hover:text-[#6366F1]",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1E1B4B] mb-4">Simple Pricing</h2>
          <p className="text-gray-600">Start free, upgrade when you need more</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`pricing-card bg-white rounded-2xl p-8 ${
                plan.popular
                  ? "border-2 border-[#6366F1] relative"
                  : "border border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="popular-badge">MOST POPULAR</div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-[#1E1B4B] mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-[#1E1B4B] mb-2">{plan.price}</div>
                <p className="text-gray-500 text-sm">{plan.period}</p>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <i className="fas fa-check text-[#10B981]"></i>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-xl font-semibold transition-all ${plan.buttonClass}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
