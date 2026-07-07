import React, { useState } from 'react';
import { runGeminiPrompt } from '../services/gemini';
import { Languages, Globe, Volume2, Sparkles, RefreshCw } from 'lucide-react';

export const LiveTranslation: React.FC = () => {
  const [inputText, setInputText] = useState('Gate 4 is overcrowded. Please proceed to Gate 2 for faster entry.');
  const [targetLang, setTargetLang] = useState('es');
  const [translatedText, setTranslatedText] = useState('Puerta 4 sobrepoblada. Por favor proceda a la Puerta 2 para una entrada más rápida.');
  const [isTranslating, setIsTranslating] = useState(false);
  const [phoneticGuide, setPhoneticGuide] = useState('Pwer-tah kwah-troh soh-breh-poh-blah-dah...');

  const languageMap: Record<string, string> = {
    en: 'English',
    es: 'Spanish (Español)',
    fr: 'French (Français)',
    ar: 'Arabic (العربية)',
    hi: 'Hindi (हिन्दी)',
    ja: 'Japanese (日本語)',
    pt: 'Portuguese (Português)',
    de: 'German (Deutsch)',
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    try {
      const prompt = `Translate this text to ${languageMap[targetLang]}: "${inputText}"`;
      const response = await runGeminiPrompt(prompt, "You are a professional tournament translator. Output only the translated text, keeping stadium terminology clear and standard.");
      setTranslatedText(response.trim());

      // Simple phonetic mocks
      if (targetLang === 'es') setPhoneticGuide('Pwer-tah kwah-troh soh-breh-poh-blah-dah...');
      else if (targetLang === 'fr') setPhoneticGuide('Port katre sur-peu-play...');
      else if (targetLang === 'de') setPhoneticGuide('Tor feer oo-ber-fult...');
      else setPhoneticGuide(`Pronunciation support pending for ${languageMap[targetLang]}`);

    } catch (e) {
      console.error(e);
      setTranslatedText(`Translation simulation fallback: [Translated to ${languageMap[targetLang].toUpperCase()}] ${inputText}`);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSpeakText = () => {
    const SpeechSynthesis = window.speechSynthesis;
    if (SpeechSynthesis && translatedText) {
      SpeechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = targetLang === 'es' ? 'es-ES' : targetLang === 'fr' ? 'fr-FR' : targetLang === 'de' ? 'de-DE' : targetLang === 'ja' ? 'ja-JP' : 'en-US';
      SpeechSynthesis.speak(utterance);
    }
  };

  const presetSignages = [
    'Gate 4 is overcrowded. Please proceed to Gate 2 for faster entry.',
    'Emergency evacuation: Walk to the nearest exit corridors immediately.',
    'First-aid station and medical clinics are located near Section 122.',
    'Where is the lost and found center?',
    'Water bottles are free to refill at cooling hubs near Section 102.'
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
      
      {/* Translation Input Card */}
      <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Languages className="h-5 w-5 text-fifa-gold" />
            FIFA Tournament Live Translator
          </h3>
          <p className="text-xxs text-slate-400 mt-1">Translate operational alerts, directional signage, or volunteer advice into the 8 tournament languages</p>
        </div>

        {/* Preset Selectors */}
        <div className="my-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Preset Signages</span>
          <div className="flex flex-col gap-2">
            {presetSignages.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(preset);
                }}
                className="text-left text-xxs p-2 bg-slate-950/40 hover:bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-300 hover:text-slate-100 rounded-lg transition-all"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-28 bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-slate-700 resize-none font-sans"
            placeholder="Type text to translate..."
            aria-label="Text to translate"
          />

          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-1.5 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs">
              <Globe className="h-4 w-4 text-slate-450" />
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-transparent border-none outline-none focus:ring-0 text-slate-200 cursor-pointer font-semibold"
                aria-label="Target language select"
              >
                {Object.entries(languageMap).map(([key, name]) => (
                  <option key={key} value={key} className="bg-slate-900">{name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleTranslate}
              disabled={isTranslating}
              className="px-5 py-2.5 rounded-xl bg-fifa-gold hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-55"
            >
              {isTranslating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>Translate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Translation Output Card */}
      <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Globe className="h-5 w-5 text-emerald-400" />
            Translated Output
          </h3>
          <p className="text-xxs text-slate-400 mt-1">Real-time parsed translation and auditory guidance helper</p>
        </div>

        {/* Translation Output Text */}
        <div className="my-6 p-4 rounded-xl bg-slate-950 border border-slate-850 h-32 flex flex-col justify-between relative overflow-y-auto">
          {isTranslating ? (
            <div className="flex items-center justify-center h-full text-xs text-slate-500 gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-fifa-gold" />
              <span>Generating Gemini Translation...</span>
            </div>
          ) : (
            <>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">{translatedText}</p>
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 mt-3">
                <span className="text-[10px] text-slate-500 font-mono">Parsed: {languageMap[targetLang]}</span>
                <button
                  onClick={handleSpeakText}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-800"
                  title="Speak Translation"
                  aria-label="Speak translated text"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Phonetic Pronunciation helper */}
        <div className="p-4 bg-slate-950/30 border border-slate-850 rounded-xl flex gap-3 text-xs text-slate-300 items-start">
          <Globe className="h-5 w-5 text-fifa-gold shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-slate-200">Phonetic Pronunciation Guide</span>
            <p className="text-slate-450 leading-relaxed font-mono italic text-[11px]">{phoneticGuide}</p>
          </div>
        </div>
      </div>

    </div>
  );
};
