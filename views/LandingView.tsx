
import React from 'react';
import { useSupabaseStore } from '../lib/supabase-store';
import Logo from '../components/Logo';

const LandingView: React.FC = () => {
  const { setView } = useSupabaseStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Gradients - Enhanced */}
      <div className="absolute top-[-15%] left-[-15%] w-[50%] h-[50%] bg-cyan-900/15 blur-[150px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-900/8 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>

      {/* Top-right text links */}
      <div className="absolute top-6 right-6 flex items-center gap-6 z-20">
        <a 
          href="https://idyllproductions.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          Portfolio
        </a>
        <a 
          href="https://idyllproductions.com/about" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          About Us
        </a>
      </div>

      <div className="max-w-4xl w-full text-center space-y-8 relative z-10">
        {/* Logo */}
        <Logo size="xl" className="mx-auto mb-6" />
        
        <div className="inline-flex items-center space-x-2 bg-cyan-950/30 border border-cyan-500/20 px-4 py-1.5 rounded-full mb-4">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Internal Release v2.4</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-primary tracking-tight leading-tight">
          Idyll Productions <br />
          <span className="text-secondary">Workspace OS</span>
        </h1>

        <p className="text-lg text-secondary max-w-2xl mx-auto leading-relaxed">
          The internal production operating system built for high-performance editors. 
          Manage tasks, meetings, and payouts in one unified, distraction-free environment.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <button 
            onClick={() => {
              console.log('LOGIN BUTTON CLICKED');
              setView('login');
            }}
            className="w-full sm:w-auto px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.3)] transition-all duration-300 transform hover:-translate-y-1"
          >
            Login to Workspace
          </button>
          <button 
            onClick={() => {
              console.log('CREATE ACCOUNT BUTTON CLICKED');
              setView('signup');
            }}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold rounded-xl transition-all duration-300"
          >
            Create New Account
          </button>
          <button 
            onClick={() => {
              console.log('APPLY TO BE EDITOR BUTTON CLICKED');
              setView('apply');
            }}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Apply to be an Editor
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingView;
