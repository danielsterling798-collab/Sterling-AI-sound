import React, { useState, useEffect } from 'react';
import { AppPublishState, AppMetadata, ContentRatingAnswers, StoreAsset, Tester, FeedbackLog, ProductionRelease } from './types';
import { INITIAL_TESTERS, INITIAL_FEEDBACKS } from './constants';
import { MetadataTab } from './components/MetadataTab';
import { AssetsTab } from './components/AssetsTab';
import { TestingTab } from './components/TestingTab';
import { ReleaseTab } from './components/ReleaseTab';
import { ExportAuditModal } from './components/ExportAuditModal';
import { DangerZoneModal } from './components/DangerZoneModal';

import { 
  Compass, LayoutGrid, CheckSquare, 
  ChevronRight, ChevronLeft, Award, Sparkles, Star, Eye, ShieldCheck, Trash2
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'sterling_playlaunch_v1_state';

const DEFAULT_METADATA: AppMetadata = {
  title: 'Sterling Sound AI v2',
  shortDescription: 'Professional studio mastering and audio spectral analyzer app.',
  longDescription: 'Sterling Sound AI is a professional-grade spectral audio visualizer and smart EQ tuner. Built utilizing fast discrete Fourier transforms, this mobile workstation delivers realtime 64-band visual telemetry, logarithmic spectral analyzers, and precise multi-band equalizations. Perfect for live musicians, acoustic engineers, and audiophiles seeking reference-level monitoring and custom target curves on headphones, car cabins, or home theater configurations.',
  appType: 'Application',
  category: 'Music & Audio',
  tags: ['Audio-Editor', 'Utilities', 'Minimalist']
};

const DEFAULT_CONTENT_RATING: ContentRatingAnswers = {
  violence: 'none',
  sexuality: 'none',
  language: 'none',
  gambling: false,
  userInteraction: false
};

const INITIAL_STATE: AppPublishState = {
  metadata: DEFAULT_METADATA,
  contentRating: DEFAULT_CONTENT_RATING,
  assets: {
    icon: null,
    feature: null,
    screenshotsPhone: [],
    screenshotsTablet: []
  },
  testers: INITIAL_TESTERS,
  feedback: INITIAL_FEEDBACKS,
  release: {
    bundleName: '',
    bundleSize: '',
    versionName: '',
    versionCode: 1,
    targetSdk: '',
    countries: [],
    recruitmentDetails: '',
    optInDetails: '',
    feedbackChangesDetails: ''
  },
  currentStep: 0,
  testingStartDate: '2026-06-01'
};

export default function App() {
  const [state, setState] = useState<AppPublishState>(INITIAL_STATE);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isResetDangerModalOpen, setIsResetDangerModalOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AppPublishState;
        
        // Self-healing migration: shrink any existing massive base64 strings to save quota
        if (parsed.assets) {
          if (parsed.assets.icon && parsed.assets.icon.url && parsed.assets.icon.url.length > 150000) {
            parsed.assets.icon.url = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
          }
          if (parsed.assets.feature && parsed.assets.feature.url && parsed.assets.feature.url.length > 250000) {
            parsed.assets.feature.url = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
          }
          if (parsed.assets.screenshotsPhone) {
            parsed.assets.screenshotsPhone = parsed.assets.screenshotsPhone.map(s => {
              if (s.url && s.url.length > 150000) {
                return { ...s, url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' };
              }
              return s;
            });
          }
          if (parsed.assets.screenshotsTablet) {
            parsed.assets.screenshotsTablet = parsed.assets.screenshotsTablet.map(s => {
              if (s.url && s.url.length > 150000) {
                return { ...s, url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' };
              }
              return s;
            });
          }
        }
        
        setState(parsed);
      }
    } catch (e) {
      console.error('Failed to load local storage state:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to local storage on edits
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to local storage, attempting self-healing compression:', e);
      // If we exceed quota, aggressively shrink heavy assets in local state so saving can succeed next time
      setState(prev => {
        const cleanAssets = {
          icon: prev.assets.icon ? {
            ...prev.assets.icon,
            url: prev.assets.icon.url && prev.assets.icon.url.length > 100000 
              ? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' 
              : prev.assets.icon.url
          } : null,
          feature: prev.assets.feature ? {
            ...prev.assets.feature,
            url: prev.assets.feature.url && prev.assets.feature.url.length > 100000 
              ? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' 
              : prev.assets.feature.url
          } : null,
          screenshotsPhone: prev.assets.screenshotsPhone.map(s => ({
            ...s,
            url: s.url && s.url.length > 100000 
              ? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' 
              : s.url
          })),
          screenshotsTablet: prev.assets.screenshotsTablet.map(s => ({
            ...s,
            url: s.url && s.url.length > 100000 
              ? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' 
              : s.url
          }))
        };
        return {
          ...prev,
          assets: cleanAssets
        };
      });
    }
  }, [state, isInitialized]);

  // Handler state updates
  const handleMetadataChange = (metadata: AppMetadata) => {
    setState(prev => ({ ...prev, metadata }));
  };

  const handleContentRatingChange = (contentRating: ContentRatingAnswers) => {
    setState(prev => ({ ...prev, contentRating }));
  };

  const handleAssetChange = (key: 'icon' | 'feature' | 'screenshotsPhone' | 'screenshotsTablet', value: any) => {
    setState(prev => ({
      ...prev,
      assets: {
        ...prev.assets,
        [key]: value
      }
    }));
  };

  const handleTestersChange = (testers: Tester[]) => {
    setState(prev => ({ ...prev, testers }));
  };

  const handleFeedbackChange = (feedback: FeedbackLog[]) => {
    setState(prev => ({ ...prev, feedback }));
  };

  const handleReleaseChange = (release: ProductionRelease) => {
    setState(prev => ({ ...prev, release }));
  };

  const handleStepChange = (step: number) => {
    if (step >= 0 && step <= 3) {
      setState(prev => ({ ...prev, currentStep: step }));
    }
  };

  const handleResetAllData = () => {
    setState(INITIAL_STATE);
  };

  // Helper sequence of dates for continuous campaign calculations
  const getCampaignDateString = (dayIndex: number) => {
    const start = new Date(state.testingStartDate);
    start.setDate(start.getDate() + dayIndex);
    return start.toISOString().split('T')[0];
  };

  // Calculate overall campaign checks
  const getCampaignMetrics = () => {
    let continuousStreak = 0;
    const testersCount = state.testers.length;
    
    // Check consecutive days with >= 20 checkers
    for (let i = 0; i < 14; i++) {
      const dateStr = getCampaignDateString(i);
      const activeCount = state.testers.filter(t => t.checkInDates.includes(dateStr)).length;
      if (activeCount >= 20) {
        continuousStreak = i + 1;
      } else {
        break;
      }
    }

    return {
      continuousStreak,
      isStreakPassed: continuousStreak >= 14,
      isCohortPassed: testersCount >= 20
    };
  };

  const metrics = getCampaignMetrics();

  // Progress metrics
  const getPublishProgressPercent = () => {
    let completedPoints = 0;
    let totalPoints = 12;

    if (state.metadata.title.length > 5) completedPoints++;
    if (state.metadata.shortDescription.length > 10) completedPoints++;
    if (state.metadata.longDescription.length > 50) completedPoints++;
    if (state.metadata.category.length > 0) completedPoints++;
    
    if (state.assets.icon) completedPoints++;
    if (state.assets.feature) completedPoints++;
    if (state.assets.screenshotsPhone.length >= 2) completedPoints++;
    if (state.assets.screenshotsTablet.length >= 2) completedPoints++;

    if (state.testers.length >= 20) completedPoints++;
    if (metrics.isStreakPassed) completedPoints++;

    if (state.release.bundleName.endsWith('.aab')) completedPoints++;
    if (state.release.countries.length > 0) completedPoints++;

    return Math.round((completedPoints / totalPoints) * 100);
  };

  const currentProgressPercent = getPublishProgressPercent();

  // Step names
  const STEPS_INDEX = [
    { label: 'Step 1: Create App', desc: 'Listing Metadata' },
    { label: 'Step 2: Store Assets', desc: 'Dimensions & Preview' },
    { label: 'Step 3: Closed Testing', desc: '20 Testers x 14 Days' },
    { label: 'Step 4: Send for Review', desc: 'Region & AAB rollout' }
  ];

  return (
    <div className="min-h-screen bg-[#fafafb] text-zinc-800 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900 pb-16">
      {/* Visual Header */}
      <header className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-150 bg-white sticky top-0 z-40 shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-505 bg-indigo-600 flex items-center justify-center text-white font-black shadow-md">
            P
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold uppercase tracking-tight text-sm text-zinc-900 leading-none">Sterling PlayLaunch</span>
              <span className="text-[9px] bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded text-indigo-700 font-bold">V2.1</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-bold block mt-0.5">Google Play Console Publishing Workspace</span>
          </div>
        </div>

        {/* Global Progress Gauge & Compliance Export Trigger */}
        <div className="flex flex-wrap items-center gap-4 text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase block tracking-wider font-mono">Publication Readiness score</span>
            <div className="flex items-center gap-2">
              <div className="w-24 sm:w-28 bg-zinc-100 h-2 rounded-full overflow-hidden border border-zinc-150">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-500"
                  style={{ width: `${currentProgressPercent}%` }}
                />
              </div>
              <span className="text-xs font-black text-indigo-700">{currentProgressPercent}%</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-950 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md shrink-0 no-print cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" /> Export Audit Trail
          </button>

          <button
            type="button"
            onClick={() => setIsResetDangerModalOpen(true)}
            className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md shrink-0 no-print cursor-pointer"
            title="Reset All Application Data"
          >
            <Trash2 className="w-4 h-4 text-red-500" /> Clear All Data
          </button>
        </div>
      </header>

      {/* Steps checklist matrix navigation visual slider */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-white border border-zinc-150 p-2 rounded-2xl shadow-sm">
          {STEPS_INDEX.map((step, idx) => {
            const isActive = state.currentStep === idx;
            const isCompleted = (idx === 0 && state.metadata.title.length > 5) ||
                               (idx === 1 && state.assets.icon && state.assets.screenshotsPhone.length >= 2) ||
                               (idx === 2 && state.testers.length >= 20 && metrics.isStreakPassed) ||
                               (idx === 3 && state.release.bundleName.endsWith('.aab') && state.release.countries.length > 0);

            return (
              <button
                key={step.label}
                type="button"
                onClick={() => handleStepChange(idx)}
                className={`p-3 rounded-xl text-left transition-all relative ${
                  isActive 
                    ? 'bg-zinc-900 text-white shadow' 
                    : 'text-zinc-650 hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] uppercase font-bold tracking-tight ${isActive ? 'text-zinc-400' : 'text-zinc-400'}`}>
                    {step.label.split(':')[0]}
                  </span>
                  {isCompleted && (
                    <span className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[9px] font-black shrink-0">
                      ✓
                    </span>
                  )}
                </div>
                <span className="block text-xs font-black truncate leading-tight font-sans mt-1">
                  {step.label.split(':')[1].trim()}
                </span>
                <span className={`block text-[10px] ${isActive ? 'text-zinc-300' : 'text-zinc-400'}`}>
                  {step.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab content container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 font-sans">
        {state.currentStep === 0 && (
          <MetadataTab
            metadata={state.metadata}
            onChange={handleMetadataChange}
            contentRating={state.contentRating}
            onContentRatingChange={handleContentRatingChange}
          />
        )}

        {state.currentStep === 1 && (
          <AssetsTab
            metadata={state.metadata}
            assets={state.assets}
            onAssetChange={handleAssetChange}
          />
        )}

        {state.currentStep === 2 && (
          <TestingTab
            metadata={state.metadata}
            testers={state.testers}
            feedback={state.feedback}
            onTestersChange={handleTestersChange}
            onFeedbackChange={handleFeedbackChange}
          />
        )}

        {state.currentStep === 3 && (
          <ReleaseTab
            metadata={state.metadata}
            testers={state.testers}
            feedback={state.feedback}
            release={state.release}
            hasIcon={!!state.assets.icon}
            hasFeature={!!state.assets.feature}
            phoneScreenshotsCount={state.assets.screenshotsPhone.length}
            tabletScreenshotsCount={state.assets.screenshotsTablet.length}
            onReleaseChange={handleReleaseChange}
            continuousStreak={metrics.continuousStreak}
          />
        )}        {/* Wizard Footer buttons */}
        <div className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-6 no-print">
          <button
            type="button"
            disabled={state.currentStep === 0}
            onClick={() => handleStepChange(state.currentStep - 1)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all outline-none ${
              state.currentStep === 0 
                ? 'opacity-40 border-zinc-200 text-zinc-300 cursor-not-allowed' 
                : 'border-zinc-200 text-zinc-650 bg-white hover:bg-zinc-50 hover:border-zinc-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Previous Step
          </button>

          {state.currentStep < 3 ? (
            <button
              type="button"
              onClick={() => handleStepChange(state.currentStep + 1)}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md outline-none"
            >
              Continue to {STEPS_INDEX[state.currentStep + 1].label.split(':')[1]} <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 select-none shrink-0 font-mono">
              ★ Readiness Dashboard fully indexed. Complete audits inside Step 4 to trigger review!
            </div>
          )}
        </div>
      </main>

      <ExportAuditModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        state={state} 
        continuousStreak={metrics.continuousStreak} 
      />

      <DangerZoneModal
        isOpen={isResetDangerModalOpen}
        onClose={() => setIsResetDangerModalOpen(false)}
        onConfirm={handleResetAllData}
        title="Reset All Application Data"
        description="This will permanently delete the entire workspace state (including all custom app metadata, storefront branding assets, registered testers, and active 14-day history review logs) and revert the application back to its default state. This action is completely irreversible."
        confirmationWord="CLEAR ALL DATA"
        actionLabel="Permanently Delete Everything"
      />
    </div>
  );
}
