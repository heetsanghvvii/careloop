import { isConfigured, firestoreDb } from './config.js';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { INITIAL_DEMO_DATA, getIsoDateOffset } from '../data/initialDemoData.js';
import { DEFAULT_TZ, DEFAULT_AVAILABILITY, todayInTz, addDays, zonedTimeToUtc } from '../data/followUpScheduler.js';
import { DEFAULT_PROGRAM_TEMPLATES } from '../data/programTemplates.js';

const STORAGE_KEY_LOCAL_DB = 'careloop_local_data_v1';

/**
 * Explicit error thrown when an active production Firebase operation fails,
 * ensuring users and administrators know that cloud synchronization failed
 * rather than falsely believing local changes reached Google Cloud.
 */
export class CloudSyncError extends Error {
  constructor(operation, originalError) {
    super(`Cloud persistence failed during "${operation}": ${originalError?.message || originalError}. Data was not saved to Google Cloud Firestore.`);
    this.name = 'CloudSyncError';
    this.operation = operation;
    this.originalError = originalError;
  }
}

// In-memory / persistent fallback store for Demo Sandbox
class LocalDataStore {
  constructor() {
    this.subscribers = new Set();
    this.data = this.load();
  }

  load() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_LOCAL_DB);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Error reading local data, resetting to initial demo data:', e);
      }
    }
    // Deep clone demo data
    const initial = JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
    this.persist(initial);
    return initial;
  }

  persist(data) {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_LOCAL_DB, JSON.stringify(data));
      } catch (e) {
        console.error('Error persisting local data:', e);
      }
    }
  }

  notify() {
    this.persist(this.data);
    this.subscribers.forEach(cb => {
      try { cb(this.data); } catch (e) { console.error('Subscriber error:', e); }
    });
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    callback(this.data);
    return () => this.subscribers.delete(callback);
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
    this.notify();
  }
}

const localStore = new LocalDataStore();

