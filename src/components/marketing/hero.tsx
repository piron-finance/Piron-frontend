import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

export function Hero() {
  return (
    <section className="relative py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl lg:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Tokenized Money
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Market Securities
            </span>
          </h1>

          <p className="text-xl lg:text-2xl text-white/70 mb-12 max-w-4xl mx-auto leading-relaxed">
            Access institutional-grade financial instruments through
            decentralized tokenized pools. Invest in T-Bills, Corporate Bonds,
            and Commercial Paper with transparent returns and blockchain
            security.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/dashboard/pools"
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-purple-500/25"
            >
              Start Investing
            </Link>

            <Link
              href="/docs"
              className="flex items-center space-x-3 px-8 py-4 border border-white/20 hover:border-white/40 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/5 text-white"
            >
              <span className="text-lg">Learn More</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
