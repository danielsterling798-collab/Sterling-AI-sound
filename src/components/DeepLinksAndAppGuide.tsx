import { useState } from 'react';
import type { FC } from 'react';
import { 
  FileCode2, 
  ExternalLink, 
  Copy, 
  Check, 
  Globe, 
  ShieldCheck, 
  KeyRound, 
  Terminal,
  DollarSign
} from 'lucide-react';

export const DeepLinksAndAppGuide: FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [pubId, setPubId] = useState('pub-XXXXXXXXXXXXXXXX');

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const assetLinksJson = JSON.stringify([
    {
      "relation": ["delegate_permission/common.handle_all_urls"],
      "target": {
        "namespace": "android_app",
        "package_name": "com.danielsterling.sterlingsoundaiv2",
        "sha256_cert_fingerprints": [
          "7C:3A:8C:DB:24:3E:DF:54:16:A3:4F:89:4D:23:4E:71:CF:C9:F8:3A:F3:77:F4:22:85:71:25:90:37:A4:AE:DF"
        ]
      }
    },
    {
      "relation": ["delegate_permission/common.handle_all_urls"],
      "target": {
        "namespace": "android_app",
        "package_name": "com.sterling_sound_ai_v2.alpha",
        "sha256_cert_fingerprints": [
          "7C:3A:8C:DB:24:3E:DF:54:16:A3:4F:89:4D:23:4E:71:CF:C9:F8:3A:F3:77:F4:22:85:71:25:90:37:A4:AE:DF"
        ]
      }
    }
  ], null, 2);

  const manifestXmlSnippet = `<!-- AndroidManifest.xml -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.danielsterling.sterlingsoundaiv2">

    <!-- Permissions -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="com.android.vending.BILLING" />

    <!-- Optional: Declare hardware requirements -->
    <uses-feature
        android:name="android.hardware.microphone"
        android:required="false" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.SterlingSoundAI">

        <!-- Google AdMob App ID (Replace with your Production AdMob App ID) -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-3940256099942544~3347511713"/>

        <activity
            android:name=".MainActivity"
            android:exported="true">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <!-- Android App Links Deep Link Verification Filter -->
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />

                <data
                    android:scheme="https"
                    android:host="sites.google.com"
                    android:pathPrefix="/view/sterlingsound-privacy" />
            </intent-filter>

        </activity>
    </application>
</manifest>`;

  const buildGradleSnippet = `// android/app/build.gradle
android {
    namespace "com.danielsterling.sterlingsoundaiv2"
    compileSdk 34

    defaultConfig {
        applicationId "com.danielsterling.sterlingsoundaiv2"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0.0-PROD"
    }

    signingConfigs {
        release {
            storeFile file("sterling-sound-upload-key.jks")
            storePassword "SterlingPass2026!"
            keyAlias "sterlingsound"
            keyPassword "SterlingPass2026!"
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            shrinkResources false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    // AndroidX Core modern architecture & splashscreen suite
    def core_version = "1.19.0"
    implementation "androidx.core:core:$core_version"
    implementation "androidx.core:core-ktx:$core_version"
    implementation "androidx.core:core-splashscreen:1.2.0"
    implementation "androidx.core:core-role:1.1.0"
    implementation "androidx.core:core-animation:1.0.0"
    implementation "androidx.core:core-performance:1.0.0"
    implementation "androidx.core:core-google-shortcuts:1.1.0"
    implementation "androidx.core:core-remoteviews:1.1.0"
    androidTestImplementation "androidx.core:core-animation-testing:1.0.0"

    // Google Play Billing Library (v7.1.1 Mandatory Upgrade)
    def billing_version = "7.1.1"
    implementation "com.android.billingclient:billing-ktx:$billing_version"

    // Google Mobile Ads SDK (AdMob)
    implementation 'com.google.android.gms:play-services-ads:23.3.0'
    implementation 'com.google.android.ump:user-messaging-platform:3.0.0'
}`;

  const appAdsTxtContent = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-blue-950/40 border border-cyan-500/20 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">Google Play Manifest, AdMob & Digital Asset Links Verification</h2>
            </div>
            <p className="text-sm text-slate-300">
              Configure AdMob monetization (<code className="text-amber-300 font-mono text-xs">app-ads.txt</code>), deep links (<code className="text-cyan-300 font-mono text-xs">assetlinks.json</code>), and target SDK 34 build configurations.
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
              href="https://play.google.com/console" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
            >
              Play Console <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* AdMob & app-ads.txt Card */}
      <div className="bg-slate-900/70 border border-amber-500/30 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-semibold text-white text-sm">Google AdMob app-ads.txt Verification</h3>
              <p className="text-xs text-slate-400">Google Certificate Authority ID: <code className="text-amber-300 font-mono">f08c47fec0942fa0</code></p>
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(appAdsTxtContent, 'appads')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 text-xs font-semibold rounded border border-amber-500/40 transition-colors shrink-0"
          >
            {copiedSection === 'appads' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedSection === 'appads' ? 'Copied app-ads.txt' : 'Copy app-ads.txt'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Your AdMob Publisher ID</label>
            <input
              type="text"
              value={pubId}
              onChange={(e) => setPubId(e.target.value)}
              placeholder="pub-XXXXXXXXXXXXXXXX"
              className="w-full bg-[#05080c] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-slate-300">Host URL Location</label>
            <div className="bg-[#05080c] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 flex items-center justify-between">
              <span>https://yourdomain.com/app-ads.txt</span>
              <span className="text-[10px] text-emerald-400 font-sans">Direct Root Path</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400">File Output Content:</label>
          <pre className="bg-[#05080c] border border-slate-800 rounded-lg p-3 text-xs text-amber-300 font-mono select-all">
            {appAdsTxtContent}
          </pre>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: AssetLinks.json */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <h3 className="font-semibold text-white text-sm">Digital Asset Links (assetlinks.json)</h3>
            </div>
            <button
              onClick={() => copyToClipboard(assetLinksJson, 'assetlinks')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded border border-slate-700 transition-colors"
            >
              {copiedSection === 'assetlinks' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'assetlinks' ? 'Copied' : 'Copy JSON'}
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Upload this file to <code className="text-cyan-300 font-mono">https://yourdomain.com/.well-known/assetlinks.json</code> with header <code className="text-slate-300 font-mono">Content-Type: application/json</code>.
          </p>

          <pre className="bg-[#05080c] border border-slate-800/80 rounded-lg p-3.5 text-xs text-emerald-400 font-mono overflow-x-auto max-h-56">
            {assetLinksJson}
          </pre>
        </div>

        {/* Card 2: Gradle build setup */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              <h3 className="font-semibold text-white text-sm">Gradle Build Config (build.gradle)</h3>
            </div>
            <button
              onClick={() => copyToClipboard(buildGradleSnippet, 'gradle')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded border border-slate-700 transition-colors"
            >
              {copiedSection === 'gradle' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'gradle' ? 'Copied' : 'Copy Config'}
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Targeting <strong>Android 14 (API 34)</strong> with release signing config connected to <code className="text-cyan-300 font-mono">sterling-sound-upload-key.jks</code>.
          </p>

          <pre className="bg-[#05080c] border border-slate-800/80 rounded-lg p-3.5 text-xs text-blue-300 font-mono overflow-x-auto max-h-56">
            {buildGradleSnippet}
          </pre>
        </div>

      </div>

      {/* Manifest Verification Snippet */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-white text-sm">Production AndroidManifest.xml (with AdMob & Deep Links)</h3>
          </div>
          <button
            onClick={() => copyToClipboard(manifestXmlSnippet, 'manifest')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded border border-slate-700 transition-colors"
          >
            {copiedSection === 'manifest' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedSection === 'manifest' ? 'Copied' : 'Copy XML'}
          </button>
        </div>

        <pre className="bg-[#05080c] border border-slate-800/80 rounded-lg p-4 text-xs text-purple-300 font-mono overflow-x-auto">
          {manifestXmlSnippet}
        </pre>
      </div>

      {/* Keytool Quick Command */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-white text-sm">Generate Upload Keystore (.jks) One-Liner</h3>
          </div>
          <button
            onClick={() => copyToClipboard('keytool -genkey -v -keystore sterling-sound-upload-key.jks -alias sterlingsound -keyalg RSA -keysize 2048 -validity 10000', 'keytool')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded border border-slate-700 transition-colors"
          >
            {copiedSection === 'keytool' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedSection === 'keytool' ? 'Copied' : 'Copy Command'}
          </button>
        </div>
        <div className="bg-[#05080c] border border-slate-800 p-3 rounded-lg flex items-center justify-between">
          <code className="text-xs text-amber-300 font-mono select-all">
            keytool -genkey -v -keystore sterling-sound-upload-key.jks -alias sterlingsound -keyalg RSA -keysize 2048 -validity 10000
          </code>
        </div>
      </div>
    </div>
  );
};
