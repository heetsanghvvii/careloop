import React, { useState } from 'react';

export const DoctorPitchModal = ({ isOpen, onClose, onGeneratePitch, initialLead = null }) => {
  if (!isOpen) return null;

  const [doctorName, setDoctorName] = useState(initialLead?.name || 'Dr. Sneha Kulkarni');
  const [clinicName, setClinicName] = useState(initialLead?.clinicName || "Dr. Sneha's Women's Metabolic Clinic");
  const [specialty, setSpecialty] = useState(initialLead?.category || 'Metabolic Health & PCOS Dietetics');
  const [city, setCity] = useState(initialLead?.city || 'Indiranagar, Bengaluru');
  const [patientVolume, setPatientVolume] = useState(initialLead?.participantVolume || '50-100');
  const [painPoint, setPainPoint] = useState('Patients forget dietary instructions within 3 days of consultation');
  const [isResearching, setIsResearching] = useState(false);
  const [researchComplete, setResearchComplete] = useState(false);

  const specialtiesList = [
    'Metabolic Health & PCOS Dietetics',
    'Diabetes & Glycemic Management',
    'Sports Physiotherapy & Orthopedic Rehab',
    'Preventive Cardiology & Hypertension',
    'Functional Gut & Autoimmune Nutrition',
    'General Lifestyle & Preventive OPD'
  ];

  const painPointsList = [
    'Patients forget dietary instructions within 3 days of consultation',
    'Zero adherence visibility between monthly OPD appointments',
    'Patients drop off home rehabilitation exercises due to mild soreness',
    'Doctor & front-desk flooded with repetitive manual WhatsApp questions',
    'High patient drop-out rate after first consultation (no renewals)'
  ];

  const handleSimulateDeepResearch = () => {
    setIsResearching(true);
    setResearchComplete(false);
    setTimeout(() => {
      setIsResearching(false);
      setResearchComplete(true);
      // Auto-tune pain points and clinic settings
      if (specialty.includes('PCOS') || specialty.includes('Dietetics')) {
        setPainPoint('Patients forget dietary instructions within 3 days of consultation');
      } else if (specialty.includes('Diabetes')) {
        setPainPoint('Zero adherence visibility between monthly OPD appointments');
      } else if (specialty.includes('Physio') || specialty.includes('Rehab')) {
        setPainPoint('Patients drop off home rehabilitation exercises due to mild soreness');
      }
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!doctorName.trim() || !clinicName.trim()) {
      alert('Please provide doctor name and clinic name.');
      return;
    }

    onGeneratePitch({
      id: 'pitch_' + Date.now(),
      doctorName: doctorName.trim(),
      clinicName: clinicName.trim(),
      specialty,
      city: city.trim(),
      patientVolume,
      painPoint,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#18231C]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] rounded-3xl max-w-xl w-full border border-[#E8EAE7] shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#F0F2EF] pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#EBF7EE] text-[#2D6A4F] text-[11px] font-bold uppercase tracking-wider">
              👑 Founder Toolkit · Clinical Acquisition
            </div>
            <h2 className="text-xl font-extrabold text-[#18231C] mt-1.5">
              Pitch a Doctor & Onboard Practice
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Generate an instant, hyper-personalized pitch deck tailored to any clinician's exact specialty and OPD volume.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Doctor Name & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Doctor / Clinician Name *
              </label>
              <input
                type="text"
                required
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="e.g. Dr. Sneha Kulkarni"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2D6A4F] outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Clinic Location / City *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Indiranagar, Bengaluru"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2D6A4F] outline-none"
              />
            </div>
          </div>

          {/* Clinic Name */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Clinic or Hospital Name *
            </label>
            <input
              type="text"
              required
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              placeholder="e.g. Dr. Sneha's Women's Metabolic Clinic"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2D6A4F] outline-none"
            />
          </div>

          {/* Specialty Dropdown */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Clinical Specialty Focus
            </label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-[#2D6A4F] outline-none font-medium text-gray-700"
            >
              {specialtiesList.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Patient Volume & Pain Point */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Estimated Monthly Volume
              </label>
              <select
                value={patientVolume}
                onChange={(e) => setPatientVolume(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-[#2D6A4F] outline-none font-medium text-gray-700"
              >
                <option value="25-50">25-50 active clients (Starter)</option>
                <option value="50-100">50-100 active clients (Growth)</option>
                <option value="100-250+">100-250+ active clients (Scale)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Target Pain Point to Address
              </label>
              <select
                value={painPoint}
                onChange={(e) => setPainPoint(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-[#2D6A4F] outline-none font-medium text-gray-700"
              >
                {painPointsList.map((p, idx) => (
                  <option key={idx} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Simulated Web & Clinical Intelligence Probe */}
          <div className="p-3.5 rounded-2xl bg-[#F8F9F7] border border-[#E8EAE7] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#18231C] text-[11px] flex items-center gap-1.5">
                <span>🔎 Synthesize Clinical Profile & Protocol</span>
                {researchComplete && <span className="text-[#2D6A4F] font-bold">✓ Profile Ready</span>}
              </div>
              <div className="text-[10px] text-gray-500">
                Tailors protocol, drop-off stats, and clinic revenue impact to {doctorName}'s specialty.
              </div>
            </div>

            <button
              type="button"
              onClick={handleSimulateDeepResearch}
              disabled={isResearching}
              className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-[11px] font-bold text-[#2D6A4F] transition-colors"
            >
              {isResearching ? 'Analyzing...' : researchComplete ? 'Re-Analyze' : 'Analyze Specialty'}
            </button>
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-[#F0F2EF] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#2D6A4F] text-white font-bold hover:bg-[#1B4332] shadow-sm transition-colors flex items-center gap-2"
            >
              <span>Launch Hyper-Personalized Pitch Deck</span>
              <span>→</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
