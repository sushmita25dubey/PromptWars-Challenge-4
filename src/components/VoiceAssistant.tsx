import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceAssistantProps {
  onTranscript: (text: string) => void;
  textToSpeak?: string;
}

interface SpeechRecognitionWindow {
  SpeechRecognition?: new () => any;
  webkitSpeechRecognition?: new () => any;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onTranscript, textToSpeak }) => {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check if SpeechRecognition is supported
    const recWindow = window as unknown as SpeechRecognitionWindow;
    const SpeechRecognitionClass = recWindow.SpeechRecognition || recWindow.webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      const rec = new SpeechRecognitionClass();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

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
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognition) {
      // Simulate speech input if API is not supported in the user's browser environment
      setIsListening(true);
      setTimeout(() => {
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
      }, 2500);
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
  };

  const speakText = () => {
    if (!textToSpeak) return;

    if (isPlaying) {
      stopSpeaking();
      return;
    }

    const SpeechSynthesis = window.speechSynthesis;
    if (SpeechSynthesis) {
      // Cancel anything currently playing
      SpeechSynthesis.cancel();

      // Clean markdown tags from speech text
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
  };

  const stopSpeaking = () => {
    const SpeechSynthesis = window.speechSynthesis;
    if (SpeechSynthesis) {
      SpeechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  // Auto clean up speech on unmount
  useEffect(() => {
    return () => {
      const SpeechSynthesis = window.speechSynthesis;
      if (SpeechSynthesis) {
        SpeechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleListening}
        type="button"
        className={`p-3 rounded-full flex items-center justify-center transition-all ${
          isListening 
            ? 'bg-rose-600 text-white animate-pulse' 
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
        } border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-fifa-gold`}
        title={isListening ? "Listening... click to stop" : "Voice Input (Speech-to-Text)"}
        aria-label={isListening ? "Stop voice listening" : "Start voice listening"}
      >
        {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </button>

      {textToSpeak && (
        <button
          onClick={speakText}
          type="button"
          className={`p-3 rounded-full flex items-center justify-center transition-all ${
            isPlaying 
              ? 'bg-fifa-gold text-fifa-dark animate-pulse' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          } border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-fifa-gold`}
          title={isPlaying ? "Click to stop narration" : "Voice Output (Text-to-Speech)"}
          aria-label={isPlaying ? "Stop narrating text" : "Start narrating text"}
        >
          {isPlaying ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      )}
    </div>
  );
};
