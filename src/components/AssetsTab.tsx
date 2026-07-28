import React, { useState, useRef, useEffect } from 'react';
import { StoreAsset, AppMetadata } from '../types';
import { 
  FileUp, Trash2, CheckCircle2, AlertTriangle, 
  Smartphone, Tablet, Download, Sparkles, Eye, ShieldAlert 
} from 'lucide-react';

interface AssetsTabProps {
  metadata: AppMetadata;
  assets: {
    icon: StoreAsset | null;
    feature: StoreAsset | null;
    screenshotsPhone: StoreAsset[];
    screenshotsTablet: StoreAsset[];
  };
  onAssetChange: (key: 'icon' | 'feature' | 'screenshotsPhone' | 'screenshotsTablet', value: any) => void;
}

export const AssetsTab: React.FC<AssetsTabProps> = ({
  metadata,
  assets,
  onAssetChange,
}) => {
  const [iconMask, setIconMask] = useState<'none' | 'squircle' | 'circle'>('squircle');
  const [showSafeZone, setShowSafeZone] = useState(true);
  const [activePreset, setActivePreset] = useState<'indigo' | 'emerald' | 'amber' | 'rose'>('indigo');
  const [generatorSymbol, setGeneratorSymbol] = useState('🌟');

  const fileInputIcon = useRef<HTMLInputElement>(null);
  const fileInputFeature = useRef<HTMLInputElement>(null);
  const fileInputPhone = useRef<HTMLInputElement>(null);
  const fileInputTablet = useRef<HTMLInputElement>(null);

  const presetsGradients = {
    indigo: { start: '#4f46e5', end: '#06b6d4', text: 'from-indigo-600 to-cyan-500' },
    emerald: { start: '#10b981', end: '#059669', text: 'from-emerald-500 to-teal-700' },
    amber: { start: '#f59e0b', end: '#d97706', text: 'from-amber-500 to-amber-700' },
    rose: { start: '#f43f5e', end: '#be123c', text: 'from-rose-500 to-pink-700' }
  };

  // Safe file reader helper with dimension checks
  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'icon' | 'feature' | 'screenshot_phone' | 'screenshot_tablet',
    targetWidth?: number,
    targetHeight?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        let validationStatus: 'valid' | 'invalid' = 'valid';
        let errorMsg = '';

        if (targetWidth && width !== targetWidth) {
          validationStatus = 'invalid';
          errorMsg = `Width must be exactly ${targetWidth}px. Detected: ${width}px.`;
        }
        if (targetHeight && height !== targetHeight) {
          validationStatus = 'invalid';
          errorMsg = `Height must be exactly ${targetHeight}px. Detected: ${height}px.`;
        }

        // Compress and downscale for local state storage to avoid exceeding localStorage quota (5MB)
        const canvas = document.createElement('canvas');
        const maxDim = type === 'icon' ? 256 : type === 'feature' ? 512 : 360;
        let w = width;
        let h = height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        let compressedUrl = reader.result as string;
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          compressedUrl = canvas.toDataURL('image/jpeg', 0.7);
        }

        const newAsset: StoreAsset = {
          id: `${type}_${Date.now()}`,
          name: file.name,
          url: compressedUrl,
          size: file.size,
          width,
          height,
          validationStatus,
          validationError: errorMsg || undefined,
          type
        };

        if (type === 'icon') {
          onAssetChange('icon', newAsset);
        } else if (type === 'feature') {
          onAssetChange('feature', newAsset);
        } else if (type === 'screenshot_phone') {
          onAssetChange('screenshotsPhone', [...assets.screenshotsPhone, newAsset]);
        } else if (type === 'screenshot_tablet') {
          onAssetChange('screenshotsTablet', [...assets.screenshotsTablet, newAsset]);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const deleteScreenshot = (id: string, isTablet: boolean) => {
    if (isTablet) {
      onAssetChange('screenshotsTablet', assets.screenshotsTablet.filter(s => s.id !== id));
    } else {
      onAssetChange('screenshotsPhone', assets.screenshotsPhone.filter(s => s.id !== id));
    }
  };

  // Canvas Generator for 512x512 App Icon
  const triggerIconGenerator = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pr = presetsGradients[activePreset];
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, pr.start);
    grad.addColorStop(1, pr.end);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Render modern symbol on center
    ctx.font = 'bold 220px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(generatorSymbol || metadata.title.charAt(0).toUpperCase() || 'A', 256, 256);

    // Save state
    const url = canvas.toDataURL('image/png');

    // For local preview storage, downscale and compress using jpeg to avoid local storage quota limit
    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = 256;
    previewCanvas.height = 256;
    const pCtx = previewCanvas.getContext('2d');
    let previewUrl = url;
    if (pCtx) {
      pCtx.drawImage(canvas, 0, 0, 256, 256);
      previewUrl = previewCanvas.toDataURL('image/jpeg', 0.8);
    }

    const mockAsset: StoreAsset = {
      id: `generated_icon_${Date.now()}`,
      name: `PlayLaunch_Icon_512.png`,
      url: previewUrl,
      size: 154000,
      width: 512,
      height: 512,
      validationStatus: 'valid',
      type: 'icon'
    };

    onAssetChange('icon', mockAsset);

    // Save File Download
    const link = document.createElement('a');
    link.download = `${metadata.title ? metadata.title.toLowerCase().replace(/\s+/g, '_') : 'app'}_icon_512.png`;
    link.href = url;
    link.click();
  };

  // Canvas Generator for 1024x500 Feature Graphic
  const triggerFeatureGenerator = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pr = presetsGradients[activePreset];
    const grad = ctx.createLinearGradient(0, 0, 1024, 500);
    grad.addColorStop(0, '#0f172a'); // Slate-900 back
    grad.addColorStop(1, pr.start);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 500);

    // Decorative backing circles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.beginPath();
    ctx.arc(512, 250, 220, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.beginPath();
    ctx.arc(512, 250, 140, 0, Math.PI * 2);
    ctx.fill();

    // App Title
    ctx.font = 'bold 58px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(metadata.title || 'App Launch Workspace', 512, 210);

    // Description
    ctx.font = '22px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(metadata.shortDescription || 'Google Play Store Release App', 512, 280);

    // Small symbol indicator
    ctx.font = '40px sans-serif';
    ctx.fillText(generatorSymbol, 512, 350);

    const url = canvas.toDataURL('image/png');

    // For local preview storage, downscale and compress using jpeg to avoid local storage quota limit
    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = 512;
    previewCanvas.height = 250;
    const pCtx = previewCanvas.getContext('2d');
    let previewUrl = url;
    if (pCtx) {
      pCtx.drawImage(canvas, 0, 0, 512, 250);
      previewUrl = previewCanvas.toDataURL('image/jpeg', 0.8);
    }

    const mockAsset: StoreAsset = {
      id: `generated_feature_${Date.now()}`,
      name: `PlayLaunch_Feature_1024x500.png`,
      url: previewUrl,
      size: 320000,
      width: 1024,
      height: 500,
      validationStatus: 'valid',
      type: 'feature'
    };

    onAssetChange('feature', mockAsset);

    const link = document.createElement('a');
    link.download = `${metadata.title ? metadata.title.toLowerCase().replace(/\s+/g, '_') : 'app'}_feature_1024.png`;
    link.href = url;
    link.click();
  };

  return (
    <div className="space-y-8" id="assets-section">
      {/* 512x512 App Icon Module */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-zinc-900 font-sans">1. App Icon (512x512)</h2>
          </div>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-mono font-bold px-2.5 py-1 rounded-full uppercase">
            Mandatory
          </span>
        </div>

        <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
          Google Play Store listing icons must be exactly <strong>512 x 512 pixels</strong>, 32-bit PNG, transparent, max 1MB. Round corners are added automatically by Google's forced masking.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mock viewer with masks */}
          <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-6 flex flex-col items-center justify-center space-y-4">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider self-start">Interactive Mask Simulator</span>
            
            <div className="relative w-36 h-36 bg-zinc-200 border border-zinc-300 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 shadow-md">
              {assets.icon ? (
                <img 
                  src={assets.icon.url} 
                  alt="App Icon View" 
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    iconMask === 'squircle' ? 'rounded-[30px]' : 
                    iconMask === 'circle' ? 'rounded-full' : 'rounded-none'
                  }`}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-center font-mono text-[10px] text-zinc-400 leading-relaxed px-4 select-none">
                  🔍 Empty Icon<br />Upload or Draw below
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {[
                { val: 'none', label: 'Square (None)' },
                { val: 'squircle', label: 'Play Store Mask' },
                { val: 'circle', label: 'Adaptive Round' }
              ].map((mask) => (
                <button
                  key={mask.val}
                  type="button"
                  onClick={() => setIconMask(mask.val as any)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                    iconMask === mask.val 
                      ? 'bg-zinc-805 text-zinc-800 border-zinc-300 bg-zinc-100' 
                      : 'border-zinc-200 text-zinc-500 hover:bg-zinc-100 bg-white'
                  }`}
                >
                  {mask.label}
                </button>
              ))}
            </div>
          </div>

          {/* Upload or Generate controller */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="border-2 border-dashed border-zinc-200 hover:border-indigo-400 bg-zinc-50/50 hover:bg-indigo-50/20 rounded-xl p-5 text-center flex flex-col items-center justify-center transition-all cursor-pointer relative"
              onClick={() => fileInputIcon.current?.click()}
            >
              <FileUp className="w-8 h-8 text-zinc-400 mb-2" />
              <span className="text-xs font-semibold text-zinc-700 block mb-0.5">Drag App Icon or Click to Upload</span>
              <span className="text-[10px] text-zinc-400">Accepts 512x512 px PNG/JPEG only</span>
              <input 
                ref={fileInputIcon}
                type="file" 
                accept="image/png, image/jpeg"
                onChange={(e) => handleUpload(e, 'icon', 512, 512)}
                className="hidden" 
              />
            </div>

            {assets.icon && (
              <div className={`p-3 rounded-lg border flex items-center justify-between ${
                assets.icon.validationStatus === 'valid' 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                  : 'bg-red-50 border-red-100 text-red-800'
              }`}>
                <div className="flex items-center gap-2">
                  {assets.icon.validationStatus === 'valid' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-650 shrink-0" />
                  )}
                  <div className="text-left">
                    <span className="block text-[10px] font-bold font-mono truncate max-w-[170px]">{assets.icon.name}</span>
                    <span className="block text-[9px] opacity-80">{assets.icon.width}x{assets.icon.height}px • {(assets.icon.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
                {assets.icon.validationError && (
                  <span className="text-[9px] font-bold text-red-700 max-w-[120px] leading-tight text-right">{assets.icon.validationError}</span>
                )}
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAssetChange('icon', null);
                  }}
                  className="p-1 hover:bg-black/5 rounded-full"
                >
                  <Trash2 className="w-3.5 h-3.5 text-zinc-500 hover:text-red-600" />
                </button>
              </div>
            )}

            {/* Quick Canvas Builder */}
            <div className="border border-zinc-150 p-4 rounded-xl space-y-3 bg-zinc-50/50">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-indigo-700">
                <Sparkles className="w-3.5 h-3.5" /> Fast 512x512 Canvas Art Generator
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(['indigo', 'emerald', 'amber', 'rose'] as const).map((pr) => (
                  <button
                    key={pr}
                    type="button"
                    onClick={() => setActivePreset(pr)}
                    className={`h-6 rounded-lg bg-gradient-to-br ${presetsGradients[pr].text} border ${
                      activePreset === pr ? 'border-zinc-900 ring-2 ring-indigo-500' : 'border-zinc-300'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  maxLength={2}
                  value={generatorSymbol}
                  onChange={(e) => setGeneratorSymbol(e.target.value)}
                  placeholder="Text/Emoji"
                  className="w-1/3 text-xs px-2.5 py-1.5 border border-zinc-200 rounded-lg bg-white text-center font-bold text-zinc-800"
                />
                <button
                  type="button"
                  onClick={triggerIconGenerator}
                  className="w-2/3 py-1.5 px-3 bg-indigo-600 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-indigo-700 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Draw & Set Icon (512x512)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1024x500 Feature Graphic Module */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-zinc-900">2. Feature Graphic (1024x500)</h2>
          </div>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-mono font-bold px-2.5 py-1 rounded-full uppercase">
            Mandatory
          </span>
        </div>

        <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
          Displayed at the top of the store entry in mobile. Requirements: exactly <strong>1024 x 500 pixels</strong>, PNG or JPEG. Margins cropped dynamically: keep text/logo in central safe margins.
        </p>

        <div className="space-y-4">
          {/* Graphic safe zone simulator */}
          <div className="relative aspect-[1024/500] w-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-inner group">
            {assets.feature ? (
              <img 
                src={assets.feature.url} 
                alt="Feature Graphic" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 text-xs font-mono p-4">
                🎨 Empty Feature Graphic (1024 x 500)<br />Upload custom graphic or generate one below
              </div>
            )}

            {showSafeZone && (
              <div className="absolute inset-[15%] border-2 border-dashed border-cyan-400/50 flex flex-col items-center justify-center pointer-events-none">
                <div className="bg-cyan-500/10 text-cyan-300 font-mono text-[8px] uppercase tracking-widest font-black p-1 px-1.5 rounded border border-cyan-400/25">
                  Play Store Text Safe Zone (Centered 70%)
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowSafeZone(!showSafeZone)}
              className="absolute bottom-3 right-3 text-[10px] font-bold bg-black/60 backdrop-blur text-white px-2.5 py-1 rounded-lg border border-white/10 hover:bg-black/8 w-auto flex items-center gap-1.5"
            >
              <Eye className="w-3 h-3" /> {showSafeZone ? 'Hide Safe Zone' : 'Map Safe Zone'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-zinc-200 hover:border-indigo-400 bg-zinc-50/50 hover:bg-indigo-50/20 rounded-xl p-4 text-center cursor-pointer flex flex-col items-center justify-center transition-all"
              onClick={() => fileInputFeature.current?.click()}
            >
              <FileUp className="w-6 h-6 text-zinc-400 mb-1" />
              <span className="text-xs font-semibold text-zinc-700 block">Upload 1024x500 Feature Banner</span>
              <input 
                ref={fileInputFeature}
                type="file" 
                accept="image/png, image/jpeg"
                onChange={(e) => handleUpload(e, 'feature', 1024, 500)}
                className="hidden" 
              />
            </div>

            <button
              type="button"
              onClick={triggerFeatureGenerator}
              className="py-4 px-6 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-white rounded-xl text-xs font-bold leading-normal flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-transform"
            >
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-left">
                <span className="block font-black">Generate Banner (1024x500)</span>
                <span className="block text-[9px] text-zinc-400 font-medium">Binds App Title + Tagline into Safe Zone</span>
              </div>
            </button>
          </div>

          {assets.feature && (
            <div className={`p-3 rounded-lg border flex items-center justify-between ${
              assets.feature.validationStatus === 'valid' 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                : 'bg-red-50 border-red-100 text-red-800'
            }`}>
              <div className="flex items-center gap-2">
                {assets.feature.validationStatus === 'valid' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-650 shrink-0" />
                )}
                <div className="text-left">
                  <span className="block text-[10px] font-bold truncate max-w-[200px]">{assets.feature.name}</span>
                  <span className="block text-[9px] opacity-80">{assets.feature.width}x{assets.feature.height}px • {(assets.feature.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
              {assets.feature.validationError && (
                <span className="text-[9px] font-bold text-red-700 max-w-[150px] leading-tight text-right">{assets.feature.validationError}</span>
              )}
              <button 
                type="button" 
                onClick={() => onAssetChange('feature', null)}
                className="p-1 hover:bg-black/5 rounded-full"
              >
                <Trash2 className="w-3.5 h-3.5 text-zinc-500 hover:text-red-700" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Screenshots Module (Phone & Tablet) */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-zinc-900">3. Device Screenshots (At least 2 screenshots per category)</h2>
          </div>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-mono font-bold px-2.5 py-1 rounded-full uppercase">
            Mandatory
          </span>
        </div>

        <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
          Google Play mandates at least <strong>2 high-quality screenshots</strong> for both <strong>Phones</strong> and <strong>Tablets</strong>. Formats: 16:9 or 18:9 ratio (e.g., 1080x1920, 1080x2400) for phones, and 16:10 ratio for tablets. Max size 8MB each.
        </p>

        {/* Phone Screenshots */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <span className="text-xs font-black text-zinc-700 uppercase tracking-tight flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-zinc-400" /> Phone Screenshots ({assets.screenshotsPhone.length}/8)
            </span>
            <button
              type="button"
              onClick={() => fileInputPhone.current?.click()}
              className="text-[10px] font-bold bg-indigo-55 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 w-auto"
            >
              + Add Phone Mock
            </button>
            <input 
              ref={fileInputPhone}
              type="file" 
              accept="image/*"
              onChange={(e) => handleUpload(e, 'screenshot_phone')}
              className="hidden" 
            />
          </div>

          <div className="flex gap-4 overflow-x-auto py-3 px-2 bg-zinc-50 rounded-xl border border-zinc-105 scrollbar-thin">
            {assets.screenshotsPhone.length === 0 ? (
              <div className="w-full text-center py-8 font-mono text-[10px] text-zinc-400">
                📱 No phone store screenshots mockups uploaded. Upload files to preview!
              </div>
            ) : (
              assets.screenshotsPhone.map((pic) => (
                <div key={pic.id} className="relative flex-shrink-0 group">
                  {/* Virtual Smartphone frame */}
                  <div className="w-[124px] h-[220px] bg-zinc-900 rounded-[18px] p-2 ring-4 ring-zinc-800 shadow-lg relative overflow-hidden flex items-center justify-center">
                    <img src={pic.url} alt="Phone Listing" className="w-full h-full object-cover rounded-[12px] bg-white" referrerPolicy="no-referrer" />
                    {/* Ear Speaker Speaker Hole */}
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-zinc-950 rounded-full" />
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteScreenshot(pic.id, false)}
                    className="absolute -top-1.5 -right-1.5 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700 hover:scale-105 transition-transform"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tablet Screenshots */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2 flex-wrap">
            <span className="text-xs font-black text-zinc-700 uppercase tracking-tight flex items-center gap-1.5">
              <Tablet className="w-4 h-4 text-zinc-400" /> Tablet (7 to 10-inch) Screenshots ({assets.screenshotsTablet.length}/8)
            </span>
            <button
              type="button"
              onClick={() => fileInputTablet.current?.click()}
              className="text-[10px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 w-auto"
            >
              + Add Tablet Mock
            </button>
            <input 
              ref={fileInputTablet}
              type="file" 
              accept="image/*"
              onChange={(e) => handleUpload(e, 'screenshot_tablet')}
              className="hidden" 
            />
          </div>

          <div className="flex gap-4 overflow-x-auto py-3 px-2 bg-zinc-50 rounded-xl border border-zinc-105 scrollbar-thin">
            {assets.screenshotsTablet.length === 0 ? (
              <div className="w-full text-center py-8 font-mono text-[10px] text-zinc-400 border-dashed">
                📟 No 7/10-inch tablet screenshots loaded. (Tablet listings improve discovery score!)
              </div>
            ) : (
              assets.screenshotsTablet.map((pic) => (
                <div key={pic.id} className="relative flex-shrink-0 group">
                  {/* Virtual Tablet horizontal screen */}
                  <div className="w-[180px] h-[120px] bg-zinc-900 rounded-[14px] p-2 ring-4 ring-zinc-800 shadow-md relative overflow-hidden flex items-center justify-center">
                    <img src={pic.url} alt="Tablet Listing" className="w-full h-full object-cover rounded-[8px] bg-white" referrerPolicy="no-referrer" />
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteScreenshot(pic.id, true)}
                    className="absolute -top-1.5 -right-1.5 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700 hover:scale-105 transition-transform"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
