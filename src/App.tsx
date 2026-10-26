import React, { useState, useCallback } from 'react';
import { 
  PhoneApp, 
  CommandLog, 
  PermissionItem, 
  AutoScrollConfig 
} from './types';
import { HeaderNav } from './components/HeaderNav';
import { PhoneSimulator } from './components/PhoneSimulator';
import { PermissionsDashboard } from './components/PermissionsDashboard';
import { ApkExportModal } from './components/ApkExportModal';
import { CommandLibrary } from './components/CommandLibrary';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { parseVoiceCommand, ParsedCommand } from './utils/commandParser';
import { DeviceBridge, ContactItem, INITIAL_CONTACTS } from './utils/deviceBridge';

export default function App() {
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [activeTab, setActiveTab] = useState<'phone' | 'permissions' | 'apk' | 'library'>('phone');
  
  // Phone simulation state
  const [currentApp, setCurrentApp] = useState<PhoneApp>('home');
  const [activeCallingContact, setActiveCallingContact] = useState<ContactItem | null>(null);
  const [autoScrollConfig, setAutoScrollConfig] = useState<AutoScrollConfig>({
    active: false,
    intervalMs: 4000,
    direction: 'down',
  });
  const [isTorchOn, setIsTorchOn] = useState(false);

  // Assistant modal state
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCommand, setLastCommand] = useState<ParsedCommand | null>(null);
  const [commandLogs, setCommandLogs] = useState<CommandLog[]>([]);

  // Permissions state
  const [permissions, setPermissions] = useState<PermissionItem[]>([
    {
      id: 'assistant',
      nameHindi: 'डिफ़ॉल्ट डिजिटल असिस्टेंट (Gemini रिप्लेसमेंट)',
      nameEnglish: 'Default Digital Assistant App',
      systemKey: 'BIND_VOICE_INTERACTION_SERVICE',
      descriptionHindi: 'बीच के होम बटन या पावर बटन को दबाकर रखने पर Gemini की जगह Astra AI को शुरू करने के लिए।',
      descriptionEnglish: 'Replaces Google Gemini / Assistant when holding the Home Button or Power Button.',
      granted: true,
      requiredFor: 'Home Button Hold Activation',
      isCore: true,
      instructionHindi: 'Apps > Default Apps > Digital Assistant App में जाएँ और Astra चुनें।',
    },
    {
      id: 'accessibility',
      nameHindi: 'एक्सेसिबिलिटी सर्विस (रील्स ऑटो-स्क्रॉल)',
      nameEnglish: 'Accessibility Service (Auto-Scroll)',
      systemKey: 'BIND_ACCESSIBILITY_SERVICE',
      descriptionHindi: 'Instagram रील्स और YouTube शॉर्ट्स को आपकी आवाज़ पर ऑटोमैटिक ऊपर या नीचे स्वाइप करने के लिए।',
      descriptionEnglish: 'Enables automatic gesture swiping for Instagram Reels and YouTube Shorts on voice commands.',
      granted: true,
      requiredFor: 'Auto-Scroll & Gesture Automation',
      isCore: true,
      instructionHindi: 'Accessibility > Installed Apps > Astra Auto-Scroll को ON करें।',
    },
    {
      id: 'overlay',
      nameHindi: 'डिस्प्ले ओवर अदर ऐप्स (फ़्लोटिंग ओवरले)',
      nameEnglish: 'Display Over Other Apps (Floating Overlay)',
      systemKey: 'SYSTEM_ALERT_WINDOW',
      descriptionHindi: 'YouTube या Instagram चलाते समय भी स्क्रीन पर गोल AI बटन और जादुई शीट दिखाने के लिए।',
      descriptionEnglish: 'Allows Astra to float over any active application like YouTube or Instagram.',
      granted: true,
      requiredFor: 'Floating Assistant Bubble',
      isCore: true,
      instructionHindi: 'Special App Access > Display Over Other Apps में Allow करें।',
    },
    {
      id: 'mic',
      nameHindi: 'माइक्रोफ़ोन अनुमति (वॉयस कमांड्स)',
      nameEnglish: 'Microphone Access',
      systemKey: 'RECORD_AUDIO',
      descriptionHindi: 'आपकी हिन्दी और इंग्लिश आवाज सुनकर कमांड्स को प्रोसेस करने के लिए।',
      descriptionEnglish: 'Required to capture voice prompts in Hindi and English.',
      granted: true,
      requiredFor: 'Voice Recognition Engine',
      isCore: true,
      instructionHindi: 'App Permissions > Microphone > Allow while using the app चुनें।',
    },
    {
      id: 'phone',
      nameHindi: 'फोन कॉल और कॉन्टैक्ट्स',
      nameEnglish: 'Phone Calling & Contacts',
      systemKey: 'CALL_PHONE & READ_CONTACTS',
      descriptionHindi: 'नाम या नंबर बोलते ही डायरेक्ट फोन मिलाने और हाल के नंबर देखने के लिए।',
      descriptionEnglish: 'Allows instant direct dialing and reading contact list by spoken name.',
      granted: true,
      requiredFor: 'Direct Voice Phone Calls',
      isCore: true,
      instructionHindi: 'App Permissions > Phone & Contacts दोनों को Allow करें।',
    },
    {
      id: 'battery',
      nameHindi: 'बैटरी ऑप्टिमाइज़ेशन छूट (24/7 एक्टिव)',
      nameEnglish: 'Ignore Battery Optimizations',
      systemKey: 'REQUEST_IGNORE_BATTERY_OPTIMIZATIONS',
      descriptionHindi: 'एंड्रॉइड सिस्टम बैकग्राउंड में एजेंट को बंद न करे, ताकि यह हमेशा तुरंत जवाब दे।',
      descriptionEnglish: 'Prevents Android OS from killing the assistant background service.',
      granted: false,
      requiredFor: 'Background Service Persistence',
      isCore: false,
      instructionHindi: 'Battery > Battery Optimization > Astra को "Unrestricted" सेट करें।',
    },
    {
      id: 'notifications',
      nameHindi: 'नोटिफिकेशन लिसनर सर्विस',
      nameEnglish: 'Notification Access',
      systemKey: 'BIND_NOTIFICATION_LISTENER_SERVICE',
      descriptionHindi: 'आने वाले WhatsApp और SMS संदेशों को बोलकर सुनाने और रिप्लाई करने के लिए।',
      descriptionEnglish: 'Reads incoming WhatsApp and SMS alerts aloud.',
      granted: false,
      requiredFor: 'WhatsApp & SMS Read-Aloud',
      isCore: false,
      instructionHindi: 'Special App Access > Notification Access में Astra Agent को Allow करें।',
    },
  ]);

  // Toggle permission
  const handleTogglePermission = (id: string) => {
    setPermissions(prev => prev.map(p => p.id === id ? { ...p, granted: !p.granted } : p));
  };

  // Grant all permissions
  const handleGrantAll = () => {
    setPermissions(prev => prev.map(p => ({ ...p, granted: true })));
  };

  // Process voice/text command
  const handleProcessCommand = useCallback(async (promptText: string) => {
    if (!promptText.trim()) return;

    setIsProcessing(true);
    let parsed: ParsedCommand = parseVoiceCommand(promptText);

    // Try server-side Gemini API route with short timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          prompt: promptText,
          currentContext: { currentApp, autoScroll: autoScrollConfig.active },
        }),
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.usingGemini && data.action) {
          parsed = {
            rawText: promptText,
            action: data.action,
            target: data.target,
            parameter: data.parameter,
            spokenResponseHindi: data.spokenResponseHindi || parsed.spokenResponseHindi,
            spokenResponseEnglish: data.spokenResponseEnglish || parsed.spokenResponseEnglish,
            confidence: 0.98,
          };
        }
      }
    } catch {
      // Local high-speed fallback works seamlessly
    }

    setLastCommand(parsed);
    const spokenReply = lang === 'hi' ? parsed.spokenResponseHindi : parsed.spokenResponseEnglish;

    // Speak audio aloud
    DeviceBridge.speak(spokenReply, lang === 'hi' ? 'hi-IN' : 'en-US');

    // Execute device automation action
    switch (parsed.action) {
      case 'OPEN_APP':
        if (parsed.target === 'YouTube') {
          setCurrentApp('youtube');
        } else if (parsed.target === 'Instagram') {
          setCurrentApp('instagram');
        } else if (parsed.target === 'Settings') {
          setCurrentApp('settings');
        } else if (parsed.target === 'Camera') {
          setCurrentApp('camera');
        } else if (parsed.target === 'Spotify') {
          setCurrentApp('spotify');
        }
        break;

      case 'SEARCH_YOUTUBE':
        setCurrentApp('youtube');
        DeviceBridge.openYouTube(parsed.parameter);
        break;

      case 'OPEN_REELS':
        setCurrentApp('instagram');
        setAutoScrollConfig(prev => ({ ...prev, active: true }));
        break;

      case 'AUTO_SCROLL':
        setCurrentApp('instagram');
        setAutoScrollConfig(prev => ({
          ...prev,
          active: true,
          direction: parsed.parameter === 'up' ? 'up' : 'down',
        }));
        break;

      case 'CALL_CONTACT':
        setCurrentApp('phone');
        {
          const callResult = DeviceBridge.triggerCall(parsed.target || 'Amit', INITIAL_CONTACTS);
          const found = INITIAL_CONTACTS.find(c => c.name.toLowerCase().includes((parsed.target || '').toLowerCase()));
          setActiveCallingContact(found || {
            id: 'temp',
            name: callResult.contactName,
            phone: callResult.number,
            relation: 'Contact',
            avatarBg: 'bg-indigo-600',
          });
        }
        break;

      case 'SEND_WHATSAPP':
        setCurrentApp('whatsapp');
        DeviceBridge.openWhatsApp('', parsed.parameter || 'Hello');
        break;

      case 'TOGGLE_TORCH':
        {
          const newState = parsed.parameter === 'off' ? false : true;
          setIsTorchOn(newState);
          DeviceBridge.toggleTorch(newState ? 'on' : 'off');
        }
        break;

      case 'CHECK_BATTERY':
        DeviceBridge.getBatteryStatus().then((info) => {
          if (info) {
            const batMsg = lang === 'hi' 
              ? `आपके फोन की बैटरी ${info.level}% है।` 
              : `Your battery level is ${info.level}%.`;
            DeviceBridge.speak(batMsg, lang === 'hi' ? 'hi-IN' : 'en-US');
          }
        });
        break;

      case 'TAKE_PHOTO':
        setCurrentApp('camera');
        break;

      default:
        break;
    }

    // Add to history log
    const newLog: CommandLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      input: promptText,
      action: parsed.action,
      target: parsed.target,
      parameter: parsed.parameter,
      response: spokenReply,
      status: 'success',
      source: 'voice',
    };

    setCommandLogs(prev => [newLog, ...prev]);
    setIsProcessing(false);

    // Auto-dismiss modal for phone app actions so user sees their phone screen change
    if (parsed.action !== 'GENERAL_QUERY') {
      setTimeout(() => {
        setIsAssistantOpen(false);
      }, 1000);
    }
  }, [lang, currentApp, autoScrollConfig.active]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <HeaderNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        lang={lang}
        onToggleLang={() => setLang(l => l === 'hi' ? 'en' : 'hi')}
        isAssistantOpen={isAssistantOpen}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'phone' && (
          <PhoneSimulator
            currentApp={currentApp}
            onNavigateApp={setCurrentApp}
            onOpenAssistant={() => setIsAssistantOpen(true)}
            activeCallingContact={activeCallingContact}
            onEndCall={() => setActiveCallingContact(null)}
            autoScrollConfig={autoScrollConfig}
            onToggleAutoScroll={() => setAutoScrollConfig(prev => ({ ...prev, active: !prev.active }))}
            isTorchOn={isTorchOn}
            onToggleTorch={() => setIsTorchOn(t => !t)}
            commandLogs={commandLogs}
            lang={lang}
          />
        )}

        {activeTab === 'permissions' && (
          <PermissionsDashboard
            permissions={permissions}
            onTogglePermission={handleTogglePermission}
            onGrantAll={handleGrantAll}
            lang={lang}
          />
        )}

        {activeTab === 'apk' && (
          <ApkExportModal lang={lang} />
        )}

        {activeTab === 'library' && (
          <CommandLibrary
            onExecutePrompt={(prompt) => {
              setActiveTab('phone');
              handleProcessCommand(prompt);
            }}
            lang={lang}
          />
        )}
      </main>

      {/* Voice Assistant Glowing Modal */}
      <VoiceAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onProcessCommand={(cmd) => {
          handleProcessCommand(cmd);
        }}
        lastCommand={lastCommand}
        isProcessing={isProcessing}
        lang={lang}
      />
    </div>
  );
}
