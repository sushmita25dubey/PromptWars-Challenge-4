import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ThemeToggle } from '../components/ThemeToggle';
import { Header } from '../components/Header';
import { LoginPage } from '../pages/LoginPage';
import { EmergencyAi } from '../features/EmergencyAi';
import { useAppStore } from '../store';


// Setup mock window properties for web speech recognition
if (typeof window !== 'undefined') {
  (window as any).webkitSpeechRecognition = vi.fn();
  window.speechSynthesis = {
    speak: vi.fn(),
    cancel: vi.fn(),
    speakUtterance: vi.fn(),
  } as any;
}

describe('FIFA SmartHub UI Component Tests', () => {
  it('should toggle theme on button click', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /switch to/i });
    expect(button).toBeInTheDocument();

    const isDarkAtStart = document.documentElement.classList.contains('dark');
    fireEvent.click(button);
    
    // It should swap the class on document element
    const isDarkAfterClick = document.documentElement.classList.contains('dark');
    expect(isDarkAfterClick).toBe(!isDarkAtStart);
  });

  it('should render Header layout elements and role badge', () => {
    // Inject mock logged-in organizer profile
    useAppStore.setState({
      user: {
        id: 'user-organizer',
        email: 'organizer@fifa.com',
        role: 'organizer',
        displayName: 'John Organizer',
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

    render(<Header />);
    expect(screen.getByText('FIFA SmartHub AI')).toBeInTheDocument();
    expect(screen.getByText('John Organizer')).toBeInTheDocument();
    expect(screen.getByText('organizer')).toBeInTheDocument();
  });

  it('should render login role selector cards', async () => {
    const onBackMock = vi.fn();
    render(<LoginPage onBack={onBackMock} />);
    
    // Check if role cards render
    expect(screen.getByText('Match Fan')).toBeInTheDocument();
    expect(screen.getByText('FIFA Volunteer')).toBeInTheDocument();
    expect(screen.getByText('Security Officer')).toBeInTheDocument();

    // Verify guest button triggers
    const guestBtn = screen.getByRole('button', { name: /log in as guest/i });
    expect(guestBtn).toBeInTheDocument();
    
    // Wrap click in act for state sync
    await act(async () => {
      fireEvent.click(guestBtn);
    });
  });


  it('should validate form fields inside Emergency dispatch reporter', async () => {
    // Reset store data
    useAppStore.setState({ incidents: [] });

    render(<EmergencyAi />);
    
    // Find form fields and submit button
    const submitBtn = screen.getByRole('button', { name: /submit dispatch/i });
    expect(submitBtn).toBeInTheDocument();
    
    // Click submit with empty description
    fireEvent.click(submitBtn);
    
    // Validation warning should appear (Zod validates length)
    await waitFor(() => {
      expect(screen.getByText('Description must be at least 10 characters long.')).toBeInTheDocument();
    });
  });
});
