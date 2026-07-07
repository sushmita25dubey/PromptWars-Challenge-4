import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Bus, Train, Navigation, Car, AlertTriangle, Route, Clock, CreditCard } from 'lucide-react';

export const TransportAi: React.FC = () => {
  const { transportOptions } = useAppStore();
  const [selectedTransportId, setSelectedTransportId] = useState<string>('t-1');

  const selectedOption = transportOptions.find(t => t.id === selectedTransportId) || transportOptions[0];

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'metro': return <Train className="h-5 w-5" />;
      case 'bus': return <Bus className="h-5 w-5" />;
      case 'taxi': return <Car className="h-5 w-5" />;
      case 'walking': return <Navigation className="h-5 w-5" />;
      default: return <Route className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'smooth': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'delayed': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'congested': return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      default: return 'text-slate-400 border-slate-700 bg-slate-800/50';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
      
      {/* Route List Selection Panel */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Route className="h-5 w-5 text-fifa-gold" />
            FIFA AI Transit Dispatch
          </h3>
          <p className="text-xxs text-slate-400 mt-1">Real-time stadium routes, traffic delays, and occupancy trackers</p>
        </div>

        <div className="space-y-3">
          {transportOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedTransportId(opt.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-fifa-gold ${
                selectedTransportId === opt.id
                  ? 'border-fifa-gold bg-slate-800 shadow-inner'
                  : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${
                  selectedTransportId === opt.id ? 'bg-fifa-gold text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}>
                  {getTransportIcon(opt.type)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{opt.name}</h4>
                  <p className="text-xxs text-slate-400 mt-0.5 line-clamp-1">{opt.description}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className={`text-[9px] px-2 py-0.5 border rounded-full font-bold uppercase tracking-wider ${getStatusColor(opt.status)}`}>
                  {opt.status}
                </span>
                <span className="text-xxs font-mono text-slate-300 font-semibold">{opt.durationMin} mins</span>
              </div>
            </button>
          ))}
        </div>

        {/* Dynamic Parking Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mt-2">
          <h4 className="text-xxs font-bold text-slate-400 uppercase tracking-wider block mb-3">Live Parking Lot Capacity</h4>
          <div className="space-y-2">
            {[
              { lot: 'Lot A (VVIP/Staff)', cap: '92%', color: 'bg-rose-500' },
              { lot: 'Lot B & C (General)', cap: '78%', color: 'bg-amber-500' },
              { lot: 'Lot G (Rideshare Hub)', cap: '89%', color: 'bg-rose-500' },
              { lot: 'Lot H (Park & Ride)', cap: '34%', color: 'bg-emerald-500' }
            ].map((p, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xxs font-medium text-slate-300">
                  <span>{p.lot}</span>
                  <span>{p.cap} Filled</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${p.color}`} style={{ width: p.cap }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simulated Live Route Maps Graphics */}
      <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
        
        {/* Active Route Details Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Simulated Google Transit Map</span>
            <h3 className="text-sm font-bold text-slate-200 mt-0.5">{selectedOption.name}</h3>
          </div>
          <div className="flex items-center gap-4 text-xxs font-medium">
            <span className="flex items-center gap-1 text-slate-300"><Clock className="h-3.5 w-3.5 text-fifa-gold" /> {selectedOption.durationMin} mins</span>
            <span className="flex items-center gap-1 text-slate-300"><CreditCard className="h-3.5 w-3.5 text-fifa-gold" /> {selectedOption.cost}</span>
          </div>
        </div>

        {/* Vector Simulated Google Map */}
        <div className="my-6 h-72 sm:h-80 relative bg-slate-950 rounded-xl overflow-hidden border border-slate-850">
          
          {/* Animated Route Line Overlay */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 500">
            {/* Draw Simulated Roads */}
            <path d="M 50 100 Q 250 200 450 100" fill="none" stroke="#334155" strokeWidth="6" />
            <path d="M 50 400 L 450 400" fill="none" stroke="#334155" strokeWidth="6" />
            <path d="M 100 50 L 100 450" fill="none" stroke="#334155" strokeWidth="6" />
            <path d="M 400 50 L 400 450" fill="none" stroke="#334155" strokeWidth="6" />

            {/* Stadium Pin Circle */}
            <circle cx="250" cy="250" r="40" className="fill-blue-950/40 stroke-fifa-gold stroke-2" />
            <text x="250" y="254" textAnchor="middle" className="fill-fifa-gold text-[8px] font-black">STADIUM</text>

            {/* Dynamic Transit lines depending on selected route */}
            {selectedOption.type === 'metro' && (
              <>
                {/* Metro Line Path */}
                <path d="M 100 50 L 100 250 Q 180 250 250 250" fill="none" stroke="#00a650" strokeWidth="4" strokeDasharray="6,4" />
                {/* Train Pulse */}
                <circle cx="100" cy="150" r="6" fill="#00a650" className="animate-ping" />
                <circle cx="100" cy="150" r="4" fill="#00a650" />
                <text x="75" y="153" className="fill-slate-400 text-[8px] font-bold">M1 Train</text>
              </>
            )}

            {/* Bus Shuttle Route */}
            {selectedOption.type === 'bus' && (
              <>
                <path d="M 400 450 L 400 250 L 250 250" fill="none" stroke="#d3112e" strokeWidth="4" />
                <circle cx="400" cy="350" r="6" fill="#d3112e" className="animate-ping" />
                <circle cx="400" cy="350" r="4" fill="#d3112e" />
                <text x="345" y="353" className="fill-slate-400 text-[8px] font-bold">Shuttle Route</text>
              </>
            )}

            {/* Taxi Lot Path */}
            {selectedOption.type === 'taxi' && (
              <>
                <path d="M 50 100 Q 250 200 250 250" fill="none" stroke="#dfb04b" strokeWidth="3" />
                <circle cx="150" cy="150" r="4" fill="#dfb04b" />
                <text x="145" y="140" className="fill-slate-400 text-[8px] font-bold">Lot G Zone</text>
              </>
            )}

            {/* Walking Pathway */}
            {selectedOption.type === 'walking' && (
              <>
                <path d="M 250 250 Q 250 350 400 400" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="3,3" />
                <circle cx="325" cy="325" r="5" fill="#3b82f6" className="animate-bounce" />
                <text x="275" y="320" className="fill-slate-400 text-[8px] font-bold">Walking Path</text>
              </>
            )}
          </svg>

          {/* Alert Callout for delayed routes */}
          {selectedOption.status !== 'smooth' && (
            <div className="absolute top-3 left-3 right-3 p-3 bg-slate-900/95 border border-amber-500/30 rounded-xl text-xxs flex items-start gap-2.5 backdrop-blur shadow-lg">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-slate-200">Alert: Transit Delay Detected</span>
                <p className="text-slate-400 mt-0.5 leading-relaxed">{selectedOption.description}</p>
              </div>
            </div>
          )}

          {/* Occupancy Indicator Badge */}
          <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-850 px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xxs">
            <span className="text-slate-400">Load Factor:</span>
            <span className={`font-bold ${
              selectedOption.occupancyPercent > 85 ? 'text-rose-400' : selectedOption.occupancyPercent > 60 ? 'text-amber-400' : 'text-emerald-400'
            }`}>{selectedOption.occupancyPercent}%</span>
          </div>

          <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-850 px-2.5 py-1.5 rounded-lg text-[9px] text-slate-400 font-mono">
            GPS: Lat 40.8135, Lng -74.0743
          </div>
        </div>

        {/* Direction Text Description */}
        <div className="p-3.5 bg-slate-950/40 border border-slate-850 rounded-xl text-xs text-slate-300">
          <span className="font-bold text-slate-200 block mb-1">Route Instructions</span>
          <p className="leading-relaxed">{selectedOption.routeDetails || 'Proceed along marked stadium directional corridors. Marshall guides are deployed at all main intersections.'}</p>
        </div>
      </div>

    </div>
  );
};
