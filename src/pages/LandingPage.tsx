import React from 'react';
import { Shield, Sparkles, Zap, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onLaunch: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col justify-between">
      
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] rounded-full bg-amber-900/10 blur-[120px] pointer-events-none" />

      {/* Header / Brand */}
      <header className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fifa-gold to-amber-600 shadow-lg">
            <span className="text-xl font-black text-slate-950">F</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              FIFA SmartHub <span className="text-xxs bg-fifa-gold/15 text-fifa-gold border border-fifa-gold/30 px-1.5 py-0.5 rounded font-mono">AI</span>
            </h1>
            <p className="text-xxs text-slate-400">Stadium Operations & Tournament Intelligence</p>
          </div>
        </div>
        <button
          onClick={onLaunch}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white transition-colors"
        >
          Developer Console
        </button>
      </header>

      {/* Hero Section */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 z-10 relative max-w-5xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs mb-6">
          <Sparkles className="h-4 w-4 text-fifa-gold animate-pulse" />
          <span>Next-Generation AI for FIFA World Cup 2026</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-4xl">
          Stadium Operations & <br />
          <span className="bg-gradient-to-r from-fifa-gold via-amber-400 to-emerald-400 bg-clip-text text-transparent">
            Tournament Intelligence
          </span>
        </h2>

        <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
          FIFA SmartHub AI is an enterprise-grade stadium operating system powered by Gemini. Optimize crowd density, carbon offsets, transport routing, accessibility pathways, and live communications in real-time.
        </p>

        {/* CTA Button */}
        <button
          onClick={onLaunch}
          className="group relative inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-fifa-gold to-amber-500 font-bold text-slate-950 shadow-xl shadow-amber-900/20 hover:from-amber-400 hover:to-amber-500 transition-all hover:scale-105 active:scale-98 focus:outline-none focus:ring-4 focus:ring-amber-300"
        >
          Launch SmartHub
          <ArrowRight className="ml-2.5 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mt-20">
          {[
            { label: 'Stadiums Managed', value: '16' },
            { label: 'Match Schedule', value: '104' },
            { label: 'AI Inference Rate', value: '0.8s' },
            { label: 'Target WCAG', value: 'AA 100%' },
          ].map((stat, i) => (
            <div key={i} className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-black text-fifa-gold mb-1">{stat.value}</div>
              <div className="text-xxs sm:text-xs text-slate-400 font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-20 text-left">
          {[
            {
              icon: Zap,
              title: 'Gemini Fan Assistant',
              desc: 'Dual voice support chatbot handles ticket queries, restrooms finder, and emergency guidelines instantaneously.'
            },
            {
              icon: Users,
              title: 'Smart Crowd Twin',
              desc: 'Interactive stadium digital maps with crowd heatmap indicators, predicting congestion bottlenecks dynamically.'
            },
            {
              icon: Shield,
              title: 'Enterprise SOS Hub',
              desc: 'One-touch emergency response protocol coordinating security alerts, incident logs, and route evacuations.'
            }
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className="p-6 bg-slate-900/40 hover:bg-slate-900/60 border border-slate-850 hover:border-slate-800 rounded-xl transition-all hover:-translate-y-1">
                <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center text-fifa-gold mb-4 border border-slate-750">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-100 mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </motion.main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        <p>© 2026 FIFA. SmartHub AI Stadium Operations and Tournament Intelligence is a conceptual project designed for Google I/O.</p>
      </footer>
    </div>
  );
};
