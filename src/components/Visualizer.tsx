import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
  analyser: AnalyserNode | null;
  isRecording: boolean;
  mode: 'oscilloscope' | 'spectrum';
  cyanColor?: string;
  orangeColor?: string;
}

export const Visualizer: React.FC<VisualizerProps> = ({ 
  analyser, 
  isRecording, 
  mode,
  cyanColor = '#00F0FF',
  orangeColor = '#FF6B00'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current || !analyser || !isRecording) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use a smaller FFT size for the 64-bar visualization if needed, 
    // but we can just sample the existing data.
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      if (mode === 'oscilloscope') {
        analyser.getByteTimeDomainData(dataArray);
      } else {
        analyser.getByteFrequencyData(dataArray);
      }

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      
      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      if (mode === 'oscilloscope') {
        ctx.lineWidth = 2;
        ctx.strokeStyle = cyanColor;
        ctx.beginPath();
        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }
        ctx.stroke();
      } else {
        // 64-bar visualization
        const barCount = 64;
        const barWidth = (width / barCount) * 0.8;
        const gap = (width / barCount) * 0.2;
        
        // We need to map the bufferLength (usually 1024) to 64 bars
        const step = Math.floor(bufferLength / barCount);

        for (let i = 0; i < barCount; i++) {
          // Average a range of frequencies for each bar
          let sum = 0;
          for (let j = 0; j < step; j++) {
            sum += dataArray[i * step + j];
          }
          const average = sum / step;
          const barHeight = (average / 255) * height;
          
          // Sub-bass is roughly the first 10% of bars (approx 0-60Hz)
          const isSubBass = i < 6; 
          
          ctx.fillStyle = isSubBass ? orangeColor : cyanColor;
          
          // Rounded bars
          const x = i * (barWidth + gap);
          const y = height - barHeight;
          
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
          ctx.fill();

          // Add a subtle glow to the top of the bar
          ctx.shadowBlur = 10;
          ctx.shadowColor = isSubBass ? orangeColor : cyanColor;
        }
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [analyser, isRecording, mode, cyanColor, orangeColor]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full bg-[#050505] rounded-xl border border-white/5"
      width={800}
      height={400}
    />
  );
};
