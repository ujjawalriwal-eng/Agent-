import React, { useState } from 'react';
import { 
  Play, 
  Sparkles, 
  Phone, 
  Video, 
  Instagram, 
  ArrowDownCircle, 
  Flashlight, 
  Clock, 
  Battery, 
  Camera, 
  MessageSquare,
  Search,
  ExternalLink
} from 'lucide-react';

interface CommandLibraryProps {
  onExecutePrompt: (promptText: string) => void;
  lang: 'hi' | 'en';
}

interface CommandCard {
  category: string;
  hindiTitle: string;
  englishTitle: string;
  hindiExamples: string[];
  englishExamples: string[];
  actionType: string;
  icon: React.ReactNode;
}

export const CommandLibrary: React.FC<CommandLibraryProps> = ({ onExecutePrompt, lang }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const commandCards: CommandCard[] = [
    {
      category: 'apps',
      hindiTitle: 'YouTube और वीडियो प्लेबैक',
      englishTitle: 'YouTube & Video Search',
      hindiExamples: [
        'YouTube खोल दे',
        'YouTube पर अरिजीत सिंह के गाने चलाओ',
        'YouTube पर कॉमेडी वीडियो दिखाओ',
      ],
      englishExamples: [
        'Open YouTube',
        'Play Arijit Singh songs on YouTube',
        'Search lo-fi music on YouTube',
      ],
      actionType: 'OPEN_APP / SEARCH_YOUTUBE',
      icon: <Video className="w-5 h-5 text-rose-500" />,
    },
    {
      category: 'social',
      hindiTitle: 'Instagram और रील्स',
      englishTitle: 'Instagram & Reels',
      hindiExamples: [
        'Instagram रील्स चलाओ',
        'इंस्टाग्राम खोल दे भाई',
        'Insta open karo',
      ],
      englishExamples: [
        'Open Instagram Reels',
        'Open Instagram',
        'Play Reels on Insta',
      ],
      actionType: 'OPEN_REELS / OPEN_APP',
      icon: <Instagram className="w-5 h-5 text-pink-500" />,
    },
    {
      category: 'automation',
      hindiTitle: 'ऑटो-स्क्रॉल (Reels & Shorts)',
      englishTitle: 'Auto-Scroll Automation',
      hindiExamples: [
        'नीचे स्क्रॉल कर',
        'ऊपर स्क्रॉल करो',
        'Scroll down',
      ],
      englishExamples: [
        'Scroll down',
        'Scroll up',
        'Auto scroll reels',
      ],
      actionType: 'AUTO_SCROLL',
      icon: <ArrowDownCircle className="w-5 h-5 text-cyan-400" />,
    },
    {
      category: 'communication',
      hindiTitle: 'कॉल और कॉन्टैक्ट्स',
      englishTitle: 'Voice Phone Calling',
      hindiExamples: [
        'पापा को कॉल लगाओ',
        'अमित को कॉल कर',
        'Call 9876543210',
      ],
      englishExamples: [
        'Call Papa',
        'Call Amit',
        'Dial +91 98765 43210',
      ],
      actionType: 'CALL_CONTACT',
      icon: <Phone className="w-5 h-5 text-emerald-400" />,
    },
    {
      category: 'communication',
      hindiTitle: 'WhatsApp मैसेजिंग',
      englishTitle: 'WhatsApp Messaging',
      hindiExamples: [
        'रोहित को WhatsApp करो',
        'WhatsApp पर हाय भेजो',
      ],
      englishExamples: [
        'Send message to Rohit on WhatsApp',
        'Open WhatsApp chat',
      ],
      actionType: 'SEND_WHATSAPP',
      icon: <MessageSquare className="w-5 h-5 text-teal-400" />,
    },
    {
      category: 'hardware',
      hindiTitle: 'टॉर्च / फ्लैशलाइट कंट्रोल',
      englishTitle: 'Flashlight / Torch Toggle',
      hindiExamples: [
        'टॉर्च चालू करो',
        'फ्लैशलाइट बंद कर दो',
        'Torch on karo',
      ],
      englishExamples: [
        'Turn on torch',
        'Turn off flashlight',
        'Toggle torch',
      ],
      actionType: 'TOGGLE_TORCH',
      icon: <Flashlight className="w-5 h-5 text-yellow-400" />,
    },
    {
      category: 'hardware',
      hindiTitle: 'बैटरी और डिवाइस स्टेटस',
      englishTitle: 'Battery & Device Health',
      hindiExamples: [
        'बैटरी कितनी है?',
        'फोन कितना चार्ज है?',
      ],
      englishExamples: [
        'Check battery status',
        'What is my battery level?',
      ],
      actionType: 'CHECK_BATTERY',
      icon: <Battery className="w-5 h-5 text-green-400" />,
    },
    {
      category: 'hardware',
      hindiTitle: 'अलार्म और टाइमर',
      englishTitle: 'Alarms & Timers',
      hindiExamples: [
        '10 मिनट का टाइमर लगाओ',
        'अलार्म सेट करो',
      ],
      englishExamples: [
        'Set a 5 minute timer',
        'Set morning alarm',
      ],
      actionType: 'SET_ALARM',
      icon: <Clock className="w-5 h-5 text-amber-400" />,
    },
    {
      category: 'hardware',
      hindiTitle: 'कैमरा और फोटो',
      englishTitle: 'Camera & Photos',
      hindiExamples: [
        'कैमरा खोलो',
        'सेल्फी लो',
      ],
      englishExamples: [
        'Open Camera',
        'Take a photo',
      ],
      actionType: 'TAKE_PHOTO',
      icon: <Camera className="w-5 h-5 text-indigo-400" />,
    },
  ];

  const filtered = commandCards.filter((card) => {
    const matchesCat = selectedCategory === 'all' || card.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      card.hindiTitle.toLowerCase().includes(query) ||
      card.englishTitle.toLowerCase().includes(query) ||
      card.hindiExamples.some(ex => ex.toLowerCase().includes(query)) ||
      card.englishExamples.some(ex => ex.toLowerCase().includes(query));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {lang === 'hi' ? 'वॉयस कमांड्स लाइब्रेरी' : 'Voice Commands Library'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'hi'
              ? 'आप हिन्दी, हिंग्लिश या इंग्लिश में जो चाहें बोल सकते हैं। टेस्ट करने के लिए किसी भी कमांड पर क्लिक करें!'
              : 'Speak naturally in Hindi, Hinglish, or English. Click any example to test it immediately!'}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'hi' ? 'कमांड खोजें...' : 'Search commands...'}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', labelHi: 'सभी कमांड्स', labelEn: 'All Commands' },
          { id: 'automation', labelHi: 'ऑटो-स्क्रॉल', labelEn: 'Auto-Scroll' },
          { id: 'apps', labelHi: 'YouTube & Apps', labelEn: 'YouTube & Apps' },
          { id: 'social', labelHi: 'Instagram', labelEn: 'Instagram' },
          { id: 'communication', labelHi: 'कॉल & WhatsApp', labelEn: 'Call & WhatsApp' },
          { id: 'hardware', labelHi: 'टॉर्च, बैटरी, कैमरा', labelEn: 'Device Controls' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {lang === 'hi' ? cat.labelHi : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((card, idx) => (
          <div
            key={idx}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-4 hover:border-slate-700 transition"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      {lang === 'hi' ? card.hindiTitle : card.englishTitle}
                    </h3>
                    <span className="font-mono text-[10px] text-cyan-400">
                      {card.actionType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Examples */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-400">
                  {lang === 'hi' ? 'बोलने के उदाहरण (क्लिक करके टेस्ट करें):' : 'Examples (Click to test):'}
                </div>
                {(lang === 'hi' ? card.hindiExamples : card.englishExamples).map((example, i) => (
                  <button
                    key={i}
                    onClick={() => onExecutePrompt(example)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-950/70 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-500/50 text-xs text-slate-200 hover:text-cyan-300 transition flex items-center justify-between group"
                  >
                    <span>"{example}"</span>
                    <Play className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
