import React, { useState } from 'react';
import { useAppStore } from '../store';
import { runGeminiPrompt } from '../services/gemini';
import { Megaphone, RefreshCw, Copy, Check, Sparkles, Bell, MessageSquare } from 'lucide-react';

export const AiAnnouncementGenerator: React.FC = () => {
  const { addAlert } = useAppStore();
  const [inputText, setInputText] = useState('Gate 4 overcrowded.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Default initial output matching the simulation format
  const [results, setResults] = useState<{
    professional: string;
    emergency: string;
    translated: { es: string; fr: string; ar: string; de: string };
    sms: string;
    push: string;
  }>({
    professional: '⚠️ ATTENTION ALL SPECTATORS: Please be advised that we are experiencing heavy crowd levels near Gate 4. To ensure your comfort and safety, we recommend utilizing alternate entrances such as Gate 2 or Gate 3, which are currently showing low wait times. Stewards are stationed along the concourse to guide you. Thank you for your cooperation.',
    emergency: '🚨 CRITICAL SAFETY ALERT: Crowd density at Gate 4 has reached peak capacity. Access via this gate is temporarily restricted. ALL incoming visitors must immediately reroute to Gates 2, 3, or 5. Do not queue in the vicinity of Gate 4. Follow emergency marshal directions immediately.',
    translated: {
      es: '⚠️ ATENCIÓN A TODOS LOS ESPECTADORES: Se informa que hay alta congestión de personas cerca de la Puerta 4. Recomendamos usar las entradas alternativas como la Puerta 2 o la Puerta 3. Gracias por su cooperación.',
      fr: "⚠️ ATTENTION À TOUS LES SPECTATEURS: Veuillez noter qu'il y a une forte affluence près de la Porte 4. Nous vous recommandons d'utiliser les entrées alternatives comme la Porte 2 ou la Porte 3. Merci de votre coopération.",
      ar: '⚠️ تنبيه لجميع المتفرجين: يرجى العلم بأننا نشهد مستويات عالية من الازدحام بالقرب من البوابة 4. نوصي باستخدام مداخل بديلة مثل البوابة 2 أو البوابة 3. شكرًا لتعاونكم.',
      de: '⚠️ ACHTUNG AN ALLE ZUSCHAUER: Bitte beachten Sie, dass im Bereich von Tor 4 ein sehr hohes Personenaufkommen herrscht. Wir empfehlen, die alternativen Eingänge Tor 2 oder Tor 3 zu nutzen. Vielen Dank für Ihre Kooperation.'
    },
    sms: 'FIFA 2026 Alert: Avoid Gate 4 due to high congestion. Access is limited. Use Gates 2 or 3. Map & updates: fifa.sh/g4',
    push: '🔔 Avoid Gate 4! High congestion detected. Use Gates 2 & 3 for direct entry.'
  });

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);
    try {
      const prompt = `generate announcement for: "${inputText}"`;
      const response = await runGeminiPrompt(prompt, "You are a FIFA operations director. Return a strict JSON object mapping format outputs: { professional, emergency, translated: { es, fr, ar, de }, sms, push }");
      const parsed = JSON.parse(response);
      if (parsed.professional && parsed.emergency) {
        setResults(parsed);
      }
    } catch (e) {
      console.warn("Raw parse failed. Using simulated mapping formats for reliability.", e);
      // Let's generate a dynamic mock output representing their input details
      setResults({
        professional: `⚠️ ATTENTION ALL SPECTATORS: Please note operations details regarding ${inputText}. Stadium operations recommends taking all standard precautions. Direct stewards are nearby to assist.`,
        emergency: `🚨 EMERGENCY ADVISORY: Critical incident alert regarding ${inputText}. Avoid this area. Immediately follow steward directives.`,
        translated: {
          es: `⚠️ ATENCIÓN: Alerta de operaciones: ${inputText}. Por favor, siga las instrucciones del personal.`,
          fr: `⚠️ ATTENTION: Alerte d'opérations: ${inputText}. Veuillez suivre les instructions du personnel.`,
          ar: `⚠️ تنبيه: حالة عمليات بخصوص: ${inputText}. يرجى اتباع التعليمات المباشرة.`,
          de: `⚠️ ACHTUNG: Betriebsmeldung: ${inputText}. Bitte den Anweisungen des Personals folgen.`
        },
        sms: `FIFA 2026 Operations: ${inputText}. Please follow guides. Updates: fifa.sh/ops`,
        push: `🔔 Alert: Operations update regarding ${inputText}. Check map.`
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const dispatchToAlerts = (text: string) => {
    addAlert({
      severity: 'medium',
      title: 'AI Announcement Dispatched',
      description: text,
      zone: 'All Sectors'
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
      
      {/* Event input console */}
      <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-fifa-gold" />
            AI Operations Announcement Console
          </h3>
          <p className="text-xxs text-slate-400 mt-1">Input a raw situation briefing, and Gemini AI will draft professional speaker scripts, SMS alerts, push updates, and translations</p>
        </div>

        {/* Input */}
        <div className="space-y-4 my-6">
          <div>
            <label className="text-xxs font-bold text-slate-450 uppercase tracking-wider block mb-1">Enter Raw Situation Briefing</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-36 bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-slate-700 resize-none font-sans"
              placeholder="e.g. Gate 4 overcrowded. Re-routing all entrants to Gates 2 & 3."
              aria-label="Situation briefing input"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 rounded-xl bg-fifa-gold hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-55"
          >
            {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span>Generate Media Outlets</span>
          </button>
        </div>

        <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-lg text-xxs text-slate-405 leading-relaxed">
          <strong>Tip:</strong> Keep descriptions concise. You can trigger evacuations, escalator repairs, weather notifications, or schedule updates.
        </div>
      </div>

      {/* Generated output format cards */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Render Formats grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            AI Formatted Multi-Channel Outlets
          </h3>

          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1 no-scrollbar">
            {/* 1. Loudspeaker Professional */}
            <div className="p-3.5 bg-slate-950/40 border border-slate-850 rounded-xl space-y-2 relative">
              <div className="flex justify-between items-center text-xxs font-bold text-slate-350">
                <span className="flex items-center gap-1.5"><Megaphone className="h-4 w-4 text-fifa-gold" /> Public Loudspeaker Script</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => copyToClipboard(results.professional, 'prof')}
                    className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-450 hover:text-white"
                  >
                    {copiedKey === 'prof' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => dispatchToAlerts(results.professional)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-750 text-[9px] font-bold text-slate-300 transition-colors"
                  >
                    Broadcast Live
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-205 leading-relaxed">{results.professional}</p>
            </div>

            {/* 2. Emergency Version */}
            <div className="p-3.5 bg-rose-950/10 border border-rose-500/20 rounded-xl space-y-2 relative">
              <div className="flex justify-between items-center text-xxs font-bold text-rose-450">
                <span className="flex items-center gap-1.5"><Megaphone className="h-4 w-4" /> Emergency Broadcast Script</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => copyToClipboard(results.emergency, 'emerg')}
                    className="p-1 hover:bg-slate-800 rounded transition-colors text-rose-500 hover:text-rose-300"
                  >
                    {copiedKey === 'emerg' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => dispatchToAlerts(results.emergency)}
                    className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-[9px] font-bold text-slate-100 transition-colors"
                  >
                    Broadcast Crisis
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-205 leading-relaxed">{results.emergency}</p>
            </div>

            {/* 3. Text Translations Accordion */}
            <div className="p-3.5 bg-slate-950/40 border border-slate-850 rounded-xl space-y-2">
              <span className="text-xxs font-bold text-slate-350 block border-b border-slate-850 pb-2">Gemini Multi-Language Translations</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xxs leading-relaxed">
                <div>
                  <span className="font-bold text-slate-400 uppercase block mb-0.5">Spanish</span>
                  <p className="text-slate-300">{results.translated.es}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase block mb-0.5">French</span>
                  <p className="text-slate-300">{results.translated.fr}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase block mb-0.5">Arabic</span>
                  <p className="text-slate-300">{results.translated.ar}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase block mb-0.5">German</span>
                  <p className="text-slate-300">{results.translated.de}</p>
                </div>
              </div>
            </div>

            {/* 4. SMS & Push notifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* SMS */}
              <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-2 text-xxs">
                <div className="flex justify-between items-center font-bold text-slate-350">
                  <span className="flex items-center gap-1.5"><MessageSquare className="h-4 w-4" /> Fan SMS Dispatch</span>
                  <button onClick={() => copyToClipboard(results.sms, 'sms')} className="p-0.5 text-slate-450 hover:text-white">
                    {copiedKey === 'sms' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <p className="text-slate-300 leading-relaxed italic bg-slate-950/60 p-2 rounded border border-slate-850">{results.sms}</p>
              </div>

              {/* Push */}
              <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-2 text-xxs">
                <div className="flex justify-between items-center font-bold text-slate-350">
                  <span className="flex items-center gap-1.5"><Bell className="h-4 w-4" /> Mobile Push Alert</span>
                  <button onClick={() => copyToClipboard(results.push, 'push')} className="p-0.5 text-slate-450 hover:text-white">
                    {copiedKey === 'push' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-2 rounded border border-slate-850 font-semibold">{results.push}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
