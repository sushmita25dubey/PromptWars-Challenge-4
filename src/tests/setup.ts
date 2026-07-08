import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock window.matchMedia for JSDOM environments
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock HTMLElement.prototype.scrollIntoView since JSDOM does not support it
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock window.localStorage for JSDOM environments
class LocalStorageMock {
  store: Record<string, string> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  get length() {
    return Object.keys(this.store).length;
  }

  key(index: number) {
    return Object.keys(this.store)[index] || null;
  }
}

Object.defineProperty(window, 'localStorage', {
  value: new LocalStorageMock(),
});

// Mock Clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
  writable: true,
});

// Mock SpeechSynthesisUtterance for JSDOM environments
class SpeechSynthesisUtteranceMock {
  text: string;
  lang = 'en-US';
  onend = () => {};
  onerror = () => {};
  constructor(text: string) {
    this.text = text;
  }
}

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  value: SpeechSynthesisUtteranceMock,
  writable: true,
});

// Mock SpeechSynthesis
Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
    speakUtterance: vi.fn(),
  },
  writable: true,
});

// Mock SpeechRecognition / webkitSpeechRecognition
class SpeechRecognitionMock {
  continuous = false;
  interimResults = false;
  lang = 'en-US';
  onstart = vi.fn();
  onresult = vi.fn();
  onerror = vi.fn();
  onend = vi.fn();
  start() {
    this.onstart();
    // Simulate immediately finding a text results callback
    const event = {
      results: [[{ transcript: 'Where is the nearest restroom?' }]]
    };
    setTimeout(() => {
      this.onresult(event);
      this.onend();
    }, 10);
  }
  stop() {
    this.onend();
  }
}

Object.defineProperty(window, 'SpeechRecognition', {
  value: SpeechRecognitionMock,
  writable: true,
});
Object.defineProperty(window, 'webkitSpeechRecognition', {
  value: SpeechRecognitionMock,
  writable: true,
});

// Mock Chart.js and react-chartjs-2 to prevent JSDOM canvas exceptions
vi.mock('react-chartjs-2', () => ({
  Doughnut: (props: any) => React.createElement('div', { 'data-testid': 'mock-doughnut', ...props }, 'Doughnut Chart'),
  Bar: (props: any) => React.createElement('div', { 'data-testid': 'mock-bar', ...props }, 'Bar Chart'),
  Line: (props: any) => React.createElement('div', { 'data-testid': 'mock-line', ...props }, 'Line Chart'),
}));
vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn(),
  },
  ArcElement: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  BarElement: vi.fn(),
  Title: vi.fn(),
}));
export {};
