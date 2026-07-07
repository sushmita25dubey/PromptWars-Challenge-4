import React from 'react';
import { useAppStore } from '../store';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, Activity, Sun, ShieldAlert, Award, 
  Leaf, Trash2, BatteryCharging, Droplet, Clock, Sparkles
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { matches, stadiumZones, transportOptions, alerts, volunteerTasks, sustainability } = useAppStore();

  // Query live match telemetry using React Query
  const { data: matchTelemetry } = useQuery({
    queryKey: ['matchTelemetry'],
    queryFn: async () => {
      // Simulate stadium API latency
      await new Promise((resolve) => setTimeout(resolve, 200));
      return matches;
    },
    initialData: matches,
  });

  // Find live match
  const liveMatch = matchTelemetry.find(m => m.status === 'live') || matchTelemetry[0];

  // Calculate crowd stats
  const totalCapacity = stadiumZones.reduce((acc, curr) => acc + curr.capacity, 0);
  const totalCount = stadiumZones.reduce((acc, curr) => acc + curr.currentCount, 0);
  const avgDensity = Math.round((totalCount / totalCapacity) * 100);

  // Status indicators helpers
  const activeAlerts = alerts.filter(a => a.status === 'active');
  const activeTasks = volunteerTasks.filter(t => t.status !== 'completed');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Dynamic Greeting & KPI Summary Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100">Operations Control Tower</h2>
          <p className="text-xxs sm:text-xs text-slate-450 mt-0.5">Real-time stadium sensor grid telemetry for FIFA World Cup 2026</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xxs font-mono text-slate-350">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Core Telemetry: Synchronized</span>
        </div>
      </div>

      {/* Realtime KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Stadium Occupancy', value: `${avgDensity}%`, sub: `${totalCount.toLocaleString()} / ${totalCapacity.toLocaleString()}`, icon: Users, color: 'text-fifa-gold bg-fifa-gold/10' },
          { label: 'Active Alerts', value: activeAlerts.length.toString(), sub: `${alerts.length - activeAlerts.length} Resolved`, icon: ShieldAlert, color: activeAlerts.length > 0 ? 'text-rose-450 bg-rose-500/10 animate-pulse' : 'text-slate-400 bg-slate-800/60' },
          { label: 'Volunteer Staff', value: '420', sub: `${activeTasks.length} tasks dispatching`, icon: Award, color: 'text-blue-400 bg-blue-500/10' },
          { label: 'Eco Offset', value: `${sustainability.environmentalScore}%`, sub: `${sustainability.wasteRecycledKg}kg recycled`, icon: Leaf, color: 'text-emerald-450 bg-emerald-500/10' }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between shadow-md">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-450 uppercase font-bold">{kpi.label}</span>
                <p className="text-xl font-black text-slate-200 mt-1">{kpi.value}</p>
                <span className="text-[9px] text-slate-500 font-medium block">{kpi.sub}</span>
              </div>
              <div className={`p-2.5 rounded-xl ${kpi.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary widgets layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column widgets: Live Match, Crowd, Sustainability */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Live Match Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            {/* Background highlight */}
            <div className="absolute top-0 right-0 w-[30%] h-full bg-gradient-to-l from-blue-900/10 to-transparent pointer-events-none" />
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-rose-600/10 text-rose-500 border border-rose-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                Live Match
              </span>
              <span className="text-xxs text-slate-400 font-mono font-semibold flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {liveMatch.minute}' played</span>
            </div>

            <div className="flex items-center justify-around py-5">
              {/* Home Team */}
              <div className="text-center space-y-1 flex-1">
                <span className="text-3xl filter drop-shadow-md block">{liveMatch.homeFlag}</span>
                <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider">{liveMatch.homeTeam}</h4>
              </div>

              {/* Scoreline */}
              <div className="text-center px-4 flex flex-col justify-center shrink-0">
                <div className="text-3xl font-black text-slate-100 tracking-wider font-mono">
                  {liveMatch.homeScore} : {liveMatch.awayScore}
                </div>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">Scoreboard</span>
              </div>

              {/* Away Team */}
              <div className="text-center space-y-1 flex-1">
                <span className="text-3xl filter drop-shadow-md block">{liveMatch.awayFlag}</span>
                <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider">{liveMatch.awayTeam}</h4>
              </div>
            </div>

            <div className="text-center text-xxs text-slate-450 border-t border-slate-800/80 pt-3 flex justify-between items-center px-2">
              <span>🏟️ Venue: {liveMatch.stadium}</span>
              <span>🎫 Gate Count: {liveMatch.attendance.toLocaleString()} seats filled</span>
            </div>
          </div>

          {/* Crowd density stand-by-stand list */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Users className="h-4.5 w-4.5 text-fifa-gold" />
              Sectors Crowd Density Telemetry
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stadiumZones.slice(0, 4).map((zone) => {
                const isOvercrowded = zone.crowdDensity > 80;
                return (
                  <div key={zone.id} className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xxs font-bold text-slate-200">{zone.name}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                        isOvercrowded ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-450 border-emerald-500/20'
                      }`}>
                        {zone.crowdDensity}% Density
                      </span>
                    </div>

                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isOvercrowded ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${zone.crowdDensity}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>Wait time: {isOvercrowded ? '45 mins' : '5 mins'}</span>
                      <span>{zone.currentCount.toLocaleString()} visitors</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core Resources metrics grid */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-fifa-gold" />
              Stadium Resource Usage Diagnostics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Electricity Consumption', value: `${sustainability.energyConsumptionKwh.toLocaleString()} kW`, metric: '42% Solar sync', icon: BatteryCharging, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                { label: 'Water Reservoir consumption', value: `${sustainability.waterConsumptionLiters.toLocaleString()} Liters`, metric: '100% purification rate', icon: Droplet, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                { label: 'Waste diversion index', value: `${sustainability.wasteRecycledKg.toLocaleString()} kg`, metric: '82% recycled', icon: Trash2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
              ].map((res, i) => {
                const Icon = res.icon;
                return (
                  <div key={i} className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-2 flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg border ${res.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold leading-tight">{res.label}</span>
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-200 mt-1">{res.value}</p>
                      <span className="text-[9px] text-slate-500 font-medium block">{res.metric}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column widgets: Alerts, AI Recommendations, Weather */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Weather and Environment */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-450 uppercase font-bold flex items-center gap-1"><Sun className="h-3.5 w-3.5 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} /> Weather Station</span>
              <p className="text-xl font-black text-slate-200 mt-1">74°F Clear Sky</p>
              <span className="text-[9px] text-slate-500 font-medium block">Humidity 45% • Wind 8mph NW</span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-amber-400 font-black text-lg">
              ☀️
            </div>
          </div>

          {/* Emergency Alert List Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-3">Active Operations Warnings</h3>
              
              <div className="space-y-2">
                {activeAlerts.length === 0 ? (
                  <div className="text-center py-4 text-xxs text-slate-500">No active warnings.</div>
                ) : (
                  activeAlerts.map((alert) => (
                    <div key={alert.id} className="p-2.5 rounded-lg bg-rose-600/5 border border-rose-500/20 text-xxs flex items-start gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0 mt-1.5 animate-pulse" />
                      <div>
                        <span className="font-bold text-slate-205">{alert.title}</span>
                        <p className="text-slate-400 leading-tight mt-0.5 line-clamp-2">{alert.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* AI recommendations widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-fifa-gold animate-pulse" />
              AI Recommendations Engine
            </h3>

            <div className="space-y-3">
              {[
                { title: 'Re-routing Gate 4', desc: 'Congestion has peaked at 98%. Open Bypass corridor B for direct access.', action: 'Open Bypass Portal' },
                { title: 'Cooling Station Water restock', desc: 'Water count is low in Section 112. Assign Volunteer Task.', action: 'Assign Restock Task' }
              ].map((rec, i) => (
                <div key={i} className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-2 text-xxs">
                  <div>
                    <h4 className="font-bold text-slate-200">{rec.title}</h4>
                    <p className="text-slate-450 leading-relaxed mt-0.5">{rec.desc}</p>
                  </div>
                  <button className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 text-[9px] font-bold text-fifa-gold border border-slate-750 transition-colors uppercase tracking-wider block">
                    {rec.action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Transport delays widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-bold text-slate-105 uppercase tracking-wider mb-3">Live Transit Status</h3>
            <div className="space-y-2">
              {transportOptions.slice(0, 3).map((opt) => (
                <div key={opt.id} className="flex justify-between items-center text-xxs py-1 border-b border-slate-850 last:border-0 last:pb-0">
                  <span className="text-slate-350 font-bold">{opt.name}</span>
                  <span className={`font-semibold ${
                    opt.status === 'smooth' ? 'text-emerald-450' : opt.status === 'delayed' ? 'text-amber-450' : 'text-rose-400'
                  }`}>{opt.status.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
