import React, { useEffect } from 'react';
import { IconXCircle } from './Icons.jsx';

export const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#0F1E17]/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className={`relative transform overflow-hidden rounded-2xl bg-[#FFFFFF] text-left shadow-2xl transition-all sm:my-8 w-full ${maxWidth} border border-[#E8EAE7] animate-in zoom-in-95 duration-200`}>
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[#F0F2EF] px-6 py-5 bg-[#FAFAF8]">
            <div>
              <h3 className="text-lg font-semibold text-[#18231C]">
                {title}
              </h3>
              {subtitle && (
                <p className="mt-1 text-sm text-[#5C6E63]">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-[#F0F2EF] hover:text-[#18231C] transition-colors"
            >
              <span className="sr-only">Close</span>
              <IconXCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
