"use client";

import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { BackgroundEffects } from "@/components/ui/background-effects";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <BackgroundEffects />
      <div className="relative z-10">
        <MarketingHeader />
        <main>{children}</main>
        <MarketingFooter />
      </div>
    </div>
  );
}
