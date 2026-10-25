import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import { dataService } from './firebase/dataService.js';
import { WorkspaceNav as Navbar } from './components/design/WorkspaceNav.jsx';
import { GymWorkspace } from './components/design/GymWorkspace.jsx';
import './components/design/workspace.css';
import { OfficialWebsite } from './components/website/OfficialWebsite.jsx';
import { FirebaseSetupModal } from './components/FirebaseSetupModal.jsx';

// Practitioner Tabs
import { WorkspaceHome as Dashboard } from './components/design/WorkspaceHome.jsx';
import { ParticipantList } from './components/practitioner/ParticipantList.jsx';
import { ParticipantDetailModal } from './components/practitioner/ParticipantDetailModal.jsx';
import { AddParticipantModal } from './components/practitioner/AddParticipantModal.jsx';
import { ProgramList } from './components/practitioner/ProgramList.jsx';
import { ProgramBuilder } from './components/practitioner/ProgramBuilder.jsx';
import { AssignProgramModal } from './components/practitioner/AssignProgramModal.jsx';
import { Analytics } from './components/practitioner/Analytics.jsx';
import { RemindersSimulation } from './components/practitioner/RemindersSimulation.jsx';
import { PricingSettings } from './components/practitioner/PricingSettings.jsx';
import { WhatsAppLab } from './components/practitioner/WhatsAppLab.jsx';
import { ClinicQrModal } from './components/practitioner/ClinicQrModal.jsx';
import { PitchDeck } from './components/deck/PitchDeck.jsx';

// Founder & Operator Experience
import { FounderDashboard } from './components/founder/FounderDashboard.jsx';

// Participant Experience
import { ParticipantPortal } from './components/participant/ParticipantPortal.jsx';

