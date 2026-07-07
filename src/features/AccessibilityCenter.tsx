import React from 'react';
import { useAppStore } from '../store';
import { Accessibility, Video, Eye, Keyboard, CheckCircle, Navigation, Volume2 } from 'lucide-react';

export const AccessibilityCenter: React.FC = () => {
  const user = useAppStore((state) => state.user);
  const updateAccessibility = useAppStore((state) => state.updateAccessibility);

  const prefs = user?.accessibilityPreferences || {
    highContrast: false,
    largeFont: false,
    reducedMotion: false,
    colorBlindSafe: false,
    voiceNavigation: false,
  };

  const handleToggle = (key: keyof typeof prefs) => {
    updateAccessibility({ [key]: !prefs[key] });
  };

  // Calculate live accessibility rating score
  const getAccessibilityScore = () => {
    let score = 80; // Baseline score
    if (prefs.highContrast) score += 5;
    if (prefs.largeFont) score += 5;
    if (prefs.reducedMotion) score += 4;
    if (prefs.colorBlindSafe) score += 3;
    if (prefs.voiceNavigation) score += 3;
    return Math.min(100, score);
  };

  const currentScore = getAccessibilityScore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
      
      {/* Settings Grid Panel */}
      <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Accessibility className="h-5 w-5 text-fifa-gold" />
            Universal Accessibility Console
          </h3>
          <p className="text-xxs text-slate-400 mt-1">Configure sensory, motion, and visual contrast modes to adapt the operational layout</p>
        </div>

        {/* Toggle Toggles List */}
        <div className="space-y-4 my-6">
          {[
            { key: 'highContrast', label: 'High Contrast Mode', desc: 'Increases text and border color differences for visual clarity.', icon: Eye },
            { key: 'largeFont', label: 'Large Scale Fonts (+20%)', desc: 'Rescales root fonts to improve text readability across pages.', icon: Eye },
            { key: 'reducedMotion', label: 'Reduced Interface Motion', desc: 'Disables parallax transitions and rapid slide animations.', icon: Keyboard },
            { key: 'colorBlindSafe', label: 'Color-Blind Safe Palette', desc: 'Adjusts density charts to ensure compatibility with protanopia.', icon: Eye },
            { key: 'voiceNavigation', label: 'Voice-Activated Shortcuts', desc: 'Activates offline microphone triggers for hands-free navigation.', icon: Volume2 }
          ].map((item) => {
            const Icon = item.icon;
            const val = prefs[item.key as keyof typeof prefs];
            return (
              <div 
                key={item.key} 
                className="flex items-start justify-between p-3.5 bg-slate-950/40 border border-slate-850 rounded-xl hover:border-slate-800 transition-colors"
              >
                <div className="flex gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 mt-0.5">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <label htmlFor={`toggle-${item.key}`} className="text-xs font-bold text-slate-200 block cursor-pointer">{item.label}</label>
                    <span className="text-xxs text-slate-400 leading-tight mt-0.5 block">{item.desc}</span>
                  </div>
                </div>

                {/* IOS Switch Slider */}
                <button
                  id={`toggle-${item.key}`}
                  role="switch"
                  aria-checked={val}
                  onClick={() => handleToggle(item.key as keyof typeof prefs)}
                  className={`w-11 h-6 shrink-0 rounded-full p-0.5 transition-colors relative flex items-center ${
                    val ? 'bg-emerald-500' : 'bg-slate-850'
                  } border border-slate-700/60`}
                >
                  <span className={`h-4.5 w-4.5 rounded-full bg-white transition-transform ${
                    val ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Live Accessibility Score Card */}
        <div className="p-4 bg-slate-950/30 border border-slate-850 rounded-xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xxs text-slate-450 uppercase font-bold">SmartHub Compliance Score</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>WCAG 2.1 AA Compliant</span>
            </div>
          </div>
          <div className="text-center shrink-0">
            <div className="text-2xl font-black text-emerald-400 font-mono">{currentScore}%</div>
            <span className="text-xxs text-slate-500 font-semibold uppercase">Accessibility Score</span>
          </div>
        </div>
      </div>

      {/* Wheelchair Paths & Sign Language Media streams */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        
        {/* Wheelchair Accessible Wayfinding */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4">
            <Navigation className="h-5 w-5 text-fifa-gold" />
            Wheelchair Accessible Routes & Elevator Status
          </h3>

          <div className="space-y-3">
            {[
              { name: 'Elevator Shaft B3 (East Stand)', desc: 'Direct route to section 104 accessible seats.', status: 'Operational', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
              { name: 'Elevator Shaft D1 (West Stand)', desc: 'Access to luxury press box wheelchair deck.', status: 'Operational', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
              { name: 'North concourse access ramp', desc: 'Gentle gradient, 4.2% incline path from Gate 1.', status: 'Clear', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
              { name: 'South escalator escalade', desc: 'Out of order. Steer users to South Shaft Elevator C2.', status: 'Out of Service', color: 'text-rose-400 border-rose-500/20 bg-rose-500/5' }
            ].map((route, i) => (
              <div key={i} className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-200">{route.name}</h4>
                  <p className="text-xxs text-slate-400 leading-tight mt-0.5">{route.desc}</p>
                </div>
                <span className={`text-xxs font-bold px-2 py-0.5 border rounded-full shrink-0 ml-3 ${route.color}`}>
                  {route.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Sign Language Video Support */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Video className="h-5 w-5 text-fifa-gold" />
            Live ASL/ISL Sign Language Assist Feed
          </h3>
          
          {/* Simulated Sign Language Stream Box */}
          <div className="h-44 bg-slate-950 border border-slate-850 rounded-xl relative flex items-center justify-center overflow-hidden">
            
            {/* Simulated Avatar Animation */}
            <div className="absolute inset-0 bg-slate-900/40 flex flex-col justify-center items-center text-center p-4">
              {/* Pulsing indicator */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-rose-600/10 border border-rose-600/20 px-2 py-0.5 rounded-full text-xxs font-bold text-rose-500">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                <span>LIVE ASSISTANCE ACTIVE</span>
              </div>

              {/* Hand Wave Avatar Graphic Mock */}
              <div className="h-16 w-16 rounded-full bg-fifa-gold/15 text-fifa-gold flex items-center justify-center border border-fifa-gold/25 animate-pulse-slow">
                <Accessibility className="h-8 w-8 text-fifa-gold" />
              </div>
              <h4 className="text-xs font-bold text-slate-200 mt-3">Stadium Interpreter stream #2</h4>
              <p className="text-xxs text-slate-500 leading-tight mt-1 max-w-xs">Translating public stadium audio broadcasts and match commentary into sign language.</p>
            </div>
            
            {/* Screen border styling overlay */}
            <div className="absolute inset-0 border border-slate-800 pointer-events-none rounded-xl" />
          </div>
        </div>

      </div>
    </div>
  );
};
