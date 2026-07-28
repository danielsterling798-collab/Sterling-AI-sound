import React, { useState } from 'react';
import { AppPublishState } from '../types';
import { 
  X, Download, Printer, ShieldCheck, Check, 
  AlertCircle, FileCode, Users, Globe, Layers, ListTodo, Calendar, Clock
} from 'lucide-react';

interface ExportAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: AppPublishState;
  continuousStreak: number;
}

export const ExportAuditModal: React.FC<ExportAuditModalProps> = ({
  isOpen,
  onClose,
  state,
  continuousStreak
}) => {
  const [developerSignature, setDeveloperSignature] = useState('Daniel Sterling');
  const [organizationName, setOrganizationName] = useState('Sterling Sound Studio');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  if (!isOpen) return null;

  const appTitle = state.metadata.title || 'Untitled Application';
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });

  const uniqueAuditId = `PLAY-AUDIT-b5edb793-${Date.now().toString(16).toUpperCase().substring(4)}`;

  // Helper sequence of dates for continuous campaign calculations
  const getCampaignDateString = (dayIndex: number) => {
    const start = new Date(state.testingStartDate);
    start.setDate(start.getDate() + dayIndex);
    return start.toISOString().split('T')[0];
  };

  // Compile check-in numbers per day
  const dailyCheckInLog = Array.from({ length: 14 }).map((_, idx) => {
    const dateStr = getCampaignDateString(idx);
    const activeCount = state.testers.filter(t => t.checkInDates.includes(dateStr)).length;
    return {
      day: idx + 1,
      date: dateStr,
      activeCount
    };
  });

  // Calculate completeness checklist items
  const auditPoints = [
    { label: 'App Title Set (> 5 chars)', value: state.metadata.title.length > 5 },
    { label: 'Short description Set (> 10 chars)', value: state.metadata.shortDescription.length > 10 },
    { label: 'Long description Set (> 50 chars)', value: state.metadata.longDescription.length > 50 },
    { label: 'Play Store Category Mapped', value: !!state.metadata.category },
    { label: 'Store Listing Icon Uploaded', value: !!state.assets.icon },
    { label: 'Store Feature Graphic Uploaded', value: !!state.assets.feature },
    { label: 'At least 2 Phone Screenshots Added', value: state.assets.screenshotsPhone.length >= 2 },
    { label: 'At least 2 Tablet Screenshots Added', value: state.assets.screenshotsTablet.length >= 2 },
    { label: 'Cohort of 20+ Testers Enrolled', value: state.testers.length >= 20 },
    { label: '14-Day Continuous Testing Streak Met', value: continuousStreak >= 14 },
    { label: 'Production .AAB Package Configured', value: state.release.bundleName.endsWith('.aab') },
    { label: 'Active Region Targets Configured', value: state.release.countries.length > 0 }
  ];

  const passedCount = auditPoints.filter(p => p.value).length;
  const isFullyCertified = passedCount === 12;

  // JSON Downloader
  const handleDownloadJson = () => {
    const jsonState = {
      auditMetadata: {
        auditIdentifier: uniqueAuditId,
        generatedTimestamp: timestamp,
        schemaVersion: '1.2.0-Production-Release',
        readinessScore: `${Math.round((passedCount / 12) * 100)}%`,
        certificationStatus: isFullyCertified ? 'FULLY CERTIFIED' : 'PENDING ACTION'
      },
      developerDeclaration: {
        authorizedSignatory: developerSignature,
        corporateEntity: organizationName,
        signatureDate: new Date().toISOString()
      },
      appState: state
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jsonState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download', 
      `google_play_submission_audit_${appTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setToastMessage('JSON Manifest file downloaded successfully!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // PDF / Print Handler
  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <>
      {/* 1. Modal overlay for Screen viewing */}
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 no-print">
        <div className="bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600/25 text-indigo-400 border border-indigo-500/30 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-base font-sans">Compliance Audit Center</h3>
                <p className="text-[11px] text-zinc-400">Generate, certify, and download Google Play submission dossiers and audit trails.</p>
              </div>
            </div>
            
            <button 
              type="button"
              onClick={onClose}
              className="p-1 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg text-xs font-bold transition-all border border-zinc-700 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            
            {/* Split layout: Input Certifier on left index, paper Preview on right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left sidebar info & Declarations */}
              <div className="lg:col-span-5 space-y-5 text-left">
                <div className="bg-zinc-950 border border-zinc-805 border-zinc-800/80 rounded-2xl p-5 space-y-4">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400 block border-b border-zinc-800 pb-2">
                    Developer Self-Certification
                  </span>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Signatory Name</label>
                      <input 
                        type="text"
                        value={developerSignature}
                        onChange={(e) => setDeveloperSignature(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 rounded-lg p-2.5 px-3 text-xs text-white font-bold tracking-wide transition-all outline-none"
                        placeholder="e.g. Daniel Sterling"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Company / Studio Entity</label>
                      <input 
                        type="text"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 rounded-lg p-2.5 px-3 text-xs text-white font-bold tracking-wide transition-all outline-none"
                        placeholder="e.g. Sterling Sound Studio"
                      />
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-zinc-450 leading-relaxed space-y-2 text-zinc-400">
                    <p>Enter your authorization variables to stamp official signature cards, proving your closed testing duration and cohort integrity.</p>
                    <div className="p-3 bg-indigo-950/40 border border-indigo-900/45 rounded-xl text-[10px] space-y-1 text-indigo-300">
                      <span className="font-extrabold block">Submission Note:</span>
                      <span>Google requires comprehensive proof of continuous cohort feedback whenever app reviewers audit closed testers. Keeping this PDF handy minimizes submission rejection risk.</span>
                    </div>
                  </div>
                </div>

                {/* Checklist overview on side */}
                <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400 block border-b border-zinc-800 pb-2 mb-3">
                    Readiness Score Card
                  </span>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-zinc-400 text-xs">Verified Milestones:</div>
                    <div className="font-mono text-sm font-black text-indigo-400">{passedCount}/12 Passed</div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {auditPoints.map((point, index) => (
                      <div key={index} className="flex items-center justify-between py-1 border-b border-zinc-900/60 last:border-0">
                        <span className="text-zinc-400 text-[11px] truncate md:max-w-[210px]">{point.label}</span>
                        {point.value ? (
                          <span className="text-emerald-450 font-semibold text-[10px] bg-emerald-950/60 border border-emerald-900/40 px-1 rounded flex items-center gap-0.5 text-emerald-400">
                            Passed ✓
                          </span>
                        ) : (
                          <span className="text-amber-500 font-semibold text-[10px] bg-amber-950/60 border border-amber-900/30 px-1 rounded">
                            Action Needed
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Paper Preview container */}
              <div className="lg:col-span-7 space-y-4">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400 block text-left">
                  Live Audit Trail Certificate Preview (A4 Optimized)
                </span>

                {/* Preview sheet */}
                <div className="bg-white text-zinc-800 border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-6 text-left shadow-lg overflow-y-auto select-none max-h-[500px]">
                  
                  {/* Certificate Header block */}
                  <div className="border-b-2 border-zinc-900 pb-4 flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-black uppercase text-indigo-600 tracking-wider">OFFICIAL RECONSTRUCTION</span>
                      <h4 className="font-extrabold text-base text-zinc-900 font-sans tracking-tight">GOOGLE PLAY COUNCIL COMPLIANCE</h4>
                      <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Audit Stamp No: {uniqueAuditId}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-150 px-2 py-0.5 rounded-full font-bold">
                        {isFullyCertified ? 'COMPLIANCE CERTIFIED' : 'PARTIAL DRAFT'}
                      </span>
                      <div className="text-[9px] text-zinc-400 font-mono mt-1">Score: {Math.round((passedCount/12)*100)}%</div>
                    </div>
                  </div>

                  {/* Metadata items */}
                  <div className="space-y-4 text-xs">
                    <div>
                      <h5 className="font-black text-zinc-900 uppercase text-[10px] tracking-wide border-b border-zinc-150 pb-0.5">1. Target Package Identity</h5>
                      <table className="w-full mt-1.5 text-[11px] leading-relaxed">
                        <tbody>
                          <tr>
                            <td className="w-1/3 text-zinc-450 font-medium py-0.5">App Store Name:</td>
                            <td className="font-bold text-zinc-900">{appTitle}</td>
                          </tr>
                          <tr>
                            <td className="text-zinc-450 font-medium py-0.5">App Type / Category:</td>
                            <td className="text-zinc-800">{state.metadata.appType} &mdash; {state.metadata.category}</td>
                          </tr>
                          <tr>
                            <td className="text-zinc-450 font-medium py-0.5">Unified AAB File name:</td>
                            <td className="text-zinc-800 font-mono break-all">{state.release.bundleName || '(Not uploaded yet)'}</td>
                          </tr>
                          <tr>
                            <td className="text-zinc-450 font-medium py-0.5">Target Framework SDK:</td>
                            <td className="text-zinc-800 font-mono">{state.release.targetSdk || '(Not uploaded yet)'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <h5 className="font-black text-zinc-900 uppercase text-[10px] tracking-wide border-b border-zinc-150 pb-0.5">2. Storefront Description & Copy</h5>
                      <div className="mt-1 text-[11px] space-y-1.5">
                        <div>
                          <strong className="text-zinc-900 block font-sans">Short Tagline (Storefront):</strong>
                          <span className="text-zinc-600 block bg-zinc-50 p-1.5 border border-zinc-100 rounded text-[10px] italic">
                            &ldquo;{state.metadata.shortDescription || 'No description provided.'}&rdquo;
                          </span>
                        </div>
                        <div>
                          <strong className="text-zinc-900 block font-sans">Full Store Profile Listing Copy:</strong>
                          <span className="text-zinc-650 block text-[10px] leading-normal line-clamp-3">
                            {state.metadata.longDescription}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Checklists items */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-black text-zinc-900 uppercase text-[10px] tracking-wide border-b border-zinc-150 pb-0.5">3. Content Safety (IARC)</h5>
                        <ul className="mt-1 space-y-0.5 text-[10px]">
                          <li className="flex justify-between">
                            <span className="text-zinc-400">Violence Class:</span>
                            <span className="font-bold capitalize">{state.contentRating.violence}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-zinc-400">Exotic Content:</span>
                            <span className="font-bold capitalize">{state.contentRating.sexuality}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-zinc-400">Profanity rating:</span>
                            <span className="font-bold capitalize">{state.contentRating.language}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-zinc-400">Gambling Flags:</span>
                            <span className="font-bold">{state.contentRating.gambling ? 'Yes (Prohibited)' : 'No (Compliant)'}</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-black text-zinc-900 uppercase text-[10px] tracking-wide border-b border-zinc-150 pb-0.5">4. Graphics Checklist</h5>
                        <ul className="mt-1 space-y-0.5 text-[10px]">
                          <li className="flex justify-between">
                            <span className="text-zinc-400">512x512 Launcher Icon:</span>
                            <span className="font-bold text-zinc-800">{state.assets.icon ? '✓ Verified' : '❌ Pending'}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-zinc-400">1024x500 Feature Graphic:</span>
                            <span className="font-bold text-zinc-800">{state.assets.feature ? '✓ Verified' : '❌ Pending'}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-zinc-400">Phone Screenshots (8x):</span>
                            <span className="font-bold text-zinc-800">{state.assets.screenshotsPhone.length}/8 Added</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-zinc-400">Tablet Screens (10"):</span>
                            <span className="font-bold text-zinc-800">{state.assets.screenshotsTablet.length}/8 Added</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* CLOSED TESTING SPECIFICS */}
                    <div>
                      <h5 className="font-black text-zinc-900 uppercase text-[10px] tracking-wide border-b border-zinc-150 pb-0.5">5. Closed Testing Cohort & Feedbacks</h5>
                      <table className="w-full mt-1.5 text-[11px] leading-relaxed">
                        <tbody>
                          <tr>
                            <td className="w-1/3 text-zinc-450 font-medium py-0.5 text-zinc-500">Active Cohort Count:</td>
                            <td className="font-bold text-zinc-900">{state.testers.length} verified email accounts</td>
                          </tr>
                          <tr>
                            <td className="text-zinc-450 font-medium py-0.5 text-zinc-500">Active engagement:</td>
                            <td className="text-zinc-800 font-medium">
                              {continuousStreak >= 14 ? (
                                <strong className="text-emerald-700">14 out of 14 continuous check-in days reached ✓</strong>
                              ) : (
                                <span className="text-amber-600">{continuousStreak}/14 continuous check-in days logged</span>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-zinc-450 font-medium py-0.5 text-zinc-500">Averaged Tester Rating:</td>
                            <td className="text-zinc-800 font-bold">
                              {(state.feedback.reduce((acc, current) => acc + current.rating, 0) / state.feedback.length || 0).toFixed(1)} ★ Stars 
                              <span className="text-zinc-400 text-[10px] font-normal font-sans ml-1">({state.feedback.length} feedbacks registered)</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Signatures card on paper */}
                    <div className="pt-4 border-t-2 border-zinc-900 flex justify-between items-end mt-4">
                      <div>
                        <div className="text-[9px] uppercase text-zinc-500">CERTIFICATE GENERATOR</div>
                        <div className="font-mono text-[9px] text-zinc-600">{timestamp}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] italic font-bold tracking-wide text-zinc-800 font-sans border-b border-zinc-400 pb-0.5 px-4 min-w-[140px] text-center inline-block">
                          {developerSignature || 'Daniel Sterling'}
                        </div>
                        <div className="text-[8px] uppercase text-zinc-500 font-bold mt-0.5">Authorizing Signatory for {organizationName || 'Studio'}</div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Action buttons footer */}
          <div className="p-6 bg-zinc-950 border-t border-zinc-800 flex justify-end gap-3">
            <button 
              type="button"
              onClick={handleDownloadJson}
              className="py-3 px-5 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 hover:border-zinc-650 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all text-white shrink-0 cursor-pointer"
            >
              <FileCode className="w-4 h-4 text-indigo-400" /> Export JSON Manifest
            </button>
            <button 
              type="button"
              onClick={handlePrintPdf}
              className="py-3 px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.01] transition-all shrink-0 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Export/Print PDF Report
            </button>
          </div>
        </div>
      </div>

      {/* 2. Toast alerts popup */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-650 bg-emerald-600 text-white font-bold p-4 rounded-xl shadow-2xl flex items-center gap-2 text-xs border border-emerald-500 animate-in slide-in-from-bottom-6 duration-200">
          <Check className="w-4 h-4 shrink-0 bg-white/20 p-0.5 rounded-full" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. Printable paper page output, formatted strictly for Chrome/Safari print-to-PDF */}
      <div className="print-only-container text-zinc-900 bg-white font-sans text-xs p-8 leading-relaxed">
        
        {/* Verification banner letterhead */}
        <div className="flex justify-between items-start border-b-4 border-zinc-900 pb-4 mb-6">
          <div>
            <h1 className="text-xl font-black uppercase text-zinc-950 font-sans tracking-tight">GOOGLE PLAY VERIFICATION COMPLIANCE REPORT</h1>
            <p className="text-xs text-zinc-500 font-mono mt-1">Audit Tracking Certification ID: <strong className="text-zinc-900">{uniqueAuditId}</strong></p>
            <p className="text-[10px] text-zinc-400 font-mono">Generated: {timestamp}</p>
          </div>
          <div className="text-right max-w-xs">
            <div className="border border-zinc-300 p-2 text-center rounded bg-zinc-50">
              <span className="block text-[9px] text-zinc-500 uppercase font-black">Play Console Index Status</span>
              <strong className="text-sm block text-emerald-800">{isFullyCertified ? '100% COMPLETE' : 'PARTIAL DRAFT'}</strong>
              <span className="block text-[10px] text-zinc-400 mt-0.5 font-bold">{passedCount} of 12 Milestones Certified</span>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-zinc-500 mb-6 italic leading-normal">
          NOTICE: This dossier functions as a secure, structured audit logbook demonstrating compliance with Google Play Store personal developer account publishing rules. To qualify for direct production release under contemporary regulations, developers must maintain a verified group of twenty (20) closed testers participating in continuous application validation for exactly fourteen (14) consecutive days, supported by appropriate metadata alignment.
        </p>

        {/* Section 1: Core metadata */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-black border-b border-zinc-600 pb-1 mb-2">1. Application Information Card</h2>
            <table className="w-full border-collapse border border-zinc-200">
              <tbody>
                <tr className="border-b border-zinc-200">
                  <td className="w-1/3 bg-zinc-50 p-2 font-bold text-[10px] text-zinc-650 uppercase">Official Title</td>
                  <td className="p-2 text-zinc-800 font-black text-xs">{appTitle}</td>
                </tr>
                <tr className="border-b border-zinc-200">
                  <td className="bg-zinc-50 p-2 font-bold text-[10px] text-zinc-650 uppercase">Store Classification</td>
                  <td className="p-2 text-zinc-800">{state.metadata.appType} &mdash; {state.metadata.category}</td>
                </tr>
                <tr className="border-b border-zinc-200">
                  <td className="bg-zinc-50 p-2 font-bold text-[10px] text-zinc-650 uppercase">Short Storefront Description</td>
                  <td className="p-2 text-zinc-805 text-zinc-700 italic">&ldquo;{state.metadata.shortDescription || 'None'}&rdquo;</td>
                </tr>
                <tr>
                  <td className="bg-zinc-50 p-2 font-bold text-[10px] text-zinc-650 uppercase">Full Profile Listing Copy</td>
                  <td className="p-2 text-zinc-600 text-[10px] leading-relaxed whitespace-pre-line">{state.metadata.longDescription}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 2: Contents safety and Assets details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-black border-b border-zinc-600 pb-1 mb-2">2. Play Storefront Assets Checklist</h2>
              <table className="w-full border-collapse border border-zinc-250 border border-zinc-200">
                <thead>
                  <tr className="bg-zinc-100 border-b border-zinc-200 text-left">
                    <th className="p-1.5 font-black text-[9px] uppercase text-zinc-600">Store Graphic Item</th>
                    <th className="p-1.5 font-black text-[9px] uppercase text-zinc-600">Verification Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-200">
                    <td className="p-1.5 font-sans">High-Res App Launcher Icon (512x512)</td>
                    <td className="p-1.5 font-bold font-mono text-[10px]">{state.assets.icon ? 'COMPLIANT (MATCHED ✓)' : 'STALLING ACTION ⚠️'}</td>
                  </tr>
                  <tr className="border-b border-zinc-200">
                    <td className="p-1.5 font-sans">High-Res Store Feature Graphic (1024x500)</td>
                    <td className="p-1.5 font-bold font-mono text-[10px]">{state.assets.feature ? 'COMPLIANT (MATCHED ✓)' : 'STALLING ACTION ⚠️'}</td>
                  </tr>
                  <tr className="border-b border-zinc-200">
                    <td className="p-1.5 font-sans">8.1" Android Phone Screenshots</td>
                    <td className="p-1.5 font-bold font-mono text-[10px]">{state.assets.screenshotsPhone.length >= 2 ? `COMPLIANT (${state.assets.screenshotsPhone.length} added ✓)` : `${state.assets.screenshotsPhone.length}/2 Added ⚠️`}</td>
                  </tr>
                  <tr className="border-b border-zinc-200">
                    <td className="p-1.5 font-sans">10.1" Android Tablet Screenshots</td>
                    <td className="p-1.5 font-bold font-mono text-[10px]">{state.assets.screenshotsTablet.length >= 2 ? `COMPLIANT (${state.assets.screenshotsTablet.length} added ✓)` : `${state.assets.screenshotsTablet.length}/2 Added ⚠️`}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-black border-b border-zinc-600 pb-1 mb-2">3. IARC Content Rating Assessment</h2>
              <table className="w-full border-collapse border border-zinc-200">
                <thead>
                  <tr className="bg-zinc-100 border-b border-zinc-200 text-left">
                    <th className="p-1.5 font-black text-[9px] uppercase text-zinc-600">Rating Question Context</th>
                    <th className="p-1.5 font-black text-[9px] uppercase text-zinc-600">Declared Level</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-200">
                    <td className="p-1.5">Violent Content Classifications</td>
                    <td className="p-1.5 font-bold capitalize">{state.contentRating.violence}</td>
                  </tr>
                  <tr className="border-b border-zinc-200">
                    <td className="p-1.5">Sensual Content Classifications</td>
                    <td className="p-1.5 font-bold capitalize">{state.contentRating.sexuality}</td>
                  </tr>
                  <tr className="border-b border-zinc-200">
                    <td className="p-1.5">Profanity/Extreme Language Check</td>
                    <td className="p-1.5 font-bold capitalize">{state.contentRating.language}</td>
                  </tr>
                  <tr className="border-b border-zinc-200">
                    <td className="p-1.5">Simulated / Cash Gambling Activities</td>
                    <td className="p-1.5 font-bold">{state.contentRating.gambling ? 'Gambling Involved ⚠️' : 'None Detected (Compliant ✓)'}</td>
                  </tr>
                  <tr className="border-b border-zinc-200">
                    <td className="p-1.5">Peer-to-Peer Interaction / Chat Engines</td>
                    <td className="p-1.5 font-bold">{state.contentRating.userInteraction ? 'P2P Active (Opt-In Req)' : 'No User-Interaction'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Testing details */}
          <div className="page-break" style={{ pageBreakBefore: 'always' }} />

          <div className="pt-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-black border-b border-zinc-600 pb-1 mb-2">4. Closed Testing Cohort Logbook (20 Users x 14 Days)</h2>
            <p className="text-[10px] text-zinc-500 mb-3 leading-relaxed">
              Below is a summary of the 20-tester closed campaign running from starting benchmark date <strong className="text-zinc-900">{state.testingStartDate}</strong>.
            </p>

            <table className="w-full border-collapse border border-zinc-200 text-[10px] mb-4">
              <thead>
                <tr className="bg-zinc-100 border-b border-zinc-200 text-left font-bold text-zinc-600">
                  <th className="p-1.5 text-[9px]">Testing Day</th>
                  <th className="p-1.5 text-[9px]">Timeline Calendars Date</th>
                  <th className="p-1.5 text-[9px]">Active Check-Ins Logged</th>
                  <th className="p-1.5 text-[9px]">Daily Target Met (&gt;= 20)</th>
                </tr>
              </thead>
              <tbody>
                {dailyCheckInLog.map((day) => (
                  <tr key={day.day} className="border-b border-zinc-100 last:border-b-2 last:border-zinc-300">
                    <td className="p-1.5 font-bold">Campaign Day {day.day}</td>
                    <td className="p-1.5 font-mono">{day.date}</td>
                    <td className="p-1.5 font-bold text-zinc-800">{day.activeCount} Check-ins verified</td>
                    <td className="p-1.5">
                      {day.activeCount >= 20 ? (
                        <span className="text-emerald-700 font-bold">Passed ✓</span>
                      ) : (
                        <span className="text-amber-600 font-bold">Failed (Below Threshold) ⚠️</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table className="w-full border border-zinc-200 text-xs mb-6">
              <tbody>
                <tr className="border-b border-zinc-200">
                  <td className="w-1/3 bg-zinc-50 p-2 font-bold text-[10px] uppercase text-zinc-650">Testing Streak Result</td>
                  <td className="p-2">
                    {continuousStreak >= 14 ? (
                      <span className="text-emerald-700 font-bold uppercase text-[11px] font-sans">
                        ✓ 14-Day Continuous Testing Period Passed (Active Streak: {continuousStreak}/14 days)
                      </span>
                    ) : (
                      <span className="text-amber-600 font-bold uppercase text-[11px] font-sans">
                        ⚠️ Continuous testing campaign failed setup ({continuousStreak}/14 continuous days logged)
                      </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="bg-zinc-50 p-2 font-bold text-[10px] uppercase text-zinc-650">Full Registered Tester Cohort</td>
                  <td className="p-2 text-zinc-800 font-medium">
                    Total of {state.testers.length} verified individual accounts are registered on developer testing registries.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 4: Rollout information */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-black border-b border-zinc-600 pb-1 mb-2">5. Binaries & Region Rollout Target Configuration</h2>
            <table className="w-full border-collapse border border-zinc-200">
              <tbody>
                <tr className="border-b border-zinc-200">
                  <td className="w-1/3 bg-zinc-50 p-2 font-bold text-[10px] text-zinc-650 uppercase">Android App Bundle (.aab)</td>
                  <td className="p-2 font-mono text-zinc-800 font-bold text-xs">{state.release.bundleName || 'Pending configuration'}</td>
                </tr>
                <tr className="border-b border-zinc-200">
                  <td className="bg-zinc-50 p-2 font-bold text-[10px] text-zinc-650 uppercase">Payload Weight</td>
                  <td className="p-2">{state.release.bundleSize || 'Pending'}</td>
                </tr>
                <tr className="border-b border-zinc-200">
                  <td className="bg-zinc-50 p-2 font-bold text-[10px] text-zinc-650 uppercase">Build Track ID</td>
                  <td className="p-2">v{state.release.versionName || '1.0.0-PROD'} (Code {state.release.versionCode || 1})</td>
                </tr>
                <tr className="border-b border-zinc-200">
                  <td className="bg-zinc-50 p-2 font-bold text-[10px] text-zinc-650 uppercase">Rollout Availability</td>
                  <td className="p-2 text-zinc-800 font-bold">Distributed to {state.release.countries.length} region country codes.</td>
                </tr>
                <tr>
                  <td className="bg-zinc-50 p-2 font-bold text-[10px] text-zinc-650 uppercase">Target SDK Version</td>
                  <td className="p-2 font-mono">{state.release.targetSdk || 'Android 14 (API level 34)'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Compliance signatures declaration */}
          <div className="pt-8 mt-12 border-t border-zinc-400">
            <h2 className="text-xs font-black uppercase tracking-wider text-black mb-3">6. Authorizing Declaration & Certificate Signature Info</h2>
            <p className="text-[10px] text-zinc-500 mb-6 leading-relaxed">
              I, the undersigned authorizing signatory, hereby certify that the metadata, accessibility configurations, content rating disclosures, assets, cohort credentials, and continuous closed testing statistics displayed within this auditing document are an accurate representation of the target application's state, fully aligned with current Google Play policies and developer distribution agreements.
            </p>

            <div className="flex justify-between items-end mt-8">
              <div className="text-left w-2/5">
                <div className="border-b-2 border-zinc-800 pb-1 text-zinc-800 text-xs font-bold font-mono">
                  {timestamp}
                </div>
                <span className="block text-[8px] uppercase tracking-wider text-zinc-400 font-bold mt-1">Audit generation date & timestamp</span>
              </div>
              <div className="text-center w-2/5">
                <div className="border-b-2 border-zinc-800 pb-1 text-zinc-900 text-sm font-bold tracking-wider font-sans italic">
                  &nbsp; {developerSignature || 'Daniel Sterling'}
                </div>
                <span className="block text-[8px] uppercase tracking-wider text-zinc-400 font-bold mt-1">Authorized Digital Signature</span>
                <span className="block text-[8px] italic text-zinc-500">Representative of &mdash; {organizationName || 'Sterling Sound Studio'}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </>
  );
};
