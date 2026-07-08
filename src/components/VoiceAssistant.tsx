import React from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

interface VoiceAssistantProps {
  onTranscript: (text: string) => void;
  textToSpeak?: string;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onTranscript, textToSpeak }) => {
  const { isListening, isPlaying, toggleListening, speakText } = useSpeech({
    onTranscript,
  });

  const handleSpeakText = () => {
    speakText(textToSpeak);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleListening}
        type="button"
        className={`p-3 rounded-full flex items-center justify-center transition-all ${
          isListening 
            ? 'bg-rose-605 text-white animate-pulse' 
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
        } border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-fifa-gold`}
        title={isListening ? "Listening... click to stop" : "Voice Input (Speech-to-Text)"}
        aria-label={isListening ? "Stop voice listening" : "Start voice listening"}
      >
        {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </button>

      {textToSpeak && (
        <button
          onClick={handleSpeakText}
          type="button"
          className={`p-3 rounded-full flex items-center justify-center transition-all ${
            isPlaying 
              ? 'bg-fifa-gold text-slate-950 animate-pulse' 
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
