import React, { useState } from 'react';
import { Modal } from '../Modal.jsx';
import { IconShield, IconDownload, IconCheckCircle, IconCopy } from '../Icons.jsx';

export const ClinicQrModal = ({ isOpen, onClose, workspace }) => {
  const [copied, setCopied] = useState(false);
  const clinicName = workspace?.name || 'PeakForm Wellness Clinic';
  const doctorName = workspace?.practitionerName || 'Dr. Arjun Patel';
  const portalUrl = typeof window !== 'undefined' ? `${window.location.origin}/` : 'https://careloop.health/';

  const handleCopy = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Clinic Desk QR Stand & Prescription Card"
      subtitle="Printable patient onboarding card to keep on your clinic consultation desk."
      maxWidth="max-w-xl"
    >
      <div className="space-y-6 text-center text-xs">
        
        {/* Printable Card Area */}
        <div id="printable-clinic-card" className="p-8 rounded-3xl bg-[#FBFBFA] border-2 border-dashed border-[#2D6A4F] text-[#18231C] space-y-4 shadow-sm mx-auto max-w-md">
          
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#2D6A4F] text-white flex items-center justify-center font-bold text-xs">
              CL
            </div>
            <span className="font-extrabold text-lg tracking-tight">Careloop</span>
          </div>

          <div>
            <h3 className="font-extrabold text-lg text-[#18231C]">
              {doctorName}
            </h3>
            <p className="text-xs text-[#2D6A4F] font-semibold mt-0.5">
              {clinicName}
            </p>
          </div>

          <div className="py-2">
            {/* Clean SVG QR Code */}
            <div className="w-44 h-44 bg-white p-3 rounded-2xl border border-gray-200 mx-auto flex items-center justify-center shadow-xs">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#18231C]">
                {/* Simulated high-quality QR matrix */}
                <rect x="0" y="0" width="30" height="30" fill="currentColor" rx="4" />
                <rect x="5" y="5" width="20" height="20" fill="white" rx="2" />
                <rect x="10" y="10" width="10" height="10" fill="currentColor" rx="1" />

                <rect x="70" y="0" width="30" height="30" fill="currentColor" rx="4" />
                <rect x="75" y="5" width="20" height="20" fill="white" rx="2" />
                <rect x="80" y="10" width="10" height="10" fill="currentColor" rx="1" />

                <rect x="0" y="70" width="30" height="30" fill="currentColor" rx="4" />
                <rect x="5" y="75" width="20" height="20" fill="white" rx="2" />
                <rect x="10" y="80" width="10" height="10" fill="currentColor" rx="1" />

                <rect x="40" y="10" width="10" height="10" fill="currentColor" />
                <rect x="55" y="20" width="10" height="15" fill="currentColor" />
                <rect x="35" y="40" width="30" height="10" fill="currentColor" />
                <rect x="70" y="45" width="15" height="15" fill="currentColor" />
                <rect x="40" y="65" width="20" height="10" fill="currentColor" />
                <rect x="45" y="80" width="15" height="15" fill="currentColor" />
                <rect x="75" y="75" width="20" height="15" fill="currentColor" />
              </svg>
            </div>
            <span className="text-[10px] text-gray-500 font-mono mt-2 block">
              Scan with phone camera
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1">
            <span className="font-bold text-xs text-[#1B4332] block">
              Start Your Daily Health & Habit Protocol
            </span>
            <p className="text-[11px] text-gray-500">
              No app store download required. Opens your personalized daily checklist in seconds.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-1.5"
          >
            <IconCopy className="w-3.5 h-3.5" />
            {copied ? 'Link Copied!' : 'Copy Portal URL'}
          </button>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-medium text-gray-600 bg-white border rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial px-5 py-2 text-xs font-semibold text-white bg-[#2D6A4F] rounded-xl hover:bg-[#1B4332] transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <IconDownload className="w-3.5 h-3.5" />
              Print Clinic Stand
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
};
