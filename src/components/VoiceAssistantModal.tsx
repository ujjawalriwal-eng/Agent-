import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  X, 
  CheckCircle2, 
  Play, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { ParsedCommand } from '../utils/commandParser';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcessCommand: (input: string) => void;
  lastCommand: ParsedCommand | null;
  isProcessing: boolean;
  lang: 'hi' | 'en';
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onProcessCommand,
  lastCommand,
  isProcessing,
  lang,
}) => {
  const [textInput, setTextInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Quick suggestions
  const suggestions = lang === 'hi' ? [
    'YouTube खोल दे',
    'अमित को कॉल कर',
    'Instagram Reels चलाओ',
    'नीचे स्क्रॉल कर',
    'YouTube पर गाने चलाओ',
    'टॉर्च चालू करो',
    'बैटरी कितनी है?',
  ] : [
    'Open YouTube',
    'Call Amit',
    'Open Instagram Reels',
    'Scroll down',
    'Play songs on YouTube',
    'Turn on torch',
    'Check battery',
  ];

  // Initialize SpeechRecognition if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-expect-error - webkitSpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          let current = '';
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          setLiveTranscript(current);

          if (event.results[0].isFinal) {
            setIsListening(false);
            if (current.trim()) {
              onProcessCommand(current.trim());
              setLiveTranscript('');
            }
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [lang, onProcessCommand]);

  // Auto-start listening when opened
  useEffect(() => {
    if (isOpen) {
      startListening();
    } else {
      stopListening();
      setLiveTranscript('');
    }
  }, [isOpen]);

  const startListening = () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        setIsListening(true);
      }
    } catch {
      // recognition may already be running
      setIsListening(true);
    }
  };

  const stopListening = () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch {
      // ignore
    }
    setIsListening(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      onProcessCommand(textInput.trim());
      setTextInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm transition-all animate-fade-in">
      {/* Click outside to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Glowing Assistant Bottom Sheet / Modal */}
      <div className="relative z-10 w-full sm:max-w-xl bg-slate-900 border-t sm:border border-indigo-500/40 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glowing top line (like Google Assistant / Gemini hold gesture) */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 via-pink-500 to-amber-400 animate-pulse" />

        {/* Header */}
        <div className="px-5 py-3.5 flex items-center justify-between border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-fuchsia-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-sm">Astra AI Voice Agent</span>
                <span className="px-1.5 py-0.2 text-[10px] bg-indigo-500/20 text-indigo-300 rounded font-mono">
                  {lang === 'hi' ? 'हिन्दी एक्टिव' : 'EN Active'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isListening 
                  ? (lang === 'hi' ? 'सुन रहा हूँ... बोलिए' : 'Listening... Speak now') 
                  : (lang === 'hi' ? 'माइक दबाएं या टाइप करें' : 'Tap mic or type')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title={voiceEnabled ? 'वॉयस म्यूट करें' : 'वॉयस चालू करें'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Audio Visualizer & Wave Animation */}
          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing rings */}
              {isListening && (
                <>
                  <div className="absolute w-24 h-24 rounded-full bg-indigo-500/20 animate-ping" />
                  <div className="absolute w-20 h-20 rounded-full bg-cyan-500/30 animate-pulse-ring" />
                </>
              )}

              {/* Main Mic Button */}
              <button
                onClick={isListening ? stopListening : startListening}
                className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
                  isListening
                    ? 'bg-gradient-to-tr from-rose-500 via-pink-600 to-indigo-600 text-white scale-110 shadow-rose-500/40 animate-pulse'
                    : 'bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 text-white hover:scale-105 shadow-indigo-600/30'
                }`}
                title={isListening ? 'स्टॉप करें' : 'माइक चालू करें'}
              >
                {isListening ? <Mic className="w-8 h-8" /> : <Mic className="w-7 h-7" />}
              </button>
            </div>

            {/* Audio Wave Bars */}
            <div className="flex items-center gap-1 h-6">
              {[4, 12, 20, 16, 24, 18, 10, 22, 14, 6].map((height, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-200 ${
                    isListening ? 'bg-gradient-to-t from-cyan-400 to-indigo-400 animate-pulse' : 'bg-slate-700 h-2'
                  }`}
                  style={{
                    height: isListening ? `${Math.max(4, Math.round(height * Math.random()))}px` : '4px',
                    animationDelay: `${i * 100}ms`
                  }}
                />
              ))}
            </div>

            {/* Live Transcript / Speech Feedback */}
            <div className="text-center min-h-[2.5rem] flex items-center justify-center px-4">
              {liveTranscript ? (
                <p className="text-base sm:text-lg font-medium text-cyan-300 animate-pulse">
                  "{liveTranscript}"
                </p>
              ) : isListening ? (
                <p className="text-xs sm:text-sm text-slate-400 italic">
                  {lang === 'hi' ? 'बोलिए... जैसे "YouTube खोलो", "अमित को कॉल कर"' : 'Say something like "Open YouTube", "Call Amit"'}
                </p>
              ) : (
                <p className="text-xs text-slate-500">
                  {lang === 'hi' ? 'माइक पर टैप करके बोलें' : 'Tap the microphone to speak'}
                </p>
              )}
            </div>
          </div>

          {/* Last Response & Action Result Display */}
          {lastCommand && (
            <div className="bg-slate-950/80 border border-indigo-500/30 rounded-2xl p-3.5 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{lang === 'hi' ? 'पहचाना गया आदेश:' : 'Recognized Command:'}</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[11px] font-bold">
                  {lastCommand.action}
                </span>
              </div>
              <p className="text-sm font-semibold text-white">
                "{lastCommand.rawText}"
              </p>
              <div className="pt-2 border-t border-slate-800 text-xs text-cyan-400 flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>{lang === 'hi' ? lastCommand.spokenResponseHindi : lastCommand.spokenResponseEnglish}</span>
              </div>
            </div>
          )}

          {/* Quick Suggestions Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400">
              {lang === 'hi' ? 'त्वरित उदाहरण (क्लिक करके चलाएं):' : 'Quick Actions:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => onProcessCommand(s)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-indigo-900/40 text-slate-200 hover:text-cyan-300 border border-slate-700/60 hover:border-indigo-500/40 transition flex items-center gap-1"
                >
                  <Play className="w-2.5 h-2.5 text-slate-400" />
                  <span>{s}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Manual Text Input Footer */}
        <form onSubmit={handleManualSubmit} className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={lang === 'hi' ? 'यहाँ टाइप करें (जैसे: कॉल करो, यूट्यूब खोलो)...' : 'Type a command here...'}
            className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={!textInput.trim() || isProcessing}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
