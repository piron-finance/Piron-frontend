import { Hero } from "@/components/marketing/hero";
import { Stats } from "@/components/marketing/stats";
import { Features } from "@/components/marketing/features";
import { CTA } from "@/components/marketing/cta";

export default function MarketingPage() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <CTA />
    </>
  );
}
