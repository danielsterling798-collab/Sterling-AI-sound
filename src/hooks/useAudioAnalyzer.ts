import { useEffect, useRef, useState, useCallback } from 'react';

export interface EQBand {
  type: BiquadFilterType;
  frequency: number;
  gain: number;
  q?: number;
}

export interface AudioAnalyzerData {
  analyser: AnalyserNode | null;
  error: string | null;
  isRecording: boolean;
  isMuted: boolean;
  start: () => Promise<void>;
  stop: () => void;
  toggleMute: () => void;
  setEQGain: (index: number, gain: number) => void;
  eqGains: number[];
}

export function useAudioAnalyzer(fftSize: number = 2048): AudioAnalyzerData {
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eqGains, setEqGains] = useState<number[]>([0, 0, 0, 0]); // SUB, BASS, MID, TREBLE
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const filtersRef = useRef<BiquadFilterNode[]>([]);

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsRecording(false);
    setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, []);

  const setEQGain = useCallback((index: number, gain: number) => {
    if (filtersRef.current[index]) {
      filtersRef.current[index].gain.value = gain;
      setEqGains(prev => {
        const next = [...prev];
        next[index] = gain;
        return next;
      });
    }
  }, []);

  const start = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = fftSize;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      // Create 4-band EQ
      // SUB: 20-60Hz (Low shelf)
      // BASS: 60-250Hz (Peaking)
      // MID: 250Hz-4kHz (Peaking)
      // TREBLE: 4kHz+ (High shelf)
      
      const subFilter = audioContext.createBiquadFilter();
      subFilter.type = 'lowshelf';
      subFilter.frequency.value = 60;
      subFilter.gain.value = eqGains[0];

      const bassFilter = audioContext.createBiquadFilter();
      bassFilter.type = 'peaking';
      bassFilter.frequency.value = 155;
      bassFilter.Q.value = 1;
      bassFilter.gain.value = eqGains[1];

      const midFilter = audioContext.createBiquadFilter();
      midFilter.type = 'peaking';
      midFilter.frequency.value = 2125;
      midFilter.Q.value = 1;
      midFilter.gain.value = eqGains[2];

      const trebleFilter = audioContext.createBiquadFilter();
      trebleFilter.type = 'highshelf';
      trebleFilter.frequency.value = 4000;
      trebleFilter.gain.value = eqGains[3];

      filtersRef.current = [subFilter, bassFilter, midFilter, trebleFilter];

      // Chain: Source -> Sub -> Bass -> Mid -> Treble -> Analyser
      source.connect(subFilter);
      subFilter.connect(bassFilter);
      bassFilter.connect(midFilter);
      midFilter.connect(trebleFilter);
      trebleFilter.connect(analyser);

      setIsRecording(true);
      setIsMuted(false);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone. Please ensure permissions are granted.');
      setIsRecording(false);
      setIsMuted(false);
    }
  }, [fftSize, eqGains]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    analyser: analyserRef.current,
    error,
    isRecording,
    isMuted,
    start,
    stop,
    toggleMute,
    setEQGain,
    eqGains
  };
}
