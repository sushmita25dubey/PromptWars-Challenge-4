import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Users, Info, ShieldAlert, Sparkles, Clock } from 'lucide-react';

export const SmartCrowdManagement: React.FC = () => {
  const { stadiumZones, addAlert } = useAppStore();
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-gate-4');
  const [timeForecast, setTimeForecast] = useState<number>(15); // minutes forecast

  const selectedZone = stadiumZones.find((z) => z.id === selectedZoneId) || stadiumZones[0];

  // Helper to color code density states
  const getDensityColor = (density: number) => {
    if (density < 50) return 'stroke-emerald-500 fill-emerald-500/10';
    if (density < 80) return 'stroke-amber-500 fill-amber-500/10';
    return 'stroke-rose-600 fill-rose-600/20';
  };

  const getDensityBadge = (density: number) => {
    if (density < 50) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (density < 80) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse';
  };

  // Simulating predictive crowd density calculations
  const getForecastDensity = (density: number, forecastMin: number) => {
    // Simulated prediction algorithm: Zone Gate 4 and South Stand will trend up during post-match, then decrease
    let modifier = 0;
    if (selectedZoneId === 'zone-gate-4') {
      modifier = forecastMin === 15 ? 1 : forecastMin === 30 ? -12 : -45;
    } else if (selectedZoneId === 'zone-south') {
      modifier = forecastMin === 15 ? 4 : forecastMin === 30 ? 6 : -10;
    } else {
      modifier = forecastMin === 15 ? 5 : forecastMin === 30 ? 12 : 18;
    }
    return Math.max(10, Math.min(100, density + modifier));
  };

  const currentForecastDensity = getForecastDensity(selectedZone.crowdDensity, timeForecast);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
      
      {/* Visual Stadium Twin Map Card */}
      <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Users className="h-5 w-5 text-fifa-gold" />
            Interactive Stadium Live Crowd Map
          </h3>
          <p className="text-xxs text-slate-400 mt-1">Select a stand or gateway on the plan to view real-time operations telemetry</p>
        </div>

        {/* Stadium SVG Vector Layout */}
        <div className="my-6 flex justify-center items-center h-72 sm:h-80 relative bg-slate-950/40 rounded-xl border border-slate-850 p-4">
          <svg viewBox="0 0 400 400" className="w-full max-w-[340px] h-auto">
            {/* Pitch Outer Ring */}
            <circle cx="200" cy="200" r="170" fill="none" stroke="#1e293b" strokeWidth="2" />
            
            {/* North Stand Area A */}
            <path
              d="M 100 100 A 140 140 0 0 1 300 100 L 270 130 A 100 100 0 0 0 130 130 Z"
              onClick={() => setSelectedZoneId('zone-north')}
              className={`cursor-pointer transition-all hover:opacity-80 stroke-[2] ${getDensityColor(82)} ${
                selectedZoneId === 'zone-north' ? 'stroke-fifa-gold stroke-[3] fill-slate-800/40' : ''
              }`}
            />
            <text x="200" y="85" textAnchor="middle" className="fill-slate-400 text-[10px] font-bold pointer-events-none">Zone A (North)</text>

            {/* East Stand Area B */}
            <path
              d="M 300 100 A 140 140 0 0 1 300 300 L 270 270 A 100 100 0 0 0 270 130 Z"
              onClick={() => setSelectedZoneId('zone-east')}
              className={`cursor-pointer transition-all hover:opacity-80 stroke-[2] ${getDensityColor(45)} ${
                selectedZoneId === 'zone-east' ? 'stroke-fifa-gold stroke-[3] fill-slate-800/40' : ''
              }`}
            />
            <text x="315" y="205" textAnchor="middle" className="fill-slate-400 text-[10px] font-bold pointer-events-none rotate-90 origin-[315px_205px]">Zone B (East)</text>

            {/* South Stand Area C */}
            <path
              d="M 300 300 A 140 140 0 0 1 100 300 L 130 270 A 100 100 0 0 0 270 270 Z"
              onClick={() => setSelectedZoneId('zone-south')}
              className={`cursor-pointer transition-all hover:opacity-80 stroke-[2] ${getDensityColor(91)} ${
                selectedZoneId === 'zone-south' ? 'stroke-fifa-gold stroke-[3] fill-slate-800/40' : ''
              }`}
            />
            <text x="200" y="325" textAnchor="middle" className="fill-slate-400 text-[10px] font-bold pointer-events-none">Zone C (South)</text>

            {/* West Stand Area D */}
            <path
              d="M 100 300 A 140 140 0 0 1 100 100 L 130 130 A 100 100 0 0 0 130 270 Z"
              onClick={() => setSelectedZoneId('zone-west')}
              className={`cursor-pointer transition-all hover:opacity-80 stroke-[2] ${getDensityColor(30)} ${
                selectedZoneId === 'zone-west' ? 'stroke-fifa-gold stroke-[3] fill-slate-800/40' : ''
              }`}
            />
            <text x="85" y="205" textAnchor="middle" className="fill-slate-400 text-[10px] font-bold pointer-events-none -rotate-90 origin-[85px_205px]">Zone D (West)</text>

            {/* Football Pitch center */}
            <rect x="140" y="150" width="120" height="100" rx="4" className="fill-emerald-950/20 stroke-slate-800 stroke-2" />
            <circle cx="200" cy="200" r="25" className="fill-none stroke-slate-800/40 stroke-2" />
            <line x1="140" y1="200" x2="260" y2="200" className="stroke-slate-800/40 stroke-2" />

            {/* Interactive Gate 4 indicator */}
            <circle
              cx="100"
              cy="100"
              r="12"
              onClick={() => setSelectedZoneId('zone-gate-4')}
              className={`cursor-pointer transition-transform hover:scale-110 stroke-[2] ${getDensityColor(98)} ${
                selectedZoneId === 'zone-gate-4' ? 'stroke-fifa-gold stroke-[3]' : ''
              }`}
            />
            <text x="94" y="103" className="fill-slate-100 text-[8px] font-black pointer-events-none">G4</text>
          </svg>

          {/* Color Legend Overlay */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-850 px-2 py-1.5 rounded-lg flex flex-col gap-1 text-[9px]">
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-emerald-500/20 border border-emerald-500" /><span>Low Density (&lt;50%)</span></div>
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-amber-500/20 border border-amber-500" /><span>Medium (50%-80%)</span></div>
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-rose-600/20 border border-rose-600 animate-pulse" /><span>Congested (&gt;80%)</span></div>
          </div>
        </div>

        {/* Dynamic Zone Details Footer */}
        <div className="flex items-center justify-between text-xs bg-slate-950/30 p-3 rounded-xl border border-slate-850">
          <span>Active Map Layer: <strong className="text-slate-200">Thermal Heatmap v1.2</strong></span>
          <span className="text-[10px] text-slate-400">Last synchronized: Just Now</span>
        </div>
      </div>

      {/* Rerouting & Operations Telemetry Console */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Selected Zone Live Telemetry */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <span className={`text-[10px] px-2 py-0.5 border rounded-full font-bold uppercase tracking-wider ${getDensityBadge(selectedZone.crowdDensity)}`}>
            {selectedZone.status.toUpperCase()}
          </span>
          <h3 className="text-base font-bold text-slate-100 mt-2">{selectedZone.name}</h3>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850">
              <span className="text-xxs text-slate-400 uppercase font-semibold">Density Level</span>
              <p className="text-lg font-black text-slate-200 mt-0.5">{selectedZone.crowdDensity}%</p>
            </div>
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850">
              <span className="text-xxs text-slate-400 uppercase font-semibold">Current Wait</span>
              <p className="text-lg font-black text-slate-200 mt-0.5">
                {selectedZone.crowdDensity > 90 ? '48 mins' : selectedZone.crowdDensity > 70 ? '25 mins' : '5 mins'}
              </p>
            </div>
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850">
              <span className="text-xxs text-slate-400 uppercase font-semibold">Headcount</span>
              <p className="text-lg font-black text-slate-200 mt-0.5">{selectedZone.currentCount} / {selectedZone.capacity}</p>
            </div>
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850">
              <span className="text-xxs text-slate-400 uppercase font-semibold">Active Incidents</span>
              <p className={`text-lg font-black mt-0.5 ${selectedZone.incidentsCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                {selectedZone.incidentsCount}
              </p>
            </div>
          </div>

          {/* Predictive Congestion Analysis */}
          <div className="mt-5 border-t border-slate-800/80 pt-4">
            <h4 className="text-xxs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-fifa-gold" />
              Gemini Congestion Forecasting
            </h4>
            
            <div className="flex gap-2 mt-3">
              {[15, 30, 45].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setTimeForecast(mins)}
                  className={`flex-1 py-1.5 text-xxs font-bold rounded-lg border transition-all ${
                    timeForecast === mins
                      ? 'bg-fifa-gold text-slate-950 border-fifa-gold'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  +{mins} min
                </button>
              ))}
            </div>

            {/* Prediction Output */}
            <div className="mt-3 p-3 rounded-lg bg-slate-950/60 border border-slate-850 flex items-center justify-between text-xs">
              <span className="text-slate-400">Forecasted Density:</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-200">{currentForecastDensity}%</span>
                <span className={`h-2.5 w-2.5 rounded-full ${
                  currentForecastDensity > 80 ? 'bg-rose-500 animate-pulse' : currentForecastDensity > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-fifa-gold" />
            AI Rerouting Assistant
          </h3>

          {selectedZone.crowdDensity > 80 ? (
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs flex gap-3">
              <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0" />
              <div className="space-y-1">
                <h4 className="font-bold text-rose-300">Alternate Gateway Dispatch</h4>
                <p className="text-slate-300 leading-relaxed">
                  Gate 4 has reached peak flow (98% capacity). Automatically routing fans to Gate 2 (5 mins walk, 8 mins wait) and Gate 3 (8 mins walk, 5 mins wait).
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => addAlert({
                      severity: 'high',
                      title: 'Gate 4 Overflow Reroute',
                      description: 'AI Rerouting active: Directing all entrants from Gate 4 to Gate 2/3.',
                      zone: 'Gate 4 Entrance'
                    })}
                    className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 font-bold text-slate-100 transition-colors uppercase tracking-wider text-[9px]"
                  >
                    Broadcast Advisory
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-850 text-xs flex gap-3">
              <Info className="h-5 w-5 text-fifa-gold shrink-0" />
              <div className="space-y-1">
                <h4 className="font-bold text-slate-200">Zone Operations Optimal</h4>
                <p className="text-slate-400 leading-relaxed">
                  Stands are reporting normal flow speeds. Congestion predictions do not indicate bottlenecks for the next 30 minutes.
                </p>
              </div>
            </div>
          )}

          {/* Pedestrian Pathways Status */}
          <div className="space-y-2 border-t border-slate-800/80 pt-4">
            <h4 className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Active Bypass Portals</h4>
            {[
              { name: 'Gateway 2 Bypass Pathway', status: 'Active (Low load)', occupancy: '14%' },
              { name: 'East Concourse Escort Corridor', status: 'Standby', occupancy: '0%' }
            ].map((bypass, i) => (
              <div key={i} className="flex justify-between items-center bg-slate-950/30 p-2.5 rounded-lg border border-slate-850/60 text-xxs">
                <span className="text-slate-300 font-medium">{bypass.name}</span>
                <span className="text-emerald-400 font-bold">{bypass.status}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
