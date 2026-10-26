import React from 'react';
import { Smartphone, ShieldCheck, Download, Mic, Sparkles, Terminal, Globe2 } from 'lucide-react';

interface HeaderNavProps {
  activeTab: 'phone' | 'permissions' | 'apk' | 'library';
  onTabChange: (tab: 'phone' | 'permissions' | 'apk' | 'library') => void;
  onOpenAssistant: () => void;
  lang: 'hi' | 'en';
  onToggleLang: () => void;
  isAssistantOpen: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  onTabChange,
  onOpenAssistant,
  lang,
  onToggleLang,
  isAssistantOpen,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/20 text-white font-black text-xl">
            A
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Astra AI Agent
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full">
                Android 15+ Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {lang === 'hi'
                ? 'स्मार्ट वॉयस & डिवाइस ऑटोमेशन असिस्टेंट (Gemini रिप्लेसमेंट)'
                : 'Smart Voice & Device Automation Assistant (Replaces Gemini)'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onTabChange('phone')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'phone'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">{lang === 'hi' ? 'फोन सिम्युलेटर' : 'Live Phone'}</span>
            <span className="sm:hidden">{lang === 'hi' ? 'फोन' : 'Phone'}</span>
          </button>

          <button
            onClick={() => onTabChange('permissions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'permissions'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">{lang === 'hi' ? 'सिस्टम परमिशन' : 'Permissions'}</span>
            <span className="sm:hidden">{lang === 'hi' ? 'परमिशन' : 'Settings'}</span>
          </button>

          <button
            onClick={() => onTabChange('apk')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'apk'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">{lang === 'hi' ? 'APK डाउनलोड' : 'Export APK'}</span>
            <span className="sm:hidden">APK</span>
          </button>

          <button
            onClick={() => onTabChange('library')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'library'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-4 h-4 text-purple-400" />
            <span className="hidden md:inline">{lang === 'hi' ? 'कमांड्स' : 'Commands'}</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="भाषा बदलें / Toggle Language"
          >
            <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'hi' ? 'हिन्दी' : 'EN'}</span>
          </button>

          {/* Quick Voice Assistant Trigger Button */}
          <button
            onClick={onOpenAssistant}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-medium text-xs sm:text-sm transition-all shadow-md ${
              isAssistantOpen
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-white shadow-indigo-500/25'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isAssistantOpen ? (lang === 'hi' ? 'सुन रहा है...' : 'Listening...') : (lang === 'hi' ? 'असिस्टेंट बोलें' : 'Voice Agent')}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
