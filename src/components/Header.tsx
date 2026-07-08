import React from 'react';
import { useAppStore } from '../store';
import { ThemeToggle } from './ThemeToggle';
import { Globe, User, LogOut } from 'lucide-react';
import { TRANSLATION_DICTIONARY } from '../constants';

export const Header: React.FC = () => {
  const { user, logout, setLanguage } = useAppStore();

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'fan': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'volunteer': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'organizer': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'security': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'admin': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const activeLang = user?.language || 'en';
  const t = TRANSLATION_DICTIONARY[activeLang] || TRANSLATION_DICTIONARY.en;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fifa-gold to-amber-600 shadow-md">
            <span className="text-lg font-black text-slate-950">F</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              {t.title}
              <span className="text-xxs font-semibold bg-fifa-gold/15 text-fifa-gold border border-fifa-gold/30 px-1.5 py-0.5 rounded uppercase tracking-wider">
                AI Ops
              </span>
            </h1>
            <p className="text-xxs text-slate-400 hidden sm:block">{t.subtitle}</p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-4">
          
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/50 rounded-lg px-2 py-1 text-slate-300 text-xs">
            <Globe className="h-4 w-4 text-slate-400" />
            <select
              value={activeLang}
              onChange={handleLangChange}
              className="bg-transparent border-none outline-none pr-1 focus:ring-0 text-slate-200 cursor-pointer font-medium"
              aria-label="Select Language"
            >
              <option value="en" className="bg-slate-900">EN</option>
              <option value="es" className="bg-slate-900">ES</option>
              <option value="fr" className="bg-slate-900">FR</option>
              <option value="ar" className="bg-slate-900">AR</option>
              <option value="hi" className="bg-slate-900">HI</option>
              <option value="ja" className="bg-slate-900">JA</option>
              <option value="pt" className="bg-slate-900">PT</option>
              <option value="de" className="bg-slate-900">DE</option>
            </select>
          </div>

          {/* Theme Toggler */}
          <ThemeToggle />

          {/* User Status / Logout */}
          {user && (
            <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-semibold text-slate-200">{user.displayName}</span>
                <span className={`text-xxs px-2 py-0.5 border rounded-full font-medium uppercase tracking-wider ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
              
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName} 
                  className="h-8 w-8 rounded-full border border-slate-700 object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                  <User className="h-4 w-4" />
                </div>
              )}

              <button
                onClick={logout}
                className="p-2 rounded-lg bg-slate-800/40 hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 transition-colors border border-slate-800 hover:border-rose-900/30"
                title="Log Out"
                aria-label="Log Out Account"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
