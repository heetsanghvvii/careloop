import React, { useState } from 'react';
import { 
  IconCheckCircle, 
  IconUsers, 
  IconSparkles, 
  IconShield, 
  IconArrowLeft,
  IconFlame,
  IconClock,
  IconMessageSquare
} from '../Icons.jsx';
import { DEFAULT_PROGRAM_TEMPLATES } from '../../data/programTemplates.js';

export const COLOR_THEMES = [
  { id: 'forest', name: 'Forest Emerald', hex: '#2D6A4F', bgLight: '#EBF7EE', border: '#BDE8C6' },
  { id: 'indigo', name: 'Royal Indigo', hex: '#1E3A8A', bgLight: '#EFF6FF', border: '#BFDBFE' },
  { id: 'teal', name: 'Clinical Teal', hex: '#0F766E', bgLight: '#F0FDFA', border: '#99F6E4' },
  { id: 'plum', name: 'Deep Plum', hex: '#701A75', bgLight: '#FDF4FF', border: '#F5D0FE' },
  { id: 'ochre', name: 'Sunset Ochre', hex: '#B45309', bgLight: '#FFFBEB', border: '#FDE68A' }
];

export const SPECIALTY_OPTIONS = [
  'Clinical Nutrition & Diabetes Reversal',
  'PCOS & Hormonal Health',
  'Functional Gut Health & Microbiome',
  'Sports Nutrition & Body Recomposition',
  'Cardiometabolic & Hypertension Management',
  'Integrative Lifestyle Medicine'
];

export const STANDARD_INTAKE_QUESTIONS = [
  { id: 'q_water', label: 'Daily Water Hydration Target (e.g. 2.5 - 3 Liters)', defaultSelected: true },
  { id: 'q_goal', label: 'Primary Health & Metabolic Objective', defaultSelected: true },
  { id: 'q_diet', label: 'Dietary Pattern (Veg / Non-Veg / Vegan / Jain)', defaultSelected: true },
  { id: 'q_schedule', label: 'Typical Morning Wake-Up & Bedtime Window', defaultSelected: false },
  { id: 'q_meds', label: 'Current Medications, Supplements or Known Allergies', defaultSelected: true },
  { id: 'q_activity', label: 'Current Physical Activity Level & Sedentary Hours', defaultSelected: false }
];

