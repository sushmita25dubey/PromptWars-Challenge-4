import React from 'react';
import { useAppStore } from '../store';
import { Leaf, Sparkles, Droplet, Zap, Trash2, ShieldCheck, HelpCircle } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register ChartJS modules
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export const SustainabilityHub: React.FC = () => {
  const sustainability = useAppStore((state) => state.sustainability);

  // Chart data for waste recycled breakdown
  const wasteData = {
    labels: ['Plastics (PET)', 'Cardboard & Paper', 'Aluminum Cans', 'Compost (Organic)'],
    datasets: [
      {
        data: [1550, 1200, 850, 600],
        backgroundColor: [
          'rgba(0, 166, 80, 0.75)', // Green
          'rgba(223, 176, 75, 0.75)',  // Gold
          'rgba(59, 130, 246, 0.75)',  // Blue
          'rgba(244, 63, 94, 0.75)',   // Rose
        ],
        borderColor: [
          '#1e293b',
          '#1e293b',
          '#1e293b',
          '#1e293b',
        ],
        borderWidth: 2,
      },
    ],
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
            size: 10,
            family: 'Outfit',
          },
          boxWidth: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${context.label}: ${context.raw} kg`,
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
      
      {/* Metrics Dashboard Column */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Real-time stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Energy Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-450 uppercase font-bold flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-amber-400" /> Energy Burn</span>
              <p className="text-lg font-black text-slate-200 mt-1">{sustainability.energyConsumptionKwh.toLocaleString()} kWh</p>
              <span className="text-[9px] text-emerald-450 block">45% solar grid matched</span>
            </div>
          </div>

          {/* Water Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-450 uppercase font-bold flex items-center gap-1"><Droplet className="h-3.5 w-3.5 text-blue-400" /> Water Flow</span>
              <p className="text-lg font-black text-slate-200 mt-1">{sustainability.waterConsumptionLiters.toLocaleString()} L</p>
              <span className="text-[9px] text-emerald-450 block">30% rain harvested reuse</span>
            </div>
          </div>

          {/* Waste Recycled */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-450 uppercase font-bold flex items-center gap-1"><Trash2 className="h-3.5 w-3.5 text-emerald-400" /> Waste Recycled</span>
              <p className="text-lg font-black text-slate-200 mt-1">{sustainability.wasteRecycledKg.toLocaleString()} kg</p>
              <span className="text-[9px] text-emerald-450 block">82% diversion from landfill</span>
            </div>
          </div>

        </div>

        {/* Gemini Carbon Offsets Recommendations */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-fifa-gold animate-pulse" />
            Gemini Carbon Offset Recommendations
          </h3>

          <div className="space-y-3">
            {[
              { title: 'Refill official FIFA reusable water bottles', desc: 'Saves approximately 420g of plastic waste per fill. Water fountains near section 102 are certified carbon-neutral.', savings: '-15kg CO2e' },
              { title: 'Utilize MetLife Express M1 Metro line', desc: 'Commuting via direct express train instead of individual rideshare reduces transit carbon footprints by 85%.', savings: '-88kg CO2e' },
              { title: 'Solar Roof Grid synchronization', desc: 'Stadium command is scaling solar energy consumption during post-match stadium lighting periods.', savings: '-420kg CO2e' }
            ].map((rec, i) => (
              <div key={i} className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl flex items-center justify-between gap-4 text-xs">
                <div>
                  <h4 className="font-bold text-slate-200">{rec.title}</h4>
                  <p className="text-xxs text-slate-400 leading-tight mt-0.5">{rec.desc}</p>
                </div>
                <span className="text-xxs font-bold px-2 py-0.5 border border-emerald-500/35 bg-emerald-500/10 text-emerald-400 rounded-full shrink-0 ml-3">
                  {rec.savings}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Compliance Gauges and Chart Columns */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Environmental Score Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-450 uppercase font-bold flex items-center gap-1"><Leaf className="h-4 w-4 text-emerald-400 animate-bounce" /> Eco Score</span>
            <div className="text-3xl font-black text-slate-200 mt-1">{sustainability.environmentalScore}%</div>
            <span className="text-[9px] text-slate-450 block">Class Leader Award</span>
          </div>
          <div className="h-16 w-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center font-bold text-xs text-emerald-400 font-mono shadow-md">
            AA Rank
          </div>
        </div>

        {/* Recycled Component Charts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-105 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-fifa-gold" />
              Recycling Content Logs
            </h3>
            <p className="text-xxs text-slate-450 mt-1">Breakdown of recovered materials across stadium recycling bins</p>
          </div>

          <div className="h-48 relative my-4">
            <Doughnut data={wasteData} options={chartOptions} />
          </div>

          <div className="text-center text-[10px] text-slate-450 bg-slate-950/30 p-2 rounded-lg border border-slate-850 flex items-center gap-2 justify-center">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Updates sync with digital weight scales every 15 mins.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
