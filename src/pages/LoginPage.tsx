import React, { useState } from 'react';
import { useAppStore } from '../store';
import { signInGuestMock, signInWithGoogleMock } from '../services/firebase';
import type { UserRole } from '../types';
import { User, Award, Shield, Server, Compass, Sparkles, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBack }) => {
  const login = useAppStore((state) => state.login);
  const [selectedRole, setSelectedRole] = useState<UserRole>('fan');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (provider: 'google' | 'guest') => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      if (provider === 'google') {
        await signInWithGoogleMock(selectedRole);
        login(selectedRole);
      } else {
        await signInGuestMock(selectedRole);
        login(selectedRole);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const rolesList: { id: UserRole; name: string; desc: string; icon: any; color: string }[] = [
    {
      id: 'fan',
      name: 'Match Fan',
      desc: 'Access seat guides, transport schedules, chatbot assistant, and carbon score trackers.',
      icon: Compass,
      color: 'border-emerald-500/20 hover:border-emerald-500/60 bg-emerald-950/5 text-emerald-400'
    },
    {
      id: 'volunteer',
      name: 'FIFA Volunteer',
      desc: 'Check assigned tasks, navigate the stadium, report incidents, and view cooling station maps.',
      icon: Award,
      color: 'border-blue-500/20 hover:border-blue-500/60 bg-blue-950/5 text-blue-400'
    },
    {
      id: 'security',
      name: 'Security Officer',
      desc: 'Monitor stadium twin crowd maps, coordinate incident response teams, and review alerts.',
      icon: Shield,
      color: 'border-rose-500/20 hover:border-rose-500/60 bg-rose-950/5 text-rose-400'
    },
    {
      id: 'organizer',
      name: 'Stadium Organizer',
      desc: 'Manage stadium logistics, dispatch AI announcements, and monitor sustainability scoring.',
      icon: Sparkles,
      color: 'border-amber-500/20 hover:border-amber-500/60 bg-amber-950/5 text-fifa-gold'
    },
    {
      id: 'admin',
      name: 'System Admin',
      desc: 'Complete control tower dashboard monitoring power grids, waste bins, and user lists.',
      icon: Server,
      color: 'border-red-500/20 hover:border-red-500/60 bg-red-950/5 text-red-400'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
      
      {/* Dynamic Glow */}
      <div className="absolute w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[100px] top-[10%] left-[20%] pointer-events-none" />
      <div className="absolute w-[40%] h-[40%] bg-amber-900/10 rounded-full blur-[100px] bottom-[10%] right-[20%] pointer-events-none" />

      <div className="w-full max-w-2xl bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative z-10">
        
        {/* Brand */}
        <div className="text-center mb-8">
          <button 
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-white transition-colors mb-2 focus:outline-none focus:underline"
          >
            ← Back to Landing Page
          </button>
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-2">
            Sign In to SmartHub <span className="text-xs bg-fifa-gold/15 text-fifa-gold border border-fifa-gold/30 px-2 py-0.5 rounded font-mono">2026</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Select your official role to configure the custom control console</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Role Selection Grid */}
        <div className="space-y-3 mb-8">
          <span id="role-select-title" className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">1. Select Operating Role</span>
          <div 
            role="radiogroup"
            aria-labelledby="role-select-title"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
          >
            {rolesList.map((roleItem) => {
              const Icon = roleItem.icon;
              const isSelected = selectedRole === roleItem.id;
              return (
                <button
                  key={roleItem.id}
                  onClick={() => setSelectedRole(roleItem.id)}
                  type="button"
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between h-36 focus:outline-none focus:ring-2 focus:ring-fifa-gold ${
                    isSelected 
                      ? 'border-fifa-gold bg-slate-800 shadow-inner' 
                      : roleItem.color
                  }`}
                  aria-checked={isSelected}
                  role="radio"
                >
                  <div className="flex items-center justify-between w-full">
                    <Icon className="h-5 w-5" />
                    {isSelected && <span className="h-2 w-2 rounded-full bg-fifa-gold animate-ping" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-200 mt-3">{roleItem.name}</h3>
                    <p className="text-xxs text-slate-400 leading-tight mt-1 line-clamp-2">{roleItem.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Authenticate Action */}
        <div className="space-y-4">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">2. Authenticate Securely</label>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Google Authentication */}
            <button
              onClick={() => handleLogin('google')}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:opacity-55"
            >
              {/* Simple Google SVG Icon */}
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.85-.92 2.69v2.54h3.1c1.8-1.66 2.87-4.11 2.87-7.08z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.1-2.54c-.86.58-1.97.92-3.1 1.92-3.1 0-5.73-2.1-6.68-4.92H3.88v2.62A12.014 12.014 0 0012 24z" />
                <path fill="#FBBC05" d="M5.32 15.47a7.16 7.16 0 010-4.54V8.31H3.88a12.01 12.01 0 000 11.23l1.44-2.54z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.96 1.19 15.24 0 12 0 7.34 0 3.38 2.68 1.44 6.6l3.88 2.62c.95-2.82 3.58-4.92 6.68-4.92z" />
              </svg>
              <span>Google Sign-In</span>
            </button>

            {/* Guest Simulation */}
            <button
              onClick={() => handleLogin('guest')}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-slate-750 disabled:opacity-55"
            >
              <User className="h-5 w-5 text-slate-400" />
              <span>Log In as Guest</span>
            </button>
          </div>
          
          <p className="text-center text-[10px] text-slate-500 italic">
            Note: Firebase credentials are standard configurations. Offline auth fallbacks are enabled for development reviews.
          </p>
        </div>

      </div>
    </div>
  );
};
