import React from 'react';

export const WebsiteFooter = ({ onOpenEarlyAccess, onOpenPolicy, onExploreDemo }) => {
  return (
    <footer className="bg-white border-t border-[#E8EAE7] py-16 text-xs text-[#5C6E63]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-[#F0F2EF]">
          
          {/* Brand & Description (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2D6A4F] text-white flex items-center justify-center font-bold text-xs">
                CL
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[#18231C]">
                Careloop
              </span>
            </div>

            <p className="text-xs text-[#5C6E63] leading-relaxed max-w-sm">
              Careloop is a configurable health-program management SaaS platform that helps coaches, clinicians, and creators turn health advice into daily action.
            </p>

            <div className="pt-2 text-[11px] text-[#7B8B80]">
              Built with evidence-based adherence architecture.
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#18231C]">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#product" className="hover:text-[#18231C]">Workspace Overview</a></li>
              <li><a href="#how-it-works" className="hover:text-[#18231C]">4-Step Loop</a></li>
              <li><button onClick={onExploreDemo} className="hover:text-[#18231C]">Interactive Demo</button></li>
              <li><a href="#pricing" className="hover:text-[#18231C]">Pricing Hypotheses</a></li>
              <li><a href="#faq" className="hover:text-[#18231C]">FAQ</a></li>
            </ul>
          </div>

          {/* Use Cases */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#18231C]">
              Supported Practices
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#who-its-for" className="hover:text-[#18231C]">Fitness Creators & Challenges</a></li>
              <li><a href="#who-its-for" className="hover:text-[#18231C]">Personal Trainers & Coaches</a></li>
              <li><a href="#who-its-for" className="hover:text-[#18231C]">Dietitians & Nutritionists</a></li>
              <li><a href="#who-its-for" className="hover:text-[#18231C]">Physiotherapy & Rehabilitation</a></li>
              <li><a href="#who-its-for" className="hover:text-[#18231C]">Wellness & Habit Mentors</a></li>
            </ul>
          </div>

          {/* Early Access & Legal */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#18231C]">
              Access & Principles
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenEarlyAccess} className="font-bold text-[#2D6A4F] hover:underline">
                  Get Early Access →
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('privacy')} className="hover:text-[#18231C]">
                  Privacy Policy (Draft)
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('terms')} className="hover:text-[#18231C]">
                  Terms of Service (Draft)
                </button>
              </li>
              <li>
                <span className="text-gray-400">Non-Clinical Disclaimer</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Regulatory & Clinical Honesty Disclaimers */}
        <div className="py-6 border-b border-[#F0F2EF] text-[11px] text-[#7B8B80] space-y-1.5 leading-relaxed">
          <p>
            <strong>Medical & Health Outcome Disclaimer:</strong> Completion tracking shows self-reported behavior, not proven health outcomes. Careloop supports the professional's plan; it does not provide medical advice.
          </p>
          <p>
            <strong>Data Protection & Regulatory Notice:</strong> Built with evidence-based adherence architecture and designed with Indian data-protection principles in mind; not a compliance guarantee.
          </p>
          <p>
            <strong>WhatsApp Integration Status:</strong> Current WhatsApp bot features operate as a simulated demo - live Meta integration not connected.
          </p>
        </div>

        {/* Bottom Copyright & Status */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7B8B80]">
          <div>
            © {new Date().getFullYear()} Careloop. All rights reserved. Early Access Validation Prototype.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#52B788]" />
            <span>Zero-Billing Spark Architecture</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
