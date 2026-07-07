import React, { useState } from 'react';
import { AlertOctagon, ShieldAlert, HeartHandshake, X, Navigation } from 'lucide-react';
import { useAppStore } from '../store';

export const EmergencyButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const addIncident = useAppStore((state) => state.addIncident);

  const handleSOS = (type: 'medical' | 'security' | 'crowd') => {
    // Broadcast SOS to Command Center
    addIncident({
      type: type === 'medical' ? 'medical' : type === 'security' ? 'security' : 'crowd',
      description: `🚨 URGENT SOS: Fan triggered emergency rescue request from South Stand (Zone C) - Row 12. Category: ${type.toUpperCase()}.`,
      severity: 'high',
      zone: 'South Stand (Zone C) - Row 12',
      reportedBy: 'SOS Button'
    });

    setSosSent(true);
    
    // Play subtle haptic pattern (simulated)
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 300]);
    }
  };

  const resetSOS = () => {
    setIsOpen(false);
    setSosSent(false);
  };

  return (
    <>
      {/* Floating SOS Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg shadow-rose-900/35 hover:bg-rose-500 transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-slate-900 border-2 border-white/20 animate-bounce"
        aria-label="Trigger Emergency SOS"
      >
        <AlertOctagon className="h-7 w-7" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div 
            className="w-full max-w-md bg-slate-900 rounded-2xl border border-rose-500/30 overflow-hidden shadow-2xl shadow-rose-950/20"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="sos-title"
          >
            {/* Header */}
            <div className="p-5 bg-rose-950/30 border-b border-rose-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-500">
                <AlertOctagon className="h-6 w-6 animate-pulse" />
                <h2 id="sos-title" className="text-xl font-bold tracking-tight uppercase">Emergency SOS Command</h2>
              </div>
              <button 
                onClick={resetSOS}
                className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {!sosSent ? (
                <>
                  <p className="text-sm text-slate-300 mb-5 leading-relaxed">
                    Triggering this SOS sends your exact stadium sector coordinates directly to first-aid teams, police marshals, and stadium directors.
                  </p>
                  
                  {/* Location Tag */}
                  <div className="mb-6 p-3 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center gap-2 text-xs text-slate-300">
                    <Navigation className="h-4 w-4 text-fifa-gold animate-pulse" />
                    <span>Estimated Position: <strong>South Stand (Zone C) - Row 12</strong></span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleSOS('medical')}
                      className="p-5 rounded-xl bg-slate-800/60 hover:bg-rose-950/20 border border-slate-700 hover:border-rose-500/50 flex flex-col items-center justify-center gap-3 text-center transition-all group animate-fade-in"
                    >
                      <div className="p-3 rounded-full bg-rose-600/10 text-rose-500 group-hover:bg-rose-600 group-hover:text-white transition-all">
                        <HeartHandshake className="h-6 w-6" />
                      </div>
                      <span className="font-semibold text-slate-200 text-sm">Medical Help</span>
                      <span className="text-xxs text-slate-400">Injury, fainting, heat stroke</span>
                    </button>

                    <button
                      onClick={() => handleSOS('security')}
                      className="p-5 rounded-xl bg-slate-800/60 hover:bg-rose-950/20 border border-slate-700 hover:border-rose-500/50 flex flex-col items-center justify-center gap-3 text-center transition-all group animate-fade-in"
                    >
                      <div className="p-3 rounded-full bg-amber-600/10 text-amber-500 group-hover:bg-amber-600 group-hover:text-white transition-all">
                        <ShieldAlert className="h-6 w-6" />
                      </div>
                      <span className="font-semibold text-slate-200 text-sm">Security / Riot</span>
                      <span className="text-xxs text-slate-400">Violence, hazards, theft</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-emerald-600/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30 animate-pulse">
                    <ShieldAlert className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mb-1">SOS Alert Dispatched</h3>
                  <p className="text-sm text-emerald-400 font-semibold mb-4">Command Center & Responders Notified</p>
                  
                  <div className="bg-slate-950/50 p-4 rounded-xl text-left border border-slate-800 text-xs text-slate-300 leading-relaxed mb-6 space-y-2">
                    <p>🚨 <strong>Assigned Unit:</strong> Medical Team Bravo & Security Sector South.</p>
                    <p>🕒 <strong>ETA:</strong> Less than 3 minutes.</p>
                    <p>ℹ️ <strong>Instructions:</strong> Please remain calm and stay in your current location if safe to do so. If in immediate danger, walk toward Exit C-Ramp.</p>
                  </div>

                  <button
                    onClick={resetSOS}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors border border-slate-700"
                  >
                    Close & Keep Active
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
