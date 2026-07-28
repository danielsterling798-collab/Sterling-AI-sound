import React, { useState } from 'react';
import { AppMetadata, ContentRatingAnswers } from '../types';
import { APP_CATEGORIES, GAME_CATEGORIES, PLAY_STORE_TAGS } from '../constants';
import { AlertTriangle, CheckCircle, Info, Sparkles, HelpCircle } from 'lucide-react';

interface MetadataTabProps {
  metadata: AppMetadata;
  onChange: (meta: AppMetadata) => void;
  contentRating: ContentRatingAnswers;
  onContentRatingChange: (cr: ContentRatingAnswers) => void;
}

export const MetadataTab: React.FC<MetadataTabProps> = ({
  metadata,
  onChange,
  contentRating,
  onContentRatingChange,
}) => {
  const [tagSearch, setTagSearch] = useState('');
  const [showRatingInfo, setShowRatingInfo] = useState(false);

  // Helper to trace marketing words discouraged on Play Store Metadata policies
  const checkMarketingTriggers = (text: string) => {
    const flags = ['free', 'best', '#1', 'no.1', 'top', 'discount', 'sale', 'offer', 'guaranteed', 'cheap', '100%'];
    const found = [];
    const lowerText = text.toLowerCase();
    for (const flag of flags) {
      if (lowerText.includes(flag)) {
        found.push(flag);
      }
    }
    // Check for excessive uppercase (more than 3 uppercase words)
    const upperWords = text.split(/\s+/).filter(w => w.length > 3 && w === w.toUpperCase() && /^[A-Z]+$/.test(w));
    if (upperWords.length >= 2) {
      found.push('EXCESSIVE_CAPS');
    }
    return found;
  };

  const titleTriggers = checkMarketingTriggers(metadata.title);
  const shortTriggers = checkMarketingTriggers(metadata.shortDescription);

  const handleTextChange = (key: keyof AppMetadata, value: any) => {
    onChange({
      ...metadata,
      [key]: value
    });
  };

  const toggleTag = (tag: string) => {
    const isSelected = metadata.tags.includes(tag);
    const updated = isSelected 
      ? metadata.tags.filter(t => t !== tag) 
      : metadata.tags.length < 5 
        ? [...metadata.tags, tag] 
        : metadata.tags;
    handleTextChange('tags', updated);
  };

  const getMaturityRating = () => {
    if (contentRating.violence === 'intense' || contentRating.sexuality === 'intense') {
      return { rating: 'PEGI 18 / ESRB Mature 17+', color: 'text-red-500 bg-red-500/10 border-red-500/20' };
    }
    if (contentRating.violence === 'moderate' || contentRating.sexuality === 'moderate') {
      return { rating: 'PEGI 12 / ESRB Teen', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
    }
    if (contentRating.violence === 'mild' || contentRating.sexuality === 'mild' || contentRating.language === 'mild') {
      return { rating: 'PEGI 7 / ESRB Everyone 10+', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' };
    }
    return { rating: 'PEGI 3 / ESRB Everyone', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
  };

  const activeRating = getMaturityRating();
  const categoriesPool = metadata.appType === 'Application' ? APP_CATEGORIES : GAME_CATEGORIES;

  return (
    <div className="space-y-8" id="metadata-section">
      <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-zinc-900">1. App Properties & Core Metadata</h2>
        </div>
        
        <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
          The information below populates the primary Store listing. Real-time checklist warnings alert you regarding Google's Metadata Policy standards.
        </p>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-700">App Title ({metadata.title.length}/50)</label>
              <span className="text-[10px] text-zinc-400 font-mono">Policy Limit: 50 Chars</span>
            </div>
            <input 
              type="text" 
              maxLength={50}
              value={metadata.title}
              placeholder="e.g. Sterling Sound Mixer"
              onChange={(e) => handleTextChange('title', e.target.value)}
              className="w-full text-sm px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-zinc-800"
            />
            {titleTriggers.length > 0 && (
              <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-800 leading-normal">
                  <strong>Metadata Policy Alert:</strong> Discouraged keywords found in title: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-900">{titleTriggers.join(', ')}</code>. Google forbids promotional adjectives ("best", "free") or excessive uppercase to ensure uniform cataloging.
                </div>
              </div>
            )}
            {metadata.title.length > 0 && titleTriggers.length === 0 && (
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-600">
                <CheckCircle className="w-3.5 h-3.5" /> compliant with Title Store policies.
              </div>
            )}
          </div>

          {/* Short Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-700">Short Description ({metadata.shortDescription.length}/80)</label>
              <span className="text-[10px] text-zinc-400 font-mono">Policy Limit: 80 Chars</span>
            </div>
            <input 
              type="text" 
              maxLength={80}
              value={metadata.shortDescription}
              placeholder="A brief tagline summarizing the killer utility of your application."
              onChange={(e) => handleTextChange('shortDescription', e.target.value)}
              className="w-full text-sm px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-zinc-800"
            />
            {shortTriggers.length > 0 && (
              <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-800 leading-normal">
                  <strong>Metadata Policy Alert:</strong> Potential promotional keyword found: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-900">{shortTriggers.join(', ')}</code>. Avoid call-to-actions like "download now" or claim guarantees.
                </div>
              </div>
            )}
            {metadata.shortDescription.length > 0 && shortTriggers.length === 0 && (
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-600">
                <CheckCircle className="w-3.5 h-3.5" /> Tagline complies with Google Play policy parameters.
              </div>
            )}
          </div>

          {/* Long Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-700">Long Description ({metadata.longDescription.length}/4000)</label>
              <span className="text-[10px] text-zinc-400 font-mono">Limit: 4000 Chars</span>
            </div>
            <textarea 
              rows={5}
              maxLength={4000}
              value={metadata.longDescription}
              placeholder="Provide a comprehensive breakdown of your app features, use cases, target audience, privacy disclosures, and setup parameters."
              onChange={(e) => handleTextChange('longDescription', e.target.value)}
              className="w-full text-sm p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-zinc-800 font-sans leading-relaxed"
            />
          </div>

          {/* Classification type and categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-2">App Classification Type</label>
              <div className="grid grid-cols-2 gap-2">
                {['Application', 'Game'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      onChange({
                        ...metadata,
                        appType: type as 'Application' | 'Game',
                        category: type === 'Application' ? 'Tools' : 'Casual'
                      });
                    }}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all text-center ${
                      metadata.appType === type 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-black shadow-inner' 
                        : 'border-zinc-200 text-zinc-500 hover:bg-zinc-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-2">Primary Category</label>
              <select
                value={metadata.category}
                onChange={(e) => handleTextChange('category', e.target.value)}
                className="w-full text-xs p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 transition-all font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categoriesPool.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-700">Developer Tags ({metadata.tags.length}/5)</label>
              <span className="text-[10px] text-zinc-400">Select up to 5 Tags</span>
            </div>
            
            <input 
              type="text"
              placeholder="Search developer tags..."
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl mb-3 text-zinc-700 focus:outline-none"
            />

            <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto p-2 bg-zinc-50 rounded-xl border border-zinc-100">
              {PLAY_STORE_TAGS.filter(t => t.toLowerCase().includes(tagSearch.toLowerCase())).map((tag) => {
                const isSelected = metadata.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-indigo-600 text-white shadow-sm font-bold' 
                        : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    {tag} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content Rating Section */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-zinc-900">2. Interactive Content Rating (IARC)</h2>
          </div>
          <button 
            type="button"
            onClick={() => setShowRatingInfo(!showRatingInfo)}
            className="p-1 px-2.5 text-[10px] font-bold border border-zinc-200 rounded-full text-zinc-500 hover:bg-zinc-100 flex items-center gap-1"
          >
            <HelpCircle className="w-3 h-3" /> Info
          </button>
        </div>

        {showRatingInfo && (
          <div className="bg-zinc-50 p-4 rounded-xl text-xs text-zinc-600 mb-6 leading-relaxed border border-zinc-100">
            <strong>What is IARC Content Rating?</strong> To publish an app, Google Play Console requires completing an active questionnaire regarding content. The age ratings are estimated based on your self-assessment of violence, language, and user communications. This prevents Store suspensions due to incorrect categorization.
          </div>
        )}

        <div className="space-y-5">
          {/* Violence */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-2">Violence Presence</label>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { val: 'none', label: 'None' },
                { val: 'mild', label: 'Mild (Pixel/Cartoon)' },
                { val: 'moderate', label: 'Moderate' },
                { val: 'intense', label: 'Intense (Realistic/Blood)' }
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => onContentRatingChange({ ...contentRating, violence: item.val as any })}
                  className={`p-2.5 rounded-lg border text-[11px] font-medium transition-all ${
                    contentRating.violence === item.val
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                      : 'border-zinc-100 text-zinc-500 hover:bg-zinc-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sexuality */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-2">Sexual Themes / Nudity</label>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { val: 'none', label: 'None' },
                { val: 'mild', label: 'Mild/References' },
                { val: 'moderate', label: 'Moderate/Implied' },
                { val: 'intense', label: 'Intense/Explicit' }
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => onContentRatingChange({ ...contentRating, sexuality: item.val as any })}
                  className={`p-2.5 rounded-lg border text-[11px] font-medium transition-all ${
                    contentRating.sexuality === item.val
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                      : 'border-zinc-100 text-zinc-500 hover:bg-zinc-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-2">Offensive Language / Crude Humor</label>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { val: 'none', label: 'None' },
                { val: 'mild', label: 'Infrequent/Mild' },
                { val: 'moderate', label: 'Frequent/Profane' }
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => onContentRatingChange({ ...contentRating, language: item.val as any })}
                  className={`p-2.5 rounded-lg border text-[11px] font-medium transition-all ${
                    contentRating.language === item.val
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                      : 'border-zinc-100 text-zinc-500 hover:bg-zinc-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle elements */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-zinc-100 cursor-pointer bg-zinc-50 hover:bg-white select-none">
              <input 
                type="checkbox"
                checked={contentRating.gambling}
                onChange={(e) => onContentRatingChange({ ...contentRating, gambling: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-650 accent-indigo-600"
              />
              <div className="text-left">
                <span className="block text-xs font-bold text-zinc-700">Simulated Gambling</span>
                <span className="block text-[10px] text-zinc-400">Contains betting mechanics</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-zinc-100 cursor-pointer bg-zinc-50 hover:bg-white select-none">
              <input 
                type="checkbox"
                checked={contentRating.userInteraction}
                onChange={(e) => onContentRatingChange({ ...contentRating, userInteraction: e.checked ? true : !contentRating.userInteraction })}
                className="w-4 h-4 rounded text-indigo-650 accent-indigo-600"
              />
              <div className="text-left">
                <span className="block text-xs font-bold text-zinc-700">User Social Integration</span>
                <span className="block text-[10px] text-zinc-400">Users interact or chat online</span>
              </div>
            </label>
          </div>

          {/* Active Rating Display Card */}
          <div className={`mt-6 p-4 rounded-xl border flex items-center justify-between ${activeRating.color}`}>
            <div className="space-y-1">
              <span className="block text-[10px] uppercase font-bold tracking-widest text-[#52525b]">Estimated Store Maturity Rating</span>
              <span className="block text-sm font-black font-sans">{activeRating.rating}</span>
            </div>
            <div className="px-3.5 py-2 font-mono text-xs border border-current font-black tracking-tight uppercase rounded-lg">
              IARC Certificate Verified
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
