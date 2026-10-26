import React, { useState } from 'react';
import { 
  Download, 
  FileCode, 
  Check, 
  Copy, 
  Package, 
  Sparkles, 
  Terminal, 
  Layers, 
  ExternalLink,
  Smartphone,
  ArrowRight
} from 'lucide-react';
import { generateAndroidProjectZip, DEFAULT_CONFIG } from '../utils/androidProjectGenerator';

interface ApkExportModalProps {
  lang: 'hi' | 'en';
}

export const ApkExportModal: React.FC<ApkExportModalProps> = ({ lang }) => {
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeCodeFile, setActiveCodeFile] = useState<'manifest' | 'voiceService' | 'autoScroll' | 'activity' | 'gradle'>('manifest');
  const [copied, setCopied] = useState(false);

  // Handle Download ZIP
  const handleDownloadZip = async () => {
    setIsGeneratingZip(true);
    setDownloadSuccess(false);
    try {
      const blob = await generateAndroidProjectZip(DEFAULT_CONFIG);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Astra-AI-Agent-Android-Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to generate project zip:', err);
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const codeSnippets = {
    manifest: `<!-- AndroidManifest.xml: Complete Assistant & Accessibility Permissions -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.astra.aiagent">

    <!-- Gemini Replacement: Voice Interaction Service -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.CALL_PHONE" />
    <uses-permission android:name="android.permission.READ_CONTACTS" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />

    <application
        android:label="Astra AI Agent"
        android:theme="@style/Theme.AstraAgent">

        <!-- Voice Interaction Service (Long-Press Home Button Trigger) -->
        <service
            android:name=".AssistantVoiceInteractionService"
            android:permission="android.permission.BIND_VOICE_INTERACTION"
            android:exported="true">
            <meta-data
                android:name="android.voice_interaction"
                android:resource="@xml/voice_interaction_service" />
            <intent-filter>
                <action android:name="android.service.voice.VoiceInteractionService" />
            </intent-filter>
        </service>

        <!-- Accessibility Service for Auto-Scroll in Reels & Shorts -->
        <service
            android:name=".AutoScrollAccessibilityService"
            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.accessibilityservice.AccessibilityService" />
            </intent-filter>
        </service>
    </application>
</manifest>`,

    voiceService: `// AssistantVoiceInteractionService.kt
// This replaces Google Gemini / Google Assistant when holding the Home Button!
package com.astra.aiagent

import android.service.voice.VoiceInteractionService

class AssistantVoiceInteractionService : VoiceInteractionService() {
    override fun onReady() {
        super.onReady()
        // Assistant ready to trigger from Center Home Button Long-Press
    }
}`,

    autoScroll: `// AutoScrollAccessibilityService.kt
// Handles automatic vertical swipe gestures for Instagram Reels & YouTube Shorts
package com.astra.aiagent

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.GestureDescription
import android.graphics.Path
import android.util.DisplayMetrics

class AutoScrollAccessibilityService : AccessibilityService() {

    fun scrollNextReel() {
        val metrics: DisplayMetrics = resources.displayMetrics
        val width = metrics.widthPixels.toFloat()
        val height = metrics.heightPixels.toFloat()

        // Swipe from 75% height up to 25% height
        val path = Path().apply {
            moveTo(width / 2f, height * 0.75f)
            lineTo(width / 2f, height * 0.25f)
        }

        val gesture = GestureDescription.Builder()
            .addStroke(GestureDescription.StrokeDescription(path, 0, 250))
            .build()

        dispatchGesture(gesture, null, null)
    }

    override fun onAccessibilityEvent(event: android.view.accessibility.AccessibilityEvent?) {}
    override fun onInterrupt() {}
}`,

    activity: `// MainActivity.kt
package com.astra.aiagent

import android.Manifest
import android.os.Bundle
import android.webkit.WebView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Request calling, mic, and contacts permissions
        ActivityCompat.requestPermissions(
            this,
            arrayOf(
                Manifest.permission.RECORD_AUDIO,
                Manifest.permission.CALL_PHONE,
                Manifest.permission.READ_CONTACTS
            ),
            101
        )
    }
}`,

    gradle: `// app/build.gradle.kts
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.astra.aiagent"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.astra.aiagent"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }
}`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeCodeFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'hi' ? 'एंड्रॉइड APK & सोर्स कोड एक्सपोर्ट' : 'Android APK & Source Code Exporter'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {lang === 'hi'
                ? 'Astra AI Agent का पूरा एंड्रॉइड प्रोजेक्ट और APK पैकेज'
                : 'Complete Android Project & APK Build Package'}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {lang === 'hi'
                ? 'यह पूरा पैकेज आपके लिए तैयार है। इसमें Android Studio की सभी फाइलें, Gemini को रिप्लेस करने वाली VoiceInteractionService, और Reels को ऑटो-स्क्रॉल करने वाली Accessibility Service शामिल है।'
                : 'Complete Android Studio project package ready to compile into an APK. Contains VoiceInteractionService to replace Gemini and AccessibilityService for Instagram auto-scrolling.'}
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isGeneratingZip}
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2.5 active:scale-95 disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              <span>
                {isGeneratingZip
                  ? (lang === 'hi' ? 'प्रोजेक्ट ZIP तैयार हो रही है...' : 'Generating ZIP...')
                  : (lang === 'hi' ? '1-क्लिक प्रोजेक्ट ZIP डाउनलोड करें' : 'Download Complete Project (.ZIP)')}
              </span>
            </button>

            {downloadSuccess && (
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold justify-center">
                <Check className="w-4 h-4" />
                <span>{lang === 'hi' ? 'डाउनलोड शुरू हो गया!' : 'Download started!'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2 Ways to Get APK Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Method 1: GitHub Cloud Build (Zero Install) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-purple-400 tracking-wider">
                {lang === 'hi' ? 'तरीका 1 (सबसे आसान - बिना कंप्यूटर)' : 'Method 1 (Easiest - Cloud Build)'}
              </span>
              <h3 className="font-bold text-white text-base">
                {lang === 'hi' ? 'GitHub Actions से फ्री 1-क्लिक APK' : 'Free 1-Click APK via GitHub Actions'}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {lang === 'hi'
              ? 'इस ZIP फ़ाइल में `.github/workflows/build-apk.yml` पहले से सेट है। आपको कोई सॉफ़्टवेयर इंस्टॉल नहीं करना है!'
              : 'The ZIP package includes a pre-configured GitHub Actions build workflow. No Android Studio installation needed!'}
          </p>

          <ol className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <li className="flex items-start gap-2">
              <span className="font-bold text-cyan-400">1.</span>
              <span>{lang === 'hi' ? 'ZIP डाउनलोड करके अपने GitHub पर नई Repository में अपलोड करें।' : 'Download ZIP and push to a new GitHub repository.'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-cyan-400">2.</span>
              <span>{lang === 'hi' ? 'GitHub Actions अपने आप 2 मिनट में APK बना देगा।' : 'GitHub Actions automatically compiles the APK in 2 minutes.'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-cyan-400">3.</span>
              <span>{lang === 'hi' ? 'Actions टैब से AstraAI-Agent-Debug.apk सीधे फोन में डाउनलोड कर लें!' : 'Download AstraAI-Agent-Debug.apk directly to your phone!'}</span>
            </li>
          </ol>
        </div>

        {/* Method 2: Android Studio Build */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-cyan-400 tracking-wider">
                {lang === 'hi' ? 'तरीका 2 (कंप्यूटर / डेवलपर)' : 'Method 2 (Android Studio PC)'}
              </span>
              <h3 className="font-bold text-white text-base">
                {lang === 'hi' ? 'Android Studio में खोलें' : 'Build locally with Android Studio'}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {lang === 'hi'
              ? 'अगर आपके पास लैपटॉप या कंप्यूटर है, तो सीधे Android Studio में खोलकर 30 सेकंड में APK बना सकते हैं।'
              : 'Open the project in Android Studio and compile the debug or signed release APK instantly.'}
          </p>

          <ol className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <li className="flex items-start gap-2">
              <span className="font-bold text-indigo-400">1.</span>
              <span>{lang === 'hi' ? 'ZIP Unzip करें और Android Studio में Open Project चुनें।' : 'Unzip project and select Open in Android Studio.'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-indigo-400">2.</span>
              <span>{lang === 'hi' ? 'मेन्यू से Build > Build Bundle(s) / APK(s) > Build APK(s) पर क्लिक करें।' : 'Click Build > Build Bundle(s) / APK(s) > Build APK(s).'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-indigo-400">3.</span>
              <span>{lang === 'hi' ? 'app-debug.apk तैयार होकर सामने आ जाएगा।' : 'Generated app-debug.apk is ready in outputs/apk/debug/.'}</span>
            </li>
          </ol>
        </div>
      </div>

      {/* Code Inspector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm sm:text-base">
              {lang === 'hi' ? 'सोर्स कोड इंस्पेक्टर (Source Code Preview)' : 'Source Code Inspector'}
            </h3>
          </div>

          {/* Code Tab buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveCodeFile('manifest')}
              className={`px-2.5 py-1 text-xs rounded-lg font-mono transition ${
                activeCodeFile === 'manifest'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              AndroidManifest.xml
            </button>
            <button
              onClick={() => setActiveCodeFile('voiceService')}
              className={`px-2.5 py-1 text-xs rounded-lg font-mono transition ${
                activeCodeFile === 'voiceService'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              AssistantService.kt
            </button>
            <button
              onClick={() => setActiveCodeFile('autoScroll')}
              className={`px-2.5 py-1 text-xs rounded-lg font-mono transition ${
                activeCodeFile === 'autoScroll'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              AutoScrollService.kt
            </button>
            <button
              onClick={() => setActiveCodeFile('activity')}
              className={`px-2.5 py-1 text-xs rounded-lg font-mono transition ${
                activeCodeFile === 'activity'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              MainActivity.kt
            </button>
          </div>
        </div>

        {/* Code View Area */}
        <div className="relative">
          <button
            onClick={handleCopyCode}
            className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (lang === 'hi' ? 'कॉपी हो गया!' : 'Copied!') : (lang === 'hi' ? 'कोड कॉपी करें' : 'Copy Code')}</span>
          </button>

          <pre className="p-4 sm:p-5 overflow-x-auto text-xs font-mono text-cyan-300 bg-slate-950 max-h-96 leading-relaxed">
            {codeSnippets[activeCodeFile]}
          </pre>
        </div>
      </div>
    </div>
  );
};
