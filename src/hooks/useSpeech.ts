import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechOptions {
  onTranscript: (text: string) => void;
  lang?: string;
}

interface SpeechRecognitionWindow {
  SpeechRecognition?: new () => any;
  webkitSpeechRecognition?: new () => any;
}

export function useSpeech({ onTranscript, lang = 'en-US' }: UseSpeechOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const listeningTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const recWindow = window as unknown as SpeechRecognitionWindow;
    const SpeechRecognitionClass = recWindow.SpeechRecognition || recWindow.webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      const rec = new SpeechRecognitionClass();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = lang;

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
        }
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }

    return () => {
      if (listeningTimeoutRef.current !== null) {
        window.clearTimeout(listeningTimeoutRef.current);
      }
    };
  }, [onTranscript, lang]);

  const stopSpeaking = useCallback(() => {
    const SpeechSynthesis = window.speechSynthesis;
    if (SpeechSynthesis) {
      SpeechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognition) {
      // Offline/test simulation fallback
      setIsListening(true);
      if (listeningTimeoutRef.current !== null) window.clearTimeout(listeningTimeoutRef.current);
      listeningTimeoutRef.current = window.setTimeout(() => {
        setIsListening(false);
        const mockQuestions = [
          "Where is the nearest wheelchair-accessible restroom?",
          "How do I get to MetLife Stadium via Metro?",
          "Where is the nearest food stall?",
          "How do I report a medical incident?",
          "Show me transport options"
        ];
        const randomQ = mockQuestions[Math.floor(Math.random() * mockQuestions.length)];
        onTranscript(randomQ);
      }, 2000);
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      if (isPlaying) {
        stopSpeaking();
      }
      recognition.start();
    }
  }, [recognition, isListening, isPlaying, onTranscript, stopSpeaking]);

  const speakText = useCallback((textToSpeak?: string) => {
    if (!textToSpeak) return;

    const SpeechSynthesis = window.speechSynthesis;
    if (SpeechSynthesis) {
      SpeechSynthesis.cancel();

      // Clean markdown tags
      const cleanText = textToSpeak.replace(/[\*#_`~>♿🚇🚻🍔🚨]/g, '').trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.onend = () => {
        setIsPlaying(false);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
      };
      setIsPlaying(true);
      SpeechSynthesis.speak(utterance);
    }
  }, []);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      const SpeechSynthesis = window.speechSynthesis;
      if (SpeechSynthesis) {
        SpeechSynthesis.cancel();
      }
    };
  }, []);

  return {
    isListening,
    isPlaying,
    toggleListening,
    speakText,
    stopSpeaking,
  };
}
