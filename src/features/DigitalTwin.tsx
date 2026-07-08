import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { Layers, Play, Pause, Sparkles, Cpu } from 'lucide-react';

export const DigitalTwin: React.FC = () => {
  const { stadiumZones, incidents } = useAppStore();
  const [selectedStand, setSelectedStand] = useState('zone-south');
  const [simSpeed, setSimSpeed] = useState<number>(1); // 1x, 2x, 5x
  const [isSimulating, setIsSimulating] = useState(true);
  const [crowdFlowRate, setCrowdFlowRate] = useState(254); // fans per min

  // Dynamic simulation simulation loop
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setCrowdFlowRate((prev) => {
        const drift = Math.floor(Math.random() * 11) - 5;
        const speedMultiplier = simSpeed;
        return Math.max(100, Math.min(500, prev + drift * speedMultiplier));
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [isSimulating, simSpeed]);

  const activeZone = stadiumZones.find(z => z.id === selectedStand) || stadiumZones[0];

  // Helper to color stands based on isometric load
  const getTwinColor = (id: string, density: number) => {
    const isSelected = selectedStand === id;
    if (density < 50) return isSelected ? 'fill-emerald-400 stroke-emerald-300' : 'fill-emerald-600/30 stroke-emerald-500/50';
    if (density < 80) return isSelected ? 'fill-amber-400 stroke-amber-300' : 'fill-amber-600/30 stroke-amber-500/50';
    return isSelected ? 'fill-rose-500 stroke-rose-450' : 'fill-rose-600/30 stroke-rose-500/50 animate-pulse';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
      
      {/* 3D Isometric Projection Card */}
      <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Layers className="h-5 w-5 text-fifa-gold" />
              FIFA 3D Stadium Digital Twin
            </h3>
            
            {/* Simulation controls */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-xxs">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title={isSimulating ? "Pause Simulation" : "Start Simulation"}
              >
                {isSimulating ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 fill-slate-400" />}
              </button>
              <span className="text-slate-500 border-l border-slate-800 h-3 pl-1.5" />
              <select
                value={simSpeed}
                onChange={(e) => setSimSpeed(Number(e.target.value))}
                className="bg-transparent border-none outline-none focus:ring-0 text-slate-350 cursor-pointer font-bold"
                aria-label="Simulation speed select"
              >
                <option value="1" className="bg-slate-900">Sim 1x</option>
                <option value="2" className="bg-slate-900">Sim 2x</option>
                <option value="5" className="bg-slate-900">Sim 5x</option>
              </select>
            </div>
          </div>
          <p className="text-xxs text-slate-400 mt-1">Isometric telemetry modeling stadium stands, crowd entry flows, and active incidents</p>
        </div>

        {/* 3D Canvas Vector Simulator (pure CSS/SVG 3D projection grid) */}
        <div className="my-6 h-80 bg-slate-950 border border-slate-850 rounded-xl relative flex items-center justify-center overflow-hidden p-4">
          <svg className="w-full max-w-[420px] h-auto" viewBox="0 0 400 300">
            {/* Base grid lines for 3D depth */}
            <line x1="50" y1="220" x2="350" y2="220" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />
            <line x1="100" y1="150" x2="300" y2="150" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />
            
            {/* Draw Isometric Football Pitch center */}
            {/* Projection matrix mapping: x_iso = x - y, y_iso = (x + y)/2 */}
            <polygon points="200,100 290,145 200,190 110,145" className="fill-emerald-950/20 stroke-slate-800 stroke-2" />
            <polygon points="200,120 250,145 200,170 150,145" className="fill-none stroke-slate-800/40 stroke-2" />
            <line x1="200" y1="100" x2="200" y2="190" className="stroke-slate-800/40 stroke-2" />

            {/* Stand 3D Blocks - North Stand (Top) */}
            <polygon 
              points="140,80 200,50 260,80 200,100"
              onClick={() => setSelectedStand('zone-north')}
              className={`cursor-pointer transition-all hover:opacity-85 stroke-[2] ${getTwinColor('zone-north', 82)}`}
            />
            <text x="200" y="65" textAnchor="middle" className="fill-slate-350 text-[8px] font-bold pointer-events-none uppercase">North Stand</text>

            {/* Stand 3D Blocks - East Stand (Right) */}
            <polygon 
              points="260,80 320,110 320,180 260,150"
              onClick={() => setSelectedStand('zone-east')}
              className={`cursor-pointer transition-all hover:opacity-85 stroke-[2] ${getTwinColor('zone-east', 45)}`}
            />
            <text x="300" y="140" textAnchor="middle" className="fill-slate-350 text-[8px] font-bold pointer-events-none uppercase rotate-[26deg] origin-[300px_140px]">East Stand</text>

            {/* Stand 3D Blocks - South Stand (Bottom) */}
            <polygon 
              points="145,210 200,190 255,210 200,240"
              onClick={() => setSelectedStand('zone-south')}
              className={`cursor-pointer transition-all hover:opacity-85 stroke-[2] ${getTwinColor('zone-south', 91)}`}
            />
            <text x="200" y="222" textAnchor="middle" className="fill-slate-350 text-[8px] font-bold pointer-events-none uppercase">South Stand</text>

            {/* Stand 3D Blocks - West Stand (Left) */}
            <polygon 
              points="80,110 140,80 140,150 80,180"
              onClick={() => setSelectedStand('zone-west')}
              className={`cursor-pointer transition-all hover:opacity-85 stroke-[2] ${getTwinColor('zone-west', 30)}`}
            />
            <text x="100" y="140" textAnchor="middle" className="fill-slate-350 text-[8px] font-bold pointer-events-none uppercase -rotate-[26deg] origin-[100px_140px]">West Stand</text>

            {/* Live Incidents Glowing Markers inside isometric space */}
            {incidents.map((inc) => {
              if (inc.status === 'resolved') return null;
              
              // Map incident zones to coordinates
              let cx = 200, cy = 210; // default south
              if (inc.zone.includes('East') || inc.zone.includes('Zone B')) {
                cx = 280; cy = 115;
              } else if (inc.zone.includes('Gate 4') || inc.zone.includes('North')) {
                cx = 200; cy = 70;
              }

              return (
                <g key={inc.id} className="cursor-pointer" onClick={() => setSelectedStand(inc.zone.includes('East') ? 'zone-east' : inc.zone.includes('Gate 4') ? 'zone-north' : 'zone-south')}>
                  <circle cx={cx} cy={cy} r="8" fill="#e11d48" className="animate-ping opacity-60" />
                  <circle cx={cx} cy={cy} r="5" fill="#e11d48" />
                  <path d={`M ${cx} ${cy} L ${cx} ${cy - 12}`} stroke="#e11d48" strokeWidth="2" />
                  <rect x={cx - 15} y={cy - 24} width="30" height="10" rx="2" fill="#e11d48" />
                  <text x={cx} y={cy - 17} textAnchor="middle" className="fill-white text-[6px] font-black uppercase">INC</text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Simulation Dashboard readout overlay */}
          <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-850 px-2 py-1.5 rounded-lg flex flex-col gap-0.5 text-[9px] text-slate-300 font-mono shadow-md">
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" /> GPU Acceleration: ON</span>
            <span>Sim Velocity: {crowdFlowRate} / min</span>
          </div>
        </div>

        {/* Dynamic telemetry footer */}
        <div className="flex justify-between items-center bg-slate-950/30 p-3 rounded-xl border border-slate-850 text-xs">
          <span>Active Projections: <strong className="text-slate-200">Twin Vector Mesh v4.0</strong></span>
          <span className="text-[10px] text-slate-400">Simulation Status: {isSimulating ? 'Simulating' : 'Paused'}</span>
        </div>
      </div>

      {/* Selected Stand Telemetry & AI Prediction */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Operations detail panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h4 className="text-xxs font-bold text-slate-450 uppercase tracking-wider block">Stand Operational Readout</h4>
          <h3 className="text-base font-bold text-slate-200 mt-2 capitalize">{activeZone.name}</h3>

          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Thermal Density</span>
              <span className="font-bold text-slate-200">{activeZone.crowdDensity}%</span>
            </div>
            <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Total Count</span>
              <span className="font-bold text-slate-200">{activeZone.currentCount.toLocaleString()} fans</span>
            </div>
            <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Stand Capacity</span>
              <span className="font-bold text-slate-200">{activeZone.capacity.toLocaleString()} seats</span>
            </div>
            <div className="flex justify-between items-center text-xs py-1">
              <span className="text-slate-400">Status</span>
              <span className={`font-bold capitalize ${activeZone.status === 'normal' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {activeZone.status}
              </span>
            </div>
          </div>
        </div>

        {/* AI Predictions / Stress Testing */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-fifa-gold animate-pulse" />
            AI Operations Stress Forecast
          </h3>

          <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-2 text-xs">
            <span className="font-bold text-slate-200 block">Bottleneck Stress Index</span>
            <div className="flex items-center justify-between">
              <span className="text-slate-450 text-xxs">Simulation flow rate:</span>
              <span className="font-bold text-slate-300">{crowdFlowRate} fans/min</span>
            </div>
            
            {/* Risk rating */}
            <div className="flex justify-between items-center border-t border-slate-850 pt-2 mt-2 text-xxs">
              <span>Evacuation Bottleneck Risk:</span>
              <span className={`font-bold ${
                activeZone.crowdDensity > 80 ? 'text-rose-400' : 'text-emerald-400'
              }`}>{activeZone.crowdDensity > 80 ? 'CRITICAL (92%)' : 'NORMAL (12%)'}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl flex gap-2.5 text-xxs leading-relaxed items-start text-slate-350">
            <Cpu className="h-4.5 w-4.5 text-fifa-gold shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-200 block mb-0.5">Core Neural Engine Analytics</span>
              <p>Evaluating crowd flow velocity metrics using isometric standalone models. Stress threshold is calculated at 400 exits/min.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
