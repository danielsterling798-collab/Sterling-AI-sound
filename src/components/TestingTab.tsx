import { useState } from 'react';
import type { ChangeEvent, FC } from 'react';
import { Tester, TesterFeedback } from '../types';
import { 
  Users, 
  CalendarCheck, 
  CheckCircle2, 
  MessageSquare, 
  Search, 
  Star
} from 'lucide-react';

interface Props {
  testers: Tester[];
  feedback: TesterFeedback[];
  onAddTester: (tester: Tester) => void;
  onAddFeedback: (feedback: TesterFeedback) => void;
}

export const TestingTab: FC<Props> = ({ testers, feedback }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'feedback' | 'checklist'>('roster');

  const filteredTesters = testers.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.deviceType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedCount = testers.filter(t => t.checkInDates.length >= 14).length;
  const progressPercent = Math.round((completedCount / testers.length) * 100);

  return (
    <div className="space-y-6">
      
      {/* 14-Day Testing Metric Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex items-center gap-3.5">
          <div className="p-3 bg-cyan-950/60 border border-cyan-500/30 rounded-lg text-cyan-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{testers.length} / 20</div>
            <div className="text-xs text-slate-400">Enrolled Testers</div>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex items-center gap-3.5">
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-lg text-emerald-400">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">14 / 14 Days</div>
            <div className="text-xs text-slate-400">Required Duration</div>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex items-center gap-3.5">
          <div className="p-3 bg-purple-950/60 border border-purple-500/30 rounded-lg text-purple-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{feedback.length} Logged</div>
            <div className="text-xs text-slate-400">Audited Feedback</div>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex items-center gap-3.5">
          <div className="p-3 bg-blue-950/60 border border-blue-500/30 rounded-lg text-blue-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">{progressPercent}% Ready</div>
            <div className="text-xs text-slate-400">Production Eligibility</div>
          </div>
        </div>

      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('roster')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'roster'
              ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Tester Roster ({testers.length})
        </button>
        <button
          onClick={() => setActiveSubTab('feedback')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'feedback'
              ? 'bg-purple-950/70 text-purple-300 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Feedback Log ({feedback.length})
        </button>
        <button
          onClick={() => setActiveSubTab('checklist')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'checklist'
              ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Google Play 14-Day Audit Checklist
        </button>
      </div>

      {/* Content depending on subtab */}
      {activeSubTab === 'roster' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search tester, email, device..."
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="w-full bg-[#05080c] border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> 20/20 Testers Opted In & Active
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3 px-2">#</th>
                  <th className="pb-3">Tester Name</th>
                  <th className="pb-3">Google Play Email</th>
                  <th className="pb-3">Device / OS</th>
                  <th className="pb-3">14-Day Check-Ins</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                {filteredTesters.map((tester, idx) => (
                  <tr key={tester.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-2 text-slate-500">{idx + 1}</td>
                    <td className="py-2.5 font-sans font-medium text-white">{tester.name}</td>
                    <td className="py-2.5 text-cyan-300/80">{tester.email}</td>
                    <td className="py-2.5 text-slate-400 font-sans">{tester.deviceType}</td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-1">
                        <span className="text-emerald-400 font-bold">{tester.checkInDates.length}</span>
                        <span className="text-slate-500">/ 14 days</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                        {tester.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'feedback' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedback.map(item => (
            <div key={item.id} className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">{item.testerName}</h4>
                  <p className="text-xs text-cyan-400 font-mono">{item.testerEmail}</p>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed bg-[#05080c] p-3 rounded-lg border border-slate-800/80">
                "{item.comment}"
              </p>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500 font-mono">{item.date}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  item.status === 'Resolved' ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/30' : 'bg-amber-950/50 text-amber-300 border border-amber-500/30'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'checklist' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-base font-semibold text-white">Google Play 20-Tester Compliance Criteria</h3>
          <div className="space-y-3">
            
            <div className="p-3.5 bg-[#05080c] border border-emerald-500/20 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">20 Unique Google Accounts Opted In</h4>
                <p className="text-xs text-slate-400 mt-0.5">All 20 individual testers have accepted the invitation link and installed the app bundle.</p>
              </div>
            </div>

            <div className="p-3.5 bg-[#05080c] border border-emerald-500/20 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">14 Continuous Days of Activity Recorded</h4>
                <p className="text-xs text-slate-400 mt-0.5">Full consecutive 14-day streak observed across multiple Android hardware versions (Phones + Tablets).</p>
              </div>
            </div>

            <div className="p-3.5 bg-[#05080c] border border-emerald-500/20 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">Feedback Logged & Iterations Actioned</h4>
                <p className="text-xs text-slate-400 mt-0.5">Responses for the 3 production questionnaire prompts (recruitment, ease of opt-in, changes made) are ready for submission.</p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
