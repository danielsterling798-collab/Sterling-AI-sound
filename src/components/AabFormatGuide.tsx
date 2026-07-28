import React, { useState } from 'react';
import forge from 'node-forge';
import { 
  FileCode, Terminal, HelpCircle, Cpu, HardDrive, 
  ChevronDown, ChevronUp, Copy, Check, ShieldAlert,
  Settings, CheckCircle2, Play, Sparkles
} from 'lucide-react';

export const AabFormatGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'intro' | 'build' | 'sign' | 'test' | 'ai'>('intro');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Keystore Generator States
  const [keystoreFileName, setKeystoreFileName] = useState('my-upload-key.keystore');
  const [keystoreAlias, setKeystoreAlias] = useState('my-key-alias');
  const [keystorePassword, setKeystorePassword] = useState('android');
  const [keystoreCN, setKeystoreCN] = useState('Daniel Sterling');
  const [keystoreOU, setKeystoreOU] = useState('Mobile');
  const [keystoreO, setKeystoreO] = useState('Sterling Launch');
  const [keystoreL, setKeystoreL] = useState('San Francisco');
  const [keystoreS, setKeystoreS] = useState('California');
  const [keystoreC, setKeystoreC] = useState('US');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genSuccess, setGenSuccess] = useState(false);

  const generateAndDownloadKeystore = () => {
    setIsGenerating(true);
    setGenSuccess(false);
    
    setTimeout(() => {
      try {
        // 1. Generate 2048-bit RSA key pair
        const keys = forge.pki.rsa.generateKeyPair(2048);
        
        // 2. Create a self-signed X.509 certificate
        const cert = forge.pki.createCertificate();
        cert.publicKey = keys.publicKey;
        cert.serialNumber = '01';
        
        const notBefore = new Date();
        const notAfter = new Date();
        // Google Play Store requires a validity duration of at least 25 years (~9125 days)
        notAfter.setFullYear(notBefore.getFullYear() + 28); 
        cert.validity.notBefore = notBefore;
        cert.validity.notAfter = notAfter;
        
        const attrs = [
          { name: 'commonName', value: keystoreCN || 'Daniel Sterling' },
          { name: 'organizationName', value: keystoreO || 'Sterling Launch' },
          { shortName: 'OU', value: keystoreOU || 'Mobile' },
          { name: 'localityName', value: keystoreL || 'San Francisco' },
          { name: 'stateOrProvinceName', value: keystoreS || 'California' },
          { name: 'countryName', value: keystoreC || 'US' }
        ];
        
        cert.setSubject(attrs);
        cert.setIssuer(attrs);
        
        // Self-sign the certificate
        cert.sign(keys.privateKey, forge.md.sha256.create());
        
        // 3. Package Private Key + Certificate into a PKCS12 Store (.keystore/.p12)
        const p12Asn1 = forge.pkcs12.toPkcs12Asn1(
          keys.privateKey,
          [cert],
          keystorePassword,
          {
            friendlyName: keystoreAlias,
            algorithm: '3des' // Safe legacy compat
          }
        );
        
        // 4. DER-encode to binary string
        const p12Der = forge.asn1.toDer(p12Asn1).getBytes();
        
        // 5. Convert binary string to standard Uint8Array
        const buffer = new Uint8Array(p12Der.length);
        for (let i = 0; i < p12Der.length; i++) {
          buffer[i] = p12Der.charCodeAt(i);
        }
        
        // 6. Trigger client-side download
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const finalName = keystoreFileName.trim() || 'my-upload-key.keystore';
        link.download = finalName.endsWith('.keystore') ? finalName : `${finalName}.keystore`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setIsGenerating(false);
        setGenSuccess(true);
        setTimeout(() => setGenSuccess(false), 8000);
      } catch (err) {
        console.error('Error generating keystore:', err);
        alert('Keystore generation failed. Please try again with simple alphanumeric characters.');
        setIsGenerating(false);
      }
    }, 150);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const buildCommands = {
    flutter: 'flutter build appbundle --release',
    reactNative: 'cd android && ./gradlew bundleRelease',
    expo: 'npx eas build --platform android --profile production',
    cordova: 'cordova build android --release -- --packageType=bundle',
    capacitor: 'npx cap copy android && cd android && ./gradlew bundleRelease'
  };

  const testCommands = {
    buildApks: 'java -jar bundletool.jar build-apks --bundle=app-release.aab --output=app.apks --mode=default',
    buildApksKey: `java -jar bundletool.jar build-apks --bundle=app-release.aab --output=app.apks \\\n  --ks=${keystoreFileName || 'my-upload-key.keystore'} --ks-pass=pass:${keystorePassword || 'android'} \\\n  --ks-key-alias=${keystoreAlias || 'my-key-alias'} --key-pass=pass:${keystorePassword || 'android'}`,
    install: 'java -jar bundletool.jar install-apks --apks=app.apks',
    extractSize: 'java -jar bundletool.jar get-size total --apks=app.apks'
  };

  return (
    <div className="border border-zinc-200 rounded-2xl bg-zinc-50 overflow-hidden transition-all shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-zinc-100/60 transition-all text-left cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-zinc-900 uppercase tracking-wide font-sans">
              Android App Bundle (.AAB) Format Guide
            </h4>
            <p className="text-[10px] text-zinc-500 font-medium">
              Learn why Google Play requires AABs, how to compile them, and check signing integrity
            </p>
          </div>
        </div>
        <div className="text-zinc-500">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-zinc-200 bg-white">
          {/* Sub-tabs */}
          <div className="flex border-b border-zinc-100 overflow-x-auto bg-zinc-50/50 p-1 gap-1">
            {[
              { id: 'intro', label: 'What is AAB?', icon: <HelpCircle className="w-3.5 h-3.5" /> },
              { id: 'build', label: 'Build Commands', icon: <Terminal className="w-3.5 h-3.5" /> },
              { id: 'sign', label: 'Signing Keys', icon: <Settings className="w-3.5 h-3.5" /> },
              { id: 'test', label: 'Local Verification', icon: <Cpu className="w-3.5 h-3.5" /> },
              { id: 'ai', label: 'Google AI Console', icon: <Sparkles className="w-3.5 h-3.5" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`py-1.5 px-3 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  activeSubTab === tab.id
                    ? 'bg-white text-indigo-700 shadow-sm border border-zinc-200 font-black'
                    : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/50'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="p-5 text-left space-y-4">
            {/* 1. INTRODUCTION */}
            {activeSubTab === 'intro' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 border border-zinc-150 rounded-xl bg-zinc-50/50 space-y-1">
                    <div className="flex items-center gap-1.5 text-zinc-800 font-bold text-[11px]">
                      <HardDrive className="w-3.5 h-3.5 text-indigo-600" /> Size Optimization
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      Google Play uses the App Bundle to generate and serve optimized APKs for each user's device configuration, reducing the download size by up to <strong>15-35%</strong>.
                    </p>
                  </div>
                  
                  <div className="p-3 border border-zinc-150 rounded-xl bg-zinc-50/50 space-y-1">
                    <div className="flex items-center gap-1.5 text-zinc-800 font-bold text-[11px]">
                      <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" /> Mandated Protocol
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      Since August 2021, all <strong>new applications</strong> must publish with <code>.aab</code> format. Legacy <code>.apk</code> files are rejected by the App Console on initial upload.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <h5 className="font-extrabold text-zinc-805 text-zinc-800">Why does this tool parse .aab?</h5>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    This launchpad validates that the file uploaded possesses the correct structures, metadata, package name conventions, and targeted SDK profiles. Ensuring these metrics are correctly configured prevents manual review rejections.
                  </p>
                </div>
              </div>
            )}

            {/* 2. BUILD COMMANDS */}
            {activeSubTab === 'build' && (
              <div className="space-y-4">
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Run the correct production command inside your framework project root folder to generate a signed release App Bundle:
                </p>

                <div className="space-y-3">
                  {/* Flutter */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 font-sans">Flutter</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(buildCommands.flutter, 'flutter')}
                        className="text-[10px] text-indigo-600 hover:text-indigo-805 font-bold flex items-center gap-1"
                      >
                        {copiedText === 'flutter' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {copiedText === 'flutter' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <code className="block bg-zinc-900 text-zinc-100 p-2.5 rounded-lg text-[11px] font-mono select-all">
                      {buildCommands.flutter}
                    </code>
                  </div>

                  {/* React Native */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 font-sans">React Native CLI</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(buildCommands.reactNative, 'rn')}
                        className="text-[10px] text-indigo-600 hover:text-indigo-805 font-bold flex items-center gap-1"
                      >
                        {copiedText === 'rn' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {copiedText === 'rn' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <code className="block bg-zinc-900 text-zinc-100 p-2.5 rounded-lg text-[11px] font-mono select-all">
                      {buildCommands.reactNative}
                    </code>
                  </div>

                  {/* Expo */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 font-sans">Expo (EAS Build)</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(buildCommands.expo, 'expo')}
                        className="text-[10px] text-indigo-600 hover:text-indigo-805 font-bold flex items-center gap-1"
                      >
                        {copiedText === 'expo' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {copiedText === 'expo' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <code className="block bg-zinc-900 text-zinc-100 p-2.5 rounded-lg text-[11px] font-mono select-all">
                      {buildCommands.expo}
                    </code>
                  </div>

                  {/* Capacitor */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 font-sans">Capacitor / Ionic</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(buildCommands.capacitor, 'cap')}
                        className="text-[10px] text-indigo-600 hover:text-indigo-805 font-bold flex items-center gap-1"
                      >
                        {copiedText === 'cap' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {copiedText === 'cap' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <code className="block bg-zinc-900 text-zinc-100 p-2.5 rounded-lg text-[11px] font-mono select-all">
                      {buildCommands.capacitor}
                    </code>
                  </div>
                </div>
              </div>
            )}

            {/* 3. SIGNING KEYS */}
            {activeSubTab === 'sign' && (
              <div className="space-y-6">
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex gap-2.5 text-left">
                  <ShieldAlert className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-amber-900 leading-relaxed">
                    <strong>Release Signing Guard:</strong> Google Play Console requires all production <code>.aab</code> App Bundles to be signed with a valid cryptographic upload key. If unsigned, the Console will reject your upload instantly.
                  </div>
                </div>

                {/* INTERACTIVE KEYSTORE GENERATOR */}
                <div className="border border-indigo-100 rounded-2xl p-4 bg-indigo-50/20 space-y-4 text-left">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-[12px] font-black text-indigo-950 uppercase tracking-wide font-sans">
                        Interactive Keystore Generator
                      </h5>
                      <p className="text-[10px] text-indigo-800 font-medium">
                        Configure certificate details to generate and download a compliant <code>.keystore</code> file instantly
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-wider block">File Name</label>
                      <input
                        type="text"
                        value={keystoreFileName}
                        onChange={(e) => setKeystoreFileName(e.target.value)}
                        className="w-full text-xs font-semibold text-zinc-800 bg-white border border-zinc-200 rounded-lg py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="e.g. my-upload-key.keystore"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-wider block">Key Alias</label>
                      <input
                        type="text"
                        value={keystoreAlias}
                        onChange={(e) => setKeystoreAlias(e.target.value)}
                        className="w-full text-xs font-semibold text-zinc-800 bg-white border border-zinc-200 rounded-lg py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="e.g. my-key-alias"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-wider block">Key Password</label>
                      <input
                        type="text"
                        value={keystorePassword}
                        onChange={(e) => setKeystorePassword(e.target.value)}
                        className="w-full text-xs font-semibold text-zinc-800 bg-white border border-zinc-200 rounded-lg py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="e.g. android"
                      />
                    </div>
                  </div>

                  <div className="border-t border-zinc-150 pt-3">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block mb-2.5">
                      Distinguished Name (DN) / Certificate Attributes
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-500 block">Full Name (CN)</label>
                        <input
                          type="text"
                          value={keystoreCN}
                          onChange={(e) => setKeystoreCN(e.target.value)}
                          className="w-full text-xs bg-white border border-zinc-200 rounded-lg py-1 px-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-800 font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-500 block">Org Unit (OU)</label>
                        <input
                          type="text"
                          value={keystoreOU}
                          onChange={(e) => setKeystoreOU(e.target.value)}
                          className="w-full text-xs bg-white border border-zinc-200 rounded-lg py-1 px-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-800 font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-500 block">Organization (O)</label>
                        <input
                          type="text"
                          value={keystoreO}
                          onChange={(e) => setKeystoreO(e.target.value)}
                          className="w-full text-xs bg-white border border-zinc-200 rounded-lg py-1 px-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-800 font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-500 block">City/Locality (L)</label>
                        <input
                          type="text"
                          value={keystoreL}
                          onChange={(e) => setKeystoreL(e.target.value)}
                          className="w-full text-xs bg-white border border-zinc-200 rounded-lg py-1 px-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-800 font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-500 block">State (S)</label>
                        <input
                          type="text"
                          value={keystoreS}
                          onChange={(e) => setKeystoreS(e.target.value)}
                          className="w-full text-xs bg-white border border-zinc-200 rounded-lg py-1 px-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-800 font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-500 block">Country Code (C)</label>
                        <input
                          type="text"
                          value={keystoreC}
                          onChange={(e) => setKeystoreC(e.target.value)}
                          className="w-full text-xs bg-white border border-zinc-200 rounded-lg py-1 px-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-800 font-medium"
                          maxLength={2}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <p className="text-[10px] text-zinc-400 font-medium leading-relaxed max-w-md">
                      This browser tool runs secure asynchronous RSA-2048 signing locally. Your password and keys never leave your device.
                    </p>
                    <button
                      type="button"
                      disabled={isGenerating}
                      onClick={generateAndDownloadKeystore}
                      className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shrink-0"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Signing RSA-2048...
                        </>
                      ) : (
                        <>
                          <Cpu className="w-3.5 h-3.5" />
                          Generate & Download Keystore
                        </>
                      )}
                    </button>
                  </div>

                  {genSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-800 text-[11px] font-bold animate-fade-in">
                      <Check className="w-4 h-4 text-emerald-600" />
                      Success! Your upload key "{keystoreFileName}" was successfully signed (RSA-2048) and downloaded to your Downloads folder!
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-xs text-left">
                  <h5 className="font-extrabold text-zinc-800">Alternative: Generating via Terminal (Java Keytool)</h5>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    If you prefer to generate your keystore manually using the Java Development Kit (JDK) on your local computer, copy and run this command:
                  </p>
                  
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => handleCopy(`keytool -genkeypair -v -keystore ${keystoreFileName} -alias ${keystoreAlias} -keyalg RSA -keysize 2048 -validity 10000 -storepass ${keystorePassword} -keypass ${keystorePassword} -dname "CN=${keystoreCN}, OU=${keystoreOU}, O=${keystoreO}, L=${keystoreL}, S=${keystoreS}, C=${keystoreC}"`, 'keystore')}
                      className="absolute right-2 top-2 text-[10px] text-zinc-400 hover:text-zinc-100 font-bold flex items-center gap-1"
                    >
                      {copiedText === 'keystore' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {copiedText === 'keystore' ? 'Copied' : 'Copy'}
                    </button>
                    <code className="block bg-zinc-900 text-zinc-100 p-3 rounded-lg text-[10.5px] font-mono select-all leading-normal whitespace-pre-wrap pr-16">
                      keytool -genkeypair -v -keystore {keystoreFileName} -alias {keystoreAlias} -keyalg RSA -keysize 2048 -validity 10000 -storepass {keystorePassword} -keypass {keystorePassword} -dname "CN={keystoreCN}, OU={keystoreOU}, O={keystoreO}, L={keystoreL}, S={keystoreS}, C={keystoreC}"
                    </code>
                  </div>
                </div>
              </div>
            )}

            {/* 4. LOCAL VERIFICATION */}
            {activeSubTab === 'test' && (
              <div className="space-y-4">
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Before uploading to Google Play, you can inspect and extract APK splits from your <code>.aab</code> package locally using Google's open-source <strong>bundletool</strong> utility:
                </p>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-700">1. Generate APK set (.apks) from bundle</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(testCommands.buildApks, 'bt1')}
                        className="text-[10px] text-indigo-600 hover:text-indigo-805 font-bold flex items-center gap-1"
                      >
                        {copiedText === 'bt1' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {copiedText === 'bt1' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <code className="block bg-zinc-900 text-zinc-100 p-2 rounded-lg text-[11px] font-mono select-all">
                      {testCommands.buildApks}
                    </code>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-700">2. Generate signed APK set for device installation</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(testCommands.buildApksKey, 'bt2')}
                        className="text-[10px] text-indigo-600 hover:text-indigo-805 font-bold flex items-center gap-1"
                      >
                        {copiedText === 'bt2' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {copiedText === 'bt2' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <code className="block bg-zinc-900 text-zinc-100 p-2 rounded-lg text-[10.5px] font-mono select-all whitespace-pre-wrap">
                      {testCommands.buildApksKey}
                    </code>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-700">3. Install APK set to a connected Android emulator/device</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(testCommands.install, 'bt3')}
                        className="text-[10px] text-indigo-600 hover:text-indigo-805 font-bold flex items-center gap-1"
                      >
                        {copiedText === 'bt3' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {copiedText === 'bt3' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <code className="block bg-zinc-900 text-zinc-100 p-2 rounded-lg text-[11px] font-mono select-all">
                      {testCommands.install}
                    </code>
                  </div>
                </div>
              </div>
            )}

            {/* 5. GOOGLE AI & PLAY RULES */}
            {activeSubTab === 'ai' && (
              <div className="space-y-5">
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl flex gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="text-[11px] font-bold text-indigo-950">Google Play Generative AI Policy</h5>
                    <p className="text-[11px] text-indigo-900/80 leading-relaxed">
                      If your <code>.aab</code> package implements Google AI (Gemini SDK, Vertex AI, or other generative models), you must declare these features in the Google Play Console under the <strong>App Content / Generative AI</strong> section.
                    </p>
                  </div>
                </div>

                {/* Sub-section: Security & Obfuscation */}
                <div className="space-y-2.5">
                  <h6 className="text-[11px] font-extrabold text-zinc-805 text-zinc-800 uppercase tracking-wide flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> Securing Gemini API Keys inside AAB
                  </h6>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    <strong>Critical Warning:</strong> Never hardcode your Google AI API keys directly inside Kotlin, Java, React Native, or Flutter code. Automated static analysis scripts can trivially decompile APKs to extract raw strings.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-zinc-600 font-sans">Step 1: Inject in Gradle (android/app/build.gradle)</span>
                        <button
                          type="button"
                          onClick={() => handleCopy('// In your android/app/build.gradle\nandroid {\n    defaultConfig {\n        Properties properties = new Properties()\n        if (project.rootProject.file(\'local.properties\').exists()) {\n            properties.load(project.rootProject.file(\'local.properties\').newDataInputStream())\n        }\n        buildConfigField "String", "GEMINI_API_KEY", "\\"\\${properties.getProperty(\'gemini.api.key\')}\\""\n    }\n}', 'gradle_key')}
                          className="text-[10px] text-indigo-600 hover:text-indigo-850 font-bold flex items-center gap-1"
                        >
                          {copiedText === 'gradle_key' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          {copiedText === 'gradle_key' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <pre className="block bg-zinc-900 text-zinc-100 p-3 rounded-lg text-[10.5px] font-mono leading-relaxed select-all overflow-x-auto whitespace-pre">
{`// In your android/app/build.gradle
android {
    defaultConfig {
        Properties properties = new Properties()
        if (project.rootProject.file('local.properties').exists()) {
            properties.load(project.rootProject.file('local.properties').newDataInputStream())
        }
        buildConfigField "String", "GEMINI_API_KEY", "\\"\${properties.getProperty('gemini.api.key')}\\""
    }
}`}
                      </pre>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-zinc-600 font-sans">Step 2: Add to Local Properties (android/local.properties)</span>
                        <button
                          type="button"
                          onClick={() => handleCopy('# Private keys stored locally and excluded from git\ngemini.api.key=AIzaSyYourGeminiApiKeyHere', 'local_properties')}
                          className="text-[10px] text-indigo-600 hover:text-indigo-850 font-bold flex items-center gap-1"
                        >
                          {copiedText === 'local_properties' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          {copiedText === 'local_properties' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <pre className="block bg-zinc-900 text-zinc-100 p-3 rounded-lg text-[10.5px] font-mono leading-relaxed select-all overflow-x-auto whitespace-pre">
{`# In your android/local.properties (ignored by version control)
gemini.api.key=AIzaSyYourGeminiApiKeyHere`}
                      </pre>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-zinc-600 font-sans">Option B: ProGuard / R8 Obfuscation Rules (proguard-rules.pro)</span>
                        <button
                          type="button"
                          onClick={() => handleCopy('# Obfuscation and code preservation for Google AI SDK classes\n-keep class com.google.ai.client.generativeai.** { *; }\n-keep interface com.google.ai.client.generativeai.** { *; }\n-dontwarn com.google.ai.client.generativeai.**', 'proguard_rules')}
                          className="text-[10px] text-indigo-600 hover:text-indigo-850 font-bold flex items-center gap-1"
                        >
                          {copiedText === 'proguard_rules' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          {copiedText === 'proguard_rules' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <pre className="block bg-zinc-900 text-zinc-100 p-3 rounded-lg text-[10.5px] font-mono leading-relaxed select-all overflow-x-auto whitespace-pre">
{`# Obfuscation and code preservation for Google AI SDK classes
-keep class com.google.ai.client.generativeai.** { *; }
-keep interface com.google.ai.client.generativeai.** { *; }
-dontwarn com.google.ai.client.generativeai.**`}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Sub-section: Play Store AI Declaration Checklist */}
                <div className="border-t border-zinc-150 pt-4 space-y-2.5">
                  <h6 className="text-[11px] font-extrabold text-zinc-805 text-zinc-800 uppercase tracking-wide flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Play Console AI Questionnaire Checklist
                  </h6>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    To prevent app suspension, your app bundle must satisfy these operational requirements before submission:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                    <div className="p-3 rounded-xl border border-zinc-150 bg-zinc-50/50 space-y-1">
                      <span className="font-bold text-zinc-800 block">1. User Reporting System</span>
                      <p className="text-zinc-500 leading-normal">
                        Provide a prominent in-app button next to generated content to flag/report offensive AI answers instantly.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl border border-zinc-150 bg-zinc-50/50 space-y-1">
                      <span className="font-bold text-zinc-800 block">2. In-App Safety Guardrails</span>
                      <p className="text-zinc-500 leading-normal">
                        Configure Gemini safety thresholds (Hate Speech, Harassment, Sexual, Dangerous) to <code>BLOCK_LOW_AND_ABOVE</code>.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl border border-zinc-150 bg-zinc-50/50 space-y-1">
                      <span className="font-bold text-zinc-800 block">3. Prompt Restrictions</span>
                      <p className="text-zinc-500 leading-normal">
                        Validate user text input locally before querying the model, rejecting forbidden words or illegal prompts.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl border border-zinc-150 bg-zinc-50/50 space-y-1">
                      <span className="font-bold text-zinc-800 block">4. Model Fine-Tuning</span>
                      <p className="text-zinc-500 leading-normal">
                        Specify system instructions to restrict output to strictly domain-specific contexts to prevent jailbreaking.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
