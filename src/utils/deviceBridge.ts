/**
 * Device Bridge for Android & Web hardware integrations
 */

export interface ContactItem {
  id: string;
  name: string;
  phone: string;
  relation?: string;
  avatarBg?: string;
}

export const INITIAL_CONTACTS: ContactItem[] = [
  { id: '1', name: 'Papa (पापा)', phone: '+91 98765 43210', relation: 'Father', avatarBg: 'bg-emerald-600' },
  { id: '2', name: 'Mummy (मम्मी)', phone: '+91 98123 45678', relation: 'Mother', avatarBg: 'bg-rose-600' },
  { id: '3', name: 'Amit Sharma (अमित)', phone: '+91 97234 56789', relation: 'Best Friend', avatarBg: 'bg-blue-600' },
  { id: '4', name: 'Rahul Verma (राहुल)', phone: '+91 96543 21098', relation: 'Colleague', avatarBg: 'bg-amber-600' },
  { id: '5', name: 'Rohit (रोहित)', phone: '+91 95432 10987', relation: 'Brother', avatarBg: 'bg-purple-600' },
  { id: '6', name: 'Doctor Sinha (डॉक्टर)', phone: '+91 94321 09876', relation: 'Physician', avatarBg: 'bg-cyan-600' },
];

let activeTorchStream: MediaStream | null = null;

export const DeviceBridge = {
  // 1. Text to Speech (Hindi & English)
  speak: (text: string, lang: 'hi-IN' | 'en-US' = 'hi-IN'): Promise<void> => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(v => v.lang.includes(lang.split('-')[0])) || voices[0];
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  },

  // 2. Stop Speech
  stopSpeaking: () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  // 3. Phone Call Intent
  triggerCall: (phoneNumberOrName: string, contacts: ContactItem[] = INITIAL_CONTACTS): { success: boolean; contactName: string; number: string } => {
    // Check if matches a contact
    const match = contacts.find(c => 
      c.name.toLowerCase().includes(phoneNumberOrName.toLowerCase()) ||
      phoneNumberOrName.toLowerCase().includes(c.name.toLowerCase()) ||
      c.phone.replace(/[\s+-]/g, '') === phoneNumberOrName.replace(/[\s+-]/g, '')
    );

    const targetNumber = match ? match.phone : phoneNumberOrName;
    const contactName = match ? match.name : phoneNumberOrName;
    const cleanNumber = targetNumber.replace(/[\s-]/g, '');

    try {
      window.location.href = `tel:${cleanNumber}`;
    } catch {
      // Ignore if iframe blocks top navigation
    }

    return { success: true, contactName, number: targetNumber };
  },

  // 4. Open YouTube or search
  openYouTube: (query?: string) => {
    const url = query 
      ? `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
      : `https://www.youtube.com`;
    window.open(url, '_blank');
  },

  // 5. Open Instagram or Reels
  openInstagram: (isReels: boolean = false) => {
    const url = isReels ? 'https://www.instagram.com/reels/' : 'https://www.instagram.com';
    window.open(url, '_blank');
  },

  // 6. WhatsApp Message
  openWhatsApp: (phone: string = '', text: string = '') => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const url = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  },

  // 7. Battery Status
  getBatteryStatus: async (): Promise<{ level: number; charging: boolean } | null> => {
    try {
      // @ts-expect-error - navigator.getBattery is non-standard
      if (typeof navigator.getBattery === 'function') {
        // @ts-expect-error - navigator.getBattery
        const battery = await navigator.getBattery();
        return {
          level: Math.round(battery.level * 100),
          charging: battery.charging,
        };
      }
    } catch {
      // fallback
    }
    return { level: 84, charging: false };
  },

  // 8. Flashlight / Torch
  toggleTorch: async (forceState?: 'on' | 'off'): Promise<boolean> => {
    try {
      if (forceState === 'off' || activeTorchStream) {
        if (activeTorchStream) {
          activeTorchStream.getTracks().forEach(t => t.stop());
          activeTorchStream = null;
        }
        if (forceState === 'off') return false;
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        const track = stream.getVideoTracks()[0];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const capabilities: any = track.getCapabilities ? track.getCapabilities() : null;
        if (capabilities?.torch) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (track as any).applyConstraints({ advanced: [{ torch: true }] });
          activeTorchStream = stream;
          return true;
        }
      }
    } catch {
      // Fallback
    }
    return false;
  },

  // 9. Haptic Vibration
  vibrate: (pattern: number[] = [80, 40, 80]) => {
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // ignore
    }
  },
};
