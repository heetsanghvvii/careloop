import React, { createContext, useContext, useState, useEffect } from 'react';
import { firebaseAuth, googleAuthProvider, isConfigured } from '../firebase/config.js';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { dataService } from '../firebase/dataService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const role = params.get('role');
        const view = params.get('view');

        if (role === 'practitioner' || view === 'dashboard' || view === 'whatsapp_lab') {
          return {
            uid: 'user_dr_trisha',
            email: 'dr.trisha@careloop.health',
            displayName: 'Dr. Trisha Sen',
            role: 'practitioner',
            isDemo: true
          };
        }
        if (role === 'participant' || view === 'participant') {
          return {
            uid: 'part_001',
            email: 'sarah.chen@example.com',
            displayName: 'Sarah Chen',
            role: 'participant',
            currentProgramId: 'template-habits-21d',
            currentProgramTitle: '21-Day Habit & Metabolic Reset',
            isDemo: true
          };
        }
        if (role === 'founder' || view === 'founder') {
          return {
            uid: 'user_founder_operator',
            email: 'founder@careloop.health',
            displayName: 'Founder & Operator',
            role: 'founder',
            isDemo: true
          };
        }

        const saved = localStorage.getItem('careloop_user_session');
        return saved ? JSON.parse(saved) : null;
      }
    } catch {
      return null;
    }
  });

  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync session
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('careloop_user_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('careloop_user_session');
    }
  }, [currentUser]);

  // Load workspace details
  useEffect(() => {
    dataService.getWorkspace().then(ws => {
      setActiveWorkspace(ws);
      setLoading(false);
    });

    const unsubscribe = dataService.subscribe(storeData => {
      setActiveWorkspace(storeData.workspace);
    });

    return unsubscribe;
  }, []);

  // Listen to Firebase auth if configured
  useEffect(() => {
    if (isConfigured && firebaseAuth) {
      const unsub = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
        if (firebaseUser) {
          // If signed in through Firebase Auth
          setCurrentUser(prev => ({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'Practitioner',
            photoURL: firebaseUser.photoURL,
            role: prev?.role || 'practitioner',
            isDemo: false
          }));
        }
      });
      return unsub;
    }
  }, []);

  const signInWithGoogle = async () => {
    if (isConfigured && firebaseAuth && googleAuthProvider) {
      try {
        const result = await signInWithPopup(firebaseAuth, googleAuthProvider);
        const user = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || 'Practitioner',
          photoURL: result.user.photoURL,
          role: 'practitioner',
          isDemo: false
        };
        setCurrentUser(user);
        return user;
      } catch (err) {
        console.error('Google Sign-in error:', err);
        throw err;
      }
    } else {
      // Demo simulated Google Sign-in
      const demoUser = {
        uid: 'user_google_demo_99',
        email: 'founder.demo@careloop.health',
        displayName: 'Demo Practitioner (Google)',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        role: 'practitioner',
        isDemo: true
      };
      setCurrentUser(demoUser);
      return demoUser;
    }
  };

  const signInAsFounder = () => {
    const founderUser = {
      uid: 'user_founder_operator',
      email: 'founder@careloop.health',
      displayName: 'Founder & Operator',
      role: 'founder',
      isDemo: true
    };
    setCurrentUser(founderUser);
    return founderUser;
  };

  const signInAsDemoPractitioner = () => {
    const demoUser = {
      uid: 'user_dr_trisha',
      email: 'dr.trisha@careloop.health',
      displayName: 'Dr. Trisha Sen',
      role: 'practitioner',
      isDemo: true
    };
    setCurrentUser(demoUser);
  };

  const signInAsCoordinator = () => {
    const coordinatorUser = {
      uid: 'user_clinic_coordinator',
      email: 'coordinator@trisha-clinic.health',
      displayName: 'Pooja Nair (Care Coordinator)',
      role: 'coordinator',
      isDemo: true
    };
    setCurrentUser(coordinatorUser);
    return coordinatorUser;
  };

  const signInAsParticipant = (participant) => {
    const user = {
      uid: participant.id,
      email: participant.email,
      displayName: participant.name,
      role: 'participant',
      participantData: participant,
      isDemo: true
    };
    setCurrentUser(user);
  };

  const signOut = async () => {
    if (isConfigured && firebaseAuth) {
      try { await fbSignOut(firebaseAuth); } catch (e) { console.warn(e); }
    }
    setCurrentUser(null);
  };

  const switchRole = (newRole, participantObj = null) => {
    if (newRole === 'founder') {
      signInAsFounder();
    } else if (newRole === 'practitioner') {
      signInAsDemoPractitioner();
    } else if (newRole === 'coordinator') {
      signInAsCoordinator();
    } else if (newRole === 'participant') {
      if (participantObj) {
        signInAsParticipant(participantObj);
      } else {
        signInAsParticipant({
          id: 'part_ananya',
          name: 'Ananya Rao',
          email: 'ananya.rao@example.com',
          currentProgramTitle: 'PCOS & Insulin Resistance Protocol'
        });
      }
    }
  };

  const value = {
    currentUser,
    activeWorkspace,
    loading,
    signInWithGoogle,
    signInAsFounder,
    signInAsDemoPractitioner,
    signInAsCoordinator,
    signInAsParticipant,
    signOut,
    switchRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