export const dataService = {
  isLiveFirebase() {
    return isConfigured && firestoreDb !== null;
  },

  // --- WORKSPACE ---
  async getWorkspace(workspaceId = 'ws_demo_001') {
    if (this.isLiveFirebase()) {
      try {
        const snap = await getDoc(doc(firestoreDb, 'workspaces', workspaceId));
        if (snap.exists()) return { id: snap.id, ...snap.data() };
      } catch (err) {
        console.error('Careloop: Firestore error in getWorkspace:', err);
        throw new CloudSyncError('getWorkspace', err);
      }
    }
    return localStore.data.workspace;
  },

  async updateWorkspace(workspaceId, updates) {
    if (this.isLiveFirebase()) {
      try {
        await updateDoc(doc(firestoreDb, 'workspaces', workspaceId), updates);
      } catch (err) {
        console.error('Careloop: Firestore error in updateWorkspace:', err);
        throw new CloudSyncError('updateWorkspace', err);
      }
    }
    localStore.data.workspace = { ...localStore.data.workspace, ...updates };
    localStore.notify();
    return localStore.data.workspace;
  },

  // --- PARTICIPANTS ---
  async getParticipants(workspaceId = 'ws_demo_001') {
    if (this.isLiveFirebase()) {
      try {
        const snap = await getDocs(collection(firestoreDb, `workspaces/${workspaceId}/participants`));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (err) {
        console.error('Careloop: Firestore error in getParticipants:', err);
        throw new CloudSyncError('getParticipants', err);
      }
    }
    return localStore.data.participants.filter(p => !p.archived);
  },

  async addParticipant(workspaceId, participantData) {
    // Check plan capacity
    const workspace = await this.getWorkspace(workspaceId);
    const planLimits = {
      Starter: 25,
      Growth: 100,
      Scale: 300
    };
    const maxAllowed = planLimits[workspace.plan] || 25;
    const currentActive = localStore.data.participants.filter(p => p.enrollmentStatus === 'active' && !p.archived).length;

    if (currentActive >= maxAllowed) {
      throw new Error(`Plan limit reached! Your current "${workspace.plan}" plan allows up to ${maxAllowed} active participants. Please upgrade to enroll more.`);
    }

    const id = participantData.id || ('part_' + Date.now());
    const newParticipant = {
      id,
      workspaceId,
      enrollmentStatus: 'active',
      startDate: getIsoDateOffset(0),
      currentDay: 1,
      streakDays: 0,
      completionRate: 0,
      lastActivityDate: getIsoDateOffset(0),
      lastCheckinNote: 'Just enrolled into program',
      ...participantData
    };

    if (this.isLiveFirebase()) {
      try {
        await setDoc(doc(firestoreDb, `workspaces/${workspaceId}/participants`, id), newParticipant);
      } catch (err) {
        console.error('Careloop: Firestore error in addParticipant:', err);
        throw new CloudSyncError('addParticipant', err);
      }
    }

    localStore.data.participants.unshift(newParticipant);
    localStore.notify();
    return newParticipant;
  },

  async updateParticipant(workspaceId, participantId, updates) {
    if (this.isLiveFirebase()) {
      try {
        await updateDoc(doc(firestoreDb, `workspaces/${workspaceId}/participants`, participantId), updates);
      } catch (err) {
        console.error('Careloop: Firestore error in updateParticipant:', err);
        throw new CloudSyncError('updateParticipant', err);
      }
    }
    const idx = localStore.data.participants.findIndex(p => p.id === participantId);
    if (idx !== -1) {
      localStore.data.participants[idx] = { ...localStore.data.participants[idx], ...updates };
      localStore.notify();
    }
  },

  async archiveParticipant(workspaceId, participantId) {
    return this.updateParticipant(workspaceId, participantId, { 
      enrollmentStatus: 'archived',
      archived: true,
      archivedAt: new Date().toISOString()
    });
  },

  // --- PROGRAMS ---
  async getPrograms(workspaceId = 'ws_demo_001') {
    if (this.isLiveFirebase()) {
      try {
        const snap = await getDocs(collection(firestoreDb, `workspaces/${workspaceId}/programs`));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (err) {
        console.error('Careloop: Firestore error in getPrograms:', err);
        throw new CloudSyncError('getPrograms', err);
      }
    }
    return localStore.data.programs.filter(p => !p.archived);
  },

  async createProgram(workspaceId, programData) {
    const id = 'prog_' + Date.now();
    const newProg = {
      id,
      workspaceId,
      createdAt: new Date().toISOString(),
      ...programData
    };
    if (this.isLiveFirebase()) {
      try {
        await setDoc(doc(firestoreDb, `workspaces/${workspaceId}/programs`, id), newProg);
      } catch (err) {
        console.error('Careloop: Firestore error in createProgram:', err);
        throw new CloudSyncError('createProgram', err);
      }
    }
    localStore.data.programs.push(newProg);
    localStore.notify();
    return newProg;
  },

  async updateProgram(workspaceId, programId, updates) {
    if (this.isLiveFirebase()) {
      try {
        await updateDoc(doc(firestoreDb, `workspaces/${workspaceId}/programs`, programId), updates);
      } catch (err) {
        console.error('Careloop: Firestore error in updateProgram:', err);
        throw new CloudSyncError('updateProgram', err);
      }
    }
    const idx = localStore.data.programs.findIndex(p => p.id === programId);
    if (idx !== -1) {
      localStore.data.programs[idx] = { ...localStore.data.programs[idx], ...updates };
      localStore.notify();
    }
  },

  async duplicateProgram(workspaceId, programId) {
    const original = localStore.data.programs.find(p => p.id === programId);
    if (!original) throw new Error('Program not found');
    const cloned = {
      ...original,
      id: 'prog_' + Date.now(),
      title: `${original.title} (Copy)`,
      createdAt: new Date().toISOString()
    };
    if (this.isLiveFirebase()) {
      try {
        await setDoc(doc(firestoreDb, `workspaces/${workspaceId}/programs`, cloned.id), cloned);
      } catch (err) {
        console.error('Careloop: Firestore error in duplicateProgram:', err);
        throw new CloudSyncError('duplicateProgram', err);
      }
    }
    localStore.data.programs.push(cloned);
    localStore.notify();
    return cloned;
  },

  async deleteProgram(workspaceId, programId) {
    return this.updateProgram(workspaceId, programId, { archived: true });
  },

  async assignProgram(workspaceId, participantId, programId) {
    const program = localStore.data.programs.find(p => p.id === programId);
    if (!program) throw new Error('Program not found');
    
    await this.updateParticipant(workspaceId, participantId, {
      currentProgramId: program.id,
      currentProgramTitle: program.title,
      totalDays: program.durationDays,
      currentDay: 1,
      startDate: getIsoDateOffset(0),
      lastActivityDate: getIsoDateOffset(0)
    });
  },

  // --- TASK COMPLETIONS ---
  async getCompletions(workspaceId = 'ws_demo_001', participantId = null) {
    if (this.isLiveFirebase()) {
      try {
        let q = collection(firestoreDb, `workspaces/${workspaceId}/completions`);
        if (participantId) {
          q = query(q, where('participantId', '==', participantId));
        }
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (err) {
        console.error('Careloop: Firestore error in getCompletions:', err);
        throw new CloudSyncError('getCompletions', err);
      }
    }
    if (participantId) {
      return localStore.data.taskCompletions.filter(tc => tc.participantId === participantId);
    }
    return localStore.data.taskCompletions;
  },

  async recordTaskCompletion(workspaceId, participantId, taskId, date, status, note = '', metadata = {}) {
    // Unique identifier by participant + task + date to prevent duplicate records
    const recordId = `tc_${participantId}_${taskId}_${date}`;
    
    // Resolve participant email / uid for rules enforcement
    const pRecord = localStore.data.participants.find(p => p.id === participantId);
    const participantUid = metadata.participantUid || pRecord?.uid || participantId;
    const participantEmail = metadata.participantEmail || pRecord?.email || null;

    const payload = {
      id: recordId,
      workspaceId,
      participantId,
      participantUid,
      participantEmail,
      taskId,
      date,
      status, // 'completed' | 'skipped' | 'pending'
      note,
      updatedAt: new Date().toISOString()
    };

    if (this.isLiveFirebase()) {
      try {
        await setDoc(doc(firestoreDb, `workspaces/${workspaceId}/completions`, recordId), payload, { merge: true });
      } catch (err) {
        console.error('Careloop: Firestore error in recordTaskCompletion:', err);
        throw new CloudSyncError('recordTaskCompletion', err);
      }
    }

    const existingIdx = localStore.data.taskCompletions.findIndex(
      tc => tc.participantId === participantId && tc.taskId === taskId && tc.date === date
    );

    if (existingIdx !== -1) {
      localStore.data.taskCompletions[existingIdx] = {
        ...localStore.data.taskCompletions[existingIdx],
        ...payload
      };
    } else {
      localStore.data.taskCompletions.unshift(payload);
    }

    // Recalculate participant adherence & streak
    this._recomputeParticipantAdherence(participantId, note);
    localStore.notify();
    return payload;
  },

  _recomputeParticipantAdherence(participantId, latestNote) {
    const participant = localStore.data.participants.find(p => p.id === participantId);
    if (!participant) return;

    const completions = localStore.data.taskCompletions.filter(tc => tc.participantId === participantId);
    const totalRecorded = completions.length;
    const completedCount = completions.filter(tc => tc.status === 'completed').length;
    const rate = totalRecorded > 0 ? Math.round((completedCount / totalRecorded) * 100) : 0;

    participant.completionRate = rate;
    participant.lastActivityDate = getIsoDateOffset(0);
    if (latestNote && latestNote.trim()) {
      participant.lastCheckinNote = latestNote.trim();
    }
  },

  // --- EARLY ACCESS LEAD CAPTURE ---
  async submitEarlyAccess(submission) {
    if (!submission.name || !submission.name.trim()) {
      throw new Error('Please provide your full name.');
    }
    if (!submission.email || !submission.email.includes('@')) {
      throw new Error('Please provide a valid email address.');
    }

    const id = 'lead_' + Date.now();
    const entry = {
      id,
      name: submission.name.trim(),
      email: submission.email.trim().toLowerCase(),
      category: submission.category || 'Fitness & Conditioning',
      participantVolume: submission.participantVolume || '1-25',
      programDescription: (submission.programDescription || '').trim(),
      createdAt: new Date().toISOString()
    };

    if (this.isLiveFirebase()) {
      try {
        await setDoc(doc(firestoreDb, 'early_access_leads', id), entry);
      } catch (err) {
        console.warn('Could not write lead to Firestore, stored in secure local session:', err);
      }
    }

    if (!localStore.data.earlyAccessSubmissions) {
      localStore.data.earlyAccessSubmissions = [];
    }
    localStore.data.earlyAccessSubmissions.unshift(entry);
    localStore.notify();
    return entry;
  },

  // --- SIMULATED REMINDERS ---
  async getSimulatedReminders(workspaceId = 'ws_demo_001') {
    if (this.isLiveFirebase()) {
      try {
        const snap = await getDocs(collection(firestoreDb, `workspaces/${workspaceId}/reminders`));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (err) {
        console.error('Careloop: Firestore error in getSimulatedReminders:', err);
        throw new CloudSyncError('getSimulatedReminders', err);
      }
    }
    return localStore.data.simulatedReminders;
  },

  async addSimulatedReminder(workspaceId, reminderData) {
    const id = 'rem_' + Date.now();
    const newRem = {
      id,
      status: 'queued',
      createdAt: new Date().toISOString(),
      ...reminderData
    };
    if (this.isLiveFirebase()) {
      try {
        await setDoc(doc(firestoreDb, `workspaces/${workspaceId}/reminders`, id), newRem);
      } catch (err) {
        console.error('Careloop: Firestore error in addSimulatedReminder:', err);
        throw new CloudSyncError('addSimulatedReminder', err);
      }
    }
    localStore.data.simulatedReminders.unshift(newRem);
    localStore.notify();
    return newRem;
  },

  async simulateReminderReply(workspaceId, reminderId, replyType) {
    // replyType: 'Done' | 'Skipped' | 'Need help'
    const rem = localStore.data.simulatedReminders.find(r => r.id === reminderId);
    if (!rem) throw new Error('Reminder not found');

    const participant = localStore.data.participants.find(p => p.id === rem.participantId);
    if (participant) {
      const today = getIsoDateOffset(0);
      const program = localStore.data.programs.find(p => p.id === participant.currentProgramId);
      const firstTaskId = program?.tasks?.[0]?.id || 'task-auto';

      if (replyType === 'Done') {
        await this.recordTaskCompletion(workspaceId, participant.id, firstTaskId, today, 'completed', 'Logged via Simulated SMS/WhatsApp reply: "Done"');
      } else if (replyType === 'Skipped') {
        await this.recordTaskCompletion(workspaceId, participant.id, firstTaskId, today, 'skipped', 'Simulated SMS reply: "Skipped - Ran out of time"');
      } else if (replyType === 'Need help') {
        participant.lastCheckinNote = 'Participant replied: "Need help! Lower back is sore today."';
        participant.notes += ' [Flag: Requested assistance via simulated reply]';
      }
    }

    rem.status = 'replied';
    rem.lastReply = replyType;
    rem.repliedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    localStore.notify();
    return rem;
  },

  // --- FOLLOW-UP BOOKING PROTOTYPE (synthetic - local store only, no real calendar writes) ---
  // Materializes seed bookings (stored as dayOffset from today) into concrete instants.
  getFollowUpState() {
    const tz = localStore.data.doctorCalendar?.timezone || DEFAULT_TZ;
    const today = todayInTz(tz);
    const raw = localStore.data.doctorCalendar || { timezone: tz, availability: null, bookings: [] };
    const bookings = (raw.bookings || []).map(b => {
      if (b.dayOffset == null) return b;
      const dateStr = addDays(today, b.dayOffset);
      const start = zonedTimeToUtc(dateStr, b.startMin, tz);
      const end = zonedTimeToUtc(dateStr, b.startMin + b.durationMin, tz);
      return { ...b, startISO: start.toISOString(), endISO: end.toISOString() };
    });
    return {
      rules: localStore.data.followUpRules || [],
      events: localStore.data.followUpEvents || [],
      calendar: {
        timezone: tz,
        availability: raw.availability || DEFAULT_AVAILABILITY,
        bookings,
      },
      today,
    };
  },

  async saveFollowUpRule(rule) {
    const rules = localStore.data.followUpRules || (localStore.data.followUpRules = []);
    const idx = rules.findIndex(r => r.id === rule.id);
    if (idx >= 0) rules[idx] = { ...rules[idx], ...rule };
    else rules.push({ id: 'fur_' + Date.now(), intervalDays: 7, durationMin: 20, active: true, timezone: DEFAULT_TZ, createdAt: new Date().toISOString(), ...rule });
    localStore.notify();
    return idx >= 0 ? rules[idx] : rules[rules.length - 1];
  },

  async saveFollowUpEvent(event) {
    const events = localStore.data.followUpEvents || (localStore.data.followUpEvents = []);
    const idx = events.findIndex(e => e.id === event.id);
    if (idx >= 0) events[idx] = event; else events.push(event);
    localStore.notify();
    return event;
  },

  async saveDoctorCalendar(calendar) {
    // Persist only concrete bookings (drop derived seed fields); availability/timezone preserved.
    localStore.data.doctorCalendar = {
      timezone: calendar.timezone,
      availability: localStore.data.doctorCalendar?.availability || null,
      bookings: calendar.bookings.map(b => b.dayOffset == null ? b : { id: b.id, startISO: b.startISO, endISO: b.endISO, title: b.title, source: b.source }),
    };
    localStore.notify();
    return localStore.data.doctorCalendar;
  },

  // --- RESET DEMO ---
  resetToDemo() {
    localStore.reset();
  },

  // --- REACTIVE STORE SUBSCRIPTION ---
  subscribe(callback) {
    return localStore.subscribe(callback);
  }
};
