import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize GoogleGenAI SDK only if a real non-placeholder key is provided
let aiClient: GoogleGenAI | null = null;
const rawKey = process.env.GEMINI_API_KEY;
if (rawKey && !rawKey.includes('MY_GEMINI_API_KEY') && rawKey.trim().length > 10) {
  try {
    aiClient = new GoogleGenAI();
  } catch (err) {
    console.warn('GoogleGenAI init failed, using internal engine:', err);
  }
}

// AI Agent intent endpoint
app.post('/api/agent', async (req, res) => {
  try {
    const { prompt, currentContext } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!aiClient) {
      // Fallback response if GEMINI_API_KEY is not set
      return res.json({
        usingGemini: false,
        message: 'No GEMINI_API_KEY detected, using internal high-speed intent engine.',
      });
    }

    const systemInstruction = `You are "Astra AI", an ultra-capable Android Voice and Device Automation Agent built for users in India.
You understand Hindi, Hinglish, and English naturally.
The user wants you to control their Android phone, make calls, open YouTube, launch Instagram Reels, trigger auto-scrolling, send WhatsApp messages, toggle flashlight, check battery, etc.

Analyze the user's speech prompt and return a valid JSON object matching this schema:
{
  "action": "OPEN_APP" | "CALL_CONTACT" | "AUTO_SCROLL" | "SEND_WHATSAPP" | "TOGGLE_TORCH" | "SET_ALARM" | "CHECK_BATTERY" | "GET_LOCATION" | "SEARCH_YOUTUBE" | "OPEN_REELS" | "OPEN_SETTINGS" | "TAKE_PHOTO" | "GENERAL_QUERY",
  "target": string, // app name, contact name, or null
  "parameter": string, // search query, scroll direction ('down' or 'up'), message text, phone number, etc.
  "spokenResponseHindi": string, // Friendly, natural, polite Hindi reply to be spoken aloud (e.g., "जी भाई, YouTube खोल रहा हूँ।", "अमित को कॉल लगा रहा हूँ।")
  "spokenResponseEnglish": string // English version of the response
}
Respond strictly with pure JSON only.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: `Current Phone State: ${JSON.stringify(currentContext || {})}\nUser Voice Command: "${prompt}"` }
          ]
        }
      ],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);

    return res.json({
      usingGemini: true,
      ...parsed,
    });
  } catch (error) {
    console.error('Agent API Error:', error);
    return res.status(500).json({
      error: 'Failed to process voice agent command',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

async function startServer() {
  const port = process.env.PORT || 3000;

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Astra AI Agent server running on http://0.0.0.0:${port}`);
  });
}

startServer();
