import { useState } from 'react';
import { 
  AudioWaveform, 
  ExternalLink, 
  FileText, 
  Users, 
  Package, 
  Link2,
  DollarSign,
  CreditCard
} from 'lucide-react';
import { MetadataTab } from './components/MetadataTab';
import { TestingTab } from './components/TestingTab';
import { ReleaseTab } from './components/ReleaseTab';
import { DeepLinksAndAppGuide } from './components/DeepLinksAndAppGuide';
import { AdMobGuideTab } from './components/AdMobGuideTab';
import { PlayBillingUpgradeTab } from './components/PlayBillingUpgradeTab';
import { Visualizer } from './components/Visualizer';
import { 
  INITIAL_METADATA, 
  INITIAL_TESTERS, 
  INITIAL_FEEDBACK, 
  INITIAL_RELEASE 
} from './constants';
import { AppMetadata, Tester, TesterFeedback } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'metadata' | 'testing' | 'release' | 'deeplinks' | 'admob' | 'billing'>('billing');
  const [metadata, setMetadata] = useState<AppMetadata>(INITIAL_METADATA);
  const [testers, setTesters] = useState<Tester[]>(INITIAL_TESTERS);
  const [feedback, setFeedback] = useState<TesterFeedback[]>(INITIAL_FEEDBACK);
  const [release] = useState(INITIAL_RELEASE);

  const handleUpdateMetadata = (updated: Partial<AppMetadata>) => {
    setMetadata((prev: AppMetadata) => ({ ...prev, ...updated }));
  };

  const handleAddTester = (tester: Tester) => {
    setTesters((prev: Tester[]) => [tester, ...prev]);
  };

  const handleAddFeedback = (item: TesterFeedback) => {
    setFeedback((prev: TesterFeedback[]) => [item, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#070a0f] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-[#090d14]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 p-0.5 shadow-lg shadow-cyan-950">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <AudioWaveform className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">Sterling Sound AI v2</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  v1.0.0-PROD
                </span>
              </div>
              <p className="text-xs text-slate-400">Google Play Console Publishing & 14-Day Audit Workspace</p>
            </div>
          </div>

          {/* Quick External Actions */}
          <div className="flex items-center gap-3">
            <a
              href="https://sites.google.com/view/sterlingsound-privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/50 transition-colors"
            >
              Privacy Policy <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <a
              href="https://play.google.com/console"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 px-3.5 py-1.5 rounded-lg shadow-md transition-colors"
            >
              Play Console <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div className="border-b border-slate-800/80 bg-[#090d14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2.5 scrollbar-none">
            
            <button
              onClick={() => setActiveTab('release')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'release'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Package className="w-4 h-4 text-blue-400" />
              Production Release & AAB
            </button>

            <button
              onClick={() => setActiveTab('testing')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'testing'
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" />
              14-Day 20-Tester Track
            </button>

            <button
              onClick={() => setActiveTab('metadata')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'metadata'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <FileText className="w-4 h-4 text-purple-400" />
              Store Listing & Privacy
            </button>

            <button
              onClick={() => setActiveTab('deeplinks')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'deeplinks'
                  ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Link2 className="w-4 h-4 text-cyan-400" />
              Deep Links & Manifest
            </button>

            <button
              onClick={() => setActiveTab('admob')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'admob'
                  ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <DollarSign className="w-4 h-4 text-amber-400" />
              AdMob Integration Guide
            </button>

            <button
              onClick={() => setActiveTab('billing')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'billing'
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              Play Billing Upgrade (PBL 7.x)
            </button>

            <button
              onClick={() => setActiveTab('visualizer')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'visualizer'
                  ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <AudioWaveform className="w-4 h-4 text-rose-400" />
              Live Audio DSP
            </button>

          </nav>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'release' && <ReleaseTab release={release} />}
        {activeTab === 'testing' && (
          <TestingTab 
            testers={testers} 
            feedback={feedback} 
            onAddTester={handleAddTester} 
            onAddFeedback={handleAddFeedback} 
          />
        )}
        {activeTab === 'metadata' && (
          <MetadataTab metadata={metadata} onUpdate={handleUpdateMetadata} />
        )}
        {activeTab === 'deeplinks' && <DeepLinksAndAppGuide />}
        {activeTab === 'admob' && <AdMobGuideTab />}
        {activeTab === 'billing' && <PlayBillingUpgradeTab />}
        {activeTab === 'visualizer' && <Visualizer />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-[#06080d] py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Sterling Sound AI v2 • Google Play Console Readiness Suite</span>
          <span className="font-mono text-slate-400">Application ID: com.danielsterling.sterlingsoundaiv2</span>
        </div>
      </footer>

    </div>
  );
}

export default App;
