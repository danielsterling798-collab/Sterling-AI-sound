import { useState } from 'react';
import type { ChangeEvent, FC } from 'react';
import { ProductionReleaseInfo } from '../types';
import { 
  Package, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Languages 
} from 'lucide-react';
import { PrePublishChecklist } from './PrePublishChecklist';

interface Props {
  release: ProductionReleaseInfo;
}

export const ReleaseTab: FC<Props> = ({ release }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState('en-US');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const localizedNotes: Record<string, string> = {
    'en-US': `Initial release of Sterling Sound AI v2.
• Real-time 64-band FFT spectral audio visualizer
• Precision multi-band equalizer with custom target curves
• Low-latency DSP audio monitoring telemetry
• Optimized UI for Android 14 phones and tablets`,

    'es-419': `Lanzamiento inicial de Sterling Sound AI v2.
• Visualizador de espectro de audio FFT de 64 bandas en tiempo real
• Ecualizador multibanda de alta precisión con curvas personalizadas
• Monitorización y telemetría de audio DSP de baja latencia
• Interfaz optimizada para teléfonos y tablets con Android 14`,

    'fr-FR': `Sortie initiale de Sterling Sound AI v2.
• Visualiseur spectral audio FFT 64 bandes en temps réel
• Égaliseur multibande de précision avec courbes cibles personnalisées
• Télémétrie et monitoring audio DSP à faible latence
• Interface optimisée pour téléphones et tablettes Android 14`,

    'de-DE': `Erstveröffentlichung von Sterling Sound AI v2.
• 64-Band-Echtzeit-FFT-Audiospektral-Visualizer
• Präziser Mehrband-Equalizer mit benutzerdefinierten Zielkurven
• DSP-Audiomonitoring und Telemetrie mit extrem geringer Latenz
• Optimierte Benutzeroberfläche für Android 14 Smartphones und Tablets`,

    'ja-JP': `Sterling Sound AI v2 の初回リリース。
• リアルタイム64バンドFFTオーディオスペクトラムアナライザー
• カスタムターゲットカーブ対応の高精度マルチバンドイコライザー
• 低遅延DSPオーディオモニタリングおよびテレメトリ
• Android 14スマートフォンおよびタブレット向けに最適化されたUI`
  };

  const allXmlNotes = `<en-US>
${localizedNotes['en-US']}
</en-US>

<es-419>
${localizedNotes['es-419']}
</es-419>

<fr-FR>
${localizedNotes['fr-FR']}
</fr-FR>

<de-DE>
${localizedNotes['de-DE']}
</de-DE>

<ja-JP>
${localizedNotes['ja-JP']}
</ja-JP>`;

  return (
    <div className="space-y-6">
      
      {/* Release Overview Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-cyan-950/40 border border-blue-500/20 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Production Release Artifacts & App Bundle (.aab)</h2>
            </div>
            <p className="text-sm text-slate-300">
              Bundle ready for Google Play Console production track rollout. Includes verified answers for 20-tester review.
            </p>
          </div>
          <a
            href="https://play.google.com/console"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-lg transition-colors"
          >
            Open Play Console <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Artifact Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-400">Bundle Name</span>
          <p className="text-sm font-semibold text-white truncate font-mono text-cyan-300">{release.bundleName}</p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-400">Version Name & Code</span>
          <p className="text-sm font-semibold text-white font-mono">{release.versionName} ({release.versionCode})</p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-400">Target SDK</span>
          <p className="text-sm font-semibold text-emerald-400 font-mono">{release.targetSdk}</p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-400">Estimated Size</span>
          <p className="text-sm font-semibold text-white font-mono">{release.bundleSize}</p>
        </div>

      </div>

      {/* Pre-Publishing Audit Checklist */}
      <PrePublishChecklist />

      {/* Production Questionnaire Answers */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white text-sm">Google Play Production Access Questionnaire (Mandatory 3 Questions)</h3>
          </div>
          <span className="text-xs text-emerald-400 font-mono">100% Certified</span>
        </div>

        {/* Q1 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-200">1. How did you recruit testers for your closed testing track?</h4>
            <button
              onClick={() => copyToClipboard(release.recruitmentDetails, 'q1')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              {copiedSection === 'q1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedSection === 'q1' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="bg-[#05080c] border border-slate-800 p-3 rounded-lg text-xs text-slate-300 leading-relaxed font-sans">
            {release.recruitmentDetails}
          </p>
        </div>

        {/* Q2 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-200">2. How easy was it for testers to opt in and engage with your app?</h4>
            <button
              onClick={() => copyToClipboard(release.optInDetails, 'q2')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              {copiedSection === 'q2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedSection === 'q2' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="bg-[#05080c] border border-slate-800 p-3 rounded-lg text-xs text-slate-300 leading-relaxed font-sans">
            {release.optInDetails}
          </p>
        </div>

        {/* Q3 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-200">3. What feedback did you receive from testers and what changes did you make?</h4>
            <button
              onClick={() => copyToClipboard(release.feedbackChangesDetails, 'q3')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              {copiedSection === 'q3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedSection === 'q3' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="bg-[#05080c] border border-slate-800 p-3 rounded-lg text-xs text-slate-300 leading-relaxed font-sans">
            {release.feedbackChangesDetails}
          </p>
        </div>
      </div>

      {/* Localized Release Notes Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-white text-sm">Release Notes (Multi-Language & XML Format)</h3>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedLang}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedLang(e.target.value)}
              className="bg-[#05080c] border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
            >
              <option value="en-US">English (en-US)</option>
              <option value="es-419">Spanish (es-419)</option>
              <option value="fr-FR">French (fr-FR)</option>
              <option value="de-DE">German (de-DE)</option>
              <option value="ja-JP">Japanese (ja-JP)</option>
            </select>
            <button
              onClick={() => copyToClipboard(allXmlNotes, 'allxml')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 text-xs font-semibold rounded border border-cyan-500/30 transition-colors"
            >
              {copiedSection === 'allxml' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'allxml' ? 'Copied' : 'Copy All (XML Tags)'}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-mono">{selectedLang} Preview:</span>
            <button
              onClick={() => copyToClipboard(localizedNotes[selectedLang], 'singlelang')}
              className="text-slate-400 hover:text-white flex items-center gap-1"
            >
              {copiedSection === 'singlelang' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedSection === 'singlelang' ? 'Copied' : 'Copy This Language'}
            </button>
          </div>
          <pre className="bg-[#05080c] border border-slate-800 p-3 rounded-lg text-xs text-cyan-200/90 font-mono whitespace-pre-wrap">
            {localizedNotes[selectedLang]}
          </pre>
        </div>
      </div>

    </div>
  );
};
