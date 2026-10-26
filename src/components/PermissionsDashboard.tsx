import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Mic, 
  PhoneCall, 
  Layers, 
  Sparkles, 
  BatteryCharging, 
  Bell, 
  ExternalLink,
  Smartphone,
  ChevronRight,
  HelpCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { PermissionItem } from '../types';

interface PermissionsDashboardProps {
  permissions: PermissionItem[];
  onTogglePermission: (id: string) => void;
  onGrantAll: () => void;
  lang: 'hi' | 'en';
}

export const PermissionsDashboard: React.FC<PermissionsDashboardProps> = ({
  permissions,
  onTogglePermission,
  onGrantAll,
  lang,
}) => {
  const [selectedSettingGuide, setSelectedSettingGuide] = useState<PermissionItem | null>(null);
  const [isRequestingMic, setIsRequestingMic] = useState(false);

  const grantedCount = permissions.filter(p => p.granted).length;
  const totalCount = permissions.length;
  const percentage = Math.round((grantedCount / totalCount) * 100);

  // Trigger real microphone browser permission
  const handleRealMicPermission = async () => {
    setIsRequestingMic(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      const micPerm = permissions.find(p => p.id === 'mic');
      if (micPerm && !micPerm.granted) {
        onTogglePermission('mic');
      }
    } catch (err) {
      console.warn('Mic permission error:', err);
    } finally {
      setIsRequestingMic(false);
    }
  };

  const getIconForPermission = (id: string) => {
    switch (id) {
      case 'assistant':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'accessibility':
        return <Layers className="w-5 h-5 text-purple-400" />;
      case 'overlay':
        return <Smartphone className="w-5 h-5 text-cyan-400" />;
      case 'mic':
        return <Mic className="w-5 h-5 text-rose-400" />;
      case 'phone':
        return <PhoneCall className="w-5 h-5 text-emerald-400" />;
      case 'battery':
        return <BatteryCharging className="w-5 h-5 text-yellow-400" />;
      case 'notifications':
        return <Bell className="w-5 h-5 text-blue-400" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner / Status Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'hi' ? 'एंड्रॉइड सिस्टम परमिशन मैनेजर' : 'Android System Permissions Setup'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {lang === 'hi' 
                ? 'सिस्टम परमिशन और जेमिनी रिप्लेसमेंट सेटिंग्स' 
                : 'System Permissions & Gemini Replacement Setup'}
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {lang === 'hi'
                ? 'अपने फोन में होम बटन होल्ड करने पर जेमिनी की जगह Astra AI को लाने, इंस्टाग्राम ऑटो-स्क्रॉल करने और कॉल लगाने के लिए नीचे दी गई सभी जरूरी अनुमतियाँ चालू करें।'
                : 'Configure all Android system permissions required to replace Gemini on Home Button hold, enable Instagram auto-scrolling, and initiate direct calls.'}
            </p>
          </div>

          {/* Progress Card & 1-Click Action */}
          <div className="flex flex-col sm:flex-row md:flex-col items-center sm:items-start md:items-end justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <div className="text-center sm:text-left md:text-right">
              <div className="text-xs text-slate-400 mb-1">{lang === 'hi' ? 'परमिशन स्टेटस' : 'Permissions Status'}</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-cyan-400">{grantedCount} / {totalCount}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                  {percentage}% {lang === 'hi' ? 'चालू' : 'Ready'}
                </span>
              </div>
            </div>

            <button
              onClick={onGrantAll}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'hi' ? 'सभी परमिशन चालू करें' : 'Grant All Recommended'}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/50">
          <div 
            className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 h-full transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Permissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {permissions.map((perm) => (
          <div
            key={perm.id}
            className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-4 ${
              perm.granted
                ? 'bg-slate-900/90 border-emerald-500/30 hover:border-emerald-500/50 shadow-md shadow-emerald-500/5'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${
                    perm.granted ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800 border-slate-700'
                  }`}>
                    {getIconForPermission(perm.id)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">
                        {lang === 'hi' ? perm.nameHindi : perm.nameEnglish}
                      </h3>
                      {perm.isCore && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {lang === 'hi' ? 'ज़रूरी' : 'Core'}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs text-slate-400">
                      {perm.systemKey}
                    </span>
                  </div>
                </div>

                {/* Toggle switch */}
                <button
                  onClick={() => onTogglePermission(perm.id)}
                  className="text-slate-300 hover:text-white transition focus:outline-none"
                  title="अनुमति टॉगल करें / Toggle permission"
                >
                  {perm.granted ? (
                    <ToggleRight className="w-8 h-8 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-500" />
                  )}
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {lang === 'hi' ? perm.descriptionHindi : perm.descriptionEnglish}
              </p>

              <div className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-semibold">{lang === 'hi' ? 'उपयोग:' : 'Required for:'}</span>{' '}
                {perm.requiredFor}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs">
                {perm.granted ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {lang === 'hi' ? 'अनुमति प्राप्त है' : 'Granted & Active'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {lang === 'hi' ? 'अनुमति बाकी है' : 'Action Required'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {perm.id === 'mic' && (
                  <button
                    onClick={handleRealMicPermission}
                    disabled={isRequestingMic}
                    className="px-2.5 py-1 text-xs rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30 transition flex items-center gap-1"
                  >
                    <Mic className="w-3 h-3" />
                    <span>{isRequestingMic ? 'जाँच...' : (lang === 'hi' ? 'माइक टेस्ट' : 'Test Mic')}</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedSettingGuide(perm)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 transition flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>{lang === 'hi' ? 'फोन में कैसे करें?' : 'Setup Guide'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Android Settings Guide Modal */}
      {selectedSettingGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  {getIconForPermission(selectedSettingGuide.id)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {lang === 'hi' ? selectedSettingGuide.nameHindi : selectedSettingGuide.nameEnglish}
                  </h3>
                  <p className="text-xs text-slate-400">Android System Settings Walkthrough</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSettingGuide(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Instruction steps */}
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                {lang === 'hi' 
                  ? 'अपने स्मार्टफोन में यह सेटिंग चालू करने के लिए इन आसान स्टेप्स का पालन करें:' 
                  : 'Follow these steps in your phone settings to enable this feature:'}
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs sm:text-sm font-sans text-slate-200">
                <div className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold shrink-0">1</span>
                  <span>{lang === 'hi' ? 'फोन की ' : 'Open phone '}<b className="text-cyan-400">Settings</b> {lang === 'hi' ? 'खोलें।' : 'app.'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold shrink-0">2</span>
                  <span>{selectedSettingGuide.instructionHindi}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold shrink-0">3</span>
                  <span>{lang === 'hi' ? 'लिस्ट में ' : 'Select '}<b className="text-indigo-400">Astra AI Agent</b> {lang === 'hi' ? 'चुनें और Allow पर क्लिक करें।' : 'and choose Allow.'}</span>
                </div>
              </div>

              {selectedSettingGuide.id === 'assistant' && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <span>
                    {lang === 'hi' 
                      ? 'यह वही सेटिंग है जिससे बीच के होम बटन को दबाकर रखने पर Gemini की जगह आपका Astra Agent एक्टिवेट होता है!' 
                      : 'This is the exact setting that replaces Google Gemini with Astra AI when holding down the Home button!'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  if (!selectedSettingGuide.granted) {
                    onTogglePermission(selectedSettingGuide.id);
                  }
                  setSelectedSettingGuide(null);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-medium rounded-xl transition"
              >
                {selectedSettingGuide.granted 
                  ? (lang === 'hi' ? 'बंद करें' : 'Close') 
                  : (lang === 'hi' ? 'अनुमति चालू मार्क करें' : 'Mark as Granted')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
