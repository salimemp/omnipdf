import { Suspense } from 'react';
import { HeroSection } from '@/components/layout/HeroSection';
import { ToolsSection } from '@/components/layout/ToolsSection';
import { FeaturesSection } from '@/components/layout/FeaturesSection';
import { PricingSection } from '@/components/layout/PricingSection';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { AdBanner } from '@/components/ui/AdBanner';
import { Skeleton } from '@/components/ui/Skeleton';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <HeroSection />
        
        <Suspense fallback={<Skeleton className="h-48 w-full" />}>
          <AdBanner 
            slotId="omnipdf-top-banner" 
            format="horizontal"
            className="my-8"
          />
        </Suspense>
        
        <ToolsSection />
        
        <Suspense fallback={<Skeleton className="h-32 w-full" />}>
          <AdBanner 
            slotId="omnipdf-middle-banner" 
            format="rectangle"
            className="my-12"
          />
        </Suspense>
        
        <FeaturesSection />
        <PricingSection />
      </main>
      
      <Footer />
    </div>
  );
}
