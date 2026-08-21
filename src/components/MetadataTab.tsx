import { useState } from 'react';
import type { ChangeEvent, FC } from 'react';
import { AppMetadata } from '../types';
import { 
  FileText, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';

interface Props {
  metadata: AppMetadata;
  onUpdate: (data: Partial<AppMetadata>) => void;
}

export const MetadataTab: FC<Props> = ({ metadata, onUpdate }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyText = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Short Description Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Title Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              App Title (Max 30 chars)
            </label>
            <span className={`text-xs font-mono ${metadata.title.length > 30 ? 'text-rose-400' : 'text-slate-400'}`}>
              {metadata.title.length}/30
            </span>
          </div>
          <input
            type="text"
            value={metadata.title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdate({ title: e.target.value })}
            className="w-full bg-[#05080c] border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors font-medium"
            maxLength={30}
          />
          <div className="flex justify-between items-center pt-1">
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Compliant for Store Listing
            </span>
            <button
              onClick={() => copyText(metadata.title, 'title')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              {copiedField === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedField === 'title' ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Short Description Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Short Description (Max 80 chars)
            </label>
            <span className={`text-xs font-mono ${metadata.shortDescription.length > 80 ? 'text-rose-400' : 'text-slate-400'}`}>
              {metadata.shortDescription.length}/80
            </span>
          </div>
          <input
            type="text"
            value={metadata.shortDescription}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdate({ shortDescription: e.target.value })}
            className="w-full bg-[#05080c] border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors font-medium"
            maxLength={80}
          />
          <div className="flex justify-between items-center pt-1">
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Scannable & high-impact
            </span>
            <button
              onClick={() => copyText(metadata.shortDescription, 'short')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              {copiedField === 'short' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedField === 'short' ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

      </div>

      {/* Long Description Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            Full Description (Max 4000 chars)
          </label>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-mono ${metadata.longDescription.length > 4000 ? 'text-rose-400' : 'text-slate-400'}`}>
              {metadata.longDescription.length}/4000
            </span>
            <button
              onClick={() => copyText(metadata.longDescription, 'long')}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded border border-slate-700 transition-colors"
            >
              {copiedField === 'long' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedField === 'long' ? 'Copied' : 'Copy Full Description'}
            </button>
          </div>
        </div>
        <textarea
          value={metadata.longDescription}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onUpdate({ longDescription: e.target.value })}
          rows={6}
          className="w-full bg-[#05080c] border border-slate-800 rounded-lg p-3.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors font-normal leading-relaxed"
          maxLength={4000}
        />
      </div>

      {/* Privacy Policy Host & URL */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-semibold text-white text-sm">Google Play Privacy Policy URL</h3>
              <p className="text-xs text-slate-400">Must be a public HTTPS web page compliant with microphone & audio data disclosures</p>
            </div>
          </div>
          <a
            href={metadata.privacyPolicyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
          >
            Visit Live Policy <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={metadata.privacyPolicyUrl}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdate({ privacyPolicyUrl: e.target.value })}
            className="flex-1 bg-[#05080c] border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-cyan-300 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            onClick={() => copyText(metadata.privacyPolicyUrl, 'privurl')}
            className="px-3.5 py-2 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            {copiedField === 'privurl' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedField === 'privurl' ? 'Copied' : 'Copy URL'}
          </button>
        </div>

        {/* Policy Text Box */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-400">Complete Policy Text (Markdown / Text):</label>
            <button
              onClick={() => copyText(metadata.privacyPolicyText, 'privtext')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              {copiedField === 'privtext' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedField === 'privtext' ? 'Copied' : 'Copy Text'}
            </button>
          </div>
          <pre className="bg-[#05080c] border border-slate-800 rounded-lg p-3 text-xs text-slate-300 font-mono max-h-48 overflow-y-auto whitespace-pre-wrap">
            {metadata.privacyPolicyText}
          </pre>
        </div>
      </div>
    </div>
  );
};
