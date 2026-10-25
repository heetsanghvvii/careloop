import { DEFAULT_PROGRAM_TEMPLATES } from './programTemplates.js';

export const getIsoDateOffset = (daysOffset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

export const INITIAL_DEMO_DATA = {
  workspace: {
    id: 'ws_demo_001',
    name: 'PeakForm Performance & Wellness',
    practitionerName: 'Dr. Arjun Patel',
    practitionerEmail: 'arjun.patel@peakform.health',
    category: 'Fitness & Conditioning',
    plan: 'Starter', // Starter: 25 participants limit
    createdAt: '2026-09-01T00:00:00.000Z'
  },

  programs: [
    ...DEFAULT_PROGRAM_TEMPLATES.map(t => ({
      ...t,
      workspaceId: 'ws_demo_001',
      isTemplate: false
    }))
  ],

  participants: [
    {
      id: 'part_001',
      workspaceId: 'ws_demo_001',
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      phone: '+91 98765 43210',
      category: 'Habits & Wellness',
      currentProgramId: 'template-habits-21d',
      currentProgramTitle: '21-Day Habit & Metabolic Reset',
      enrollmentStatus: 'active',
      startDate: getIsoDateOffset(-12),
      currentDay: 13,
      totalDays: 21,
      streakDays: 6,
      completionRate: 88, // Calculated dynamically too
      lastActivityDate: getIsoDateOffset(0),
      lastCheckinNote: 'Woke up naturally at 6:15 AM. Sunlight walk felt great. Energy consistent through 3 PM.',
      notes: 'Client working on reducing afternoon energy crashes. High response to morning hydration.'
    },
    {
      id: 'part_002',
      workspaceId: 'ws_demo_001',
      name: 'Marcus Vance',
      email: 'marcus.v@example.com',
      phone: '+91 98111 22334',
      category: 'Fitness & Conditioning',
      currentProgramId: 'template-fitness-6w',
      currentProgramTitle: '6-Week Strength & Functional Mobility',
      enrollmentStatus: 'active',
      startDate: getIsoDateOffset(-20),
      currentDay: 21,
      totalDays: 42,
      streakDays: 3,
      completionRate: 74,
      lastActivityDate: getIsoDateOffset(-1),
      lastCheckinNote: 'Completed heavy deadlift session. Right patella had minor tightness during split squats; iced afterwards.',
      notes: 'Focusing on hamstring recruitment and ankle dorsiflexion.'
    },
    {
      id: 'part_003',
      workspaceId: 'ws_demo_001',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 99887 76655',
      category: 'Nutrition & Dietetics',
      currentProgramId: 'template-nutrition-28d',
      currentProgramTitle: 'Mediterranean Anti-Inflammatory Protocol',
      enrollmentStatus: 'active',
      startDate: getIsoDateOffset(-15),
      currentDay: 16,
      totalDays: 28,
      streakDays: 12,
      completionRate: 95,
      lastActivityDate: getIsoDateOffset(0),
      lastCheckinNote: 'Prepared Greek lentil soup with EVOO and dark leafy greens. 2.7L water hit comfortably today.',
      notes: 'Highly compliant. Reports reduced joint stiffness after two weeks.'
    },
    {
      id: 'part_004',
      workspaceId: 'ws_demo_001',
      name: 'David Miller',
      email: 'david.m@example.com',
      phone: '+91 97654 32109',
      category: 'Physiotherapy & Rehab',
      currentProgramId: 'template-rehab-30d',
      currentProgramTitle: 'Lumbar Spine & Core Rehabilitation',
      enrollmentStatus: 'active',
      startDate: getIsoDateOffset(-18),
      currentDay: 19,
      totalDays: 30,
      streakDays: 0,
      completionRate: 42,
      lastActivityDate: getIsoDateOffset(-4), // Inactive > 3 days -> triggers follow-up
      lastCheckinNote: 'Work deadlines made it tough to get on the floor for bird-dogs.',
      notes: 'Flags active: High risk of program drop-off. Send reminder sequence.'
    },
    {
      id: 'part_005',
      workspaceId: 'ws_demo_001',
      name: 'Elena Rostova',
      email: 'elena.r@example.com',
      phone: '+91 91234 56789',
      category: 'Habits & Wellness',
      currentProgramId: 'template-habits-21d',
      currentProgramTitle: '21-Day Habit & Metabolic Reset',
      enrollmentStatus: 'completed',
      startDate: getIsoDateOffset(-30),
      currentDay: 21,
      totalDays: 21,
      streakDays: 18,
      completionRate: 92,
      lastActivityDate: getIsoDateOffset(-9),
      lastCheckinNote: 'Completed graduation review! Maintained hydration habit for full 21 days.',
      notes: 'Successfully graduated program. Considering 6-Week Strength upgrade.'
    }
  ],

  // Historical and current task completion logs
  taskCompletions: [
    // Sarah Chen today
    {
      id: 'tc_s01',
      participantId: 'part_001',
      taskId: 'task-h1',
      date: getIsoDateOffset(0),
      status: 'completed',
      note: '500ml water with sea salt before espresso',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'tc_s02',
      participantId: 'part_001',
      taskId: 'task-h2',
      date: getIsoDateOffset(0),
      status: 'completed',
      note: '25 min brisk walk in morning sun',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'tc_s03',
      participantId: 'part_001',
      taskId: 'task-h3',
      date: getIsoDateOffset(0),
      status: 'completed',
      note: '3 eggs + spinach + avocado (~32g protein)',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'tc_s04',
      participantId: 'part_001',
      taskId: 'task-h4',
      date: getIsoDateOffset(0),
      status: 'pending',
      note: '',
      updatedAt: new Date().toISOString()
    },
    // Sarah Chen yesterday
    {
      id: 'tc_s05',
      participantId: 'part_001',
      taskId: 'task-h1',
      date: getIsoDateOffset(-1),
      status: 'completed',
      note: '',
      updatedAt: getIsoDateOffset(-1)
    },
    {
      id: 'tc_s06',
      participantId: 'part_001',
      taskId: 'task-h2',
      date: getIsoDateOffset(-1),
      status: 'completed',
      note: '',
      updatedAt: getIsoDateOffset(-1)
    },
    {
      id: 'tc_s07',
      participantId: 'part_001',
      taskId: 'task-h3',
      date: getIsoDateOffset(-1),
      status: 'completed',
      note: '',
      updatedAt: getIsoDateOffset(-1)
    },
    {
      id: 'tc_s08',
      participantId: 'part_001',
      taskId: 'task-h4',
      date: getIsoDateOffset(-1),
      status: 'completed',
      note: 'Read Kindle instead of phone',
      updatedAt: getIsoDateOffset(-1)
    },
    // Marcus Vance yesterday
    {
      id: 'tc_m01',
      participantId: 'part_002',
      taskId: 'task-f1',
      date: getIsoDateOffset(-1),
      status: 'completed',
      note: 'Hip 90/90 flow',
      updatedAt: getIsoDateOffset(-1)
    },
    {
      id: 'tc_m02',
      participantId: 'part_002',
      taskId: 'task-f2',
      date: getIsoDateOffset(-1),
      status: 'completed',
      note: 'Legs day (modified split squats)',
      updatedAt: getIsoDateOffset(-1)
    },
    {
      id: 'tc_m03',
      participantId: 'part_002',
      taskId: 'task-f3',
      date: getIsoDateOffset(-1),
      status: 'skipped',
      note: 'Rainy afternoon, only reached 6,200 steps',
      updatedAt: getIsoDateOffset(-1)
    },
    // Priya Sharma today
    {
      id: 'tc_p01',
      participantId: 'part_003',
      taskId: 'task-n1',
      date: getIsoDateOffset(0),
      status: 'completed',
      note: 'Spinach, roasted bell peppers, tomatoes',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'tc_p02',
      participantId: 'part_003',
      taskId: 'task-n2',
      date: getIsoDateOffset(0),
      status: 'completed',
      note: 'Wild salmon fillet for lunch',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'tc_p03',
      participantId: 'part_003',
      taskId: 'task-n3',
      date: getIsoDateOffset(0),
      status: 'completed',
      note: 'Hit 2.5L marker by 4 PM',
      updatedAt: new Date().toISOString()
    }
  ],

  // Simulated reminders queue
  simulatedReminders: [
    {
      id: 'rem_001',
      participantId: 'part_004',
      participantName: 'David Miller',
      participantEmail: 'david.m@example.com',
      scheduledTime: '10:00 AM',
      type: 'Adherence Check-in (Prompt)',
      messageText: 'Hi David! Dr. Arjun noticed you haven\'t logged your lumbar stabilization tasks over the last 3 days. How is your lower back feeling today? Reply "Done" if you completed it or "Need help" if you are feeling stiffness.',
      status: 'queued',
      channel: 'Simulated WhatsApp/SMS'
    },
    {
      id: 'rem_002',
      participantId: 'part_001',
      participantName: 'Sarah Chen',
      participantEmail: 'sarah.chen@example.com',
      scheduledTime: '08:30 PM',
      type: 'Evening Habit Wind-Down',
      messageText: 'Evening check-in Sarah! Remember to start your digital sunset in 30 minutes for optimal sleep architecture tonight. You are on a 6-day streak!',
      status: 'sent',
      channel: 'Simulated WhatsApp/SMS'
    },
    {
      id: 'rem_003',
      participantId: 'part_002',
      participantName: 'Marcus Vance',
      participantEmail: 'marcus.v@example.com',
      scheduledTime: '07:30 AM',
      type: 'Workout Split Reminder',
      messageText: 'Morning Marcus! Today is Push Day #3. Focus on controlled eccentrics on overhead presses. Let\'s keep that joint mobility prep front and center!',
      status: 'delivered',
      channel: 'Simulated WhatsApp/SMS'
    }
  ]
};
