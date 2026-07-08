export type UserRole = 'fan' | 'volunteer' | 'organizer' | 'security' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
  photoURL?: string;
  language: string;
  accessibilityPreferences: {
    highContrast: boolean;
    largeFont: boolean;
    reducedMotion: boolean;
    colorBlindSafe: boolean;
    voiceNavigation: boolean;
  };
}

export interface MatchStatus {
  id: string;
  homeTeam: string;
  homeFlag: string;
  awayTeam: string;
  awayFlag: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  status: 'upcoming' | 'live' | 'completed';
  date: string;
  time: string;
  stadium: string;
  attendance: number;
  capacity: number;
}

export interface TransportOption {
  id: string;
  type: 'metro' | 'bus' | 'taxi' | 'walking' | 'parking';
  name: string;
  durationMin: number;
  status: 'smooth' | 'delayed' | 'congested';
  occupancyPercent: number;
  description: string;
  cost: string;
  routeDetails?: string;
}

export interface EmergencyAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  zone: string;
  status: 'active' | 'resolved';
}

export interface VolunteerTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  location: string;
  status: 'pending' | 'in_progress' | 'completed';
  timeLimit: string;
  aiGuidance: string;
}

export interface SustainabilityMetrics {
  energyConsumptionKwh: number;
  waterConsumptionLiters: number;
  wasteRecycledKg: number;
  carbonScore: number;
  environmentalScore: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
  voiceUrl?: string;
}

export interface IncidentReport {
  id: string;
  type: 'medical' | 'security' | 'crowd' | 'facility';
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'reported' | 'investigating' | 'resolved';
  reportedBy: string;
  reportedAt: string;
  zone: string;
}

export interface StadiumZone {
  id: string;
  name: string;
  crowdDensity: number; // 0 to 100
  capacity: number;
  currentCount: number;
  incidentsCount: number;
  status: 'normal' | 'congested' | 'restricted';
}
