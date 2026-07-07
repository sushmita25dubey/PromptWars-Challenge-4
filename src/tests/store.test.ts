// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../store';

describe('useAppStore Zustand Store Telemetry', () => {
  beforeEach(() => {
    // Reset state before each test run
    useAppStore.setState({
      user: null,
      alerts: [],
      incidents: [],
      chatHistory: [],
      volunteerTasks: []
    });
  });

  it('should authenticate user roles properly', () => {
    const store = useAppStore.getState();
    expect(store.user).toBeNull();

    // Perform Login
    store.login('organizer');
    
    const loggedInUser = useAppStore.getState().user;
    expect(loggedInUser).not.toBeNull();
    expect(loggedInUser?.role).toBe('organizer');
    expect(loggedInUser?.displayName).toBe('Organizer Operator');
  });

  it('should update accessibility settings and sync font configurations', () => {
    const store = useAppStore.getState();
    store.login('fan');

    // Update settings
    store.updateAccessibility({ highContrast: true, largeFont: true });
    
    const updatedUser = useAppStore.getState().user;
    expect(updatedUser?.accessibilityPreferences.highContrast).toBe(true);
    expect(updatedUser?.accessibilityPreferences.largeFont).toBe(true);
  });

  it('should dispatch incidents and increment command alerts log', () => {
    const store = useAppStore.getState();
    
    store.addIncident({
      type: 'medical',
      description: 'Test medical emergency Section 102',
      severity: 'high',
      zone: 'Section 102',
      reportedBy: 'Steward Unit'
    });

    const activeIncidents = useAppStore.getState().incidents;
    expect(activeIncidents.length).toBe(1);
    expect(activeIncidents[0].type).toBe('medical');
    expect(activeIncidents[0].severity).toBe('high');

    // High severity should trigger an emergency alert dispatch
    const activeAlerts = useAppStore.getState().alerts;
    expect(activeAlerts.length).toBe(1);
    expect(activeAlerts[0].title).toContain('Incident: MEDICAL');
  });


  it('should resolve active incident tickets', () => {
    const store = useAppStore.getState();
    
    store.addIncident({
      type: 'security',
      description: 'Test dispute reported in concourse',
      severity: 'medium',
      zone: 'Concourse B',
      reportedBy: 'Volunteer B'
    });

    const added = useAppStore.getState().incidents[0];
    expect(added.status).toBe('reported');

    // Resolve incident
    useAppStore.getState().resolveIncident(added.id);
    
    const resolved = useAppStore.getState().incidents[0];
    expect(resolved.status).toBe('resolved');
  });

  it('should dispatch emergency warnings', () => {
    const store = useAppStore.getState();
    
    store.addAlert({
      severity: 'high',
      title: 'Gate 4 Overcrowded Warning',
      description: 'Rerouting in progress',
      zone: 'Gate 4'
    });

    const currentAlerts = useAppStore.getState().alerts;
    expect(currentAlerts.length).toBe(1);
    expect(currentAlerts[0].title).toBe('Gate 4 Overcrowded Warning');
  });

  it('should clear chat logs on demand', () => {
    const store = useAppStore.getState();
    
    store.addChatMessage({
      sender: 'user',
      content: 'Where is gate 4?'
    });

    expect(useAppStore.getState().chatHistory.length).toBe(1);

    store.clearChatHistory();
    expect(useAppStore.getState().chatHistory.length).toBe(0);
  });
});
