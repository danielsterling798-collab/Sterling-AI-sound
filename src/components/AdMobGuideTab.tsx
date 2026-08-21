import { useState } from 'react';
import type { FC } from 'react';
import { 
  DollarSign, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldAlert, 
  Code2, 
  CheckCircle2, 
  Smartphone, 
  Layers
} from 'lucide-react';

export const AdMobGuideTab: FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [publisherId, setPublisherId] = useState('pub-XXXXXXXXXXXXXXXX');
  const [appId, setAppId] = useState('ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY');
  const [bannerAdUnitId, setBannerAdUnitId] = useState('ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ');
  const [selectedSdk, setSelectedSdk] = useState<'android_native' | 'flutter'>('android_native');

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const appAdsTxt = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`;

  const nativeGradleDependencies = `// android/app/build.gradle
dependencies {
    // Google Mobile Ads SDK (latest Play Services compatible)
    implementation 'com.google.android.gms:play-services-ads:23.3.0'

    // Google User Messaging Platform (UMP) for GDPR & CCPA consent compliance
    implementation 'com.google.android.ump:user-messaging-platform:3.0.0'
}`;

  const flutterDependencies = `# pubspec.yaml
dependencies:
  flutter:
    sdk: flutter
  google_mobile_ads: ^5.1.0`;

  const manifestAddition = `<!-- AndroidManifest.xml (inside <application> ... </application>) -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.danielsterling.sterlingsoundaiv2">

    <!-- Essential Internet & Network State Permissions for Ad Serving -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <!-- Google Play Services Ad ID Permission (Required for Android 13+ / API 33+) -->
    <uses-permission android:name="com.google.android.gms.permission.AD_ID" />

    <application
        android:label="Sterling Sound AI v2"
        android:icon="@mipmap/ic_launcher">

        <!-- Google AdMob Application ID -->
        <!-- Use ca-app-pub-3940256099942544~3347511713 during testing -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="${appId}"/>

    </application>
</manifest>`;

  const nativeKotlinInit = `// MainActivity.kt or Application class
package com.danielsterling.sterlingsoundaiv2

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.RequestConfiguration
import java.util.Arrays

class MainActivity : AppCompatActivity() {

    private lateinit var adView: AdView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // 1. (Optional) Set Test Device IDs for local testing to prevent policy strikes
        val testDeviceIds = Arrays.asList("TEST_EMULATOR_DEVICE_HASH")
        val configuration = RequestConfiguration.Builder()
            .setTestDeviceIds(testDeviceIds)
            .build()
        MobileAds.setRequestConfiguration(configuration)

        // 2. Initialize Google Mobile Ads SDK on background thread
        MobileAds.initialize(this) { initializationStatus ->
            // SDK is ready, load Banner / Interstitial
            loadBannerAd()
        }
    }

    private fun loadBannerAd() {
        adView = AdView(this)
        adView.adUnitId = "${bannerAdUnitId}"
        adView.setAdSize(AdSize.BANNER)

        val adRequest = AdRequest.Builder().build()
        adView.loadAd(adRequest)
    }
}`;

  const flutterInit = `// lib/main.dart
