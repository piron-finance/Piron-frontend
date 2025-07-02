import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-3xl p-12 lg:p-16 border border-white/10">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Ready to Start Investing?
            </span>
          </h2>

          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Join thousands of investors already earning competitive returns on
            tokenized money market securities.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/dashboard/pools"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105"
            >
              Start Investing Now
            </Link>

            <Link
              href="/docs"
              className="flex items-center justify-center space-x-3 px-8 py-4 border border-white/20 hover:border-white/40 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/5 text-white"
            >
              <span className="text-lg">Read Documentation</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
