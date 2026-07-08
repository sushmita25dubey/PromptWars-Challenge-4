import React from 'react';
import { useAppStore } from '../store';
import { Server, Users, AlertTriangle, Download, Activity, CheckSquare } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const AdminCommandCenter: React.FC = () => {
  const { incidents, resolveIncident } = useAppStore();

  // Mock User List for User Management Table
  const userRoster = [
    { name: 'John Miller', email: 'john@fifa.com', role: 'admin', status: 'active' },
    { name: 'Sarah Connor', email: 'sarah@volunteer.fifa.com', role: 'volunteer', status: 'active' },
    { name: 'David Smith', email: 'david@security.fifa.com', role: 'security', status: 'active' },
    { name: 'Elena Rostova', email: 'elena@volunteer.fifa.com', role: 'volunteer', status: 'offline' },
    { name: 'Marcus Aurelius', email: 'marcus@fan.fifa.com', role: 'fan', status: 'active' }
  ];

  // Chart data for energy consumption (hourly blocks)
  const energyChartData = {
    labels: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00 (Live)'],
    datasets: [
      {
        label: 'Stadium Grid Load (kW)',
        data: [1200, 1400, 1900, 2400, 3100, 3420],
        backgroundColor: 'rgba(223, 176, 75, 0.75)', // Gold
        borderColor: '#dfb04b',
        borderWidth: 1.5,
      },
      {
        label: 'Solar Generator Output (kW)',
        data: [1500, 1600, 1550, 1400, 1200, 800],
        backgroundColor: 'rgba(0, 166, 80, 0.75)', // Green
        borderColor: '#00a650',
        borderWidth: 1.5,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#cbd5e1', // Slate-300
          font: {
            size: 9,
            family: 'Outfit',
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { size: 9 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { size: 9 } }
      }
    }
  };

  const exportReport = () => {
    // Generate simulated CSV download
    const csvContent = "data:text/csv;charset=utf-8,Incident ID,Category,Zone,Severity,Status\n" 
      + incidents.map(e => `"${e.id}","${e.type}","${e.zone}","${e.severity}","${e.status}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FIFA_Incident_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
      
      {/* Real-time Incident & User Command Tables */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* User Management Directory */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Users className="h-5 w-5 text-fifa-gold" />
              Tournament User Directory & Rosters
            </h3>
            <button
              onClick={exportReport}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-305 transition-colors border border-slate-700 text-xxs flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-450 text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/50">
                {userRoster.map((u, i) => (
                  <tr key={i} className="hover:bg-slate-950/20 text-slate-300">
                    <td className="py-3 px-3 font-semibold text-slate-205">{u.name}</td>
                    <td className="py-3 px-3 font-mono text-slate-450 text-[11px]">{u.email}</td>
                    <td className="py-3 px-3">
                      <span className={`text-[9px] px-2 py-0.5 border rounded-full font-bold uppercase tracking-wider ${
                        u.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                        u.role === 'security' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                        u.role === 'volunteer' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`flex items-center gap-1.5 ${u.status === 'active' ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-650'}`} />
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Active Incident Dispatchers Console */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-rose-500 animate-pulse" />
            Operations Command Center Log
          </h3>

          <div className="space-y-3">
            {incidents.map((inc) => (
              <div key={inc.id} className="p-3.5 bg-slate-950/40 border border-slate-850 rounded-xl flex justify-between items-start text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[9px] px-2 py-0.5 border rounded-full font-bold uppercase tracking-wider ${
                      inc.severity === 'high' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                      inc.severity === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {inc.severity}
                    </span>
                    <span className="font-bold text-slate-200 capitalize">{inc.type} incident</span>
                    <span className="text-[10px] text-slate-500 font-mono">@{inc.reportedAt}</span>
                  </div>
                  <p className="text-slate-350 leading-relaxed">{inc.description}</p>
                  <span className="text-[10px] text-slate-450 block font-medium">Zone Sector: {inc.zone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                    inc.status === 'resolved' ? 'bg-emerald-950/30 text-emerald-400' : 'bg-rose-950/20 text-rose-400'
                  }`}>
                    {inc.status.toUpperCase()}
                  </span>
                  
                  {inc.status !== 'resolved' && (
                    <button
                      onClick={() => resolveIncident(inc.id)}
                      className="px-2.5 py-1 rounded bg-slate-850 hover:bg-slate-800 text-[10px] font-bold text-slate-200 border border-slate-750 transition-colors"
                    >
                      Resolve Case
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grid statistics & Chart Columns */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Active systems parameters */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-450 uppercase font-bold flex items-center gap-1"><Activity className="h-4 w-4 text-fifa-gold" /> System Telemetry</span>
            <div className="text-2xl font-black text-slate-205 mt-1">100% Online</div>
            <span className="text-[9px] text-emerald-400 block font-semibold">12 Core Nodes Operational</span>
          </div>
          <div className="h-14 w-14 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-emerald-400 animate-pulse">
            <Server className="h-6 w-6" />
          </div>
        </div>

        {/* Chart load details */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-105 flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-fifa-gold" />
              Power Grid Telemetry
            </h3>
            <p className="text-xxs text-slate-450 mt-1">Live comparison of core stadium electrical load versus local solar battery reserves</p>
          </div>

          <div className="h-44 relative my-4">
            <Bar data={energyChartData} options={chartOptions} />
          </div>

          <div className="text-center text-[10px] text-slate-450 bg-slate-950/30 p-2 rounded-lg border border-slate-850">
            Current Backup Grid Reserve: 84,200 kWh.
          </div>
        </div>

      </div>
    </div>
  );
};
