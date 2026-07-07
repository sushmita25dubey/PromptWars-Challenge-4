import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppStore } from '../store';
import { ShieldAlert, HeartPulse, Send, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';


// Zod Schema for incident validation
const incidentSchema = z.object({
  type: z.enum(['medical', 'security', 'crowd', 'facility']),
  zone: z.string().min(1, 'Please specify the location zone.'),
  severity: z.enum(['low', 'medium', 'high']),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
});

type IncidentFormData = z.infer<typeof incidentSchema>;

export const EmergencyAi: React.FC = () => {
  const { incidents, addIncident, resolveIncident } = useAppStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<IncidentFormData>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      type: 'medical',
      zone: 'East Stand (Zone B)',
      severity: 'medium',
      description: '',
    }
  });

  const onSubmit = async (data: IncidentFormData) => {
    // Dispatch to store
    addIncident({
      type: data.type,
      zone: data.zone,
      severity: data.severity,
      description: data.description,
      reportedBy: 'User Console'
    });
    
    reset({
      type: 'medical',
      zone: 'East Stand (Zone B)',
      severity: 'medium',
      description: '',
    });
  };

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'high': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
      
      {/* Active Incident Dispatch Form */}
      <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4">
          <ShieldAlert className="h-5 w-5 text-rose-500" />
          Dispatch Incident Report
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Incident Type */}
          <div>
            <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block mb-1">Incident Category</label>
            <select
              {...register('type')}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
            >
              <option value="medical">Medical First-Aid Call</option>
              <option value="security">Security / Riot / Conflict</option>
              <option value="crowd">Crowd Overflow / Bottleneck</option>
              <option value="facility">Facility Fault (Power/Water)</option>
            </select>
          </div>

          {/* Location Area */}
          <div>
            <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block mb-1">Incident Location (Zone)</label>
            <input
              type="text"
              {...register('zone')}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
              placeholder="e.g. Gate 4 entrance or Section 102 Row G"
            />
            {errors.zone && <span className="text-[10px] text-rose-400 mt-1 block">{errors.zone.message}</span>}
          </div>

          {/* Severity */}
          <div>
            <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block mb-1">Severity Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {['low', 'medium', 'high'].map((lvl) => (
                <label 
                  key={lvl} 
                  className={`border rounded-xl p-2.5 flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold transition-all ${
                    register('severity') ? 'hover:bg-slate-800/40' : ''
                  }`}
                >
                  <input
                    type="radio"
                    value={lvl}
                    {...register('severity')}
                    className="sr-only"
                  />
                  <span className="capitalize">{lvl}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block mb-1">Details & Context</label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-slate-700 resize-none"
              placeholder="Provide a detailed report of the situation so dispatchers know who to send..."
            />
            {errors.description && <span className="text-[10px] text-rose-400 mt-1 block">{errors.description.message}</span>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-55"
          >
            <Send className="h-4 w-4" />
            <span>Submit Dispatch</span>
          </button>
        </form>
      </div>

      {/* Incident Log & Responder Status */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Active Emergency Dispatch Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Active Incident Log
            </h3>
            
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 no-scrollbar">
              {incidents.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  <CheckCircle className="h-8 w-8 text-slate-650 mx-auto mb-2" />
                  <span>No active incident reports at this time.</span>
                </div>
              ) : (
                incidents.map((inc) => (
                  <div key={inc.id} className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] px-2 py-0.5 border rounded-full font-bold uppercase tracking-wider ${getSeverityStyle(inc.severity)}`}>
                          {inc.severity}
                        </span>
                        <span className="font-bold text-slate-200 capitalize">{inc.type}</span>
                        <span className="text-[10px] text-slate-500 font-mono">@{inc.reportedAt}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{inc.description}</p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                        <MapPin className="h-3 w-3 text-slate-500" />
                        <span>Zone: {inc.zone}</span>
                      </div>
                    </div>

                    {inc.status !== 'resolved' && (
                      <button
                        onClick={() => resolveIncident(inc.id)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 hover:text-white transition-colors border border-slate-700"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Evacuation and Responders Directory */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4">
            <HeartPulse className="h-5 w-5 text-emerald-400" />
            Active Responders & Evacuation Portals
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Responders */}
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">First-Aid Responders</span>
              {[
                { name: 'Medical Squad A (Plaza)', status: 'On Call (Gate 2)', count: '4 medics' },
                { name: 'Medical Squad B (South)', status: 'Roving (Zone C)', count: '3 medics' }
              ].map((res, i) => (
                <div key={i} className="flex justify-between items-center text-xxs border-b border-slate-850/60 pb-1.5 last:border-0 last:pb-0">
                  <div>
                    <span className="text-slate-350 font-bold block">{res.name}</span>
                    <span className="text-[9px] text-slate-500">{res.count}</span>
                  </div>
                  <span className="text-fifa-gold font-bold">{res.status}</span>
                </div>
              ))}
            </div>

            {/* Evacuation gates */}
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Evacuation Exits</span>
              {[
                { gate: 'Gate 1 Evacuation Pathway', status: 'Clear (Active)' },
                { gate: 'Gate 2 Escalade Ramps', status: 'Clear (Active)' },
                { gate: 'Gate 4 Concourse Tunnel', status: 'Blocked (Overcrowded)' }
              ].map((exit, i) => (
                <div key={i} className="flex justify-between items-center text-xxs border-b border-slate-850/60 pb-1.5 last:border-0 last:pb-0">
                  <span className="text-slate-350 font-bold">{exit.gate}</span>
                  <span className={exit.status.includes('Clear') ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold animate-pulse'}>
                    {exit.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