export default function App() {
  const { currentUser, signInAsFounder, signInAsDemoPractitioner, signInAsCoordinator, signInAsParticipant, switchRole, signOut } = useAuth();

  // Primary View Mode: 'website' (Official Marketing Website) vs 'app' (Practitioner/Participant Workspace)
  const [currentView, setCurrentView] = useState('website');

  // Active navigation tab within practitioner dashboard
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modals state
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [isAddParticipantModalOpen, setIsAddParticipantModalOpen] = useState(false);
  const [isProgramBuilderOpen, setIsProgramBuilderOpen] = useState(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);
  const [isClinicQrOpen, setIsClinicQrOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [assigningProgramTarget, setAssigningProgramTarget] = useState(null);

  // Live Data Store State
  const [store, setStore] = useState({
    workspace: null,
    participants: [],
    programs: [],
    taskCompletions: [],
    simulatedReminders: []
  });

  // Subscribe to real-time data
  useEffect(() => {
    const unsub = dataService.subscribe((data) => {
      setStore({
        workspace: data.workspace,
        participants: data.participants,
        programs: data.programs,
        taskCompletions: data.taskCompletions,
        simulatedReminders: data.simulatedReminders
      });

      // Keep selected participant reference updated
      if (selectedParticipant) {
        const updated = data.participants.find(p => p.id === selectedParticipant.id);
        if (updated) setSelectedParticipant(updated);
      }
    });

    return unsub;
  }, [selectedParticipant]);

  // Handler functions
  const handleLaunchFounderMode = () => {
    signInAsFounder();
    setCurrentView('app');
  };

  const handleSelectClinicWorkspace = async (clinic) => {
    const wsId = clinic.id || 'ws_demo_001';
    await dataService.updateWorkspace(wsId, {
      id: wsId,
      name: clinic.name,
      practitionerName: clinic.leadDoctor,
      practitionerEmail: clinic.email,
      category: clinic.specialty,
      plan: clinic.plan.split(' ')[0]
    });
  };

  const handleLaunchDemoPractitioner = () => {
    signInAsDemoPractitioner();
    setCurrentView('app');
    setActiveTab('dashboard');
  };

  const handleLaunchDemoParticipant = () => {
    const sarah = store.participants.find(p => p.id === 'part_001') || {
      id: 'part_001',
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      currentProgramId: 'template-habits-21d',
      currentProgramTitle: '21-Day Habit & Metabolic Reset'
    };
    signInAsParticipant(sarah);
    setCurrentView('app');
  };

  const handleAddParticipant = async (participantData) => {
    const wsId = store.workspace?.id || 'ws_demo_001';
    return await dataService.addParticipant(wsId, participantData);
  };

  const handleUpdateParticipant = async (participantId, updates) => {
    const wsId = store.workspace?.id || 'ws_demo_001';
    return await dataService.updateParticipant(wsId, participantId, updates);
  };

  const handleArchiveParticipant = async (participantId) => {
    const wsId = store.workspace?.id || 'ws_demo_001';
    return await dataService.archiveParticipant(wsId, participantId);
  };

  const handleSaveProgram = async (programData) => {
    const wsId = store.workspace?.id || 'ws_demo_001';
    if (programData.id) {
      return await dataService.updateProgram(wsId, programData.id, programData);
    } else {
      return await dataService.createProgram(wsId, programData);
    }
  };

  const handleDuplicateProgram = async (programId) => {
    const wsId = store.workspace?.id || 'ws_demo_001';
    return await dataService.duplicateProgram(wsId, programId);
  };

  const handleDeleteProgram = async (programId) => {
    const wsId = store.workspace?.id || 'ws_demo_001';
    if (window.confirm('Archive this program from your workspace?')) {
      return await dataService.deleteProgram(wsId, programId);
    }
  };

  const handleCloneTemplate = async (template) => {
    const wsId = store.workspace?.id || 'ws_demo_001';
    const cloned = await dataService.createProgram(wsId, {
      title: template.title,
      category: template.category,
      durationDays: template.durationDays,
      description: template.description,
      guidelines: template.guidelines,
      tasks: template.tasks,
      isTemplate: false
    });
    alert(`Cloned "${cloned.title}" into your workspace programs!`);
  };

  const handleAssignProgram = async (participantId, programId) => {
    const wsId = store.workspace?.id || 'ws_demo_001';
    return await dataService.assignProgram(wsId, participantId, programId);
  };

  const handleRecordCompletion = async (participantId, taskId, date, status, note) => {
    const wsId = store.workspace?.id || 'ws_demo_001';
    return await dataService.recordTaskCompletion(wsId, participantId, taskId, date, status, note);
  };

  const handleAddReminder = async (reminderData) => {
    const wsId = store.workspace?.id || 'ws_demo_001';
    return await dataService.addSimulatedReminder(wsId, reminderData);
  };

  const handleSimulateReply = async (reminderId, replyType) => {
    const wsId = store.workspace?.id || 'ws_demo_001';
    return await dataService.simulateReminderReply(wsId, reminderId, replyType);
  };

  const handleUpdatePlan = async (targetPlan) => {
    const wsId = store.workspace?.id || 'ws_demo_001';
    return await dataService.updateWorkspace(wsId, { plan: targetPlan });
  };

  // --- VIEW 1: OFFICIAL MARKETING WEBSITE ---
  if (currentView === 'website' || !currentUser) {
    return (
      <>
        <OfficialWebsite
          onExploreDemo={handleLaunchDemoPractitioner}
          onLaunchParticipant={handleLaunchDemoParticipant}
          onLaunchFounder={handleLaunchFounderMode}
          onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
          onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
        />
        <FirebaseSetupModal
          isOpen={isFirebaseModalOpen}
          onClose={() => setIsFirebaseModalOpen(false)}
        />
        {isPitchDeckOpen && (
          <PitchDeck
            onClose={() => setIsPitchDeckOpen(false)}
            onLaunchDemo={handleLaunchDemoPractitioner}
          />
        )}
      </>
    );
  }

  // --- VIEW 0: FOUNDER & OPERATOR COMMAND CENTER ---
  if (currentUser.role === 'founder') {
    return (
      <FounderDashboard
        store={store}
        onSwitchToPractitioner={() => {
          switchRole('practitioner');
          setActiveTab('dashboard');
        }}
        onSwitchToParticipant={() => {
          switchRole('participant');
        }}
        onSwitchToCoordinator={() => {
          switchRole('coordinator');
          setActiveTab('participants');
        }}
        onBackToWebsite={() => setCurrentView('website')}
        onSelectClinicWorkspace={handleSelectClinicWorkspace}
      />
    );
  }

  // --- VIEW 2: PARTICIPANT MOBILE PORTAL ---
  if (currentUser.role === 'participant') {
    const activeParticipantData = store.participants.find(p => p.id === currentUser.uid || p.email === currentUser.email) || currentUser.participantData;
    const assignedProgram = store.programs.find(p => p.id === activeParticipantData?.currentProgramId);

    return (
      <ParticipantPortal
        participant={activeParticipantData}
        program={assignedProgram}
        completions={store.taskCompletions}
        onRecordCompletion={handleRecordCompletion}
        onBackToPractitioner={() => setCurrentView('website')}
      />
    );
  }

  // --- VIEW 3: PRACTITIONER DASHBOARD & WORKSPACE ---
  return (
    <div className="cl-workspace min-h-screen bg-[#FBFBFA] flex flex-col text-[#1E2922]">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
        onBackToWebsite={() => setCurrentView('website')}
        onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
        onOpenClinicQr={() => setIsClinicQrOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            workspace={store.workspace}
            participants={store.participants}
            programs={store.programs}
            completions={store.taskCompletions}
            onNavigateTab={setActiveTab}
            onOpenAddParticipant={() => setIsAddParticipantModalOpen(true)}
            onOpenCreateProgram={() => {
              setEditingProgram(null);
              setIsProgramBuilderOpen(true);
            }}
            onSelectParticipant={setSelectedParticipant}
          />
        )}

        {activeTab === 'gym' && <GymWorkspace participants={store.participants} />}

        {activeTab === 'participants' && (
          <ParticipantList
            participants={store.participants}
            workspace={store.workspace}
            onOpenAddModal={() => setIsAddParticipantModalOpen(true)}
            onSelectParticipant={setSelectedParticipant}
          />
        )}

        {activeTab === 'programs' && (
          <ProgramList
            programs={store.programs}
            onOpenCreateModal={() => {
              setEditingProgram(null);
              setIsProgramBuilderOpen(true);
            }}
            onEditProgram={(prog) => {
              setEditingProgram(prog);
              setIsProgramBuilderOpen(true);
            }}
            onDuplicateProgram={handleDuplicateProgram}
            onDeleteProgram={handleDeleteProgram}
            onOpenAssignModal={setAssigningProgramTarget}
            onCloneTemplate={handleCloneTemplate}
          />
        )}

        {activeTab === 'whatsapp_lab' && (
          <WhatsAppLab
            participants={store.participants}
            onRecordCompletion={handleRecordCompletion}
          />
        )}

        {activeTab === 'analytics' && (
          <Analytics
            workspace={store.workspace}
            participants={store.participants}
            programs={store.programs}
            completions={store.taskCompletions}
          />
        )}

        {activeTab === 'reminders' && (
          <RemindersSimulation
            reminders={store.simulatedReminders}
            participants={store.participants}
            onAddReminder={handleAddReminder}
            onSimulateReply={handleSimulateReply}
          />
        )}

        {activeTab === 'pricing' && (
          <PricingSettings
            workspace={store.workspace}
            participants={store.participants}
            onUpdatePlan={handleUpdatePlan}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E8EAE7] py-6 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#18231C]">Careloop Workspace</span>
            <span className="text-gray-300">•</span>
            <button 
              onClick={() => setCurrentView('website')}
              className="text-[#2D6A4F] hover:underline font-semibold"
            >
              ← Back to Marketing Website
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsFirebaseModalOpen(true)}
              className="text-[#2D6A4F] hover:underline font-medium"
            >
              Firebase Database Settings
            </button>
            <span className="text-gray-300">•</span>
            <span>Synthetic demo · No paid services enabled</span>
          </div>
        </div>
      </footer>

      {/* Common Modals */}
      <AddParticipantModal
        isOpen={isAddParticipantModalOpen}
        onClose={() => setIsAddParticipantModalOpen(false)}
        programs={store.programs}
        onAddParticipant={handleAddParticipant}
        currentPlan={store.workspace?.plan || 'Starter'}
        currentActiveCount={store.participants.filter(p => p.enrollmentStatus === 'active' && !p.archived).length}
      />

      <ParticipantDetailModal
        isOpen={Boolean(selectedParticipant)}
        onClose={() => setSelectedParticipant(null)}
        participant={selectedParticipant}
        completions={store.taskCompletions}
        programs={store.programs}
        onUpdateParticipant={handleUpdateParticipant}
        onArchiveParticipant={handleArchiveParticipant}
        onAssignProgram={handleAssignProgram}
      />

      <ProgramBuilder
        isOpen={isProgramBuilderOpen}
        onClose={() => {
          setIsProgramBuilderOpen(false);
          setEditingProgram(null);
        }}
        initialProgram={editingProgram}
        onSaveProgram={handleSaveProgram}
      />

      <AssignProgramModal
        isOpen={Boolean(assigningProgramTarget)}
        onClose={() => setAssigningProgramTarget(null)}
        program={assigningProgramTarget}
        participants={store.participants}
        onAssign={handleAssignProgram}
      />

      <FirebaseSetupModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
      />

      <ClinicQrModal
        isOpen={isClinicQrOpen}
        onClose={() => setIsClinicQrOpen(false)}
        workspace={store.workspace}
      />

      {isPitchDeckOpen && (
        <PitchDeck
          onClose={() => setIsPitchDeckOpen(false)}
          onLaunchDemo={handleLaunchDemoPractitioner}
        />
      )}
    </div>
  );
}
