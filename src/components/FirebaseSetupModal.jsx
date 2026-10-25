import React, { useState } from 'react';
import { Modal } from './Modal.jsx';
import { isConfigured, getStoredFirebaseConfig, saveCustomFirebaseConfig, clearCustomFirebaseConfig } from '../firebase/config.js';
import { IconShield, IconSparkles, IconCheckCircle, IconCopy, IconAlertCircle } from './Icons.jsx';

export const FirebaseSetupModal = ({ isOpen, onClose }) => {
  const [configJson, setConfigJson] = useState(() => {
    const existing = getStoredFirebaseConfig();
    return existing ? JSON.stringify(existing, null, 2) : '';
  });
  const [error, setError] = useState('');
  const [copiedRules, setCopiedRules] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setError('');
    try {
      const parsed = JSON.parse(configJson);
      if (!parsed.apiKey || !parsed.projectId) {
        setError('Config must contain at least "apiKey" and "projectId".');
        return;
      }
      saveCustomFirebaseConfig(parsed);
    } catch {
      setError('Invalid JSON format. Please paste the Firebase configuration object from your Firebase console.');
    }
  };

  const handleClear = () => {
    clearCustomFirebaseConfig();
  };

  const sampleConfig = `{
  "apiKey": "AIzaSyD-sampleApiKey12345",
  "authDomain": "careloop-mvp.firebaseapp.com",
  "projectId": "careloop-mvp",
  "storageBucket": "careloop-mvp.appspot.com",
  "messagingSenderId": "1234567890",
  "appId": "1:1234567890:web:abcdef123456"
}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Firebase Cloud Database & Auth Configuration"
      subtitle="Connect your free Google Firebase project for real multi-device cloud synchronization."
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Status Banner */}
        <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
          isConfigured 
            ? 'bg-[#EBF7EE] border-[#BDE8C6] text-[#1B4332]' 
            : 'bg-[#FFF9EB] border-[#FCE6B2] text-[#8C5D08]'
        }`}>
          {isConfigured ? (
            <IconCheckCircle className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-0.5" />
          ) : (
            <IconAlertCircle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
          )}
          <div className="text-sm">
            <span className="font-semibold">
              {isConfigured ? 'Live Firebase Connected' : 'Running in Zero-Setup Offline Sandbox'}
            </span>
            <p className="mt-0.5 opacity-90 text-xs leading-relaxed">
              {isConfigured 
                ? 'Careloop is actively persisting data to your Cloud Firestore database and authenticating against Google Firebase.' 
                : 'Data is securely isolated and preserved locally in your browser session. You can explore, test, and assign programs immediately without configuring external servers.'}
            </p>
          </div>
        </div>

        {/* Zero-Cost Verification */}
        <div className="bg-[#F8F9F7] rounded-xl p-4 border border-[#E8EAE7] text-xs text-[#405347] space-y-2">
          <div className="font-semibold text-[#18231C] flex items-center gap-1.5 text-sm">
            <IconShield className="w-4 h-4 text-[#2D6A4F]" />
            Free Tier (Spark Plan) - ₹0 Cost Guarantee
          </div>
          <p>
            Firebase provides a completely free Spark tier requiring <strong>no credit card</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>50,000 document reads per day</li>
            <li>20,000 document writes per day</li>
            <li>1 GB persistent Cloud Firestore storage</li>
            <li>Unlimited Google Identity Authentication</li>
          </ul>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-[#18231C] uppercase tracking-wider">
                Firebase Web App Configuration (JSON)
              </label>
              <button
                type="button"
                onClick={() => setConfigJson(sampleConfig)}
                className="text-xs text-[#2D6A4F] hover:underline"
              >
                Insert sample template
              </button>
            </div>
            <textarea
              rows={7}
              value={configJson}
              onChange={(e) => setConfigJson(e.target.value)}
              placeholder={`{\n  "apiKey": "...",\n  "authDomain": "...",\n  "projectId": "..."\n}`}
              className="w-full font-mono text-xs p-3 rounded-xl border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent bg-[#FAFAF9]"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <div>
              {isConfigured && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-rose-700 hover:text-rose-900 font-medium hover:underline"
                >
                  Disconnect & Revert to Offline Sandbox
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#2D6A4F] rounded-lg hover:bg-[#1B4332] transition-colors shadow-xs"
              >
                Save & Connect Firebase
              </button>
            </div>
          </div>
        </form>

        {/* Security Rules Helper */}
        <div className="pt-2 border-t border-[#E8EAE7]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#18231C]">
              Firestore Security Rules
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`// Refer to firestore.rules in project root`);
                setCopiedRules(true);
                setTimeout(() => setCopiedRules(false), 2000);
              }}
              className="inline-flex items-center gap-1 text-xs text-[#2D6A4F] hover:underline"
            >
              <IconCopy className="w-3.5 h-3.5" />
              {copiedRules ? 'Copied!' : 'Reference in firestore.rules'}
            </button>
          </div>
          <p className="text-xs text-[#5C6E63]">
            A complete set of production-tested, workspace-isolated Firestore security rules has been prepared in <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px]">firestore.rules</code> in this repository. Paste them directly into your Firebase Console Rules editor to enforce workspace isolation.
          </p>
        </div>
      </div>
    </Modal>
  );
};
