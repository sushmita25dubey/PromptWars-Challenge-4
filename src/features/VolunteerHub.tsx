import React, { useState } from 'react';
import { useAppStore } from '../store';
import { BookOpen, Clock, ShieldAlert, CheckSquare } from 'lucide-react';
import { sanitizeInputText } from '../utils/format';

export const VolunteerHub: React.FC = () => {
  const { volunteerTasks, updateTaskStatus, addIncident } = useAppStore();
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [activeTab, setActiveTab] = useState<'tasks' | 'training'>('tasks');

  // Simple incident quick-form inside volunteer panel
  const [reportType, setReportType] = useState('medical');
  const [reportDesc, setReportDesc] = useState('');
  const [reportZone, setReportZone] = useState('South Concourse');
  const [reportSent, setReportSent] = useState(false);

  const handleTaskComplete = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'pending' ? 'in_progress' : 'completed';
    updateTaskStatus(id, nextStatus);
  };

  const handleQuickReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDesc.trim()) return;

    addIncident({
      type: reportType as any,
      description: `[Volunteer Report]: ${sanitizeInputText(reportDesc)}`,
      severity: 'medium',
      zone: sanitizeInputText(reportZone),
      reportedBy: 'Volunteer Hub'
    });

    setReportDesc('');
    setReportSent(true);
    setTimeout(() => setReportSent(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
      
      {/* Shift status & Task management list */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Shift Attendance Check-In */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isCheckedIn ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}>
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">Volunteer Shift Console</h3>
              <p className="text-xxs text-slate-400 mt-0.5">
                {isCheckedIn ? 'Shift active since 16:30. Check-out is scheduled at 23:00.' : 'Offline. Check in to receive tasks.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckedIn(!isCheckedIn)}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors border focus:outline-none ${
              isCheckedIn
                ? 'bg-slate-800 hover:bg-slate-750 text-rose-400 border-slate-700 hover:border-rose-900/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
            }`}
          >
            {isCheckedIn ? 'Check Out' : 'Check In Shift'}
          </button>
        </div>

        {/* Task Management Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex border-b border-slate-800 pb-3 mb-4 justify-between items-center">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('tasks')}
                className={`text-xs font-bold pb-2 transition-all ${
                  activeTab === 'tasks' ? 'border-b-2 border-fifa-gold text-fifa-gold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Assigned Operations Tasks ({volunteerTasks.length})
              </button>
              <button
                onClick={() => setActiveTab('training')}
                className={`text-xs font-bold pb-2 transition-all ${
                  activeTab === 'training' ? 'border-b-2 border-fifa-gold text-fifa-gold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Training Resources
              </button>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Shift Ref: V-8894</span>
          </div>

          {activeTab === 'tasks' ? (
            <div className="space-y-4">
              {!isCheckedIn ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  <span>Please check in to your shift to view assigned tasks.</span>
                </div>
              ) : (
                volunteerTasks.map((task) => (
                  <div key={task.id} className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl space-y-3 hover:border-slate-800 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          {task.location}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-200 mt-1.5">{task.title}</h4>
                      </div>
                      <span className={`text-xxs font-bold px-2 py-0.5 border rounded-full ${
                        task.status === 'completed' 
                          ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                          : task.status === 'in_progress'
                          ? 'text-blue-400 border-blue-500/30 bg-blue-500/10 animate-pulse'
                          : 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                      }`}>
                        {task.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xxs sm:text-xs text-slate-300 leading-relaxed">{task.description}</p>

                    {/* AI Guidance Box */}
                    <div className="p-3 bg-slate-900 border border-slate-850/80 rounded-lg text-xxs leading-relaxed">
                      <span className="font-bold text-fifa-gold uppercase block mb-1">🤖 Gemini Operations Guidance</span>
                      <p className="text-slate-400">{task.aiGuidance}</p>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-3 text-xxs font-mono text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Time Limit: {task.timeLimit}</span>
                      </div>
                      
                      {task.status !== 'completed' && (
                        <button
                          onClick={() => handleTaskComplete(task.id, task.status)}
                          className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-xxs font-bold text-slate-100 transition-colors uppercase tracking-wider"
                        >
                          {task.status === 'pending' ? 'Start Task' : 'Complete Task'}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Training Accordions list */
            <div className="space-y-3">
              {[
                { title: 'Emergency evacuation procedures', duration: '6 mins reading', desc: 'Step-by-step layout guides for directing crowd bottlenecks to Gates 1, 2, and 3. In case of fire alarms, keep access channels unlocked.' },
                { title: 'Accessible assistance protocols', duration: '8 mins reading', desc: 'Etiquette for guiding wheelchair units, blind spectators, and senior visitors. Coordinate elevator transfers at Zone B.' },
                { title: 'Heat exhaustion first-aid responses', duration: '5 mins reading', desc: 'Identify symptoms of dehydration or heat stroke. Escort fans to Sections 108/122 cooling chambers for immediate hydration.' }
              ].map((tr, idx) => (
                <div key={idx} className="p-3.5 bg-slate-950/40 border border-slate-850 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                    <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-fifa-gold" /> {tr.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">{tr.duration}</span>
                  </div>
                  <p className="text-xxs text-slate-400 leading-relaxed">{tr.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Incident reporting shortcuts inside volunteer dashboard */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Quick Report Form Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-slate-105 flex items-center gap-2 mb-3">
            <ShieldAlert className="h-5 w-5 text-rose-500" />
            Quick Incident Dispatch
          </h3>
          <p className="text-xxs text-slate-400 mb-4 leading-relaxed">Report stadium damage, spills, medical cases, or lockouts directly to operators.</p>

          <form onSubmit={handleQuickReportSubmit} className="space-y-3">
            <div>
              <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block mb-1">Location Zone</label>
              <input
                type="text"
                value={reportZone}
                onChange={(e) => setReportZone(e.target.value)}
                maxLength={100}
                className="w-full bg-slate-950 border border-slate-855 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                placeholder="e.g. East Concourse Level 2"
              />
            </div>

            <div>
              <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block mb-1">Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-855 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="medical">Medical Case</option>
                <option value="facility">Spill / Clean Up / Power Fault</option>
                <option value="security">Crowd Dispute / Security Alert</option>
              </select>
            </div>

            <div>
              <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block mb-1">Details</label>
              <textarea
                value={reportDesc}
                onChange={(e) => setReportDesc(e.target.value)}
                rows={3}
                maxLength={1000}
                className="w-full bg-slate-950 border border-slate-855 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none resize-none"
                placeholder="Briefly state what needs attention..."
              />
            </div>

            {reportSent && (
              <span className="text-[10px] text-emerald-400 font-bold block animate-pulse">Report dispatched to command tower!</span>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 font-bold text-white text-xs transition-colors"
            >
              Dispatch Report
            </button>
          </form>
        </div>

        {/* Dynamic Volunteer KPI counters */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850">
            <span className="text-xxs text-slate-400 uppercase font-bold block">Assigned Today</span>
            <span className="text-2xl font-black text-slate-200 block mt-1">4 Tasks</span>
          </div>
          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850">
            <span className="text-xxs text-slate-400 uppercase font-bold block">Completed</span>
            <span className="text-2xl font-black text-emerald-400 block mt-1">2 Tasks</span>
          </div>
        </div>

      </div>
    </div>
  );
};
