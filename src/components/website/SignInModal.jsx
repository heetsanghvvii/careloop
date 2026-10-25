import React, { useState } from 'react';
import { Modal } from '../Modal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { isConfigured } from '../../firebase/config.js';
import { IconCheckCircle, IconUsers, IconSparkles, IconShield } from '../Icons.jsx';

export const SignInModal = ({ isOpen, onClose, onLaunchDemo, onLaunchParticipant, onLaunchFounder, onOpenOnboarding }) => {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      onClose();
    } catch (err) {
      setError(err.message || 'Google sign-in encountered an issue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign in to Careloop"
      subtitle="Access your practitioner coaching workspace or participant portal."
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
            {error}
          </div>
        )}

        {/* Primary Google Auth Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl border border-[#D5D9D4] hover:bg-[#F4F6F3] text-[#18231C] font-semibold text-xs flex items-center justify-center gap-3 transition-colors shadow-xs"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>{loading ? 'Connecting...' : 'Continue with Google Account'}</span>
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-[#E8EAE7]"></div>
          <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-gray-400">or explore sandbox</span>
          <div className="flex-grow border-t border-[#E8EAE7]"></div>
        </div>

        {/* Demo Fast Track Options */}
        <div className="space-y-2">
          {onOpenOnboarding && (
            <button
              onClick={() => {
                onOpenOnboarding();
                onClose();
              }}
              className="w-full p-3 rounded-xl bg-[#EBF7EE] border border-[#2D6A4F] hover:bg-[#D8F3DC] text-left transition-colors flex items-center justify-between group shadow-xs"
            >
              <div>
                <div className="font-bold text-xs flex items-center gap-1.5 text-[#1B4332]">
                  🩺 Create Practice Workspace (Self-Serve)
                </div>
                <div className="text-[11px] text-[#5C6E63]">
                  Guided 3-minute setup: branding, intake questions & protocols
                </div>
              </div>
              <span className="text-xs font-bold text-[#2D6A4F] group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          )}

          {onLaunchFounder && (
            <button
              onClick={() => {
                onLaunchFounder();
                onClose();
              }}
              className="w-full p-3 rounded-xl bg-[#18231C] text-white hover:bg-[#2D6A4F] text-left transition-colors flex items-center justify-between group shadow-xs"
            >
              <div>
                <div className="font-bold text-xs flex items-center gap-1.5 text-white">
                  👑 Founder & Operator Command Center
                </div>
                <div className="text-[11px] text-[#A3B18A]">
                  Manage business metrics, lead pipeline & pitch doctors
                </div>
              </div>
              <span className="text-xs font-bold text-[#52B788] group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          )}

          <button
            onClick={() => {
              onLaunchDemo();
              onClose();
            }}
            className="w-full p-3 rounded-xl bg-[#EBF7EE] border border-[#BDE8C6] hover:bg-[#D8F3DC] text-left transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="font-bold text-xs text-[#1B4332] flex items-center gap-1.5">
                <IconSparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
                Explore Practitioner Workspace
              </div>
              <div className="text-[11px] text-[#5C6E63]">
                Preloaded with Dr. Arjun Patel & 5 demo participants
              </div>
            </div>
            <span className="text-xs font-bold text-[#2D6A4F] group-hover:translate-x-0.5 transition-transform">→</span>
          </button>

          <button
            onClick={() => {
              onLaunchParticipant();
              onClose();
            }}
            className="w-full p-3 rounded-xl bg-[#FAFAF8] border border-[#E8EAE7] hover:bg-[#F4F6F3] text-left transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="font-bold text-xs text-[#18231C] flex items-center gap-1.5">
                <IconUsers className="w-3.5 h-3.5 text-[#5C6E63]" />
                Preview Participant Portal
              </div>
              <div className="text-[11px] text-[#5C6E63]">
                Experience Sarah Chen's daily mobile checklist & streaks
              </div>
            </div>
            <span className="text-xs font-bold text-gray-400 group-hover:translate-x-0.5 transition-transform">→</span>
          </button>
        </div>

        <div className="pt-2 text-center text-[11px] text-gray-400">
          {isConfigured ? 'Connected to live Firebase Cloud database.' : 'Operating in secure offline sandbox mode.'}
        </div>
      </div>
    </Modal>
  );
};
