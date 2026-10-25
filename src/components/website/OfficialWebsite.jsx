import React, { useState } from 'react';
import { WebsiteNavbar } from './WebsiteNavbar.jsx';
import { WebsiteHero } from './WebsiteHero.jsx';
import { TheProblem } from './TheProblem.jsx';
import { HowItWorks } from './HowItWorks.jsx';
import { ProductShowcase } from './ProductShowcase.jsx';
import { WhoItsFor } from './WhoItsFor.jsx';
import { Benefits } from './Benefits.jsx';
import { AutomationVision } from './AutomationVision.jsx';
import { PricingSection } from './PricingSection.jsx';
import { FaqSection } from './FaqSection.jsx';
import { FinalCta } from './FinalCta.jsx';
import { WebsiteFooter } from './WebsiteFooter.jsx';

import { EarlyAccessModal } from './EarlyAccessModal.jsx';
import { SignInModal } from './SignInModal.jsx';
import { PolicyModal } from './PolicyModal.jsx';

export const OfficialWebsite = ({ 
  onExploreDemo, 
  onLaunchParticipant, 
  onLaunchFounder,
  onOpenFirebaseModal 
}) => {
  const [isEarlyAccessOpen, setIsEarlyAccessOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [policyType, setPolicyType] = useState(null); // 'privacy' | 'terms' | null

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#18231C]">
      
      {/* Top Banner with direct demo trigger & Firebase setup indicator */}
      <div className="bg-[#1B4332] text-[#D8F3DC] text-xs py-2 px-4 text-center font-medium flex flex-wrap items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#52B788] animate-ping" />
        <span>Careloop Official Marketing Website • Live Online</span>
        <span className="text-white/40">•</span>
        <button 
          onClick={onExploreDemo}
          className="text-white font-bold underline hover:text-[#52B788]"
        >
          Doctor Sandbox →
        </button>
        {onLaunchFounder && (
          <>
            <span className="text-white/40">•</span>
            <button 
              onClick={onLaunchFounder}
              className="text-[#52B788] font-bold underline hover:text-white"
            >
              👑 Founder Command & Pitch Generator →
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <WebsiteNavbar
        onOpenEarlyAccess={() => setIsEarlyAccessOpen(true)}
        onOpenSignIn={() => setIsSignInOpen(true)}
        onExploreDemo={onExploreDemo}
      />

      {/* Main Content Sections */}
      <main>
        {/* Section B: Hero */}
        <WebsiteHero
          onExploreDemo={onExploreDemo}
          onOpenEarlyAccess={() => setIsEarlyAccessOpen(true)}
        />

        {/* Section C: The Problem */}
        <TheProblem />

        {/* Section D: How It Works */}
        <HowItWorks
          onExploreDemo={onExploreDemo}
        />

        {/* Section E: Product Showcase */}
        <ProductShowcase
          onExploreDemo={onExploreDemo}
        />

        {/* Section F: Who It's For */}
        <WhoItsFor
          onOpenEarlyAccess={() => setIsEarlyAccessOpen(true)}
        />

        {/* Section G: Benefits */}
        <Benefits />

        {/* Section H: Automation Vision */}
        <AutomationVision
          onExploreDemo={onExploreDemo}
        />

        {/* Section I: Pricing */}
        <PricingSection
          onOpenEarlyAccess={() => setIsEarlyAccessOpen(true)}
          onExploreDemo={onExploreDemo}
        />

        {/* Section J: FAQ */}
        <FaqSection />

        {/* Section K: Final CTA */}
        <FinalCta
          onOpenEarlyAccess={() => setIsEarlyAccessOpen(true)}
          onExploreDemo={onExploreDemo}
        />
      </main>

      {/* Section L: Footer */}
      <WebsiteFooter
        onOpenEarlyAccess={() => setIsEarlyAccessOpen(true)}
        onOpenPolicy={(type) => setPolicyType(type)}
        onExploreDemo={onExploreDemo}
      />

      {/* Interactive Modals */}
      <EarlyAccessModal
        isOpen={isEarlyAccessOpen}
        onClose={() => setIsEarlyAccessOpen(false)}
      />

      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onLaunchDemo={onExploreDemo}
        onLaunchParticipant={onLaunchParticipant}
        onLaunchFounder={onLaunchFounder}
      />

      <PolicyModal
        isOpen={Boolean(policyType)}
        onClose={() => setPolicyType(null)}
        policyType={policyType}
      />

    </div>
  );
};