export const DoctorSelfServeOnboarding = ({ onBack, onCompleteWorkspace }) => {
  // Step 1: Practice Profile
  const [doctorName, setDoctorName] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [specialty, setSpecialty] = useState(SPECIALTY_OPTIONS[0]);
  const [phone, setPhone] = useState('');

  // Step 2: Branding Choices
  const [brandColor, setBrandColor] = useState(COLOR_THEMES[0].hex);
  const [tagline, setTagline] = useState('Transforming metabolic health through daily disciplined follow-through.');
  const [avatarEmoji, setAvatarEmoji] = useState('🩺');

  // Step 3: Intake Questions
  const [selectedIntakeQuestions, setSelectedIntakeQuestions] = useState([
    'q_water', 'q_goal', 'q_diet', 'q_meds'
  ]);
  const [customIntakeQuestion, setCustomIntakeQuestion] = useState('');

  // Step 4: Program Templates
  const [selectedTemplates, setSelectedTemplates] = useState([
    'template-habits-21d',
    'template-diabetes-india-30d',
    'template-pcos-india-28d'
  ]);

  // Step 5: Follow-Up Rules
  const [inactivityDays, setInactivityDays] = useState(3);
  const [riskThresholdPercent, setRiskThresholdPercent] = useState(60);
  const [nudgeTime, setNudgeTime] = useState('08:00 AM');
  const [allowSkipDays, setAllowSkipDays] = useState(true);

  // Validation Errors
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeTheme = COLOR_THEMES.find(t => t.hex === brandColor) || COLOR_THEMES[0];

  const handleToggleIntakeQuestion = (id) => {
    if (selectedIntakeQuestions.includes(id)) {
      setSelectedIntakeQuestions(selectedIntakeQuestions.filter(q => q !== id));
    } else {
      setSelectedIntakeQuestions([...selectedIntakeQuestions, id]);
    }
  };

  const handleToggleTemplate = (id) => {
    if (selectedTemplates.includes(id)) {
      setSelectedTemplates(selectedTemplates.filter(t => t !== id));
    } else {
      setSelectedTemplates([...selectedTemplates, id]);
    }
  };

  const validateForm = () => {
    const errors = {};

    // 1. Practice Profile
    if (!doctorName || doctorName.trim().length < 3) {
      errors.doctorName = 'Doctor full name is required (minimum 3 characters).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!doctorEmail || !emailRegex.test(doctorEmail.trim())) {
      errors.doctorEmail = 'A valid professional email address is required.';
    }
    if (!clinicName || clinicName.trim().length < 3) {
      errors.clinicName = 'Clinic or practice name is required (minimum 3 characters).';
    }
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (!phone || !phoneRegex.test(cleanPhone)) {
      errors.phone = 'A valid 10 to 15 digit WhatsApp contact number is required.';
    }
    if (!specialty) {
      errors.specialty = 'Clinical specialty must be selected.';
    }

    // 2. Branding Choices
    if (!tagline || tagline.trim().length < 5) {
      errors.tagline = 'A clinic welcome tagline is required (minimum 5 characters).';
    }
    if (!brandColor) {
      errors.brandColor = 'Please choose a brand accent theme color.';
    }

    // 3. Intake Questions
    if (selectedIntakeQuestions.length < 2) {
      errors.intakeQuestions = 'Please select at least 2 patient intake questions for your onboarding workflow.';
    }

    // 4. Starter Program Templates
    if (selectedTemplates.length < 1) {
      errors.templates = 'Please select at least one starter program template to initialize your workspace.';
    }

    // 5. Follow-Up Rules
    const parsedInactivity = parseInt(inactivityDays, 10);
    if (isNaN(parsedInactivity) || parsedInactivity < 1 || parsedInactivity > 14) {
      errors.inactivityDays = 'Inactivity threshold must be an integer between 1 and 14 days.';
    }
    const parsedRisk = parseInt(riskThresholdPercent, 10);
    if (isNaN(parsedRisk) || parsedRisk < 10 || parsedRisk > 90) {
      errors.riskThresholdPercent = 'Adherence risk threshold must be an integer between 10% and 90%.';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setValidationErrors({});
    setIsSubmitting(true);

    try {
      const workspacePayload = {
        doctorName: doctorName.trim(),
        doctorEmail: doctorEmail.trim(),
        clinicName: clinicName.trim(),
        specialty,
        phone: phone.trim(),
        brandColor,
        tagline: tagline.trim(),
        avatarEmoji,
        intakeQuestions: [
          ...selectedIntakeQuestions.map(qId => {
            const found = STANDARD_INTAKE_QUESTIONS.find(sq => sq.id === qId);
            return found ? found.label : qId;
          }),
          ...(customIntakeQuestion.trim() ? [customIntakeQuestion.trim()] : [])
        ],
        selectedTemplates,
        inactivityDays: parseInt(inactivityDays, 10),
        riskThresholdPercent: parseInt(riskThresholdPercent, 10),
        nudgeTime,
        allowSkipDays
      };

      await onCompleteWorkspace(workspacePayload);
    } catch (err) {
      setValidationErrors({ submit: err.message || 'Workspace initialization failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#18231C] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E8EAE7]">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
              title="Return to Marketing Website"
            >
              <IconArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-[#18231C]">
                  Self-Serve Doctor Onboarding
                </span>
                <span className="text-[10px] font-bold text-[#2D6A4F] bg-[#EBF7EE] px-2 py-0.5 rounded-full border border-[#D8F3DC]">
                  Zero-Code Setup
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Configure your practice workspace in 3 minutes. Automatic initialization with zero manual setup.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
            <span>₹0 Setup Fee</span>
            <span>•</span>
            <span>Isolated Multi-Tenant Storage</span>
          </div>
        </div>

        {/* Validation Error Banner */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs animate-in fade-in space-y-1">
            <div className="font-bold flex items-center gap-2">
              <span>⚠️ Configuration Incomplete: Please fix the following explicit errors:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 pl-2 text-[11px] text-rose-700">
              {Object.entries(validationErrors).map(([key, msg]) => (
                <li key={key}><strong>{key}</strong>: {msg}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 2-Column Layout: Form Left (7 Cols), Live Preview Right (5 Cols) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT FORM (7 Columns) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8 text-left">
            
            {/* Section 1: Practice Profile */}
            <div className="p-6 bg-white rounded-3xl border border-[#E8EAE7] shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="w-6 h-6 rounded-lg bg-[#EBF7EE] text-[#2D6A4F] flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <h3 className="font-extrabold text-sm text-[#18231C]">
                  Practice & Clinician Profile
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Doctor Full Name *
                  </label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="e.g. Dr. Priya Sharma"
                    className={`w-full p-2.5 rounded-xl border ${
                      validationErrors.doctorName ? 'border-rose-400 bg-rose-50/30' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-xs`}
                  />
                  {validationErrors.doctorName && (
                    <span className="text-[10px] text-rose-600 mt-1 block">{validationErrors.doctorName}</span>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Professional Email *
                  </label>
                  <input
                    type="email"
                    value={doctorEmail}
                    onChange={(e) => setDoctorEmail(e.target.value)}
                    placeholder="dr.priya@metabolic.health"
                    className={`w-full p-2.5 rounded-xl border ${
                      validationErrors.doctorEmail ? 'border-rose-400 bg-rose-50/30' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-xs`}
                  />
                  {validationErrors.doctorEmail && (
                    <span className="text-[10px] text-rose-600 mt-1 block">{validationErrors.doctorEmail}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Clinic / Practice Name *
                  </label>
                  <input
                    type="text"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    placeholder="e.g. Sanjeevani Metabolic Clinic"
                    className={`w-full p-2.5 rounded-xl border ${
                      validationErrors.clinicName ? 'border-rose-400 bg-rose-50/30' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-xs`}
                  />
                  {validationErrors.clinicName && (
                    <span className="text-[10px] text-rose-600 mt-1 block">{validationErrors.clinicName}</span>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Clinic WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+919876543210"
                    className={`w-full p-2.5 rounded-xl border ${
                      validationErrors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-xs`}
                  />
                  {validationErrors.phone && (
                    <span className="text-[10px] text-rose-600 mt-1 block">{validationErrors.phone}</span>
                  )}
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-bold text-gray-700 mb-1">
                  Clinical Specialty / Focus *
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-xs font-medium"
                >
                  {SPECIALTY_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section 2: Branding Choices */}
            <div className="p-6 bg-white rounded-3xl border border-[#E8EAE7] shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="w-6 h-6 rounded-lg bg-[#EBF7EE] text-[#2D6A4F] flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <h3 className="font-extrabold text-sm text-[#18231C]">
                  Branding & Visual Customization
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <label className="block font-bold text-gray-700">
                  Clinic Brand Accent Color *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {COLOR_THEMES.map(theme => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setBrandColor(theme.hex)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        brandColor === theme.hex 
                          ? 'ring-2 ring-offset-2 ring-black font-bold shadow-xs' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ backgroundColor: theme.bgLight }}
                    >
                      <div 
                        className="w-5 h-5 rounded-full mx-auto mb-1.5 shadow-xs" 
                        style={{ backgroundColor: theme.hex }}
                      />
                      <span className="text-[11px] block text-[#18231C]">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">
                    Clinic Welcome Tagline *
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Transforming metabolic health through daily discipline."
                    className={`w-full p-2.5 rounded-xl border ${
                      validationErrors.tagline ? 'border-rose-400 bg-rose-50/30' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-xs`}
                  />
                  {validationErrors.tagline && (
                    <span className="text-[10px] text-rose-600 mt-1 block">{validationErrors.tagline}</span>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Clinic Avatar Emoji
                  </label>
                  <div className="flex gap-2">
                    {['🩺', '🌿', '🧬', '🍎', '🥗'].map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setAvatarEmoji(emoji)}
                        className={`w-10 h-10 rounded-xl border text-lg flex items-center justify-center transition-all ${
                          avatarEmoji === emoji ? 'border-black bg-gray-100 ring-1 ring-black' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Patient Intake Questions */}
            <div className="p-6 bg-white rounded-3xl border border-[#E8EAE7] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#EBF7EE] text-[#2D6A4F] flex items-center justify-center font-bold text-xs">
                    3
                  </span>
                  <h3 className="font-extrabold text-sm text-[#18231C]">
                    Patient Intake Questions ({selectedIntakeQuestions.length} selected)
                  </h3>
                </div>
                <span className="text-[11px] text-gray-400">Min. 2 required</span>
              </div>

              {validationErrors.intakeQuestions && (
                <div className="text-[11px] text-rose-600 font-semibold">{validationErrors.intakeQuestions}</div>
              )}

              <div className="space-y-2 text-xs">
                {STANDARD_INTAKE_QUESTIONS.map(q => {
                  const isChecked = selectedIntakeQuestions.includes(q.id);
                  return (
                    <label 
                      key={q.id}
                      onClick={() => handleToggleIntakeQuestion(q.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        isChecked ? 'bg-[#EBF7EE]/60 border-[#BDE8C6] text-[#1B4332]' : 'bg-[#FAFAF8] border-gray-200 text-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded text-[#2D6A4F] focus:ring-[#2D6A4F]"
                      />
                      <span className="font-medium text-xs">{q.label}</span>
                    </label>
                  );
                })}
              </div>

              <div className="pt-2 text-xs">
                <label className="block font-bold text-gray-700 mb-1">
                  Optional Custom Intake Question
                </label>
                <input
                  type="text"
                  value={customIntakeQuestion}
                  onChange={(e) => setCustomIntakeQuestion(e.target.value)}
                  placeholder="e.g. Do you have regular access to a home blood pressure monitor?"
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-xs"
                />
              </div>
            </div>

            {/* Section 4: Starter Program Templates */}
            <div className="p-6 bg-white rounded-3xl border border-[#E8EAE7] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#EBF7EE] text-[#2D6A4F] flex items-center justify-center font-bold text-xs">
                    4
                  </span>
                  <h3 className="font-extrabold text-sm text-[#18231C]">
                    Starter Protocols ({selectedTemplates.length} selected)
                  </h3>
                </div>
                <span className="text-[11px] text-gray-400">Min. 1 required</span>
              </div>

              {validationErrors.templates && (
                <div className="text-[11px] text-rose-600 font-semibold">{validationErrors.templates}</div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {DEFAULT_PROGRAM_TEMPLATES.map(t => {
                  const isChecked = selectedTemplates.includes(t.id);
                  return (
                    <div 
                      key={t.id}
                      onClick={() => handleToggleTemplate(t.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-[#EBF7EE]/60 border-[#2D6A4F] shadow-xs ring-1 ring-[#2D6A4F]' 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-[#18231C]">{t.title}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-[#2D6A4F] focus:ring-[#2D6A4F] mt-0.5"
                        />
                      </div>
                      <span className="text-[10px] text-[#2D6A4F] font-bold block mt-1 uppercase">
                        {t.category} • {t.durationDays} Days
                      </span>
                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                        {t.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 5: Follow-Up & Adherence Rules */}
            <div className="p-6 bg-white rounded-3xl border border-[#E8EAE7] shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="w-6 h-6 rounded-lg bg-[#EBF7EE] text-[#2D6A4F] flex items-center justify-center font-bold text-xs">
                  5
                </span>
                <h3 className="font-extrabold text-sm text-[#18231C]">
                  Follow-Up & Clinical Inactivity Rules
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Inactivity Risk Flag *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="14"
                      value={inactivityDays}
                      onChange={(e) => setInactivityDays(e.target.value)}
                      className="w-20 p-2.5 rounded-xl border border-gray-200 text-center font-bold text-xs"
                    />
                    <span className="text-gray-500 text-[11px]">days without log</span>
                  </div>
                  {validationErrors.inactivityDays && (
                    <span className="text-[10px] text-rose-600 mt-1 block">{validationErrors.inactivityDays}</span>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Adherence Alert Bar *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="10"
                      max="90"
                      value={riskThresholdPercent}
                      onChange={(e) => setRiskThresholdPercent(e.target.value)}
                      className="w-20 p-2.5 rounded-xl border border-gray-200 text-center font-bold text-xs"
                    />
                    <span className="text-gray-500 text-[11px]">% min completion</span>
                  </div>
                  {validationErrors.riskThresholdPercent && (
                    <span className="text-[10px] text-rose-600 mt-1 block">{validationErrors.riskThresholdPercent}</span>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Morning Check-in Time
                  </label>
                  <select
                    value={nudgeTime}
                    onChange={(e) => setNudgeTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-xs font-medium"
                  >
                    <option value="07:00 AM">07:00 AM</option>
                    <option value="08:00 AM">08:00 AM (Recommended)</option>
                    <option value="09:00 AM">09:00 AM</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F9F7] border border-[#E8EAE7] cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={allowSkipDays}
                    onChange={(e) => setAllowSkipDays(e.target.checked)}
                    className="rounded text-[#2D6A4F] focus:ring-[#2D6A4F]"
                  />
                  <div>
                    <span className="font-bold text-[#18231C] block">Permit Guilt-Free Rest Days (SKIP check-ins)</span>
                    <span className="text-[11px] text-gray-500 block">
                      Patients who log a rest day do not break their consistency streak.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                style={{ backgroundColor: brandColor }}
              >
                <IconSparkles className="w-5 h-5" />
                <span>
                  {isSubmitting ? 'Synthesizing Your Isolated Workspace...' : 'Generate My Practice Workspace Now →'}
                </span>
              </button>
              <p className="text-center text-[11px] text-gray-400 mt-2">
                Self-serve initialization runs automatically in client store. Zero manual owner intervention required.
              </p>
            </div>

          </form>

          {/* RIGHT LIVE PREVIEW PANEL (5 Columns) */}
          <div className="lg:col-span-5 sticky top-8 space-y-5 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F] bg-[#EBF7EE] px-3 py-1 rounded-full border border-[#D8F3DC]">
                Real-Time Live Preview
              </span>
              <span className="text-[11px] text-gray-400">Updates live as you type</span>
            </div>

            {/* Preview 1: Doctor Workspace Banner */}
            <div className="rounded-2xl p-5 text-white shadow-sm transition-all" style={{ backgroundColor: brandColor }}>
              <div className="flex items-center gap-2 text-xs opacity-90 mb-2">
                <span>{avatarEmoji}</span>
                <span className="font-bold">{clinicName || 'Your Clinic Name'}</span>
                <span>•</span>
                <span className="text-[10px]">{specialty.split(' ')[0]}</span>
              </div>
              <h4 className="text-lg font-extrabold">
                Welcome back, {doctorName || 'Doctor'}
              </h4>
              <p className="text-xs opacity-85 mt-1 line-clamp-2">
                {tagline || 'Clinic welcome tagline'}
              </p>
              <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-[11px]">
                <span>Inactivity alert: ≥ {inactivityDays} days</span>
                <span>Adherence floor: {riskThresholdPercent}%</span>
              </div>
            </div>

            {/* Preview 2: Patient Mobile Portal Card */}
            <div className="bg-white p-5 rounded-2xl border border-[#E8EAE7] shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">
                  Patient Mobile Checklist View
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: brandColor }}>
                  Branded Portal
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-[#18231C] block">Ananya Rao</span>
                  <span className="text-[10px] text-gray-500 block">
                    {clinicName || 'Your Clinic'} • Day 1
                  </span>
                </div>
                <div className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: brandColor }}>
                  🔥 1d streak
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="p-2.5 rounded-lg border border-gray-200 flex items-center justify-between bg-white">
                  <span>💧 500ml Morning Hydration</span>
                  <span className="text-emerald-700 font-bold text-[10px]">✓ Done</span>
                </div>
                <div className="p-2.5 rounded-lg border border-gray-200 flex items-center justify-between bg-white">
                  <span>🚶 20-min Sunlight Walk</span>
                  <span className="text-gray-400 text-[10px]">Pending</span>
                </div>
              </div>
            </div>

            {/* Preview 3: Simulated WhatsApp Welcome Prompt */}
            <div className="p-4 rounded-2xl bg-[#EBF7EE] border border-[#BDE8C6] space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#1B4332]">
                <IconMessageSquare className="w-4 h-4 text-[#2D6A4F]" />
                <span>WhatsApp Morning Prompt ({nudgeTime})</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#D8F3DC] text-[11px] text-gray-700 font-mono leading-relaxed whitespace-pre-line shadow-xs">
                {`🌿 Good morning! ${doctorName || 'Your Doctor'} from ${clinicName || 'Your Clinic'}.\n\nHere are your daily tasks for today:\n• Morning Hydration & Light\n• Daily Activity Goal\n\nReply "DONE" when finished or "HELP" if you need guidance!`}
              </div>
            </div>

            {/* Preview 4: Clinic Desk Stand Card */}
            <div className="p-4 rounded-2xl bg-white border border-[#E8EAE7] flex items-center gap-3 text-xs">
              <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-xl shrink-0">
                {avatarEmoji}
              </div>
              <div>
                <span className="font-extrabold text-xs text-[#18231C] block">
                  {clinicName || 'Clinic Desk QR Stand'}
                </span>
                <span className="text-[10px] text-gray-400 block">
                  {selectedIntakeQuestions.length} patient intake questions active
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
