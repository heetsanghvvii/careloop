import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { isConfigured } from '../firebase/config.js';
import { dataService } from '../firebase/dataService.js';
import { 
  IconCheckCircle, 
  IconUsers, 
  IconClipboardList, 
  IconBarChart, 
  IconBell, 
  IconCreditCard, 
  IconLogOut, 
  IconShield,
  IconChevronDown,
  IconRefreshCw,
  IconArrowLeft
} from './Icons.jsx';

export const Navbar = ({ activeTab, setActiveTab, onOpenFirebaseModal, onBackToWebsite, onOpenPitchDeck, onOpenClinicQr }) => {
  const { currentUser, activeWorkspace, switchRole, signOut } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: IconCheckCircle },
    { id: 'participants', label: 'Participants', icon: IconUsers },
    { id: 'programs', label: 'Programs & Templates', icon: IconClipboardList },
    { id: 'whatsapp_lab', label: 'WhatsApp Lab', icon: IconMessageSquare },
    { id: 'analytics', label: 'Analytics', icon: IconBarChart },
    { id: 'reminders', label: 'Reminders (Simulated)', icon: IconBell },
    { id: 'pricing', label: 'Plans & Add-ons', icon: IconCreditCard },
  ];

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to clean initial baseline?')) {
      dataService.resetToDemo();
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E8EAE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Workspace */}
          <div className="flex items-center gap-6">
            <div 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="m8.5 12 2.5 2.5 5-5" />
                </svg>
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-[#18231C]">
                  Careloop
                </span>
                <span className="hidden sm:inline-block ml-2 text-[11px] font-medium text-[#52B788] bg-[#EBF7EE] px-2 py-0.5 rounded-full border border-[#D8F3DC]">
                  MVP
                </span>
              </div>
            </div>

            {/* Workspace badge */}
            {activeWorkspace && (
              <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-[#E8EAE7]">
                <div className="text-left">
                  <div className="text-xs font-semibold text-[#18231C]">
                    {activeWorkspace.name}
                  </div>
                  <div className="text-[10px] text-[#5C6E63]">
                    {activeWorkspace.category} • <span className="text-[#2D6A4F] font-medium">{activeWorkspace.plan} Plan</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#EBF7EE] text-[#1B4332] font-semibold border border-[#D8F3DC] shadow-xs'
                      : 'text-[#405347] hover:text-[#18231C] hover:bg-[#F4F6F3]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#2D6A4F]' : 'text-gray-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Role Switcher & Firebase State */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Pitch Decks Modal Button */}
            {onOpenPitchDeck && (
              <button
                onClick={onOpenPitchDeck}
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#1B4332] bg-[#EBF7EE] border border-[#BDE8C6] hover:bg-[#D8F3DC] transition-colors"
                title="View Doctor, Investor, and Team Pitch Decks"
              >
                <span>Pitch Decks (3)</span>
              </button>
            )}

            {/* Clinic QR Stand Button */}
            {onOpenClinicQr && (
              <button
                onClick={onOpenClinicQr}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#18231C] bg-white border border-[#D5D9D4] hover:bg-[#F4F6F3] transition-colors"
                title="Print Clinic Desk Stand & Prescription Card"
              >
                <span>Clinic QR</span>
              </button>
            )}

            {/* Back to Marketing Website Button */}
            {onBackToWebsite && (
              <button
                onClick={onBackToWebsite}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#18231C] bg-white border border-[#D5D9D4] hover:bg-[#F4F6F3] transition-colors"
                title="Return to Public Marketing Website"
              >
                <IconArrowLeft className="w-3.5 h-3.5 text-gray-500" />
                <span>Marketing Site</span>
              </button>
            )}

            {/* Firebase Status Pill */}
            <button
              onClick={onOpenFirebaseModal}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isConfigured 
                  ? 'bg-[#EBF7EE] border-[#BDE8C6] text-[#1B4332] hover:bg-[#D8F3DC]' 
                  : 'bg-[#F8F9F7] border-[#E0E2DE] text-[#5C6E63] hover:bg-[#EEF0EC]'
              }`}
              title="Click to manage Firebase connection"
            >
              <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-[#2D6A4F] animate-pulse' : 'bg-amber-400'}`} />
              <span className="hidden xl:inline">{isConfigured ? 'Live Firebase' : 'Demo Sandbox'}</span>
              <span className="xl:hidden">{isConfigured ? 'Cloud' : 'Demo'}</span>
            </button>

            {/* Quick Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F4F6F3] text-[#18231C] border border-[#E0E2DE] hover:bg-[#EAEDE8] transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-[#2D6A4F]" />
                <span className="hidden sm:inline">Role:</span>
                <span className="font-semibold capitalize truncate max-w-[120px]">
                  {currentUser?.role === 'participant' ? `Participant (${currentUser.displayName})` : 'Practitioner'}
                </span>
                <IconChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {roleDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-xl border border-[#E8EAE7] py-2 z-50 text-xs animate-in fade-in duration-150"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                    Switch Active Experience
                  </div>

                  <button
                    onClick={() => {
                      switchRole('practitioner');
                      setRoleDropdownOpen(false);
                      setActiveTab('dashboard');
                    }}
                    className={`w-full text-left px-3 py-2.5 hover:bg-[#F4F6F3] flex items-center justify-between ${
                      currentUser?.role === 'practitioner' ? 'bg-[#EBF7EE] font-semibold text-[#1B4332]' : 'text-gray-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium">Practitioner Dashboard</div>
                      <div className="text-[10px] text-gray-500">Dr. Arjun Patel (Full workspace admin)</div>
                    </div>
                    {currentUser?.role === 'practitioner' && <IconCheckCircle className="w-4 h-4 text-[#2D6A4F]" />}
                  </button>

                  <div className="px-3 py-1 text-[10px] uppercase font-semibold text-gray-400 border-t border-gray-100 mt-1">
                    Participant Mobile Portals
                  </div>

                  <button
                    onClick={() => {
                      switchRole('participant', {
                        id: 'part_001',
                        name: 'Sarah Chen',
                        email: 'sarah.chen@example.com',
                        currentProgramId: 'template-habits-21d',
                        currentProgramTitle: '21-Day Habit & Metabolic Reset'
                      });
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-[#F4F6F3] flex items-center justify-between ${
                      currentUser?.uid === 'part_001' ? 'bg-[#EBF7EE] font-semibold text-[#1B4332]' : 'text-gray-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium">Sarah Chen</div>
                      <div className="text-[10px] text-gray-500">21-Day Habit & Metabolic Reset (Day 13)</div>
                    </div>
                    {currentUser?.uid === 'part_001' && <IconCheckCircle className="w-4 h-4 text-[#2D6A4F]" />}
                  </button>

                  <button
                    onClick={() => {
                      switchRole('participant', {
                        id: 'part_002',
                        name: 'Marcus Vance',
                        email: 'marcus.v@example.com',
                        currentProgramId: 'template-fitness-6w',
                        currentProgramTitle: '6-Week Strength & Functional Mobility'
                      });
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-[#F4F6F3] flex items-center justify-between ${
                      currentUser?.uid === 'part_002' ? 'bg-[#EBF7EE] font-semibold text-[#1B4332]' : 'text-gray-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium">Marcus Vance</div>
                      <div className="text-[10px] text-gray-500">6-Week Strength & Mobility (Day 21)</div>
                    </div>
                    {currentUser?.uid === 'part_002' && <IconCheckCircle className="w-4 h-4 text-[#2D6A4F]" />}
                  </button>

                  <div className="border-t border-gray-100 my-1 pt-1">
                    {onBackToWebsite && (
                      <button
                        onClick={() => {
                          onBackToWebsite();
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-[#2D6A4F] hover:bg-[#EBF7EE] font-semibold flex items-center gap-2"
                      >
                        <IconArrowLeft className="w-3.5 h-3.5" />
                        View Marketing Website
                      </button>
                    )}
                    <button
                      onClick={handleReset}
                      className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <IconRefreshCw className="w-3.5 h-3.5 text-gray-400" />
                      Reset Demo Data
                    </button>
                    <button
                      onClick={() => {
                        signOut();
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <IconLogOut className="w-3.5 h-3.5" />
                      Sign Out / Back to Landing
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#E8EAE7] space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-[#EBF7EE] text-[#1B4332] font-semibold'
                      : 'text-[#405347] hover:bg-[#F4F6F3]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
