import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneApp, 
  CommandLog, 
  AutoScrollConfig 
} from '../types';
import { 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Phone, 
  PhoneOff, 
  Mic, 
  Camera, 
  Settings as SettingsIcon, 
  Flame, 
  Search, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Music, 
  ChevronDown, 
  ChevronUp, 
  Flashlight, 
  Battery, 
  Wifi, 
  Radio, 
  ArrowLeft,
  Sliders,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { ContactItem, INITIAL_CONTACTS } from '../utils/deviceBridge';

interface PhoneSimulatorProps {
  currentApp: PhoneApp;
  onNavigateApp: (app: PhoneApp) => void;
  onOpenAssistant: () => void;
  activeCallingContact: ContactItem | null;
  onEndCall: () => void;
  autoScrollConfig: AutoScrollConfig;
  onToggleAutoScroll: () => void;
  isTorchOn: boolean;
  onToggleTorch: () => void;
  commandLogs: CommandLog[];
  lang: 'hi' | 'en';
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  currentApp,
  onNavigateApp,
  onOpenAssistant,
  activeCallingContact,
  onEndCall,
  autoScrollConfig,
  onToggleAutoScroll,
  isTorchOn,
  onToggleTorch,
  commandLogs,
  lang,
}) => {
  // Long-press hold detection for center home button (Gemini Replacement)
  const [isHoldingHome, setIsHoldingHome] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Current time for status bar
  const [currentTime, setCurrentTime] = useState('09:41');

  // Instagram Reels state
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const reels = [
    {
      id: '1',
      author: '@tech_guru_india',
      caption: 'Astra AI Agent replacing Gemini on Android! 🔥 Full auto-scroll feature enabled.',
      music: 'Original Audio - Trending Beats',
      likes: '142K',
      comments: '3.2K',
      bgGradient: 'from-purple-900 via-slate-900 to-indigo-950',
    },
    {
      id: '2',
      author: '@mumbai_coder',
      caption: 'जब AI एजेंट आपके कहने से बिना छुए फोन में रील्स स्क्रॉल करने लगे! 😂 #AIAgent #VoiceControl',
      music: 'Arijit Singh - Soulful Mix',
      likes: '89.4K',
      comments: '1.8K',
      bgGradient: 'from-rose-950 via-slate-900 to-amber-950',
    },
    {
      id: '3',
      author: '@travel_hindi',
      caption: 'Kashmir Valley snowfall ❄️ Speech controlled navigation in action!',
      music: 'Pahari Flute Melody',
      likes: '210K',
      comments: '5.1K',
      bgGradient: 'from-blue-950 via-slate-900 to-cyan-950',
    },
  ];

  // Auto-scroll effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (autoScrollConfig.active && currentApp === 'instagram') {
      interval = setInterval(() => {
        setCurrentReelIndex((prev) => (prev + 1) % reels.length);
      }, autoScrollConfig.intervalMs || 4000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoScrollConfig.active, autoScrollConfig.intervalMs, currentApp, reels.length]);

  // Update clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    update();
    const timer = setInterval(update, 10000);
    return () => clearInterval(timer);
  }, []);

  // Home Button Press & Hold logic
  const handleHomeTouchStart = () => {
    setIsHoldingHome(true);
    setHoldProgress(0);

    const startTime = Date.now();
    const duration = 500; // 500ms to trigger assistant

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setHoldProgress(pct);
    }, 20);

    holdTimerRef.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
      onOpenAssistant();
      handleHomeTouchEnd();
    }, duration);
  };

  const handleHomeTouchEnd = () => {
    setIsHoldingHome(false);
    setHoldProgress(0);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-6 px-4 max-w-7xl mx-auto">
      {/* Left: Explanatory / Control Panel */}
      <div className="w-full lg:w-96 space-y-4">
        {/* Gemini Replacement Callout Card */}
        <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 shadow-lg space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-500 text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                {lang === 'hi' ? 'जेमिनी रिप्लेसमेंट टेस्ट' : 'Gemini Replacement Trigger'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'hi' ? 'बीच का होम बटन दबाकर रखें' : 'Hold center Home button below'}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'hi'
              ? 'फोन के नीचे दिए गए बीच वाले सफेद नेविगेशन बार को 0.5 सेकंड तक दबाकर रखें। यह ठीक उसी तरह Astra AI एजेंट को सक्रिय करता है जैसे फोन में Google Gemini आता है!'
              : 'Press & hold the center navigation pill at the bottom of the phone for 0.5s to trigger Astra AI, exactly like Gemini!'}
          </p>

          {/* Manual Trigger Button */}
          <button
            onClick={onOpenAssistant}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
          >
            <Mic className="w-4 h-4" />
            <span>{lang === 'hi' ? 'वॉयस असिस्टेंट बुलाएं' : 'Summon Voice Assistant'}</span>
          </button>
        </div>

        {/* Device Controls Quick Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {lang === 'hi' ? 'हार्डवेयर और ऑटोमेशन स्टेटस' : 'Hardware & Automation Status'}
          </h4>

          <div className="space-y-2">
            {/* Auto-Scroll Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${autoScrollConfig.active ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                  <ArrowLeft className="w-3.5 h-3.5 -rotate-90" />
                </div>
                <div>
                  <div className="font-semibold text-white">{lang === 'hi' ? 'रील्स ऑटो-स्क्रॉल' : 'Reels Auto-Scroll'}</div>
                  <div className="text-[10px] text-slate-400">{autoScrollConfig.active ? 'सक्रिय (Active)' : 'बंद (Off)'}</div>
                </div>
              </div>

              <button
                onClick={onToggleAutoScroll}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  autoScrollConfig.active
                    ? 'bg-cyan-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {autoScrollConfig.active ? 'Stop' : 'Start'}
              </button>
            </div>

            {/* Torch Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${isTorchOn ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Flashlight className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-white">{lang === 'hi' ? 'फ्लैशलाइट / टॉर्च' : 'Flashlight / Torch'}</div>
                  <div className="text-[10px] text-slate-400">{isTorchOn ? 'चालू (ON)' : 'बंद (OFF)'}</div>
                </div>
              </div>

              <button
                onClick={onToggleTorch}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  isTorchOn
                    ? 'bg-yellow-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {isTorchOn ? 'OFF' : 'ON'}
              </button>
            </div>
          </div>
        </div>

        {/* Live Command Logs */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {lang === 'hi' ? 'लाइव एजेंट हिस्ट्री' : 'Live Agent Activity'}
            </h4>
            <span className="text-[10px] font-mono text-cyan-400">{commandLogs.length} events</span>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs">
            {commandLogs.length === 0 ? (
              <p className="text-slate-500 text-center py-4 italic text-[11px]">
                {lang === 'hi' ? 'अभी तक कोई कमांड नहीं चलाई गई' : 'No commands executed yet'}
              </p>
            ) : (
              commandLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono text-indigo-400">{log.action}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <div className="text-white font-medium text-[11px]">"{log.input}"</div>
                  <div className="text-cyan-400 text-[10px]">{log.response}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Center: Smartphone Frame */}
      <div className="relative shrink-0 w-[360px] h-[720px] bg-slate-950 border-[10px] border-slate-800 rounded-[50px] shadow-2xl shadow-cyan-500/10 flex flex-col overflow-hidden ring-1 ring-slate-700">
        {/* Dynamic Island / Notch Camera */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
          <div className="w-24 h-4 bg-black rounded-full flex items-center justify-end px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-cyan-600" />
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="h-10 pt-2 px-6 flex items-center justify-between text-xs font-semibold text-slate-200 z-20 select-none bg-slate-950/60 backdrop-blur-sm">
          <span>{currentTime}</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-[10px] font-mono px-1 bg-slate-800 rounded">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px]">84%</span>
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Phone Content Screen */}
        <div className="flex-1 relative overflow-hidden bg-slate-950 text-white flex flex-col">
          {/* Active Call Overlay if calling */}
          {activeCallingContact && (
            <div className="absolute inset-0 z-30 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-between p-8 animate-fade-in">
              <div className="text-center space-y-4 pt-6">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {lang === 'hi' ? 'आउटगोइंग कॉल...' : 'Calling...'}
                </span>

                <div className={`w-28 h-28 mx-auto rounded-full ${activeCallingContact.avatarBg || 'bg-indigo-600'} flex items-center justify-center text-4xl font-bold shadow-2xl animate-pulse`}>
                  {activeCallingContact.name[0]}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{activeCallingContact.name}</h3>
                  <p className="text-sm text-slate-400 font-mono mt-1">{activeCallingContact.phone}</p>
                </div>
              </div>

              {/* Call Controls */}
              <div className="w-full space-y-6">
                <div className="flex items-center justify-around text-slate-300">
                  <button className="p-3.5 rounded-full bg-slate-800 hover:bg-slate-700 transition">
                    <Mic className="w-5 h-5" />
                  </button>
                  <button className="p-3.5 rounded-full bg-slate-800 hover:bg-slate-700 transition">
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <button className="p-3.5 rounded-full bg-slate-800 hover:bg-slate-700 transition">
                    <Radio className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={onEndCall}
                    className="p-5 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/40 transition active:scale-95"
                    title="कॉल काटें / End Call"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Screen: Home Screen */}
          {currentApp === 'home' && (
            <div className="flex-1 p-5 flex flex-col justify-between select-none">
              {/* Wallpaper widgets */}
              <div className="space-y-4 pt-4">
                <div className="text-center space-y-1">
                  <div className="text-4xl font-extralight tracking-tight">{currentTime}</div>
                  <div className="text-xs text-slate-400 font-medium">Monday, 26 October</div>
                </div>

                {/* Google / Gemini Search bar replacement widget */}
                <div 
                  onClick={onOpenAssistant}
                  className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 flex items-center justify-between cursor-pointer shadow-lg hover:border-indigo-500/60 transition group"
                >
                  <div className="flex items-center gap-2.5 text-xs text-slate-400">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">
                      A
                    </div>
                    <span>{lang === 'hi' ? 'Astra से कुछ भी कहें...' : 'Ask Astra anything...'}</span>
                  </div>
                  <Mic className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
                </div>
              </div>

              {/* App Drawer Grid */}
              <div className="grid grid-cols-4 gap-4 py-6">
                {[
                  { id: 'youtube', name: 'YouTube', icon: '▶', bg: 'bg-rose-600' },
                  { id: 'instagram', name: 'Instagram', icon: '📸', bg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600' },
                  { id: 'phone', name: 'Phone', icon: '📞', bg: 'bg-emerald-600' },
                  { id: 'whatsapp', name: 'WhatsApp', icon: '💬', bg: 'bg-teal-600' },
                  { id: 'camera', name: 'Camera', icon: '📷', bg: 'bg-slate-800' },
                  { id: 'spotify', name: 'Spotify', icon: '🎵', bg: 'bg-green-600' },
                  { id: 'settings', name: 'Settings', icon: '⚙️', bg: 'bg-slate-700' },
                  { id: 'assistant_app', name: 'Astra AI', icon: '✨', bg: 'bg-gradient-to-tr from-cyan-500 to-indigo-600' },
                ].map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      if (app.id === 'assistant_app') {
                        onOpenAssistant();
                      } else {
                        onNavigateApp(app.id as PhoneApp);
                      }
                    }}
                    className="flex flex-col items-center gap-1.5 focus:outline-none group active:scale-95 transition"
                  >
                    <div className={`w-12 h-12 rounded-2xl ${app.bg} flex items-center justify-center text-lg text-white shadow-md group-hover:scale-105 transition`}>
                      {app.icon}
                    </div>
                    <span className="text-[11px] text-slate-300 font-medium truncate w-full text-center">
                      {app.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Dock */}
              <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-3 flex items-center justify-around border border-slate-800/80 mb-2">
                <button onClick={() => onNavigateApp('phone')} className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-base">
                  📞
                </button>
                <button onClick={() => onNavigateApp('whatsapp')} className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white text-base">
                  💬
                </button>
                <button onClick={() => onNavigateApp('instagram')} className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white text-base">
                  📸
                </button>
                <button onClick={() => onNavigateApp('youtube')} className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white text-base">
                  ▶
                </button>
              </div>
            </div>
          )}

          {/* Screen: Instagram Reels */}
          {currentApp === 'instagram' && (
            <div className={`flex-1 bg-gradient-to-b ${reels[currentReelIndex].bgGradient} flex flex-col justify-between p-4 relative overflow-hidden transition-all duration-500`}>
              {/* Reels Top Bar */}
              <div className="flex items-center justify-between text-xs z-10 pt-1">
                <button onClick={() => onNavigateApp('home')} className="p-1 rounded-full bg-black/40 text-white">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">Reels</span>
                  {autoScrollConfig.active && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-semibold animate-pulse">
                      Auto-Scrolling ON
                    </span>
                  )}
                </div>
                <Camera className="w-4 h-4 text-white" />
              </div>

              {/* Simulated Reel Video Content Area */}
              <div className="my-auto text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white text-2xl border border-white/20 animate-pulse">
                  🎬
                </div>
                <div className="px-4 py-2 text-xs text-slate-200 font-sans font-medium bg-black/50 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                  <span>{lang === 'hi' ? 'रील्स वीडियो चल रहा है • Reel Playing' : 'Playing Reel Video'}</span>
                </div>
              </div>

              {/* Bottom Details & Vertical Action Bar */}
              <div className="flex items-end justify-between z-10">
                <div className="space-y-2 max-w-[220px]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                      {reels[currentReelIndex].author[1].toUpperCase()}
                    </div>
                    <span className="font-bold text-xs text-white">{reels[currentReelIndex].author}</span>
                  </div>
                  <p className="text-xs text-slate-200 line-clamp-2">
                    {reels[currentReelIndex].caption}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-300 font-mono">
                    <Music className="w-3 h-3 text-cyan-400" />
                    <span>{reels[currentReelIndex].music}</span>
                  </div>
                </div>

                {/* Right Action Icons */}
                <div className="flex flex-col items-center gap-3 text-white">
                  <button className="flex flex-col items-center gap-0.5">
                    <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                    <span className="text-[10px]">{reels[currentReelIndex].likes}</span>
                  </button>
                  <button className="flex flex-col items-center gap-0.5">
                    <MessageCircle className="w-6 h-6 text-white" />
                    <span className="text-[10px]">{reels[currentReelIndex].comments}</span>
                  </button>
                  <button className="flex flex-col items-center gap-0.5">
                    <Share2 className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              {/* Manual Next / Prev Reel Buttons */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
                <button
                  onClick={() => setCurrentReelIndex((prev) => (prev > 0 ? prev - 1 : reels.length - 1))}
                  className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition"
                  title="ऊपर स्क्रॉल करें"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentReelIndex((prev) => (prev + 1) % reels.length)}
                  className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition"
                  title="नीचे स्क्रॉल करें"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Screen: YouTube */}
          {currentApp === 'youtube' && (
            <div className="flex-1 bg-slate-950 flex flex-col p-3 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <button onClick={() => onNavigateApp('home')} className="p-1 text-slate-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5 font-bold text-sm">
                  <span className="w-4 h-3 bg-red-600 rounded-sm inline-block" />
                  <span>YouTube</span>
                </div>
                <Search className="w-4 h-4 text-slate-400" />
              </div>

              {/* Main Video Player Card */}
              <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 space-y-2.5">
                <div className="aspect-video bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center relative">
                  <div className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-105 transition">
                    <Play className="w-5 h-5 ml-0.5" />
                  </div>
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono">
                    14:20
                  </span>
                </div>

                <div className="p-3 space-y-1">
                  <h4 className="text-xs font-bold text-white line-clamp-2">
                    Arijit Singh Best Songs 2026 - Romantic Hindi Songs Playlist
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>T-Series • 4.2M views</span>
                    <span className="text-emerald-400 font-semibold">1080p HD</span>
                  </div>
                </div>
              </div>

              {/* Recommendations list */}
              <div className="space-y-2 flex-1 overflow-y-auto">
                {[
                  { title: 'Learn AI Agent Coding in 10 Minutes', views: '120K' },
                  { title: 'New Android 15 Secret Features Revealed', views: '450K' },
                  { title: 'Hindi Lo-Fi Chill Beats for Coding', views: '980K' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <div className="w-20 h-12 bg-slate-800 rounded-lg shrink-0 flex items-center justify-center text-xs">
                      ▶️
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold text-white truncate">{item.title}</div>
                      <div className="text-[10px] text-slate-400">{item.views} views</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Screen: Phone Dialer & Contacts */}
          {currentApp === 'phone' && (
            <div className="flex-1 bg-slate-950 flex flex-col p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <button onClick={() => onNavigateApp('home')} className="p-1 text-slate-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="font-bold text-sm">{lang === 'hi' ? 'फोन & कॉन्टैक्ट्स' : 'Phone & Contacts'}</span>
                <Phone className="w-4 h-4 text-emerald-400" />
              </div>

              {/* Contacts list */}
              <div className="flex-1 overflow-y-auto space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  {lang === 'hi' ? 'हाल के कॉन्टैक्ट्स' : 'Direct Call Contacts'}
                </div>

                {INITIAL_CONTACTS.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${c.avatarBg} flex items-center justify-center text-xs font-bold text-white`}>
                        {c.name[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{c.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{c.phone}</div>
                      </div>
                    </div>

                    <a
                      href={`tel:${c.phone.replace(/[\s-]/g, '')}`}
                      className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition"
                      title={`${c.name} को कॉल करें`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Screen: Settings */}
          {currentApp === 'settings' && (
            <div className="flex-1 bg-slate-950 flex flex-col p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <button onClick={() => onNavigateApp('home')} className="p-1 text-slate-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="font-bold text-sm">Settings</span>
                <SettingsIcon className="w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-3 text-xs">
                {/* Default Assistant selector */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>Default Digital Assistant</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-semibold flex items-center justify-between">
                    <span>Astra AI Agent (Active)</span>
                    <span className="text-[10px] bg-indigo-600 px-1.5 py-0.5 rounded text-white">Default</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Replaces Google Assistant / Gemini on Home Button hold
                  </p>
                </div>

                {/* Accessibility */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>Accessibility Service</span>
                    <span className="text-emerald-400 font-semibold text-[10px]">ON</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    AutoScrollAccessibilityService enabled for Instagram Reels & YouTube Shorts
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Screen: Camera / WhatsApp / Spotify Fallback view */}
          {(currentApp === 'camera' || currentApp === 'whatsapp' || currentApp === 'spotify') && (
            <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-3xl">
                {currentApp === 'camera' ? '📷' : currentApp === 'whatsapp' ? '💬' : '🎵'}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-white capitalize">{currentApp} Screen</h3>
                <p className="text-xs text-slate-400">
                  {lang === 'hi'
                    ? 'Astra AI एजेंट द्वारा सफलतापूर्वक खोला गया!'
                    : `Opened successfully by Astra AI Agent!`}
                </p>
              </div>
              <button
                onClick={() => onNavigateApp('home')}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-xl transition"
              >
                {lang === 'hi' ? 'होम स्क्रीन पर जाएँ' : 'Back to Home'}
              </button>
            </div>
          )}

          {/* Floating Assistant Bubble over other apps */}
          <div className="absolute bottom-16 right-4 z-40">
            <button
              onClick={onOpenAssistant}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-600 to-fuchsia-600 text-white shadow-xl shadow-indigo-600/40 flex items-center justify-center hover:scale-110 active:scale-95 transition border border-white/20 group"
              title="Astra AI फ्लोटिंग बटन (क्लिक करके बोलें)"
            >
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </button>
          </div>
        </div>

        {/* Center Android Navigation Bar & Gemini Replacement Hold Pill */}
        <div className="h-12 bg-slate-950 flex flex-col items-center justify-center px-6 relative z-20 select-none border-t border-slate-900">
          {/* Visual Hold Progress indicator */}
          {isHoldingHome && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 transition-all duration-75"
                style={{ width: `${holdProgress}%` }}
              />
            </div>
          )}

          {/* Center Navigation Pill Button */}
          <div className="flex items-center justify-center w-full relative">
            <button
              onMouseDown={handleHomeTouchStart}
              onMouseUp={handleHomeTouchEnd}
              onTouchStart={handleHomeTouchStart}
              onTouchEnd={handleHomeTouchEnd}
              onMouseLeave={handleHomeTouchEnd}
              className={`w-32 h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                isHoldingHome
                  ? 'h-2 bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-500 shadow-lg shadow-indigo-500/50 scale-105'
                  : 'bg-slate-500 hover:bg-slate-300'
              }`}
              title="Hold to summon Astra AI Agent (Gemini Replacement)"
            />
          </div>

          <span className="text-[9px] text-slate-500 font-medium tracking-tight mt-1">
            {isHoldingHome 
              ? (lang === 'hi' ? 'जेमिनी रिप्लेसमेंट सक्रिय हो रहा है...' : 'Summoning Astra AI...') 
              : (lang === 'hi' ? 'होम बटन दबाकर रखें (Hold for Astra AI)' : 'Hold pill for Astra AI')}
          </span>
        </div>
      </div>
    </div>
  );
};
