import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  ShieldCheck, 
  RotateCcw, 
  AlertCircle
} from 'lucide-react';

interface PrePublishTask {
  id: string;
  title: string;
  category: 'Build' | 'Compliance' | 'Policy' | 'Store';
  description: string;
  actionLabel?: string;
  actionUrl?: string;
  critical: boolean;
}

const DEFAULT_TASKS: PrePublishTask[] = [
  {
    id: 'signed_aab',
    title: 'Signed AAB generated (API 34 / Target SDK 34)',
    category: 'Build',
    description: 'Release bundle compiled with sterling-sound-upload-key.jks and targetSdk 34.',
    actionLabel: 'Verify Build',
    critical: true
  },
  {
    id: 'proguard_rules',
    title: 'Proguard / R8 rules updated',
    category: 'Build',
    description: 'Keep rules added for Play Billing Library, AdMob, and audio DSP native routines.',
    actionLabel: 'Review Rules',
    critical: true
  },
  {
    id: 'privacy_policy',
    title: 'Privacy policy link verified & live',
    category: 'Compliance',
    description: 'Accessible at https://sites.google.com/view/sterlingsound-privacy covering audio microphone usage.',
    actionLabel: 'Check Link',
    actionUrl: 'https://sites.google.com/view/sterlingsound-privacy',
    critical: true
  },
  {
    id: 'app_ads_txt',
    title: 'app-ads.txt hosted on developer domain',
    category: 'Compliance',
    description: 'Contains google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0.',
    critical: true
  },
  {
    id: 'play_billing_7',
    title: 'Play Billing Library v7.1.1 implemented',
    category: 'Build',
    description: 'Uses ProductDetails API with mandatory 3-day purchase acknowledgment.',
    critical: true
  },
  {
    id: 'data_safety_form',
    title: 'Data Safety declaration submitted in Play Console',
    category: 'Policy',
    description: 'Advertising ID and ephemeral microphone audio DSP processing disclosed.',
    actionLabel: 'Play Console',
    actionUrl: 'https://play.google.com/console',
    critical: true
  },
  {
    id: 'tester_questionnaire',
    title: '14-Day 20-tester audit responses completed',
    category: 'Store',
    description: 'Recruitment, engagement, and tester iteration questions answered for production approval.',
    critical: true
  },
  {
    id: 'store_assets',
    title: 'Store graphics & localized release notes loaded',
    category: 'Store',
    description: '512x512 app icon, 1024x500 feature graphic, and multi-language release XML ready.',
    critical: false
  }
];

export const PrePublishChecklist: FC = () => {
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sterling_prepublish_tasks');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default initial checked items for high readiness
    return ['signed_aab', 'proguard_rules', 'privacy_policy', 'play_billing_7', 'app_ads_txt'];
  });

  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    try {
      localStorage.setItem('sterling_prepublish_tasks', JSON.stringify(completedIds));
    } catch {
      // ignore
    }
  }, [completedIds]);

  const toggleTask = (id: string) => {
    setCompletedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const resetChecklist = () => {
    setCompletedIds(['signed_aab', 'proguard_rules', 'privacy_policy', 'play_billing_7']);
  };

  const markAll = () => {
    setCompletedIds(DEFAULT_TASKS.map(t => t.id));
  };

  const progressPercent = Math.round((completedIds.length / DEFAULT_TASKS.length) * 100);
  const isReady = completedIds.length === DEFAULT_TASKS.length;

  const filteredTasks = DEFAULT_TASKS.filter(task => {
    const isDone = completedIds.includes(task.id);
    if (filter === 'pending') return !isDone;
    if (filter === 'completed') return isDone;
    return true;
  });

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-5">
      
      {/* Header with Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white text-sm">Essential Pre-Publishing Audit Checklist</h3>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
              isReady 
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' 
                : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
            }`}>
              {isReady ? 'READY FOR REVIEW' : `${completedIds.length}/${DEFAULT_TASKS.length} COMPLETE`}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Verify every mandatory gate before clicking <strong>Send changes for review</strong> in Google Play Console.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={markAll}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
          >
            Check All
          </button>
          <button
            onClick={resetChecklist}
            className="p-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Reset Checklist"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-slate-400">Readiness Score</span>
          <span className={progressPercent === 100 ? 'text-emerald-400 font-bold' : 'text-cyan-300 font-bold'}>
            {progressPercent}%
          </span>
        </div>
        <div className="w-full h-2 bg-[#05080c] rounded-full overflow-hidden border border-slate-800">
          <div 
            className={`h-full transition-all duration-500 rounded-full ${
              progressPercent === 100 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                : 'bg-gradient-to-r from-cyan-500 to-blue-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              filter === 'all' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({DEFAULT_TASKS.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              filter === 'pending' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pending ({DEFAULT_TASKS.length - completedIds.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              filter === 'completed' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Completed ({completedIds.length})
          </button>
        </div>

        {isReady && (
          <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> All pre-flight requirements cleared
          </span>
        )}
      </div>

      {/* Task List */}
      <div className="divide-y divide-slate-800/60 rounded-lg border border-slate-800/80 bg-[#05080c] overflow-hidden">
        {filteredTasks.map((task) => {
          const isDone = completedIds.includes(task.id);

          return (
            <div 
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-3.5 flex items-start justify-between gap-3 cursor-pointer transition-colors ${
                isDone ? 'bg-slate-900/20 hover:bg-slate-900/40' : 'hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  className="mt-0.5 shrink-0 text-slate-500 hover:text-cyan-400 focus:outline-none"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                  )}
                </button>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-semibold ${
                      isDone ? 'text-slate-400 line-through' : 'text-slate-200'
                    }`}>
                      {task.title}
                    </span>

                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-slate-800 text-slate-400 border border-slate-700/60">
                      {task.category}
                    </span>

                    {task.critical && !isDone && (
                      <span className="text-[9px] font-semibold text-amber-400 flex items-center gap-0.5">
                        <AlertCircle className="w-2.5 h-2.5" /> Required
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {task.description}
                  </p>
                </div>
              </div>

              {task.actionUrl && (
                <a
                  href={task.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 inline-flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 px-2 py-1 bg-cyan-950/40 rounded border border-cyan-500/20 hover:border-cyan-500/40 transition-colors"
                >
                  {task.actionLabel || 'Open'} <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
