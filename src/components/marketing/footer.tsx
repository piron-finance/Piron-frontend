import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const footerLinks = {
  Product: [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Pools", href: "/dashboard/pools" },
    { name: "Portfolio", href: "/dashboard/portfolio" },
  ],
  Resources: [
    { name: "Documentation", href: "/docs" },
    { name: "About", href: "/about" },
    { name: "Support", href: "/support" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Risk Disclosure", href: "/risk" },
  ],
};

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <Logo />
            <p className="text-white/60 mt-6 max-w-xs">
              Democratizing access to institutional-grade financial instruments
              through blockchain technology.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-6">{category}</h3>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 text-center text-white/60">
          <p>&copy; 2024 Piron Finance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
