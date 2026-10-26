/**
 * Command Parser & Intent Recognizer for Astra AI Agent
 * Supports Hindi, Hinglish, and English natural speech commands.
 */

export type ActionType = 
  | 'OPEN_APP'
  | 'CALL_CONTACT'
  | 'AUTO_SCROLL'
  | 'SEND_WHATSAPP'
  | 'TOGGLE_TORCH'
  | 'SET_ALARM'
  | 'CHECK_BATTERY'
  | 'GET_LOCATION'
  | 'SEARCH_YOUTUBE'
  | 'OPEN_REELS'
  | 'OPEN_SETTINGS'
  | 'TAKE_PHOTO'
  | 'GENERAL_QUERY';

export interface ParsedCommand {
  rawText: string;
  action: ActionType;
  target?: string;
  parameter?: string;
  spokenResponseHindi: string;
  spokenResponseEnglish: string;
  confidence: number;
}

export function parseVoiceCommand(input: string): ParsedCommand {
  const clean = input.trim();
  const lower = clean.toLowerCase();

  // 1. YouTube specific
  if (
    lower.includes('youtube') ||
    lower.includes('यूट्यूब') ||
    lower.includes('युटुब') ||
    lower.includes('yt')
  ) {
    // Check if it's a search / song play request
    // Matches: "YouTube par Arijit Singh chalao", "YouTube par song search karo", "YouTube par arijit ke gane bajao", etc.
    const hasSearchKeyword = /(?:chalao|search|play|bajao|sunao|dikhao|चलाओ|बजाओ|सुनाओ|दिखाओ|सर्च|गाने|गाना|gana|song|video)/i.test(lower);
    
    if (hasSearchKeyword) {
      let query = lower
        .replace(/(?:youtube|यूट्यूब|युटुब|yt)/gi, '')
        .replace(/(?:par|pe|me|me se|पर|में|पे)/gi, '')
        .replace(/(?:ke|k|के)/gi, '')
        .replace(/(?:chalao|chala do|bajao|play|search|kholo|khol de|khol do|sunao|dikhao|चलाओ|बजाओ|सुनाओ|दिखाओ|खोल दे|खोल दो|सर्च करो|खोल)/gi, '')
        .replace(/(?:gana|gane|song|songs|video|videos|गाने|गाना|गीत|वीडियो)/gi, '')
        .trim();

      if (query.length > 1) {
        return {
          rawText: clean,
          action: 'SEARCH_YOUTUBE',
          target: 'YouTube',
          parameter: query,
          spokenResponseHindi: `YouTube पर "${query}" चला रहा हूँ।`,
          spokenResponseEnglish: `Playing "${query}" on YouTube.`,
          confidence: 0.96,
        };
      }
    }

    return {
      rawText: clean,
      action: 'OPEN_APP',
      target: 'YouTube',
      spokenResponseHindi: 'YouTube खोल रहा हूँ।',
      spokenResponseEnglish: 'Opening YouTube.',
      confidence: 0.95,
    };
  }

  // 2. Instagram & Reels
  if (
    lower.includes('instagram') ||
    lower.includes('इंस्टाग्राम') ||
    lower.includes('इन्स्टाग्राम') ||
    lower.includes('insta') ||
    lower.includes('रील') ||
    lower.includes('reels') ||
    lower.includes('reel')
  ) {
    if (lower.includes('reel') || lower.includes('रील') || lower.includes('shorts')) {
      return {
        rawText: clean,
        action: 'OPEN_REELS',
        target: 'Instagram Reels',
        spokenResponseHindi: 'Instagram रील्स चालू कर रहा हूँ।',
        spokenResponseEnglish: 'Opening Instagram Reels.',
        confidence: 0.95,
      };
    }
    return {
      rawText: clean,
      action: 'OPEN_APP',
      target: 'Instagram',
      spokenResponseHindi: 'Instagram खोल रहा हूँ।',
      spokenResponseEnglish: 'Opening Instagram.',
      confidence: 0.95,
    };
  }

  // 3. Auto Scroll (नीचे स्क्रॉल कर, स्क्रॉल डाउन, scroll, ऊपर स्क्रॉल)
  if (
    lower.includes('scroll') ||
    lower.includes('स्क्रॉल') ||
    lower.includes('स्क्रोल') ||
    lower.includes('upar scroll') ||
    lower.includes('niche scroll')
  ) {
    const isUp = lower.includes('upar') || lower.includes('ऊपर') || lower.includes('up');
    const direction = isUp ? 'up' : 'down';
    return {
      rawText: clean,
      action: 'AUTO_SCROLL',
      parameter: direction,
      spokenResponseHindi: isUp ? 'ऊपर स्क्रॉल कर रहा हूँ।' : 'नीचे ऑटो-स्क्रॉल शुरू कर रहा हूँ।',
      spokenResponseEnglish: isUp ? 'Scrolling up.' : 'Auto-scrolling down.',
      confidence: 0.95,
    };
  }

  // 4. Calling contact or number (कॉल कर, call lagao, फोन मिलाओ)
  if (
    lower.includes('call') ||
    lower.includes('कॉल') ||
    lower.includes('फोन मिलाओ') ||
    lower.includes('phone milao') ||
    lower.includes('phone lagao') ||
    lower.includes('dial')
  ) {
    let recipient = '';
    const numberMatch = clean.match(/(\+?\d[\d\s-]{6,14}\d)/);
    if (numberMatch) {
      recipient = numberMatch[1].replace(/[\s-]/g, '');
    } else {
      const nameMatch = clean.match(/(?:call\s+to|call|dial|फोन\s+मिलाओ|कॉल\s+करो|कॉल\s+कर)\s+([A-Za-z0-9\u0900-\u097F\s]+)/i) ||
                         clean.match(/([A-Za-z0-9\u0900-\u097F\s]+)\s*(?:ko|par|को|पर)?\s*(?:call|कॉल|फोन\s+लगाओ|फोन\s+मिलाओ)/i);
      if (nameMatch && nameMatch[1]) {
        recipient = nameMatch[1].replace(/(?:ko|par|please|bhai|bhi|को|पर|भाई)/gi, '').trim();
      }
    }

    if (!recipient) {
      recipient = 'Recent Contact';
    }

    return {
      rawText: clean,
      action: 'CALL_CONTACT',
      target: recipient,
      spokenResponseHindi: `${recipient} को कॉल लगा रहा हूँ।`,
      spokenResponseEnglish: `Calling ${recipient}.`,
      confidence: 0.92,
    };
  }

  // 5. WhatsApp Message
  if (
    lower.includes('whatsapp') ||
    lower.includes('व्हाट्सएप') ||
    lower.includes('व्हॉट्सॲप') ||
    lower.includes('वाट्सएप') ||
    lower.includes('संदेश') ||
    lower.includes('message')
  ) {
    let contact = 'Contact';
    const contactMatch = clean.match(/(?:to|ko|को)\s+([A-Za-z0-9\u0900-\u097F]+)/i);
    if (contactMatch && contactMatch[1]) {
      contact = contactMatch[1].trim();
    }

    return {
      rawText: clean,
      action: 'SEND_WHATSAPP',
      target: contact,
      parameter: 'Hello',
      spokenResponseHindi: `WhatsApp पर ${contact} के लिए चैट खोल रहा हूँ।`,
      spokenResponseEnglish: `Opening WhatsApp chat with ${contact}.`,
      confidence: 0.9,
    };
  }

  // 6. Torch / Flashlight
  if (
    lower.includes('torch') ||
    lower.includes('flashlight') ||
    lower.includes('फ्लैश') ||
    lower.includes('टॉर्च')
  ) {
    const isOff = lower.includes('off') || lower.includes('band') || lower.includes('बंद');
    const state = isOff ? 'off' : 'on';
    return {
      rawText: clean,
      action: 'TOGGLE_TORCH',
      parameter: state,
      spokenResponseHindi: isOff ? 'टॉर्च बंद कर दी गई है।' : 'टॉर्च चालू कर दी है।',
      spokenResponseEnglish: isOff ? 'Flashlight turned off.' : 'Flashlight turned on.',
      confidence: 0.95,
    };
  }

  // 7. Battery check
  if (
    lower.includes('battery') ||
    lower.includes('बैटरी') ||
    lower.includes('चार्जिंग') ||
    lower.includes('charge')
  ) {
    return {
      rawText: clean,
      action: 'CHECK_BATTERY',
      spokenResponseHindi: 'बैटरी की स्थिति जांची जा रही है।',
      spokenResponseEnglish: 'Checking battery status.',
      confidence: 0.95,
    };
  }

  // 8. Alarm / Timer
  if (
    lower.includes('alarm') ||
    lower.includes('अलार्म') ||
    lower.includes('timer') ||
    lower.includes('टाइमर')
  ) {
    const timeMatch = clean.match(/(\d+)\s*(?:minute|min|घंटे|hour|बजे|am|pm|मिनट)?/i);
    const duration = timeMatch ? timeMatch[1] : '5';
    return {
      rawText: clean,
      action: 'SET_ALARM',
      parameter: duration,
      spokenResponseHindi: `${duration} मिनट का अलार्म/टाइमर सेट कर दिया गया है।`,
      spokenResponseEnglish: `Alarm/Timer set for ${duration} minutes.`,
      confidence: 0.92,
    };
  }

  // 9. Location
  if (
    lower.includes('location') ||
    lower.includes('लोकेशन') ||
    lower.includes('जगह') ||
    lower.includes('kahan hu') ||
    lower.includes('कहाँ हूँ')
  ) {
    return {
      rawText: clean,
      action: 'GET_LOCATION',
      spokenResponseHindi: 'आपकी वर्तमान लोकेशन की जांच की जा रही है।',
      spokenResponseEnglish: 'Finding your current GPS location.',
      confidence: 0.9,
    };
  }

  // 10. Camera
  if (
    lower.includes('camera') ||
    lower.includes('कैमरा') ||
    lower.includes('photo') ||
    lower.includes('फोटो') ||
    lower.includes('selfie') ||
    lower.includes('सेल्फी')
  ) {
    return {
      rawText: clean,
      action: 'TAKE_PHOTO',
      target: 'Camera',
      spokenResponseHindi: 'कैमरा खोल रहा हूँ।',
      spokenResponseEnglish: 'Opening Camera.',
      confidence: 0.95,
    };
  }

  // 11. Generic App Opening
  const knownApps: Record<string, string[]> = {
    'Spotify': ['spotify', 'स्पॉटिफ़ाई', 'गाना ऐप'],
    'Chrome': ['chrome', 'ब्राउज़र', 'browser', 'क्रोम'],
    'Settings': ['settings', 'सेटिंग्स', 'सेटिंग'],
    'Gallery': ['gallery', 'गैलरी', 'photos'],
    'Google Maps': ['maps', 'गूगल मैप्स', 'नक्शा'],
    'Calculator': ['calculator', 'कैलकुलेटर'],
  };

  for (const [appName, keywords] of Object.entries(knownApps)) {
    if (keywords.some(k => lower.includes(k))) {
      return {
        rawText: clean,
        action: 'OPEN_APP',
        target: appName,
        spokenResponseHindi: `${appName} खोल रहा हूँ।`,
        spokenResponseEnglish: `Opening ${appName}.`,
        confidence: 0.9,
      };
    }
  }

  // 12. General AI assistance / conversation
  let fallbackHindi = 'जी भाई! आपका हुक्म सिर आँखों पर। मैं आपके लिए क्या करूँ?';
  let fallbackEng = 'Yes! What can I do for you today?';

  if (lower.includes('kaise ho') || lower.includes('how are you') || lower.includes('कैसे हो')) {
    fallbackHindi = 'मैं बिल्कुल बढ़िया हूँ! आपके सभी डिवाइस टास्क्स को पूरा करने के लिए तैयार।';
    fallbackEng = 'I am doing great and ready to execute your phone tasks!';
  } else if (lower.includes('who are you') || lower.includes('tum kaun ho') || lower.includes('तुम कौन हो')) {
    fallbackHindi = 'मैं अस्त्र एआई हूँ - आपका पर्सनल एंड्रॉइड असिस्टेंट एजेंट जो फोन के सारे काम खुद कर देता है!';
    fallbackEng = 'I am Astra AI - your personal Android Device Assistant Agent.';
  }

  return {
    rawText: clean,
    action: 'GENERAL_QUERY',
    parameter: clean,
    spokenResponseHindi: fallbackHindi,
    spokenResponseEnglish: fallbackEng,
    confidence: 0.75,
  };
}
