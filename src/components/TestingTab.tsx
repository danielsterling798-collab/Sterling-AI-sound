import React, { useState } from 'react';
import { Tester, FeedbackLog, AppMetadata } from '../types';
import { EMAIL_TEMPLATES } from '../constants';
import { 
  Users, Calendar, Mail, FileText, Plus, Trash2, 
  CheckCircle, AlertTriangle, Play, Sparkles, Clipboard, 
  ChevronRight, RefreshCw, Star
} from 'lucide-react';
import { DangerZoneModal } from './DangerZoneModal';

interface TestingTabProps {
  metadata: AppMetadata;
  testers: Tester[];
  feedback: FeedbackLog[];
  onTestersChange: (testers: Tester[]) => void;
  onFeedbackChange: (feedback: FeedbackLog[]) => void;
}

export const TestingTab: React.FC<TestingTabProps> = ({
  metadata,
  testers,
  feedback,
  onTestersChange,
  onFeedbackChange,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'calendar' | 'email' | 'feedback'>('roster');
  
  // New Tester Form
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDevice, setNewDevice] = useState<'Android Phone' | 'Android Tablet' | 'Android emulator'>('Android Phone');
  
  // Feedback Form
  const [fbTester, setFbTester] = useState('');
  const [fbRating, setFbRating] = useState(5);
  const [fbComment, setFbComment] = useState('');

  // Email state
  const [selectedTemplate, setSelectedTemplate] = useState('group_invite');
  const [selectedEmailTester, setSelectedEmailTester] = useState<string>('');

  // Day selection for Calendar
  const [selectedDayIndex, setSelectedDayIndex] = useState(9); // defaults to day 10 for simulated activity

  const [isDangerModalOpen, setIsDangerModalOpen] = useState(false);

  // Pre-seed helper to instantly fill or clear
  const clearRoster = () => {
    onTestersChange([]);
  };

  const handleAddTester = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newT: Tester = {
      id: `tester_${Date.now()}`,
      name: newName,
      email: newEmail,
      deviceType: newDevice,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      checkInDates: [new Date().toISOString().split('T')[0]] // Active on day 1
    };

    onTestersChange([...testers, newT]);
    setNewName('');
    setNewEmail('');
  };

  const deleteTester = (id: string) => {
    onTestersChange(testers.filter(t => t.id !== id));
  };

  const addFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbTester || !fbComment) return;

    const newFb: FeedbackLog = {
      id: `fb_${Date.now()}`,
      testerName: fbTester,
      testerEmail: testers.find(t => t.name === fbTester)?.email || 'tester@gmail.com',
      date: new Date().toISOString().split('T')[0],
      rating: fbRating,
      comment: fbComment,
      status: 'Open'
    };

    onFeedbackChange([newFb, ...feedback]);
    setFbComment('');
  };

  const toggleCheckInDateForTester = (testerId: string, dayDate: string) => {
    const updated = testers.map(t => {
      if (t.id === testerId) {
        const hasDate = t.checkInDates.includes(dayDate);
        return {
          ...t,
          checkInDates: hasDate 
            ? t.checkInDates.filter(d => d !== dayDate) 
            : [...t.checkInDates, dayDate]
        };
      }
      return t;
    });
    onTestersChange(updated);
  };

  // Generate sequence of dates representing the 14 days campaign
  const campaignStartDate = '2026-06-01';
  const getCampaignDateString = (dayIndex: number) => {
    const start = new Date(campaignStartDate);
    start.setDate(start.getDate() + dayIndex);
    return start.toISOString().split('T')[0];
  };

  // Helper: check if a tester was checked in on a specific campaign day
  const isTesterActiveOnDay = (tester: Tester, dayIndex: number) => {
    const targetDate = getCampaignDateString(dayIndex);
    return tester.checkInDates.includes(targetDate);
  };

  // Compute metric calculations
  const calculateDailyTestActivity = () => {
    const dailyStatus = [];
    for (let i = 0; i < 14; i++) {
      const dateStr = getCampaignDateString(i);
      const activeCount = testers.filter(t => t.checkInDates.includes(dateStr)).length;
      dailyStatus.push({
        dayIndex: i + 1,
        date: dateStr,
        count: activeCount,
        isValid: activeCount >= 20 // Google mandates at least 20 active testers
      });
    }
    return dailyStatus;
  };

  const dailyStats = calculateDailyTestActivity();
  const validStreakDays = dailyStats.filter(d => d.isValid).length;
  // Check continuous streak of valid days
  let continuousValidStreak = 0;
  for (let i = 0; i < 14; i++) {
    if (dailyStats[i].isValid) {
      continuousValidStreak = i + 1;
    } else {
      break; // Resets if continuous chain is broken
    }
  }

  // Pre-seed complete check-ins for day index 1 to 14 to simulate success demo
  const simulatePerfectCampaign = () => {
    const updated = testers.map(t => {
      const dates = [];
      for (let i = 0; i < 14; i++) {
        dates.push(getCampaignDateString(i));
      }
      return {
        ...t,
        status: 'Active' as const,
        checkInDates: dates
      };
    });
    onTestersChange(updated);
  };

  // Get formatted Email body based on template selection and selected tester
  const getFilteredEmailTemplate = () => {
    const template = EMAIL_TEMPLATES.find(t => t.id === selectedTemplate);
    if (!template) return { subject: '', body: '' };

    const selectedTesterObj = testers.find(t => t.id === selectedEmailTester) || testers[0] || { name: 'Alex Johnson', email: 'alex@gmail.com' };
    const appShort = metadata.title.toLowerCase().replace(/\s+/g, '');
    const appDomain = metadata.title.toLowerCase().replace(/\s+/g, '_');

    let parsedSubject = template.subject
      .replace(/{AppName}/g, metadata.title || 'My App')
      .replace(/{TesterName}/g, selectedTesterObj.name)
      .replace(/{TesterEmail}/g, selectedTesterObj.email)
      .replace(/{AppShort}/g, appShort)
      .replace(/{AppDomain}/g, appDomain)
      .replace(/{DayIndex}/g, '1')
      .replace(/{DeveloperName}/g, 'Lead Developer');

    let parsedBody = template.body
      .replace(/{AppName}/g, metadata.title || 'My App')
      .replace(/{TesterName}/g, selectedTesterObj.name)
      .replace(/{TesterEmail}/g, selectedTesterObj.email)
      .replace(/{AppShort}/g, appShort)
      .replace(/{AppDomain}/g, appDomain)
      .replace(/{DayIndex}/g, '1')
      .replace(/{DeveloperName}/g, 'Lead Developer');

    return { subject: parsedSubject, body: parsedBody };
  };

  const emailContents = getFilteredEmailTemplate();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  return (
    <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm" id="testing-section">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-100 pb-4 mb-6">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <Users className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-zinc-900 font-sans">Closed Testing Coordinator (20 Testers • 14 Days)</h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={simulatePerfectCampaign}
            className="text-[10px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1.5 font-bold"
          >
            <Sparkles className="w-3.5 h-3.5" /> Simulate Day 1-14 Logs
          </button>
          <button
            type="button"
            onClick={() => setIsDangerModalOpen(true)}
            className="text-[10px] bg-red-50 text-red-750 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-100 text-red-700 flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Roster
          </button>
        </div>
      </div>

      <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
        Google mandates that new personal developer accounts conduct a closed test using <strong>at least 20 testers</strong> who must be opted-in and remain active for <span className="text-zinc-800 font-bold">14 continuous days</span> or else the campaign resets! Follow this checklist to recruit and log daily feedback.
      </p>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-50 border border-zinc-150 p-4 rounded-xl text-left">
          <span className="block text-[9px] uppercase font-bold text-zinc-400">Total Testers Enrolled</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-black text-zinc-800">{testers.length}</span>
            <span className="text-xs text-zinc-500 font-bold">/ 20 required</span>
          </div>
          <div className="mt-1">
            {testers.length >= 20 ? (
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">✓ Roster size passes</span>
            ) : (
              <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">⚠️ Needs {20 - testers.length} more testers</span>
            )}
          </div>
        </div>

        <div className="bg-zinc-50 border border-zinc-150 p-4 rounded-xl text-left">
          <span className="block text-[9px] uppercase font-bold text-zinc-400">Continuous Testing Streak</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-black text-zinc-800">{continuousValidStreak}</span>
            <span className="text-xs text-zinc-500 font-bold">/ 14 continuous days</span>
          </div>
          <div className="mt-1">
            {continuousValidStreak === 14 ? (
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">✓ Closed Testing fully compliant!</span>
            ) : (
              <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">⏱️ Active streak is {continuousValidStreak} days</span>
            )}
          </div>
        </div>

        <div className="bg-zinc-50 border border-zinc-150 p-4 rounded-xl text-left">
          <span className="block text-[9px] uppercase font-bold text-zinc-400">Average Build Feedback Rating</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-black text-zinc-800">
              {feedback.length > 0 ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1) : 'No Ratings'}
            </span>
            <span className="text-xs text-zinc-500 font-bold">★ / 5.0</span>
          </div>
          <p className="text-[10px] text-zinc-400 mt-1 truncate">{feedback.length} tester responses logged</p>
        </div>
      </div>

      {/* Sub tabs navigation */}
      <div className="flex border-b border-zinc-100 gap-1 mb-6">
        {[
          { tab: 'roster', label: 'Roster Directory', icon: <Users className="w-3.5 h-3.5" /> },
          { tab: 'calendar', label: '14-Day Calendar Matrix', icon: <Calendar className="w-3.5 h-3.5" /> },
          { tab: 'email', label: 'Invite Outreach Emailer', icon: <Mail className="w-3.5 h-3.5" /> },
          { tab: 'feedback', label: 'Testing Feedback (Play Console)', icon: <FileText className="w-3.5 h-3.5" /> }
        ].map((item) => (
          <button
            key={item.tab}
            type="button"
            onClick={() => setActiveSubTab(item.tab as any)}
            className={`py-3 px-4 text-xs font-bold transition-all flex items-center gap-1 border-b-2 cursor-pointer ${
              activeSubTab === item.tab 
                ? 'border-indigo-600 bg-indigo-50/20 text-indigo-700' 
                : 'border-transparent text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700'
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB PANELS */}
      
      {/* 1. ROSTER */}
      {activeSubTab === 'roster' && (
        <div className="space-y-6">
          <form onSubmit={handleAddTester} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-zinc-50 p-4 rounded-xl border border-zinc-150">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Tester Name</label>
              <input 
                type="text" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Rachel Green"
                className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Email Account</label>
              <input 
                type="email" 
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Google Account Email"
                className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Device Platform</label>
              <select
                value={newDevice}
                onChange={(e) => setNewDevice(e.target.value as any)}
                className="w-full text-xs p-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
              >
                <option value="Android Phone">Android Phone</option>
                <option value="Android Tablet">Android Tablet</option>
                <option value="Android emulator">Emulator</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Tester
              </button>
            </div>
          </form>

          <div className="overflow-x-auto rounded-xl border border-zinc-150">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-50 text-zinc-500 border-b border-zinc-155 font-bold uppercase tracking-tight text-[10px]">
                  <th className="p-3">Tester Profile</th>
                  <th className="p-3">Email Contact</th>
                  <th className="p-3">Device Platform</th>
                  <th className="p-3">Testing Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {testers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-400 font-mono text-[11px]">
                      🫙 Roster empty. Use generators to seed mock testers for testing compliance validation!
                    </td>
                  </tr>
                ) : (
                  testers.map((t) => (
                    <tr key={t.id} className="hover:bg-zinc-50/50">
                      <td className="p-3 font-semibold text-zinc-800">{t.name}</td>
                      <td className="p-3 text-zinc-500 truncate max-w-[150px]">{t.email}</td>
                      <td className="p-3 text-zinc-500 font-mono text-[11px]">{t.deviceType}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-755 border border-indigo-100">
                          {t.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => deleteTester(t.id)}
                          className="p-1 text-zinc-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. CALENDAR TRACKING GRID */}
      {activeSubTab === 'calendar' && (
        <div className="space-y-6">
          <div className="p-4 bg-indigo-50 rounded-xl flex items-start gap-3 border border-indigo-150">
            <Calendar className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-900 leading-relaxed">
              <strong>Google Play Rule Tracker:</strong> Minimum 20 opted-in testers must check in for 14 calendar days continuously. Click on days below to inspect tester activity of that simulated release date.
            </div>
          </div>

          {/* Sequential 14 days grid */}
          <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
            {dailyStats.map((day) => {
              const isSelected = selectedDayIndex === day.dayIndex - 1;
              return (
                <button
                  key={day.dayIndex}
                  type="button"
                  onClick={() => setSelectedDayIndex(day.dayIndex - 1)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected 
                      ? 'bg-zinc-900 text-white border-zinc-950 shadow' 
                      : day.isValid
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-800 hover:bg-emerald-100/50'
                        : 'bg-zinc-55 bg-zinc-50 border-zinc-150 text-zinc-650 hover:bg-zinc-100'
                  }`}
                >
                  <span className="block text-[10px] uppercase font-bold text-zinc-400">Day {day.dayIndex}</span>
                  <span className="block text-[11px] font-semibold truncate leading-tight">{day.date}</span>
                  <div className="flex items-center justify-between mt-2 flex-wrap">
                    <span className="text-xs font-black font-sans shrink-0">{day.count} active</span>
                    <span className={`text-[9px] font-bold px-1 py-0.5 rounded shrink-0 ${
                      day.isValid ? 'bg-emerald-500/20 text-emerald-600' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {day.isValid ? 'Valid' : 'Warning'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected calendar day's tester checklist */}
          <div className="border border-zinc-150 rounded-xl p-5 bg-zinc-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-3 mb-4 flex-wrap">
              <div>
                <h3 className="text-sm font-bold text-zinc-800">Check-in Registry</h3>
                <span className="text-xs text-zinc-400">Day {selectedDayIndex + 1} ({getCampaignDateString(selectedDayIndex)})</span>
              </div>
              <div className="text-right mt-2 sm:mt-0">
                <span className="text-xs font-black text-zinc-700 block">
                  Checked-in Testers: {testers.filter(t => isTesterActiveOnDay(t, selectedDayIndex)).length}/{testers.length}
                </span>
                <span className="text-[10px] text-zinc-500 block">Need at least 20 checklist inclusions for success</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-h-[250px] overflow-y-auto">
              {testers.length === 0 ? (
                <div className="col-span-3 text-center py-6 font-mono text-[10px] text-zinc-400">
                  Roster is empty. Add testers first!
                </div>
              ) : (
                testers.map((t) => {
                  const isActive = isTesterActiveOnDay(t, selectedDayIndex);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleCheckInDateForTester(t.id, getCampaignDateString(selectedDayIndex))}
                      className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all ${
                        isActive 
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800 font-medium' 
                          : 'border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-500'
                      }`}
                    >
                      <div className="text-left font-sans text-xs truncate max-w-[130px]">
                        <strong>{t.name}</strong>
                        <span className="block text-[9px] opacity-70">{t.email}</span>
                      </div>
                      <span className={`text-[10px] font-black ${isActive ? 'text-emerald-600' : 'text-zinc-300'}`}>
                        {isActive ? 'Active ✓' : 'Inactive'}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. EMAIL PREVIEWER */}
      {activeSubTab === 'email' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1 border border-zinc-150 p-4 rounded-xl space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">1. Select Email Template</label>
                {EMAIL_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={`w-full p-2.5 rounded-lg border text-xs font-bold text-left mb-2 transition-all ${
                      selectedTemplate === tpl.id 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                        : 'border-zinc-200 bg-white text-zinc-650 hover:bg-zinc-50'
                    }`}
                  >
                    {tpl.id === 'group_invite' ? 'Google Group Initial Invite' : 'Testing Daily reminder'}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">2. Targeting Tester</label>
                <select
                  value={selectedEmailTester}
                  onChange={(e) => setSelectedEmailTester(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-zinc-200 rounded-lg text-zinc-800 font-bold focus:outline-none"
                >
                  <option value="">-- Choose Tester --</option>
                  {testers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2 border border-zinc-150 rounded-xl overflow-hidden shadow-inner bg-zinc-50 p-5 space-y-4 relative">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Copy outreach email</span>
                <span className="text-[10px] text-zinc-400 font-mono">Dynamic Merge Tags Applied</span>
              </div>

              {/* Subject */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Subject Line</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(emailContents.subject, 'Subject')}
                    className="p-1 px-2 border border-zinc-300 rounded text-[10px] font-bold bg-white text-zinc-700 hover:bg-zinc-100 flex items-center gap-1 shrink-0"
                  >
                    <Clipboard className="w-3 h-3" /> Copy
                  </button>
                </div>
                <div className="p-2.5 bg-white rounded border border-zinc-150 text-xs font-bold text-zinc-800">
                  {emailContents.subject || 'Select a tester and template first.'}
                </div>
              </div>

              {/* Body */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Email Content Body</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(emailContents.body, 'Email Body')}
                    className="p-1 px-2 border border-zinc-300 rounded text-[10px] font-bold bg-white text-zinc-700 hover:bg-zinc-100 flex items-center gap-1 shrink-0"
                  >
                    <Clipboard className="w-3 h-3" /> Copy
                  </button>
                </div>
                <pre className="p-4 bg-white rounded border border-zinc-150 text-xs text-zinc-700 leading-relaxed font-sans whitespace-pre-wrap max-h-[220px] overflow-y-auto">
                  {emailContents.body || 'Select a template and tester.'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. FEEDBACK & BUG TRACKER */}
      {activeSubTab === 'feedback' && (
        <div className="space-y-6">
          <form onSubmit={addFeedback} className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-150">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Tester Selector</label>
              <select
                value={fbTester}
                onChange={(e) => setFbTester(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-zinc-200 rounded-lg focus:outline-none"
              >
                <option value="">-- Choose Tester --</option>
                {testers.map(t => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Rating Star (1 to 5)</label>
              <select
                value={fbRating}
                onChange={(e) => setFbRating(parseInt(e.target.value))}
                className="w-full text-xs p-2 bg-white border border-zinc-200 rounded-lg focus:outline-none"
              >
                <option value="5">★★★★★ (5 Stars)</option>
                <option value="4">★★★★☆ (4 Stars)</option>
                <option value="3">★★★☆☆ (3 Stars)</option>
                <option value="2">★★☆☆☆ (2 Stars)</option>
                <option value="1">★☆☆☆☆ (1 Star)</option>
              </select>
            </div>
            <div className="sm:col-span-2 flex items-end gap-2 text-left">
              <div className="w-full">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Tester Comment / Bug Log Description</label>
                <input 
                  type="text"
                  value={fbComment}
                  onChange={(e) => setFbComment(e.target.value)}
                  placeholder="e.g., Performance lags on older versions, layout is pixel perfect other than that."
                  className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="p-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Log
              </button>
            </div>
          </form>

          {/* Feedback log cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {feedback.map((fb) => (
              <div key={fb.id} className="p-4 border border-zinc-150 rounded-xl relative hover:border-zinc-300 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-left font-sans text-xs">
                      <strong className="block text-zinc-805 text-zinc-800">{fb.testerName}</strong>
                      <span className="block text-[10px] text-zinc-400">{fb.date}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-amber-500 font-bold text-xs">
                        {Array.from({length: fb.rating}, (_, i) => '★').join('')}
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        fb.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {fb.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-600 mt-2 italic font-sans leading-relaxed text-left">
                    "{fb.comment}"
                  </p>
                </div>

                <div className="flex gap-2 justify-end border-t border-zinc-100 pt-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = feedback.map(f => {
                        if (f.id === fb.id) {
                          return { ...f, status: f.status === 'Resolved' ? 'Open' as const : 'Resolved' as const };
                        }
                        return f;
                      });
                      onFeedbackChange(updated);
                    }}
                    className="p-1 px-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-[10px] rounded-lg font-bold text-zinc-650"
                  >
                    {fb.status === 'Resolved' ? 'Re-open' : 'Mark Resolved'}
                  </button>
                  <button
                    type="button"
                    className="p-1 text-zinc-400 hover:text-red-700 rounded"
                    onClick={() => onFeedbackChange(feedback.filter(f => f.id !== fb.id))}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <DangerZoneModal
        isOpen={isDangerModalOpen}
        onClose={() => setIsDangerModalOpen(false)}
        onConfirm={clearRoster}
        title="Clear Closed Tester Cohort"
        description="This will permanently delete the entire roster of testers enrolled in your closed testing release, instantly resetting your active 14-day continuous closed testing streak. This action is completely irreversible."
        confirmationWord="CLEAR COHORT"
        actionLabel="Permanently Delete Roster"
      />
    </div>
  );
};
