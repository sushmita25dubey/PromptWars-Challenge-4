import { create } from 'zustand';
import type { UserProfile, UserRole, MatchStatus, TransportOption, EmergencyAlert, VolunteerTask, SustainabilityMetrics, ChatMessage, IncidentReport, StadiumZone } from '../types';
import { MATCHES, STADIUM_ZONES, TRANSPORT_OPTIONS, SUSTAINABILITY_METRICS, RECENT_ALERTS, VOLUNTEER_TASKS } from '../constants';

interface AppState {
  // Auth
  user: UserProfile | null;
  login: (role: UserRole) => void;
  logout: () => void;
  updateAccessibility: (prefs: Partial<UserProfile['accessibilityPreferences']>) => void;
  setLanguage: (lang: string) => void;

  // Domain Data
  matches: MatchStatus[];
  stadiumZones: StadiumZone[];
  transportOptions: TransportOption[];
  alerts: EmergencyAlert[];
  volunteerTasks: VolunteerTask[];
  sustainability: SustainabilityMetrics;
  chatHistory: ChatMessage[];
  incidents: IncidentReport[];

  // Actions
  updateMatchScore: (matchId: string, homeScore: number, awayScore: number, minute: number) => void;
  addAlert: (alert: Omit<EmergencyAlert, 'id' | 'timestamp' | 'status'>) => void;
  resolveAlert: (id: string) => void;
  addIncident: (incident: Omit<IncidentReport, 'id' | 'reportedAt' | 'status'>) => void;
  resolveIncident: (id: string) => void;
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChatHistory: () => void;
  updateTaskStatus: (taskId: string, status: VolunteerTask['status']) => void;
  updateSustainabilityMetrics: (metrics: Partial<SustainabilityMetrics>) => void;
}

const DEFAULT_USER = (role: UserRole): UserProfile => ({
  id: `user-${role}`,
  email: `${role}@fifa.com`,
  role,
  displayName: role.charAt(0).toUpperCase() + role.slice(1) + ' Operator',
  accessibilityPreferences: {
    highContrast: false,
    largeFont: false,
    reducedMotion: false,
    colorBlindSafe: false,
    voiceNavigation: false,
  },
  language: 'en',
});

export const useAppStore = create<AppState>((set) => ({
  // Auth
  user: null,
  login: (role) => set({ user: DEFAULT_USER(role) }),
  logout: () => set({ user: null }),
  updateAccessibility: (prefs) => set((state) => {
    if (!state.user) return {};
    const updatedUser = {
      ...state.user,
      accessibilityPreferences: {
        ...state.user.accessibilityPreferences,
        ...prefs,
      }
    };
    // Sync class list for high-contrast on html/body element
    if (prefs.highContrast !== undefined) {
      if (prefs.highContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    }
    // Sync dynamic root styling
    if (prefs.largeFont !== undefined) {
      if (prefs.largeFont) {
        document.documentElement.style.fontSize = '120%';
      } else {
        document.documentElement.style.fontSize = '';
      }
    }
    return { user: updatedUser };
  }),
  setLanguage: (lang) => set((state) => {
    if (!state.user) return {};
    return { user: { ...state.user, language: lang } };
  }),

  // Domain Data
  matches: MATCHES,
  stadiumZones: STADIUM_ZONES,
  transportOptions: TRANSPORT_OPTIONS,
  alerts: RECENT_ALERTS,
  volunteerTasks: VOLUNTEER_TASKS,
  sustainability: SUSTAINABILITY_METRICS,
  chatHistory: [
    {
      id: 'welcome',
      sender: 'ai',
      content: 'Hello! I am FIFA SmartHub AI Stadium Assistant. How can I help you today? Ask about transport, parking, washrooms, seat locations, or environmental initiatives.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ],
  incidents: [
    {
      id: 'inc-1',
      type: 'medical',
      description: 'Minor heat exhaustion reported in Section 112.',
      severity: 'low',
      status: 'investigating',
      reportedBy: 'volunteer-1',
      reportedAt: '18:30',
      zone: 'East Stand (Zone B)'
    },
    {
      id: 'inc-2',
      type: 'security',
      description: 'Suspicious unattended backpack found near Gate 4 ticket booths.',
      severity: 'high',
      status: 'reported',
      reportedBy: 'security-2',
      reportedAt: '18:45',
      zone: 'Gate 4 Entrance'
    }
  ],

  // Actions
  updateMatchScore: (matchId, homeScore, awayScore, minute) => set((state) => ({
    matches: state.matches.map((m) =>
      m.id === matchId ? { ...m, homeScore, awayScore, minute } : m
    ),
  })),
  addAlert: (alert) => set((state) => {
    const newAlert: EmergencyAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'active',
    };
    return { alerts: [newAlert, ...state.alerts] };
  }),
  resolveAlert: (id) => set((state) => ({
    alerts: state.alerts.map((a) => a.id === id ? { ...a, status: 'resolved' } : a),
  })),
  addIncident: (incident) => set((state) => {
    const newIncident: IncidentReport = {
      ...incident,
      id: `inc-${Date.now()}`,
      reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'reported',
    };
    // If high or medium incident, also add to active alerts
    const alertsUpdate = incident.severity !== 'low' ? [
      {
        id: `alert-${Date.now()}`,
        severity: incident.severity === 'high' ? 'high' as const : 'medium' as const,
        title: `Incident: ${incident.type.toUpperCase()}`,
        description: incident.description,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        zone: incident.zone,
        status: 'active' as const
      },
      ...state.alerts
    ] : state.alerts;

    return {
      incidents: [newIncident, ...state.incidents],
      alerts: alertsUpdate
    };
  }),
  resolveIncident: (id) => set((state) => ({
    incidents: state.incidents.map((i) => i.id === id ? { ...i, status: 'resolved' } : i),
  })),
  addChatMessage: (msg) => set((state) => ({
    chatHistory: [
      ...state.chatHistory,
      {
        ...msg,
        id: `chat-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]
  })),
  clearChatHistory: () => set({ chatHistory: [] }),
  updateTaskStatus: (taskId, status) => set((state) => ({
    volunteerTasks: state.volunteerTasks.map((t) =>
      t.id === taskId ? { ...t, status } : t
    ),
  })),
  updateSustainabilityMetrics: (metrics) => set((state) => ({
    sustainability: {
      ...state.sustainability,
      ...metrics,
    }
  })),
}));