import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize AdMob SDK
  await MobileAds.instance.initialize();

  // Configure test devices if testing on physical phone
  await MobileAds.instance.updateRequestConfiguration(
    RequestConfiguration(
      testDeviceIds: ['YOUR_PHYSICAL_DEVICE_TEST_ID'],
    ),
  );

  runApp(const MyApp());
}`;

  return (
    <div className="space-y-6">
      
      {/* Banner / Header */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900/60 to-cyan-950/40 border border-amber-500/30 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-white">Google AdMob Complete Integration & Compliance Guide</h2>
            </div>
            <p className="text-sm text-slate-300">
              End-to-end instructions for dashboard configuration, SDK installation, manifest declarations, GDPR/UMP consent, and <code className="text-amber-300 font-mono text-xs">app-ads.txt</code> verification.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href="https://admob.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold text-xs rounded-lg transition-colors"
            >
              AdMob Console <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://developers.google.com/admob/android/quick-start" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg transition-colors border border-slate-700"
            >
              Google Dev Docs <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Interactive IDs Configurator */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-cyan-400" />
          AdMob Credentials & Unit ID Customizer
        </h3>
        <p className="text-xs text-slate-400">
          Enter your AdMob identifiers to dynamically generate your ready-to-paste manifest metadata, code snippets, and <code className="text-amber-300 font-mono">app-ads.txt</code>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Publisher ID</label>
            <input
              type="text"
              value={publisherId}
              onChange={(e) => setPublisherId(e.target.value)}
              placeholder="pub-XXXXXXXXXXXXXXXX"
              className="w-full bg-[#05080c] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
            />
            <span className="text-[10px] text-slate-500">AdMob Settings &rarr; Account Info</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">AdMob App ID</label>
            <input
              type="text"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              placeholder="ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"
              className="w-full bg-[#05080c] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
            <span className="text-[10px] text-slate-500">AdMob &rarr; Apps &rarr; App Settings</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Banner / Ad Unit ID</label>
            <input
              type="text"
              value={bannerAdUnitId}
              onChange={(e) => setBannerAdUnitId(e.target.value)}
              placeholder="ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ"
              className="w-full bg-[#05080c] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
            />
            <span className="text-[10px] text-slate-500">AdMob &rarr; Apps &rarr; Ad Units</span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Implementation Cards */}
      <div className="space-y-6">
        
        {/* Phase 1: Dashboard Setup */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <div className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-xs font-bold font-mono">
              1
            </div>
            <h3 className="font-semibold text-white text-sm">AdMob Dashboard Setup Requirements</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#05080c] border border-slate-800/80 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> A. Register Your App in AdMob
              </h4>
              <ul className="list-disc list-inside text-slate-400 space-y-1 pl-1">
                <li>Log in to <a href="https://admob.google.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">admob.google.com</a>.</li>
                <li>Go to <strong>Apps &rarr; Add App &rarr; Platform: Android</strong>.</li>
                <li>If not yet published, select <em>&ldquo;No, the app is not listed on a supported app store&rdquo;</em> (link it after production rollout).</li>
                <li>Enter App Name: <code className="text-slate-200">Sterling Sound AI v2</code>.</li>
                <li>Copy the generated <strong>App ID</strong> (<code className="text-cyan-300 font-mono">ca-app-pub-...~...</code>).</li>
              </ul>
            </div>

            <div className="bg-[#05080c] border border-slate-800/80 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> B. Create Ad Units
              </h4>
              <ul className="list-disc list-inside text-slate-400 space-y-1 pl-1">
                <li>Under your app in AdMob, click <strong>Ad Units &rarr; Add Ad Unit</strong>.</li>
                <li>Recommended for Audio EQ apps:
                  <ul className="list-circle list-inside pl-3 pt-1 space-y-0.5 text-slate-300">
                    <li><strong>Adaptive Banner</strong>: Anchored to bottom/top of EQ screen.</li>
                    <li><strong>Interstitial</strong>: Shown only after exporting/saving custom sound profile.</li>
                    <li><strong>Rewarded Ad</strong>: Unlock premium 31-band mastering EQ preset.</li>
                  </ul>
                </li>
                <li>Copy the generated <strong>Ad Unit IDs</strong>.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Phase 2: app-ads.txt Hosting */}
        <div className="bg-slate-900/70 border border-amber-500/30 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-950 text-amber-400 border border-amber-500/40 flex items-center justify-center text-xs font-bold font-mono">
                2
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Host app-ads.txt on Developer Domain</h3>
                <p className="text-xs text-slate-400">Required by Google AdMob to prevent ad fraud and monetize inventory</p>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(appAdsTxt, 'guide_appads')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 text-xs font-semibold rounded border border-amber-500/40 transition-colors shrink-0"
            >
              {copiedSection === 'guide_appads' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'guide_appads' ? 'Copied app-ads.txt' : 'Copy app-ads.txt'}
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Create a plain text file named <code className="text-amber-300 font-mono">app-ads.txt</code> and place it at the root of your developer website URL listed in Google Play Store Listing (e.g. <code className="text-cyan-300 font-mono">https://yourdomain.com/app-ads.txt</code>).
          </p>

          <pre className="bg-[#05080c] border border-slate-800 rounded-lg p-3 text-xs text-amber-300 font-mono select-all">
            {appAdsTxt}
          </pre>
        </div>

        {/* Phase 3: AndroidManifest.xml & Gradle */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-950 text-purple-400 border border-purple-500/40 flex items-center justify-center text-xs font-bold font-mono">
                3
              </div>
              <h3 className="font-semibold text-white text-sm">AndroidManifest.xml & Gradle Configurations</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedSdk('android_native')}
                className={`px-2.5 py-1 text-xs rounded font-mono transition-colors ${selectedSdk === 'android_native' ? 'bg-cyan-600 text-black font-semibold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Native Android
              </button>
              <button
                onClick={() => setSelectedSdk('flutter')}
                className={`px-2.5 py-1 text-xs rounded font-mono transition-colors ${selectedSdk === 'flutter' ? 'bg-cyan-600 text-black font-semibold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Flutter
              </button>
            </div>
          </div>

          {/* Dependencies Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                {selectedSdk === 'android_native' ? 'build.gradle Dependencies' : 'pubspec.yaml Dependencies'}
              </span>
              <button
                onClick={() => copyToClipboard(selectedSdk === 'android_native' ? nativeGradleDependencies : flutterDependencies, 'deps')}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded border border-slate-700 font-mono"
              >
                {copiedSection === 'deps' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                Copy
              </button>
            </div>
            <pre className="bg-[#05080c] border border-slate-800 rounded-lg p-3 text-xs text-blue-300 font-mono overflow-x-auto">
              {selectedSdk === 'android_native' ? nativeGradleDependencies : flutterDependencies}
            </pre>
          </div>

          {/* Manifest Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-purple-400" />
                AndroidManifest.xml Application Metadata & Permissions
              </span>
              <button
                onClick={() => copyToClipboard(manifestAddition, 'admob_manifest')}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded border border-slate-700 font-mono"
              >
                {copiedSection === 'admob_manifest' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                Copy Manifest
              </button>
            </div>
            <pre className="bg-[#05080c] border border-slate-800 rounded-lg p-3 text-xs text-purple-300 font-mono overflow-x-auto">
              {manifestAddition}
            </pre>
          </div>
        </div>

        {/* Phase 4: Initialization & Testing Guardrails */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xs font-bold font-mono">
                4
              </div>
              <h3 className="font-semibold text-white text-sm">SDK Initialization Code</h3>
            </div>
            <button
              onClick={() => copyToClipboard(selectedSdk === 'android_native' ? nativeKotlinInit : flutterInit, 'init_code')}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded border border-slate-700 font-mono"
            >
              {copiedSection === 'init_code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              Copy Code
            </button>
          </div>

          <pre className="bg-[#05080c] border border-slate-800 rounded-lg p-3 text-xs text-emerald-300 font-mono overflow-x-auto">
            {selectedSdk === 'android_native' ? nativeKotlinInit : flutterInit}
          </pre>
        </div>

        {/* Critical Policy Warnings */}
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
            <h4 className="font-semibold text-sm">Crucial Google AdMob Policy Compliance Rules</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="space-y-1.5 bg-[#05080c] p-3 rounded-lg border border-amber-500/20">
              <strong className="text-amber-300">1. Never Click Your Own Live Ads</strong>
              <p className="text-slate-400 leading-relaxed">
                Always use Google Sample Ad Unit IDs during development or register your physical devices under <code className="text-amber-300 font-mono">setTestDeviceIds()</code>. Clicking live ads will lead to account suspension.
              </p>
            </div>
            <div className="space-y-1.5 bg-[#05080c] p-3 rounded-lg border border-amber-500/20">
              <strong className="text-amber-300">2. Google UMP / GDPR Consent Requirement</strong>
              <p className="text-slate-400 leading-relaxed">
                Google requires apps serving ads in the EEA/UK to use a Google-certified Consent Management Platform (CMP). The Google User Messaging Platform (UMP) SDK handles this seamlessly.
              </p>
            </div>
            <div className="space-y-1.5 bg-[#05080c] p-3 rounded-lg border border-amber-500/20">
              <strong className="text-amber-300">3. Play Store Data Safety Sync</strong>
              <p className="text-slate-400 leading-relaxed">
                In Play Console &rarr; App Content &rarr; Data Safety, disclose that Advertising ID / Device IDs are collected for Advertising / Marketing purposes.
              </p>
            </div>
            <div className="space-y-1.5 bg-[#05080c] p-3 rounded-lg border border-amber-500/20">
              <strong className="text-amber-300">4. Sample Test Ad Units</strong>
              <p className="text-slate-400 font-mono text-[11px] leading-relaxed">
                Test App ID: <span className="text-cyan-300">ca-app-pub-3940256099942544~3347511713</span><br />
                Test Banner: <span className="text-purple-300">ca-app-pub-3940256099942544/6300978111</span><br />
                Test Interstitial: <span className="text-amber-300">ca-app-pub-3940256099942544/1033173712</span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
