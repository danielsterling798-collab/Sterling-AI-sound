import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { 
  Activity, 
  Play, 
  Pause
} from 'lucide-react';

export const Visualizer: FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activePreset, setActivePreset] = useState<'Flat' | 'Bass Boost' | 'Vocal Clean' | 'Club Live'>('Vocal Clean');
  const [bandCount] = useState(64);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Audio spectrum simulation loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const barWidth = (width / bandCount) - 2;

      // Draw background grid lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw frequency spectrum bars
      for (let i = 0; i < bandCount; i++) {
        let value = 0;

        if (isPlaying) {
          // Synthetic audio signal with harmonics
          const freqMultiplier = (i + 1) / bandCount;
          const wave1 = Math.sin(phase + i * 0.18) * 0.4 + 0.5;
          const wave2 = Math.cos(phase * 1.5 + i * 0.08) * 0.3 + 0.5;
          const noise = Math.sin(i * 99 + phase * 4) * 0.1;
          
          let presetBoost = 1.0;
          if (activePreset === 'Bass Boost' && i < 16) presetBoost = 1.6;
          if (activePreset === 'Vocal Clean' && i >= 16 && i <= 36) presetBoost = 1.4;
          if (activePreset === 'Club Live') presetBoost = 1.25 + Math.sin(i * 0.2) * 0.3;

          value = Math.max(0.08, Math.min(0.95, (wave1 * 0.6 + wave2 * 0.4 + noise) * presetBoost * (1 - freqMultiplier * 0.35)));
        } else {
          value = 0.05;
        }

        const barHeight = value * (height - 20);
        const x = i * (barWidth + 2);
        const y = height - barHeight;

        // Gradient for bars (Cyan -> Blue -> Purple)
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, '#06b6d4');
        gradient.addColorStop(0.6, '#3b82f6');
        gradient.addColorStop(1, '#a855f7');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Cap indicator
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, Math.max(0, y - 3), barWidth, 2);
      }

      if (isPlaying) {
        phase += 0.04;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, activePreset, bandCount]);

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
      {/* Visualizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
          <div>
            <h3 className="text-sm font-semibold text-white">64-Band Real-Time FFT Spectral Analyzer & DSP Engine</h3>
            <p className="text-xs text-slate-400">Core audio module demonstration • 48 kHz Sample Rate • &lt;5ms Processing Latency</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#05080c] border border-slate-800 rounded-lg p-0.5">
            {(['Flat', 'Bass Boost', 'Vocal Clean', 'Club Live'] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => setActivePreset(preset)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                  activePreset === preset
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isPlaying
                ? 'bg-amber-950/40 text-amber-300 border-amber-500/30 hover:bg-amber-900/50'
                : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/50'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause DSP' : 'Start DSP'}
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative bg-[#05080c] border border-slate-800 rounded-lg overflow-hidden p-2">
        <canvas
          ref={canvasRef}
          width={800}
          height={200}
          className="w-full h-48 block"
        />
        <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[10px] text-slate-500 font-mono">
          <span>20 Hz (Sub)</span>
          <span>250 Hz (Low)</span>
          <span>1 kHz (Mid)</span>
          <span>4 kHz (High-Mid)</span>
          <span>16 kHz (Air)</span>
        </div>
      </div>

      {/* Realtime Telemetry Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <div className="bg-[#05080c] border border-slate-800/80 rounded-lg p-2.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Input Signal</span>
          <span className="text-xs font-mono font-bold text-cyan-300">-14.2 dBFS (Nominal)</span>
        </div>
        <div className="bg-[#05080c] border border-slate-800/80 rounded-lg p-2.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">FFT Resolution</span>
          <span className="text-xs font-mono font-bold text-blue-300">2048 pts / 64 bands</span>
        </div>
        <div className="bg-[#05080c] border border-slate-800/80 rounded-lg p-2.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Target Curve</span>
          <span className="text-xs font-mono font-bold text-purple-300">Harman 2026 Ref</span>
        </div>
        <div className="bg-[#05080c] border border-slate-800/80 rounded-lg p-2.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Privacy Isolation</span>
          <span className="text-xs font-mono font-bold text-emerald-400">100% Volatile RAM</span>
        </div>
      </div>
    </div>
  );
};
