import React, { useState, useEffect } from 'react';
import { IconChevronRight } from '../Icons.jsx';

export const WebsiteNavbar = ({ onOpenEarlyAccess, onOpenSignIn, onExploreDemo, onOpenPitchDeck }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Product', href: '#product' },
    { label: 'Who it\'s for', href: '#who-its-for' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' }
  ];

  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`sticky top-0 z-40 transition-all duration-200 ${
      scrolled 
        ? 'bg-[#FBFBFA]/90 backdrop-blur-md border-b border-[#E8EAE7] shadow-xs' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Wordmark & Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#2D6A4F] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="m8.5 12 2.5 2.5 5-5" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#18231C]">
                Careloop
              </span>
              <span className="hidden sm:block text-[11px] text-[#5C6E63] font-medium -mt-1">
                Better follow-through. Measurable progress.
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="text-xs font-semibold text-[#405347] hover:text-[#18231C] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {onOpenPitchDeck && (
              <button
                onClick={onOpenPitchDeck}
                className="px-3.5 py-2 text-xs font-semibold text-[#18231C] bg-white border border-[#D5D9D4] rounded-xl hover:bg-[#F4F6F3] transition-colors"
              >
                Pitch Decks (3)
              </button>
            )}
            <button
              onClick={onOpenSignIn}
              className="px-3.5 py-2 text-xs font-semibold text-[#18231C] hover:text-[#2D6A4F] transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={onExploreDemo}
              className="px-3.5 py-2 text-xs font-semibold text-[#1B4332] bg-[#EBF7EE] border border-[#BDE8C6] rounded-xl hover:bg-[#D8F3DC] transition-colors"
            >
              Demo Sandbox
            </button>
            <button
              onClick={onOpenEarlyAccess}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-[#2D6A4F] rounded-xl hover:bg-[#1B4332] transition-colors shadow-xs"
            >
              Get early access
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenEarlyAccess}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#2D6A4F] rounded-lg"
            >
              Early access
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#18231C] hover:bg-[#F4F6F3]"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-[#E8EAE7] px-4 pt-3 pb-6 space-y-3 animate-in fade-in duration-150">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="block px-3 py-2 text-sm font-semibold text-[#405347] hover:bg-[#FAFAF8] rounded-lg"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-[#F0F2EF] space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSignIn();
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-[#18231C]"
            >
              Sign in
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onExploreDemo();
              }}
              className="w-full py-2.5 rounded-xl bg-[#EBF7EE] text-[#1B4332] text-xs font-semibold border border-[#BDE8C6]"
            >
              Explore Sandbox Demo
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEarlyAccess();
              }}
              className="w-full py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-semibold"
            >
              Get early access
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
