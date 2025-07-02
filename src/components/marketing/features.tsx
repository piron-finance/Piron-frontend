import { Shield, Zap, Globe, DollarSign } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Institutional Grade Security",
    description:
      "Multi-signature escrow contracts and transparent fund management with blockchain immutability.",
  },
  {
    icon: Zap,
    title: "Automated Returns",
    description:
      "Smart contracts handle all calculations and distributions, ensuring accurate and timely returns.",
  },
  {
    icon: Globe,
    title: "Global Access",
    description:
      "Access traditional financial instruments from anywhere in the world through decentralized protocols.",
  },
  {
    icon: DollarSign,
    title: "Competitive Yields",
    description:
      "Earn attractive returns on T-Bills, Corporate Bonds, and Commercial Paper with transparent pricing.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Why Choose Piron Finance
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Built for the modern investor who demands transparency, security,
            and competitive returns.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-white/70 text-lg leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
