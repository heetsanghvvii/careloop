import React, { useState } from 'react';
import { DoctorPitchModal } from './DoctorPitchModal.jsx';
import { DoctorPitchPresentation } from './DoctorPitchPresentation.jsx';

export const FounderDashboard = ({ 
  store, 
  onSwitchToPractitioner, 
  onSwitchToParticipant, 
  onSwitchToCoordinator, 
  onBackToWebsite,
  onSelectClinicWorkspace 
}) => {
  const [activeTab, setActiveTab] = useState('pitches'); // 'pitches' | 'clinics' | 'leads' | 'economics'
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [activePitchDeck, setActivePitchDeck] = useState(null);
  const [selectedLeadForPitch, setSelectedLeadForPitch] = useState(null);

  // Initial network clinics managed by the Careloop platform
  const [clinics, setClinics] = useState([
    {
      id: 'ws_demo_001',
      name: "Dr. Trisha's Nutrition & Metabolic Clinic",
      leadDoctor: 'Dr. Trisha Sen',
      email: 'dr.trisha@careloop.health',
      specialty: 'Clinical Dietetics & Hormonal Health / PCOS',
      plan: 'Growth (₹1,499/mo)',
      patientCount: 38,
      adherenceRate: 86,
      atRiskCount: 1,
      city: 'Indiranagar, Bengaluru',
      status: 'active'
    },
    {
      id: 'ws_clinic_peakform',
      name: 'PeakForm Performance & Sports Physio',
      leadDoctor: 'Dr. Arjun Patel',
      email: 'arjun.patel@peakform.health',
      specialty: 'Sports Physiotherapy & Orthopedic Rehab',
      plan: 'Starter (₹499/mo)',
      patientCount: 24,
      adherenceRate: 78,
      atRiskCount: 2,
      city: 'Bandra West, Mumbai',
      status: 'active'
    },
    {
      id: 'ws_clinic_apex',
      name: 'Apex Diabetes & Glycemic Care',
      leadDoctor: 'Dr. Vikram Malhotra',
      email: 'vikram.m@apexcare.in',
      specialty: 'Type 2 Diabetes & Lifestyle Medicine',
      plan: 'Growth (₹1,499/mo)',
      patientCount: 52,
      adherenceRate: 84,
      atRiskCount: 1,
      city: 'South Extension, New Delhi',
      status: 'active'
    },
    {
      id: 'ws_clinic_vitality',
      name: 'Vitality Functional Health OPD',
      leadDoctor: 'Dr. Meera Mukherjee',
      email: 'meera@vitalityopd.org',
      specialty: 'Functional Gut & Autoimmune Nutrition',
      plan: 'Starter (₹499/mo)',
      patientCount: 18,
      adherenceRate: 81,
      atRiskCount: 0,
      city: 'Jubilee Hills, Hyderabad',
      status: 'active'
    }
  ]);

  // Saved hyper-personalized doctor pitch decks
  const [savedPitches, setSavedPitches] = useState([
    {
      id: 'pitch_001',
      doctorName: 'Dr. Sneha Kulkarni',
      clinicName: "Dr. Sneha's Women's Metabolic Clinic",
      specialty: 'Metabolic Health & PCOS Dietetics',
      city: 'Indiranagar, Bengaluru',
      patientVolume: '50-100',
      painPoint: 'Patients forget dietary instructions within 3 days of consultation',
      createdAt: '2026-10-25T14:30:00Z',
      status: 'Ready to Pitch'
    },
    {
      id: 'pitch_002',
      doctorName: 'Dr. Rohan Mehta',
      clinicName: 'Mehta Orthopedic & Sports Medicine',
      specialty: 'Sports Physiotherapy & Orthopedic Rehab',
      city: 'Bandra West, Mumbai',
      patientVolume: '25-50',
      painPoint: 'Patients drop off home rehabilitation exercises due to mild soreness',
      createdAt: '2026-10-25T11:15:00Z',
      status: 'Pitched on WhatsApp'
    },
    {
      id: 'pitch_003',
      doctorName: 'Dr. Radhika Sharma',
      clinicName: 'Delhi Endocrine & Diabetes Centre',
      specialty: 'Diabetes & Glycemic Management',
      city: 'Green Park, New Delhi',
      patientVolume: '100-250+',
      painPoint: 'Zero adherence visibility between monthly OPD appointments',
      createdAt: '2026-10-24T18:00:00Z',
      status: 'Ready to Pitch'
    }
  ]);

  // Total metrics
  const totalClinics = clinics.length;
  const totalManagedPatients = clinics.reduce((acc, c) => acc + c.patientCount, 0);
  const avgAdherence = Math.round(clinics.reduce((acc, c) => acc + c.adherenceRate, 0) / clinics.length);
  const totalAtRisk = clinics.reduce((acc, c) => acc + c.atRiskCount, 0);
  const leadsCount = (store.earlyAccessSubmissions || []).length || 3;

  const handleCreatePitch = (newPitch) => {
    setSavedPitches(prev => [newPitch, ...prev]);
    setIsPitchModalOpen(false);
    setActivePitchDeck(newPitch);
  };

  const handlePitchLead = (lead) => {
    setSelectedLeadForPitch(lead);
    setIsPitchModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col text-[#18231C]">
      
      {/* Top Founder Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#18231C] text-white border-b border-black/20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand & Persona Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2D6A4F] flex items-center justify-center font-extrabold text-white text-base">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight">Careloop HQ</span>
                <span className="px-2 py-0.5 rounded-full bg-[#EBF7EE] text-[#1B4332] text-[10px] font-extrabold uppercase tracking-wider">
                  👑 Founder & Operator
                </span>
              </div>
              <p className="text-[11px] text-[#A3B18A] hidden sm:block">
                Master Business Operations & Doctor Pitch Generator
              </p>
            </div>
          </div>

          {/* Quick Actions & Role Jumpers */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setSelectedLeadForPitch(null);
                setIsPitchModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#2D6A4F] hover:bg-[#52B788] text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>+ Pitch a Doctor</span>
            </button>

            {/* Persona Switchers */}
            <div className="hidden md:flex items-center gap-1.5 bg-white/10 p-1 rounded-xl text-xs">
              <button
                onClick={onSwitchToPractitioner}
                className="px-2.5 py-1 rounded-lg hover:bg-white/10 text-gray-200 hover:text-white transition-colors"
                title="Switch to Doctor Dashboard (Dr. Trisha / Dr. Arjun)"
              >
                🩺 Doctor View
              </button>
              <button
                onClick={onSwitchToParticipant}
                className="px-2.5 py-1 rounded-lg hover:bg-white/10 text-gray-200 hover:text-white transition-colors"
                title="Switch to Patient Mobile Portal (Ananya Rao)"
              >
                📱 Patient View
              </button>
              <button
                onClick={onSwitchToCoordinator}
                className="px-2.5 py-1 rounded-lg hover:bg-white/10 text-gray-200 hover:text-white transition-colors"
                title="Switch to Clinic Care Coordinator View"
              >
                📋 Coordinator View
              </button>
            </div>

            <button
              onClick={onBackToWebsite}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-xs font-semibold transition-colors"
            >
              Exit to Website
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Banner & KPI Stats Grid */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18231C]">
                Founder Command Center
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage all clinics, generate tailored clinical pitches, and track patient adherence across the Careloop ecosystem.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2D6A4F] animate-pulse" />
              <span className="text-xs font-bold text-[#2D6A4F]">Zero-Cost Serverless Cloud Mode</span>
            </div>
          </div>

          {/* 5 KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="p-4 rounded-2xl bg-white border border-[#E8EAE7] shadow-xs">
              <div className="text-[11px] font-bold uppercase text-gray-400">Clinics Onboarded</div>
              <div className="text-2xl font-black text-[#18231C] mt-1">{totalClinics}</div>
              <div className="text-[10px] text-[#2D6A4F] font-semibold mt-0.5">Across 4 metros</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E8EAE7] shadow-xs">
              <div className="text-[11px] font-bold uppercase text-gray-400">Managed Patients</div>
              <div className="text-2xl font-black text-[#18231C] mt-1">{totalManagedPatients}</div>
              <div className="text-[10px] text-gray-500 font-semibold mt-0.5">Active cohort clients</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E8EAE7] shadow-xs">
              <div className="text-[11px] font-bold uppercase text-gray-400">Network Adherence</div>
              <div className="text-2xl font-black text-[#2D6A4F] mt-1">{avgAdherence}%</div>
              <div className="text-[10px] text-gray-500 font-semibold mt-0.5">Daily check-in rate</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E8EAE7] shadow-xs">
              <div className="text-[11px] font-bold uppercase text-gray-400">Doctor Inbound Leads</div>
              <div className="text-2xl font-black text-[#18231C] mt-1">{leadsCount}</div>
              <div className="text-[10px] text-[#2D6A4F] font-semibold mt-0.5">Website applications</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E8EAE7] shadow-xs col-span-2 lg:col-span-1">
              <div className="text-[11px] font-bold uppercase text-gray-400">Intervention Flags</div>
              <div className="text-2xl font-black text-amber-600 mt-1">{totalAtRisk}</div>
              <div className="text-[10px] text-amber-700 font-semibold mt-0.5">Patients needing support</div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="border-b border-[#E8EAE7] flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pitches')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'pitches'
                ? 'border-[#2D6A4F] text-[#1B4332]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>🎯 Hyper-Personalized Doctor Pitches</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#EBF7EE] text-[#2D6A4F] text-[10px]">
              {savedPitches.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('clinics')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'clinics'
                ? 'border-[#2D6A4F] text-[#1B4332]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>🏥 Clinic Network Directory</span>
            <span className="px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-600 text-[10px]">
              {clinics.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'leads'
                ? 'border-[#2D6A4F] text-[#1B4332]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>📥 Early Access Inbound Pipeline</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px]">
              {leadsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('economics')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'economics'
                ? 'border-[#2D6A4F] text-[#1B4332]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            📊 SaaS Unit Economics & Pricing Model
          </button>
        </div>

        {/* TAB 1: HYPER-PERSONALIZED DOCTOR PITCHES */}
        {activeTab === 'pitches' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8EAE7]">
              <div>
                <h2 className="text-base font-bold text-[#18231C]">
                  Doctor Outreach & Instant Pitch Decks
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Generate tailored, specialty-specific presentations in 10 seconds. Each deck includes customized drop-off insights, practice revenue projections, and a live WhatsApp simulator.
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedLeadForPitch(null);
                  setIsPitchModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-2 self-start sm:self-auto shrink-0"
              >
                <span>+ Pitch New Doctor</span>
              </button>
            </div>

            {/* Pitches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {savedPitches.map((pitch) => (
                <div
                  key={pitch.id}
                  className="bg-white rounded-2xl border border-[#E8EAE7] p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-[#EBF7EE] text-[#2D6A4F] text-[10px] font-bold uppercase">
                        {pitch.specialty.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {new Date(pitch.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm text-[#18231C]">{pitch.doctorName}</h3>
                      <div className="text-xs font-medium text-gray-600 mt-0.5">{pitch.clinicName}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">📍 {pitch.city}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAFAF8] border border-[#E8EAE7] text-[11px] space-y-1">
                      <div className="text-gray-500 font-semibold">Focus Pain Point:</div>
                      <div className="text-gray-700 font-medium italic">"{pitch.painPoint}"</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F0F2EF] mt-4 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActivePitchDeck(pitch)}
                      className="flex-1 py-2 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-bold transition-colors text-center"
                    >
                      Present Deck Live →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: CLINIC NETWORK DIRECTORY */}
        {activeTab === 'clinics' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-[#E8EAE7]">
              <div>
                <h2 className="text-base font-bold text-[#18231C]">
                  Careloop Multi-Clinic Network
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Inspect each clinic's active cohort, patient follow-through index, and jump into their clinical dashboard.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clinics.map((clinic) => (
                <div key={clinic.id} className="bg-white rounded-2xl border border-[#E8EAE7] p-5 space-y-4 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-bold uppercase">
                        {clinic.plan}
                      </span>
                      <h3 className="font-extrabold text-sm text-[#18231C] mt-1">{clinic.name}</h3>
                      <div className="text-xs text-gray-600">Lead Clinician: <strong>{clinic.leadDoctor}</strong></div>
                      <div className="text-[11px] text-gray-400 mt-0.5">📍 {clinic.city}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-black text-[#2D6A4F]">{clinic.adherenceRate}%</div>
                      <div className="text-[10px] text-gray-400 font-semibold">Adherence Index</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#F8F9F7] text-center text-xs">
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Patients</div>
                      <div className="font-extrabold text-[#18231C] mt-0.5">{clinic.patientCount}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">At-Risk</div>
                      <div className="font-extrabold text-amber-600 mt-0.5">{clinic.atRiskCount}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Status</div>
                      <div className="font-extrabold text-[#2D6A4F] mt-0.5 capitalize">{clinic.status}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-gray-500">Specialty: {clinic.specialty.split('/')[0]}</span>
                    <button
                      onClick={() => {
                        onSelectClinicWorkspace(clinic);
                        onSwitchToPractitioner();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#F4F6F3] hover:bg-[#EAEDE8] text-[#18231C] text-xs font-bold transition-colors"
                    >
                      Jump to Clinic Workspace →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: INBOUND DOCTOR LEADS PIPELINE */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E8EAE7]">
              <h2 className="text-base font-bold text-[#18231C]">
                Marketing Website Early Access Submissions
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Doctors, dietitians, and clinic founders who requested early access from the landing page form.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8EAE7] overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F9F7] border-b border-[#E8EAE7] text-[11px] font-bold text-gray-500 uppercase">
                  <tr>
                    <th className="p-4">Clinician Name</th>
                    <th className="p-4">Practice Focus</th>
                    <th className="p-4">Patient Volume</th>
                    <th className="p-4">Program Goals</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F2EF]">
                  {(store.earlyAccessSubmissions || [
                    {
                      id: 'lead_001',
                      name: 'Dr. Radhika Sharma',
                      email: 'dr.radhika@endocrinecare.in',
                      category: 'Diabetes & Glycemic Management',
                      participantVolume: '50-100',
                      programDescription: 'Need a way for PCOS and diabetic patients to log daily spearmint tea and post-meal walks without calling me.',
                      createdAt: '2026-10-25T10:00:00Z'
                    },
                    {
                      id: 'lead_002',
                      name: 'Dr. Rohan Mehta',
                      email: 'rohan@mumbaiortho.com',
                      category: 'Sports Physiotherapy & Orthopedic Rehab',
                      participantVolume: '25-50',
                      programDescription: 'Post-op ACL rehab adherence tracking. Patients stop doing home exercises once pain drops.',
                      createdAt: '2026-10-24T15:30:00Z'
                    },
                    {
                      id: 'lead_003',
                      name: 'Maya Lin',
                      email: 'maya@practice.health',
                      category: 'Metabolic Health & PCOS Dietetics',
                      participantVolume: '26-100',
                      programDescription: 'Anti-inflammatory metabolic routine for 40 clients.',
                      createdAt: '2026-10-24T12:00:00Z'
                    }
                  ]).map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#F8F9F7] transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-[#18231C]">{lead.name}</div>
                        <div className="text-[11px] text-gray-500">{lead.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-[#EBF7EE] text-[#2D6A4F] text-[10px] font-bold">
                          {lead.category}
                        </span>
                      </td>
                      <td className="p-4 text-gray-700 font-medium">
                        {lead.participantVolume} clients
                      </td>
                      <td className="p-4 max-w-xs text-gray-600 text-[11px] truncate" title={lead.programDescription}>
                        {lead.programDescription || 'General clinic follow-up adherence'}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handlePitchLead(lead)}
                          className="px-3 py-1.5 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-[11px] font-bold transition-colors"
                        >
                          Pitch Doctor →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SAAS UNIT ECONOMICS & PRICING MODEL */}
        {activeTab === 'economics' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E8EAE7] space-y-4">
              <h2 className="text-lg font-bold text-[#18231C]">
                Careloop Business Model & Unit Economics
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed max-w-3xl">
                Careloop is built on negative net-churn SaaS economics: as a practitioner's active patient cohort expands, they naturally upgrade their subscription tier.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-xl bg-[#F8F9F7] border border-[#E8EAE7]">
                  <div className="text-xs font-bold text-gray-500 uppercase">Starter Tier</div>
                  <div className="text-2xl font-black text-[#18231C] mt-1">₹499 <span className="text-xs font-normal text-gray-500">/ mo</span></div>
                  <p className="text-xs text-gray-600 mt-2">Up to 25 active patients. Solo trainers, early-stage dietitians.</p>
                </div>

                <div className="p-5 rounded-xl bg-[#EBF7EE] border border-[#BDE8C6]">
                  <div className="text-xs font-bold text-[#2D6A4F] uppercase">Growth Tier (Sweet Spot)</div>
                  <div className="text-2xl font-black text-[#1B4332] mt-1">₹1,499 <span className="text-xs font-normal text-gray-500">/ mo</span></div>
                  <p className="text-xs text-[#2D6A4F] mt-2">Up to 100 active patients. Established clinics, busy dietetic OPDs.</p>
                </div>

                <div className="p-5 rounded-xl bg-[#F8F9F7] border border-[#E8EAE7]">
                  <div className="text-xs font-bold text-gray-500 uppercase">Scale Tier</div>
                  <div className="text-2xl font-black text-[#18231C] mt-1">₹2,999 <span className="text-xs font-normal text-gray-500">/ mo</span></div>
                  <p className="text-xs text-gray-600 mt-2">Up to 300 active patients. Multi-coach centers & hospital departments.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAFAF8] border border-gray-200 text-xs text-gray-500 space-y-1">
                <div>* All financial figures are pilot pricing hypotheses under active market validation.</div>
                <div>* Zero additional cloud infrastructure spend guaranteed under Firebase Spark + GitHub Pages architecture.</div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Pitch Generator Modal */}
      {isPitchModalOpen && (
        <DoctorPitchModal
          isOpen={isPitchModalOpen}
          onClose={() => setIsPitchModalOpen(false)}
          onGeneratePitch={handleCreatePitch}
          initialLead={selectedLeadForPitch}
        />
      )}

      {/* Fullscreen Interactive Doctor Pitch Presentation */}
      {activePitchDeck && (
        <DoctorPitchPresentation
          pitchData={activePitchDeck}
          onClose={() => setActivePitchDeck(null)}
          onOpenClinicWorkspace={() => {
            setActivePitchDeck(null);
            onSwitchToPractitioner();
          }}
        />
      )}

    </div>
  );
};
