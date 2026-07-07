import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check local storage or document class list
    const isDarkMode = document.documentElement.classList.contains('dark') || 
                       (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
                       localStorage.theme === 'dark';
    
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-slate-800 dark:bg-slate-800/80 text-amber-400 hover:text-amber-300 dark:text-slate-400 dark:hover:text-slate-200 transition-colors border border-slate-700/60 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-fifa-gold focus:ring-offset-2 focus:ring-offset-slate-900"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5 text-slate-700" />}
    </button>
  );
};
