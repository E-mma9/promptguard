import { MarketingHeader, MarketingFooter } from '@/components/MarketingShell';
import { Hero } from '@/components/landing/Hero';
import { LogosBar } from '@/components/landing/LogosBar';
import { RealityStats } from '@/components/landing/RealityStats';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { Comparison } from '@/components/landing/Comparison';
import { Testimonial } from '@/components/landing/Testimonial';
import { FinalCta } from '@/components/landing/FinalCta';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader darkHero />
      <main>
        <Hero />
        <LogosBar />
        <RealityStats />
        <HowItWorks />
        <FeatureGrid />
        <Comparison />
        <Testimonial />
        <FinalCta />
      </main>
      <MarketingFooter />
    </div>
  );
}
