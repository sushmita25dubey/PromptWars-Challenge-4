import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore } from '../store';

// Import Feature Components
import { AiFanAssistant } from '../features/AiFanAssistant';
import { AccessibilityCenter } from '../features/AccessibilityCenter';
import { LiveTranslation } from '../features/LiveTranslation';
import { TransportAi } from '../features/TransportAi';
import { VolunteerHub } from '../features/VolunteerHub';
import { SustainabilityHub } from '../features/SustainabilityHub';
import { AdminCommandCenter } from '../features/AdminCommandCenter';
import { AiAnnouncementGenerator } from '../features/AiAnnouncementGenerator';
import { EmergencyAi } from '../features/EmergencyAi';
import { EmergencyButton } from '../components/EmergencyButton';

// Setup QueryClient for testing wrapper
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('FIFA SmartHub AI Comprehensive Feature Tests', () => {
  beforeEach(() => {
    // Reset App State before each test run
    useAppStore.setState({
      user: {
        id: 'user-admin',
        email: 'admin@fifa.com',
        role: 'admin',
        displayName: 'Test Operator',
        accessibilityPreferences: {
          highContrast: false,
          largeFont: false,
          reducedMotion: false,
          colorBlindSafe: false,
          voiceNavigation: false,
        },
        language: 'en',
      },
      alerts: [],
      incidents: [],
      chatHistory: [],
      volunteerTasks: [
        {
          id: 'task-test-1',
          title: 'Guidance Help Section 104',
          description: 'Help fans find seats',
          assignedTo: 'volunteer-1',
          location: 'Gate 2',
          status: 'pending',
          timeLimit: '10 mins',
          aiGuidance: 'Proceed along main ramp.'
        }
      ]
    });
    vi.clearAllMocks();
  });

  // 1. AI Fan Assistant Component Tests
  describe('AiFanAssistant Module', () => {
    it('should render chat assistance, suggestion buttons, and handle message submit', async () => {
      render(<AiFanAssistant />, { wrapper });
      expect(screen.getByText('FIFA AI Fan Assistant')).toBeInTheDocument();

      // Check suggestions render
      const suggestionBtn = screen.getByText('Where is the nearest wheelchair-accessible restroom?');
      expect(suggestionBtn).toBeInTheDocument();

      // Clear chat
      const clearBtn = screen.getByRole('button', { name: /clear chat messages/i });
      fireEvent.click(clearBtn);
      const chatState = useAppStore.getState().chatHistory;
      expect(chatState.length).toBe(0);

      // Select suggestion
      fireEvent.click(suggestionBtn);
      await waitFor(() => {
        expect(useAppStore.getState().chatHistory.some(m => m.sender === 'user')).toBe(true);
      });
    });
  });

  // 2. Accessibility Center Component Tests
  describe('AccessibilityCenter Module', () => {
    it('should render compliance console toggles and update store preferences', () => {
      render(<AccessibilityCenter />, { wrapper });
      expect(screen.getByText('Universal Accessibility Console')).toBeInTheDocument();

      // Select high contrast switch
      const contrastSwitch = screen.getByRole('switch', { name: /high contrast mode/i });
      expect(contrastSwitch).toBeInTheDocument();

      // Click to toggle contrast
      fireEvent.click(contrastSwitch);
      const contrastState = useAppStore.getState().user?.accessibilityPreferences.highContrast;
      expect(contrastState).toBe(true);
    });
  });

  // 3. Live Translation Component Tests
  describe('LiveTranslation Module', () => {
    it('should translate signages and trigger text pronunciation', async () => {
      render(<LiveTranslation />, { wrapper });
      expect(screen.getByText('FIFA Tournament Live Translator')).toBeInTheDocument();

      // Select preset
      const presetBtn = screen.getByText('Where is the lost and found center?');
      fireEvent.click(presetBtn);

      // Select exact button with name "Translate" to avoid matching "Speak Translation"
      const translateBtn = screen.getByRole('button', { name: /^Translate$/ });
      fireEvent.click(translateBtn);

      // Verify TTS triggering speech synthesis (wait for translation simulated latency)
      const speakBtn = await screen.findByRole('button', { name: /speak translated text/i }, { timeout: 2000 });
      fireEvent.click(speakBtn);
      expect(window.speechSynthesis.speak).toHaveBeenCalled();
    });
  });

  // 4. Transport AI Component Tests
  describe('TransportAi Module', () => {
    it('should display routes list and change active transit route details', () => {
      render(<TransportAi />, { wrapper });
      expect(screen.getByText('FIFA AI Transit Dispatch')).toBeInTheDocument();

      // Check default route
      expect(screen.getAllByText('MetLife Express Line (M1)')[0]).toBeInTheDocument();

      // Select Bus Shuttle Option
      const busBtn = screen.getByRole('button', { name: /Shuttle Bus 350/i });
      fireEvent.click(busBtn);

      // Verify details update
      expect(screen.getByText('Board at Gate B Bus Depot.')).toBeInTheDocument();
    });
  });

  // 5. Volunteer Hub Component Tests
  describe('VolunteerHub Module', () => {
    it('should render shift check-ins, tasks logs, and complete assignments', () => {
      // Set volunteer role
      useAppStore.setState({
        user: {
          id: 'user-volunteer',
          email: 'volunteer@fifa.com',
          role: 'volunteer',
          displayName: 'Jane Volunteer',
          accessibilityPreferences: {
            highContrast: false,
            largeFont: false,
            reducedMotion: false,
            colorBlindSafe: false,
            voiceNavigation: false,
          },
          language: 'en',
        }
      });

      render(<VolunteerHub />, { wrapper });
      expect(screen.getByText('Volunteer Shift Console')).toBeInTheDocument();

      // Check-out shift
      const checkInOutBtn = screen.getByRole('button', { name: /check out/i });
      fireEvent.click(checkInOutBtn);
      expect(screen.getByText('Offline. Check in to receive tasks.')).toBeInTheDocument();

      // Check back in
      fireEvent.click(checkInOutBtn);
      expect(screen.getByText('Guidance Help Section 104')).toBeInTheDocument();

      // Start Task and verify state progress
      const taskBtn = screen.getByRole('button', { name: /start task/i });
      fireEvent.click(taskBtn);
      const activeState = useAppStore.getState().volunteerTasks[0].status;
      expect(activeState).toBe('in_progress');
    });
  });

  // 6. Sustainability Hub Component Tests
  describe('SustainabilityHub Module', () => {
    it('should render real-time environmental score and carbon recommendations', () => {
      render(<SustainabilityHub />, { wrapper });
      expect(screen.getByText('Eco Score')).toBeInTheDocument();
      expect(screen.getByText('88%')).toBeInTheDocument();
      expect(screen.getByText('4,200 kg')).toBeInTheDocument();
    });
  });

  // 7. Admin Command Center Component Tests
  describe('AdminCommandCenter Module', () => {
    it('should render users roster table and log of active incidents', () => {
      render(<AdminCommandCenter />, { wrapper });
      expect(screen.getByText('Tournament User Directory & Rosters')).toBeInTheDocument();
      expect(screen.getByText('Sarah Connor')).toBeInTheDocument();
    });
  });

  // 8. Announcement Generator Component Tests
  describe('AiAnnouncementGenerator Module', () => {
    it('should generate announcement alerts and broadcast to active warnings', async () => {
      render(<AiAnnouncementGenerator />, { wrapper });
      expect(screen.getByText('AI Operations Announcement Console')).toBeInTheDocument();

      // Click broadcast loudspeaker
      const broadcastBtn = screen.getAllByRole('button', { name: /broadcast live/i })[0];
      fireEvent.click(broadcastBtn);

      const alerts = useAppStore.getState().alerts;
      expect(alerts.length).toBe(1);
      expect(alerts[0].title).toBe('AI Announcement Dispatched');
    });
  });

  // 9. Emergency AI Form Validation Tests
  describe('EmergencyAi Module', () => {
    it('should submit incident reports and trigger store validation dispatch', async () => {
      render(<EmergencyAi />, { wrapper });
      expect(screen.getByText('Dispatch Incident Report')).toBeInTheDocument();

      // Set description details
      const detailsInput = screen.getByPlaceholderText(/provide a detailed report of the situation/i);
      fireEvent.change(detailsInput, { target: { value: 'This is a long test description for medical response.' } });

      const submitBtn = screen.getByRole('button', { name: /submit dispatch/i });
      fireEvent.click(submitBtn);

      // Verify incident dispatched into store state
      await waitFor(() => {
        const incidentsList = useAppStore.getState().incidents;
        expect(incidentsList.length).toBe(1);
        expect(incidentsList[0].description).toContain('medical response');
      });
    });
  });

  // 10. Floating Emergency Button SOS Modal Tests
  describe('EmergencyButton Module', () => {
    it('should display modal, trigger high-severity incident dispatch, and handle Escape closures', async () => {
      render(<EmergencyButton />, { wrapper });
      
      const sosBtn = screen.getByRole('button', { name: /trigger emergency sos/i });
      expect(sosBtn).toBeInTheDocument();

      // Click to open SOS Modal
      fireEvent.click(sosBtn);
      expect(screen.getByText('Emergency SOS Command')).toBeInTheDocument();

      // Click Medical SOS Action
      const medicalBtn = screen.getByRole('button', { name: /medical help/i });
      fireEvent.click(medicalBtn);

      expect(screen.getByText('SOS Alert Dispatched')).toBeInTheDocument();
      
      // Verify store incident triggered
      const incidents = useAppStore.getState().incidents;
      expect(incidents.length).toBe(1);
      expect(incidents[0].severity).toBe('high');
      expect(incidents[0].type).toBe('medical');

      // Test Escape Key close
      fireEvent.keyDown(window, { key: 'Escape' });
      await waitFor(() => {
        expect(screen.queryByText('Emergency SOS Command')).not.toBeInTheDocument();
      });
    });
  });
});
