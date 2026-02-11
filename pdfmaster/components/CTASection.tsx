export default function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-[#6366F1] rounded-3xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-white/80 mb-8">
            Join millions of users who trust PDF Master for their document needs.
          </p>
          <button className="bg-[#10B981] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-600 transition-all transform hover:scale-105">
            Start Free Now <i className="fas fa-arrow-right ml-2"></i>
          </button>
          <p className="text-sm text-white/60 mt-4">
            No credit card required • Free forever plan available
          </p>
        </div>
      </div>
    </section>
  );
}
