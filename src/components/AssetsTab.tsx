import React, { useState, useRef } from 'react';
import { StoreAsset, AppMetadata } from '../types';
import { 
  FileUp, Trash2, CheckCircle2, AlertTriangle, 
  Smartphone, Tablet, Download, Sparkles, Eye,
  Wand2, Layers, Grid, X, Info, Sliders, Check, RefreshCw, LayoutGrid
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
  const [activePreset, setActivePreset] = useState<'indigo' | 'emerald' | 'amber' | 'rose' | 'cyber'>('indigo');
  const [generatorSymbol, setGeneratorSymbol] = useState('🎵');

  // AI Generator Modal state
  const [showAiModal, setShowAiModal] = useState(false);
  const [modalTab, setModalTab] = useState<'icon' | 'feature' | 'phone' | 'tablet'>('icon');
  const [includeGuides, setIncludeGuides] = useState(true);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  const fileInputIcon = useRef<HTMLInputElement>(null);
  const fileInputFeature = useRef<HTMLInputElement>(null);
  const fileInputPhone = useRef<HTMLInputElement>(null);
  const fileInputTablet = useRef<HTMLInputElement>(null);

  const presetsGradients = {
    indigo: { start: '#4f46e5', end: '#06b6d4', text: 'from-indigo-600 to-cyan-500', name: 'Studio Indigo' },
    emerald: { start: '#10b981', end: '#059669', text: 'from-emerald-500 to-teal-700', name: 'Emerald Clean' },
    amber: { start: '#f59e0b', end: '#d97706', text: 'from-amber-500 to-amber-700', name: 'Warm Amber' },
    rose: { start: '#f43f5e', end: '#be123c', text: 'from-rose-500 to-pink-700', name: 'Cyber Rose' },
    cyber: { start: '#2563eb', end: '#7c3aed', text: 'from-blue-600 to-violet-600', name: 'Royal Cyber' }
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
  const generateIconCanvas = (drawGuides: boolean) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { fullUrl: '', previewUrl: '' };

    const pr = presetsGradients[activePreset];
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, pr.start);
    grad.addColorStop(1, pr.end);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Decorative geometric background accent
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.arc(256, 256, 190, 0, Math.PI * 2);
    ctx.fill();

    // Symbol / Monogram
    ctx.font = 'bold 210px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(generatorSymbol || metadata.title.charAt(0).toUpperCase() || 'A', 256, 256);

    if (drawGuides) {
      // Play store squircle mask outline guide
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 8]);
      ctx.beginPath();
      ctx.roundRect(16, 16, 480, 480, 100);
      ctx.stroke();
      ctx.setLineDash([]);

      // Dimension text badge
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.beginPath();
      ctx.roundRect(136, 420, 240, 44, 12);
      ctx.fill();

      ctx.font = 'bold 20px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('512 × 512 PX', 256, 442);
    }

    const fullUrl = canvas.toDataURL('image/png');

    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = 256;
    previewCanvas.height = 256;
    const pCtx = previewCanvas.getContext('2d');
    let previewUrl = fullUrl;
    if (pCtx) {
      pCtx.drawImage(canvas, 0, 0, 256, 256);
      previewUrl = previewCanvas.toDataURL('image/jpeg', 0.8);
    }

    return { fullUrl, previewUrl };
  };

  // Canvas Generator for 1024x500 Feature Graphic
  const generateFeatureCanvas = (drawGuides: boolean) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { fullUrl: '', previewUrl: '' };

    const pr = presetsGradients[activePreset];
    const grad = ctx.createLinearGradient(0, 0, 1024, 500);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, pr.start);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 500);

    // Decorative backing shapes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath(); ctx.arc(512, 250, 220, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(512, 250, 140, 0, Math.PI * 2); ctx.fill();

    // App Title
    ctx.font = 'bold 54px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(metadata.title || 'App Launch Workspace', 512, 200);

    // Subtitle
    ctx.font = '22px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fillText(metadata.shortDescription || 'Google Play Store Release App', 512, 265);

    // Symbol badge
    ctx.font = '36px sans-serif';
    ctx.fillText(generatorSymbol, 512, 335);

    if (drawGuides) {
      // Play Store Safe Text Zone (Centered 70%)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 6]);
      ctx.strokeRect(153, 75, 718, 350);
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
      ctx.fillRect(362, 20, 300, 32);
      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = '#020617';
      ctx.fillText('PLAY STORE SAFE ZONE (70%)', 512, 36);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.beginPath();
      ctx.roundRect(387, 440, 250, 40, 10);
      ctx.fill();

      ctx.font = 'bold 18px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('1024 × 500 PX BANNER', 512, 460);
    }

    const fullUrl = canvas.toDataURL('image/png');

    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = 512;
    previewCanvas.height = 250;
    const pCtx = previewCanvas.getContext('2d');
    let previewUrl = fullUrl;
    if (pCtx) {
      pCtx.drawImage(canvas, 0, 0, 512, 250);
      previewUrl = previewCanvas.toDataURL('image/jpeg', 0.8);
    }

    return { fullUrl, previewUrl };
  };

  // Canvas Generator for 1080x1920 Phone Screenshot
  const generatePhoneCanvas = (drawGuides: boolean) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { fullUrl: '', previewUrl: '' };

    const pr = presetsGradients[activePreset];

    // Background
    const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
    grad.addColorStop(0, '#020617');
    grad.addColorStop(0.5, pr.start);
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Status bar mock
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(60, 40, 120, 16);
    ctx.fillRect(940, 40, 80, 16);

    // Mock UI App Bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(60, 100, 960, 150, 24);
    ctx.fill();

    ctx.font = 'bold 44px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${generatorSymbol}  ${metadata.title || 'Sterling Audio'}`, 100, 175);

    // Mock Main UI Card
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(60, 290, 960, 1220, 32);
    ctx.fill();
    ctx.stroke();

    // Render 24 Spectrum Bars
    const numBars = 22;
    const barWidth = 30;
    const gap = 12;
    const startX = 110;
    for (let i = 0; i < numBars; i++) {
      const h = Math.floor(120 + Math.abs(Math.sin((i + 1) * 0.7)) * 520);
      const barGrad = ctx.createLinearGradient(0, 1150 - h, 0, 1150);
      barGrad.addColorStop(0, '#38bdf8');
      barGrad.addColorStop(1, pr.start);
      ctx.fillStyle = barGrad;
      ctx.beginPath();
      ctx.roundRect(startX + i * (barWidth + gap), 1150 - h, barWidth, h, 6);
      ctx.fill();
    }

    // Spec card
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath();
    ctx.roundRect(100, 1240, 880, 210, 20);
    ctx.fill();

    ctx.font = 'bold 30px sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('REALTIME SPECTRAL TELEMETRY • 64-BAND', 130, 1300);
    ctx.font = '22px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('64Hz - 18kHz • Discrete Fourier Analyzer', 130, 1360);

    // Bottom Navigation Bar Mock
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.roundRect(60, 1550, 960, 140, 24);
    ctx.fill();

    if (drawGuides) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
      ctx.fillRect(60, 1730, 960, 60);
      ctx.font = 'bold 26px monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText('DIMENSION GUIDE: 1080 × 1920 PX (9:16 PHONE RATIO)', 540, 1768);

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, 1072, 1912);
    }

    const fullUrl = canvas.toDataURL('image/png');

    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = 240;
    previewCanvas.height = 426;
    const pCtx = previewCanvas.getContext('2d');
    let previewUrl = fullUrl;
    if (pCtx) {
      pCtx.drawImage(canvas, 0, 0, 240, 426);
      previewUrl = previewCanvas.toDataURL('image/jpeg', 0.8);
    }

    return { fullUrl, previewUrl };
  };

  // Canvas Generator for 1920x1200 Tablet Screenshot
  const generateTabletCanvas = (drawGuides: boolean) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { fullUrl: '', previewUrl: '' };

    const pr = presetsGradients[activePreset];

    // Background
    const grad = ctx.createLinearGradient(0, 0, 1920, 1200);
    grad.addColorStop(0, '#020617');
    grad.addColorStop(0.5, pr.start);
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1920, 1200);

    // Left Sidebar
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.beginPath();
    ctx.roundRect(40, 40, 420, 1120, 24);
    ctx.fill();

    ctx.font = 'bold 36px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${generatorSymbol} ${metadata.title || 'Studio'}`, 80, 100);

    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i === 0 ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.roundRect(70, 180 + i * 80, 360, 60, 12);
      ctx.fill();
    }

    // Main Workspace
    ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
    ctx.beginPath();
    ctx.roundRect(490, 40, 1390, 1120, 24);
    ctx.fill();

    // Equalizer Faders
    for (let i = 0; i < 10; i++) {
      const x = 580 + i * 125;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(x + 20, 500, 10, 450);

      const knobY = 550 + Math.abs(Math.sin(i * 1.5)) * 320;
      ctx.fillStyle = pr.start;
      ctx.beginPath();
      ctx.roundRect(x, knobY, 50, 24, 8);
      ctx.fill();
    }

    if (drawGuides) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
      ctx.fillRect(490, 1060, 1390, 60);
      ctx.font = 'bold 26px monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText('DIMENSION GUIDE: 1920 × 1200 PX (16:10 TABLET LANDSCAPE RATIO)', 1185, 1098);

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, 1912, 1192);
    }

    const fullUrl = canvas.toDataURL('image/png');

    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = 480;
    previewCanvas.height = 300;
    const pCtx = previewCanvas.getContext('2d');
    let previewUrl = fullUrl;
    if (pCtx) {
      pCtx.drawImage(canvas, 0, 0, 480, 300);
      previewUrl = previewCanvas.toDataURL('image/jpeg', 0.8);
    }

    return { fullUrl, previewUrl };
  };

  // Triggers for main view quick buttons
  const triggerIconGenerator = () => {
    const { fullUrl, previewUrl } = generateIconCanvas(false);
    if (!fullUrl) return;

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

    const link = document.createElement('a');
    link.download = `${metadata.title ? metadata.title.toLowerCase().replace(/\s+/g, '_') : 'app'}_icon_512.png`;
    link.href = fullUrl;
    link.click();
  };

  const triggerFeatureGenerator = () => {
    const { fullUrl, previewUrl } = generateFeatureCanvas(false);
    if (!fullUrl) return;

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
    link.href = fullUrl;
    link.click();
  };

  // Modal actions
  const applySingleAssetFromModal = (type: 'icon' | 'feature' | 'phone' | 'tablet') => {
    if (type === 'icon') {
      const { previewUrl } = generateIconCanvas(includeGuides);
      onAssetChange('icon', {
        id: `ai_icon_${Date.now()}`,
        name: `AI_Store_Icon_512x512.png`,
        url: previewUrl,
        size: 154000,
        width: 512,
        height: 512,
        validationStatus: 'valid',
        type: 'icon'
      });
      setAppliedNotification('App Icon (512x512) updated!');
    } else if (type === 'feature') {
      const { previewUrl } = generateFeatureCanvas(includeGuides);
      onAssetChange('feature', {
        id: `ai_feature_${Date.now()}`,
        name: `AI_Feature_Graphic_1024x500.png`,
        url: previewUrl,
        size: 320000,
        width: 1024,
        height: 500,
        validationStatus: 'valid',
        type: 'feature'
      });
      setAppliedNotification('Feature Graphic (1024x500) updated!');
    } else if (type === 'phone') {
      const { previewUrl } = generatePhoneCanvas(includeGuides);
      const newPhoneAsset: StoreAsset = {
        id: `ai_phone_${Date.now()}`,
        name: `AI_Phone_Screenshot_1080x1920.png`,
        url: previewUrl,
        size: 450000,
        width: 1080,
        height: 1920,
        validationStatus: 'valid',
        type: 'screenshot_phone'
      };
      onAssetChange('screenshotsPhone', [...assets.screenshotsPhone, newPhoneAsset]);
      setAppliedNotification('Phone Screenshot added!');
    } else if (type === 'tablet') {
      const { previewUrl } = generateTabletCanvas(includeGuides);
      const newTabletAsset: StoreAsset = {
        id: `ai_tablet_${Date.now()}`,
        name: `AI_Tablet_Screenshot_1920x1200.png`,
        url: previewUrl,
        size: 520000,
        width: 1920,
        height: 1200,
        validationStatus: 'valid',
        type: 'screenshot_tablet'
      };
      onAssetChange('screenshotsTablet', [...assets.screenshotsTablet, newTabletAsset]);
      setAppliedNotification('Tablet Screenshot added!');
    }

    setTimeout(() => setAppliedNotification(null), 3000);
  };

  const applyAllAssetsFromModal = () => {
    setIsBatchGenerating(true);
    setTimeout(() => {
      const iconRes = generateIconCanvas(includeGuides);
      const featureRes = generateFeatureCanvas(includeGuides);
      const phoneRes = generatePhoneCanvas(includeGuides);
      const tabletRes = generateTabletCanvas(includeGuides);

      onAssetChange('icon', {
        id: `ai_icon_${Date.now()}`,
        name: `AI_Store_Icon_512x512.png`,
        url: iconRes.previewUrl,
        size: 154000,
        width: 512,
        height: 512,
        validationStatus: 'valid',
        type: 'icon'
      });

      onAssetChange('feature', {
        id: `ai_feature_${Date.now()}`,
        name: `AI_Feature_Banner_1024x500.png`,
        url: featureRes.previewUrl,
        size: 320000,
        width: 1024,
        height: 500,
        validationStatus: 'valid',
        type: 'feature'
      });

      onAssetChange('screenshotsPhone', [
        {
          id: `ai_phone_1_${Date.now()}`,
          name: `AI_Phone_Mock_1080x1920.png`,
          url: phoneRes.previewUrl,
          size: 450000,
          width: 1080,
          height: 1920,
          validationStatus: 'valid',
          type: 'screenshot_phone'
        }
      ]);

      onAssetChange('screenshotsTablet', [
        {
          id: `ai_tablet_1_${Date.now()}`,
          name: `AI_Tablet_Mock_1920x1200.png`,
          url: tabletRes.previewUrl,
          size: 520000,
          width: 1920,
          height: 1200,
          validationStatus: 'valid',
          type: 'screenshot_tablet'
        }
      ]);

      setIsBatchGenerating(false);
      setAppliedNotification('✨ All Store Assets generated & applied successfully!');
      setTimeout(() => setAppliedNotification(null), 3500);
    }, 600);
  };

  const downloadActiveAsset = (type: 'icon' | 'feature' | 'phone' | 'tablet') => {
    let res = { fullUrl: '' };
    let filename = 'asset.png';

    if (type === 'icon') {
      res = generateIconCanvas(includeGuides);
      filename = `${metadata.title ? metadata.title.toLowerCase().replace(/\s+/g, '_') : 'app'}_icon_512x512.png`;
    } else if (type === 'feature') {
      res = generateFeatureCanvas(includeGuides);
      filename = `${metadata.title ? metadata.title.toLowerCase().replace(/\s+/g, '_') : 'app'}_feature_1024x500.png`;
    } else if (type === 'phone') {
      res = generatePhoneCanvas(includeGuides);
      filename = `${metadata.title ? metadata.title.toLowerCase().replace(/\s+/g, '_') : 'app'}_phone_1080x1920.png`;
    } else if (type === 'tablet') {
      res = generateTabletCanvas(includeGuides);
      filename = `${metadata.title ? metadata.title.toLowerCase().replace(/\s+/g, '_') : 'app'}_tablet_1920x1200.png`;
    }

    if (res.fullUrl) {
      const link = document.createElement('a');
      link.download = filename;
      link.href = res.fullUrl;
      link.click();
    }
  };

  return (
    <div className="space-y-8" id="assets-section">
      {/* Hero Banner with AI Asset Generator Button */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/50 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-400" /> Store Asset Studio
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">AI Asset Studio & Dimension Guide Suite</h2>
            <p className="text-xs text-indigo-200/80 leading-relaxed">
              Generate pixel-accurate 512x512 app icons, 1024x500 feature banners, and device screenshots with built-in dimension overlays and Google Play safe-zone guides.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="shrink-0 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Wand2 className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>AI Asset Generator</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {appliedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-emerald-100 border border-emerald-700/80 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{appliedNotification}</span>
        </div>
      )}

      {/* 512x512 App Icon Module */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-zinc-900 font-sans">1. App Icon (512x512)</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setModalTab('icon');
                setShowAiModal(true);
              }}
              className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1 rounded-lg border border-indigo-100 flex items-center gap-1 transition-all"
            >
              <Wand2 className="w-3 h-3 text-amber-500" /> AI Guide
            </button>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-mono font-bold px-2.5 py-1 rounded-full uppercase">
              Mandatory
            </span>
          </div>
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
                      ? 'bg-zinc-800 text-white border-zinc-900' 
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
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
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
            <div className="border border-zinc-200 p-4 rounded-xl space-y-3 bg-zinc-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-indigo-700">
                  <Sparkles className="w-3.5 h-3.5" /> Fast 512x512 Canvas Art Generator
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setModalTab('icon');
                    setShowAiModal(true);
                  }}
                  className="text-[10px] text-indigo-600 hover:underline font-bold flex items-center gap-1"
                >
                  <Wand2 className="w-3 h-3" /> Advanced AI Studio
                </button>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {(['indigo', 'emerald', 'amber', 'rose', 'cyber'] as const).map((pr) => (
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
                  className="w-2/3 py-1.5 px-3 bg-indigo-600 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-indigo-700 shadow-sm cursor-pointer"
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setModalTab('feature');
                setShowAiModal(true);
              }}
              className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1 rounded-lg border border-indigo-100 flex items-center gap-1 transition-all"
            >
              <Wand2 className="w-3 h-3 text-amber-500" /> AI Guide
            </button>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-mono font-bold px-2.5 py-1 rounded-full uppercase">
              Mandatory
            </span>
          </div>
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
              className="py-4 px-6 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl text-xs font-bold leading-normal flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-transform cursor-pointer"
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
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setModalTab('phone');
                setShowAiModal(true);
              }}
              className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1 rounded-lg border border-indigo-100 flex items-center gap-1 transition-all"
            >
              <Wand2 className="w-3 h-3 text-amber-500" /> AI Mock Studio
            </button>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-mono font-bold px-2.5 py-1 rounded-full uppercase">
              Mandatory
            </span>
          </div>
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
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  applySingleAssetFromModal('phone');
                }}
                className="text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-600" /> Generate Mock
              </button>
              <button
                type="button"
                onClick={() => fileInputPhone.current?.click()}
                className="text-[10px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 w-auto cursor-pointer"
              >
                + Add Phone Mock
              </button>
            </div>
            <input 
              ref={fileInputPhone}
              type="file" 
              accept="image/*"
              onChange={(e) => handleUpload(e, 'screenshot_phone')}
              className="hidden" 
            />
          </div>

          <div className="flex gap-4 overflow-x-auto py-3 px-2 bg-zinc-50 rounded-xl border border-zinc-100 scrollbar-thin">
            {assets.screenshotsPhone.length === 0 ? (
              <div className="w-full text-center py-8 font-mono text-[10px] text-zinc-400">
                📱 No phone store screenshots mockups uploaded. Upload files or click "Generate Mock" to preview!
              </div>
            ) : (
              assets.screenshotsPhone.map((pic) => (
                <div key={pic.id} className="relative flex-shrink-0 group">
                  {/* Virtual Smartphone frame */}
                  <div className="w-[124px] h-[220px] bg-zinc-900 rounded-[18px] p-2 ring-4 ring-zinc-800 shadow-lg relative overflow-hidden flex items-center justify-center">
                    <img src={pic.url} alt="Phone Listing" className="w-full h-full object-cover rounded-[12px] bg-white" referrerPolicy="no-referrer" />
                    {/* Ear Speaker Hole */}
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
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  applySingleAssetFromModal('tablet');
                }}
                className="text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-600" /> Generate Tablet Mock
              </button>
              <button
                type="button"
                onClick={() => fileInputTablet.current?.click()}
                className="text-[10px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 w-auto cursor-pointer"
              >
                + Add Tablet Mock
              </button>
            </div>
            <input 
              ref={fileInputTablet}
              type="file" 
              accept="image/*"
              onChange={(e) => handleUpload(e, 'screenshot_tablet')}
              className="hidden" 
            />
          </div>

          <div className="flex gap-4 overflow-x-auto py-3 px-2 bg-zinc-50 rounded-xl border border-zinc-100 scrollbar-thin">
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

      {/* AI ASSET GENERATOR & DIMENSION GUIDE MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-amber-400">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    AI Store Asset Studio & Dimension Guides
                  </h3>
                  <p className="text-xs text-slate-400">
                    Visual placeholders, exact pixel dimension specifications, and safe zone guidelines for Google Play Store.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-900/80 px-5 gap-2 overflow-x-auto">
              {[
                { id: 'icon', label: 'App Icon (512×512)', icon: Smartphone },
                { id: 'feature', label: 'Feature Banner (1024×500)', icon: Eye },
                { id: 'phone', label: 'Phone Mock (1080×1920)', icon: Smartphone },
                { id: 'tablet', label: 'Tablet Mock (1920×1200)', icon: Tablet }
              ].map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setModalTab(tab.id as any)}
                    className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                      modalTab === tab.id
                        ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body & Live Preview */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Studio Controls Bar */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Theme Selector */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Visual Color Theme
                  </label>
                  <select
                    value={activePreset}
                    onChange={(e) => setActivePreset(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {Object.entries(presetsGradients).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Symbol / Monogram */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Icon / Monogram Glyph
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={generatorSymbol}
                    onChange={(e) => setGeneratorSymbol(e.target.value)}
                    placeholder="Emoji or Monogram"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs font-bold text-center focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Dimension Guides Toggle */}
                <div className="space-y-1.5 flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={() => setIncludeGuides(!includeGuides)}
                    className={`w-full py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      includeGuides
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>{includeGuides ? 'Dimension Overlay: ON' : 'Dimension Overlay: OFF'}</span>
                  </button>
                </div>
              </div>

              {/* Active Tab Graphic Preview & Dimension Spec Guide */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Visual Preview Frame */}
                <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center min-h-[280px]">
                  {modalTab === 'icon' && (
                    <div className="space-y-4 flex flex-col items-center">
                      <div className="relative w-56 h-56 rounded-2xl overflow-hidden ring-4 ring-indigo-500/30 shadow-2xl">
                        <img 
                          src={generateIconCanvas(includeGuides).fullUrl} 
                          alt="Icon Preview" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-xs font-mono text-indigo-300 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
                        512 × 512 PX • 32-bit PNG • 1:1 Square
                      </span>
                    </div>
                  )}

                  {modalTab === 'feature' && (
                    <div className="space-y-3 w-full flex flex-col items-center">
                      <div className="relative aspect-[1024/500] w-full rounded-xl overflow-hidden ring-2 ring-indigo-500/30 shadow-2xl">
                        <img 
                          src={generateFeatureCanvas(includeGuides).fullUrl} 
                          alt="Feature Banner Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-mono text-indigo-300 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
                        1024 × 500 PX • 1024:500 Aspect Banner
                      </span>
                    </div>
                  )}

                  {modalTab === 'phone' && (
                    <div className="space-y-3 flex flex-col items-center">
                      <div className="relative w-[180px] h-[320px] rounded-[24px] overflow-hidden ring-4 ring-slate-700 shadow-2xl bg-black">
                        <img 
                          src={generatePhoneCanvas(includeGuides).fullUrl} 
                          alt="Phone Screenshot Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-mono text-indigo-300 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
                        1080 × 1920 PX • 9:16 Portrait Ratio
                      </span>
                    </div>
                  )}

                  {modalTab === 'tablet' && (
                    <div className="space-y-3 w-full flex flex-col items-center">
                      <div className="relative aspect-[16/10] w-full max-w-[480px] rounded-[16px] overflow-hidden ring-4 ring-slate-700 shadow-2xl bg-black">
                        <img 
                          src={generateTabletCanvas(includeGuides).fullUrl} 
                          alt="Tablet Screenshot Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-mono text-indigo-300 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
                        1920 × 1200 PX • 16:10 Landscape Ratio
                      </span>
                    </div>
                  )}
                </div>

                {/* Dimension Guide Specs & Tips Panel */}
                <div className="space-y-4 bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 text-xs">
                  <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" /> Specification Guide
                  </h4>

                  {modalTab === 'icon' && (
                    <div className="space-y-2.5 text-slate-300 leading-relaxed">
                      <p><strong>Required Dimensions:</strong> 512 x 512 pixels (exact).</p>
                      <p><strong>Format:</strong> 32-bit PNG with alpha transparency channel.</p>
                      <p><strong>Masking Rule:</strong> Do NOT add rounded corners to your raw file! Google Play automatically applies a 20% squircle mask.</p>
                      <p><strong>Max File Size:</strong> 1,024 KB (1 MB).</p>
                    </div>
                  )}

                  {modalTab === 'feature' && (
                    <div className="space-y-2.5 text-slate-300 leading-relaxed">
                      <p><strong>Required Dimensions:</strong> 1024 x 500 pixels (exact).</p>
                      <p><strong>Safe Text Zone:</strong> Centered 70% width area (153px side margins). Text/logos outside this margin may be cut off on small devices.</p>
                      <p><strong>Format:</strong> PNG or JPEG (no transparency required).</p>
                    </div>
                  )}

                  {modalTab === 'phone' && (
                    <div className="space-y-2.5 text-slate-300 leading-relaxed">
                      <p><strong>Recommended Resolution:</strong> 1080 x 1920 or 1080 x 2400 pixels (16:9 / 18:9 ratio).</p>
                      <p><strong>Minimum Count:</strong> At least 2 phone screenshots are required to publish on Google Play.</p>
                      <p><strong>Tip:</strong> Highlight core app features in the first 3 screenshots as they appear in search results.</p>
                    </div>
                  )}

                  {modalTab === 'tablet' && (
                    <div className="space-y-2.5 text-slate-300 leading-relaxed">
                      <p><strong>Recommended Resolution:</strong> 1920 x 1200 or 2560 x 1600 pixels (16:10 ratio).</p>
                      <p><strong>Target Sizes:</strong> 7-inch & 10-inch tablet device listings.</p>
                      <p><strong>Discovery Score:</strong> Providing tablet screenshots boosts your store ranking for tablet users by up to 35%.</p>
                    </div>
                  )}

                  {/* Actions for active tab */}
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <button
                      type="button"
                      onClick={() => applySingleAssetFromModal(modalTab)}
                      className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Apply Current Asset</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadActiveAsset(modalTab)}
                      className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PNG Guide</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Instantly generate complete matching set for all 4 asset requirements.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={applyAllAssetsFromModal}
                  disabled={isBatchGenerating}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isBatchGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating Assets...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-200" />
                      <span>Generate & Apply All Assets</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

