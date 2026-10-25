import React from 'react';
import { Modal } from '../Modal.jsx';
import { IconShield, IconLock } from '../Icons.jsx';

export const PolicyModal = ({ isOpen, onClose, policyType }) => {
  if (!isOpen) return null;

  const isPrivacy = policyType === 'privacy';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isPrivacy ? "Careloop Privacy Policy (Early Access Draft)" : "Careloop Terms of Service (Early Access Draft)"}
      subtitle="Transparent operational principles for the Careloop platform prototype."
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 text-xs text-[#405347] leading-relaxed max-h-96 overflow-y-auto pr-1">
        <div className="p-3 bg-[#EBF7EE] text-[#1B4332] rounded-xl border border-[#BDE8C6] flex items-center gap-2">
          <IconShield className="w-4 h-4 text-[#2D6A4F] shrink-0" />
          <span className="font-semibold">
            Draft Notice: This document outlines privacy and usage principles for the Careloop MVP validation prototype.
          </span>
        </div>

        {isPrivacy ? (
          <>
            <div>
              <h4 className="font-bold text-sm text-[#18231C] mb-1">1. Information Minimization Principle</h4>
              <p>
                Careloop is engineered to minimize the collection of unnecessary sensitive medical information. The platform records structured task completions, habit streaks, participant reflection notes, and contact identifiers strictly necessary to facilitate coaching workflows.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#18231C] mb-1">2. Workspace Isolation & Multi-Tenancy</h4>
              <p>
                Each practitioner workspace operates within an isolated tenant partition. Access is governed by Cloud Firestore security rules ensuring that one coaching practice can never read or query records belonging to another practice.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#18231C] mb-1">3. Participant Identity & Access</h4>
              <p>
                Participants only have access to their own assigned programs, daily task checklists, and personal completion logs. Private practitioner clinical notes are withheld from client views unless explicitly intended for sharing.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#18231C] mb-1">4. Zero Monetization of User Data</h4>
              <p>
                Careloop will never sell, lease, or broker participant or practitioner data to third-party ad networks or brokers.
              </p>
            </div>
          </>
        ) : (
          <>
            <div>
              <h4 className="font-bold text-sm text-[#18231C] mb-1">1. Non-Medical Platform Disclaimer</h4>
              <p>
                Careloop is a configurable habit and adherence management SaaS. It does not provide medical diagnosis, therapeutic treatment, or clinical intervention. Practitioners are solely responsible for ensuring their assigned routines conform to their professional scope of practice and local regulations.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#18231C] mb-1">2. Early Access & Prototype Nature</h4>
              <p>
                Careloop is currently provided as an early validation prototype. Pricing ladders (Starter, Growth, Scale) reflect hypotheses for market validation and do not constitute billing contracts until public commercial launch.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#18231C] mb-1">3. Acceptable Use</h4>
              <p>
                Practitioners agree not to use Careloop to distribute harmful, fraudulent, or unsafe health protocols. Careloop reserves the right to suspend workspaces in violation of ethical standards.
              </p>
            </div>
          </>
        )}

        <div className="pt-4 border-t border-[#F0F2EF] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2D6A4F] text-white text-xs font-semibold rounded-lg hover:bg-[#1B4332]"
          >
            I Understand
          </button>
        </div>
      </div>
    </Modal>
  );
};
