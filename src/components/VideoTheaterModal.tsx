import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Maximize2,
  Compass,
} from 'lucide-react';

interface VideoTheaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimSpot: () => void;
}

interface ScriptBeat {
  startSec: number;
  endSec: number;
  label: string;
  headline: string;
  narration: string;
  badge: string;
}

const SCRIPT_BEATS: ScriptBeat[] = [
  {
    startSec: 0,
    endSec: 7,
    label: '01. The Retail Trap',
    headline: 'Bypass Heavy Public Retail Markups',
    narration:
      'Every time you book luxury hotels on public travel portals, you pay heavy commission markups that subsidize commercial ads and TV campaigns.',
    badge: 'RATE PARITY EXEMPT',
  },
  {
    startSec: 7,
    endSec: 15,
    label: '02. Direct B2B Wholesale',
    headline: 'Direct Bedbank Settlement (Hotelbeds & WebBeds)',
    narration:
      'Atlas Travel Club connects members directly to institutional wholesale bedbanks at true net wholesale prices without middleman markups.',
    badge: 'WHOLESALE NET',
  },
  {
    startSec: 15,
    endSec: 23,
    label: '03. Up To 45% Net Savings',
    headline: 'Same 5-Star Luxury. Save Up To 45% Net.',
    narration:
      'Access over 1,000,000 five-star hotels and private villas worldwide, saving up to 45% on every single journey.',
    badge: 'UP TO 45% ARBITRAGE',
  },
  {
    startSec: 23,
    endSec: 31,
    label: '04. Half Price For Life',
    headline: 'Lock In Your Membership At Half Price For Life',
    narration:
      'Join our exclusive prelaunch waiting list today to lock in your membership at half price for life.',
    badge: '50% OFF FOR LIFE',
  },
  {
    startSec: 31,
    endSec: 38,
    label: '05. 5 Free Lifetime Draws',
    headline: 'Win 1 of 5 Free Lifetime Memberships',
    narration:
      'Plus, five lucky founder members will win a completely free lifetime membership with zero annual dues forever.',
    badge: '5 FREE LIFETIME PASSES',
  },
];

export const VideoTheaterModal: React.FC<VideoTheaterModalProps> = ({
  isOpen,
  onClose,
  onClaimSpot,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentSec, setCurrentSec] = useState<number>(0);
  const [activeBeatIndex, setActiveBeatIndex] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);

  // Play luxury ambient drone audio synthesized smoothly via Web Audio API
  useEffect(() => {
    if (!isOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      stopAmbientAudio();
      return;
    }

    setCurrentSec(0);
    setActiveBeatIndex(0);
    setIsPlaying(true);

    // Timeline progress loop
    timerRef.current = window.setInterval(() => {
      setCurrentSec((prev) => {
        const next = prev + 0.25;
        if (next >= 38) {
          // Loop or linger at end
          return 0;
        }
        return next;
      });
    }, 250);

    startAmbientAudio();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopAmbientAudio();
    };
  }, [isOpen]);

  // Synchronize script beats with playback time
  useEffect(() => {
    const idx = SCRIPT_BEATS.findIndex(
      (b) => currentSec >= b.startSec && currentSec < b.endSec
    );
    if (idx !== -1 && idx !== activeBeatIndex) {
      setActiveBeatIndex(idx);
    }
  }, [currentSec, activeBeatIndex]);

  // Ambient sound synthesizer: warm luxury chords and soft ocean harmonics
  const startAmbientAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : 0.08, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Warm luxury chord frequencies (F# minor 9th luxury ambient chord)
      const freqs = [92.5, 138.59, 185.0, 220.0, 277.18, 329.63];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Gentle undulating LFO for peaceful movement
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.2 + i * 0.05, ctx.currentTime);
        lfoGain.gain.setValueAtTime(0.02, ctx.currentTime);
        lfo.connect(lfoGain.gain);
        lfo.start();

        oscGain.gain.setValueAtTime(0.04 / freqs.length, ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
      });
    } catch {
      // Audio autoplay policy handled gracefully
    }
  };

  const stopAmbientAudio = () => {
    if (audioContextRef.current) {
      try {
        if (gainNodeRef.current) {
          gainNodeRef.current.gain.linearRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.5);
        }
        setTimeout(() => {
          audioContextRef.current?.close();
          audioContextRef.current = null;
        }, 500);
      } catch {
        audioContextRef.current = null;
      }
    }
  };

  const toggleSound = () => {
    if (gainNodeRef.current && audioContextRef.current) {
      if (isMuted) {
        gainNodeRef.current.gain.linearRampToValueAtTime(0.08, audioContextRef.current.currentTime + 0.3);
        setIsMuted(false);
      } else {
        gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.3);
        setIsMuted(true);
      }
    } else {
      setIsMuted(!isMuted);
    }
  };

  const jumpToBeat = (index: number) => {
    setActiveBeatIndex(index);
    setCurrentSec(SCRIPT_BEATS[index].startSec);
  };

  if (!isOpen) return null;

  const currentBeat = SCRIPT_BEATS[activeBeatIndex] || SCRIPT_BEATS[0];
  const progressPct = Math.min(100, (currentSec / 38) * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-neutral-950 border border-amber-400/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Video Header */}
        <div className="relative z-20 px-4 sm:px-6 py-3.5 bg-neutral-950/90 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-amber-400/50 bg-neutral-900 flex items-center justify-center text-amber-300">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <span className="font-cinzel text-sm sm:text-base font-bold tracking-wider text-neutral-100 flex items-center gap-2">
                <span>Atlas Travel Club</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  Prelaunch Trailer
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSound}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition cursor-pointer ${
                !isMuted
                  ? 'bg-amber-400/20 border-amber-400/60 text-amber-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
              title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isMuted ? 'Sound Off' : 'Sound On'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100 flex items-center justify-center transition border border-neutral-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cinematic Video Player Container */}
        <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
          {/* Embedded High-Definition 4K Cinematic Luxury Drone Travel Stream */}
          <iframe
            className="w-full h-full object-cover scale-105 pointer-events-none"
            src="https://www.youtube-nocookie.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&controls=0&loop=1&playlist=LXb3EKWsInQ&modestbranding=1&rel=0&showinfo=0"
            title="Atlas Luxury Travel 4K Teaser"
            allow="autoplay; encrypted-media"
          />

          {/* Vignette Gradients for Contrast & Luxury Tone */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/60 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-neutral-950/30 to-neutral-950/80 pointer-events-none" />

          {/* Top Left Watermark */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-950/70 backdrop-blur-md border border-amber-400/30 text-[11px] font-mono text-amber-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>4K CINEMATIC REEL</span>
          </div>

          {/* Top Right Duration */}
          <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-neutral-950/70 backdrop-blur-md border border-neutral-800 text-[11px] font-mono text-neutral-300">
            <span>{Math.floor(currentSec).toString().padStart(2, '0')}:38</span>
          </div>

          {/* Dynamic Center/Bottom Subtitle & Storyboard HUD */}
          <div className="absolute bottom-16 sm:bottom-20 left-4 right-4 sm:left-10 sm:right-10 z-10 text-center space-y-2 pointer-events-none animate-in fade-in duration-500 key={activeBeatIndex}">
            <div className="inline-block px-3 py-1 rounded-full bg-amber-400/25 border border-amber-400/50 text-amber-300 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest backdrop-blur-md shadow-lg shadow-black/50">
              {currentBeat.badge}
            </div>
            <h2 className="font-cinzel text-xl sm:text-3xl md:text-4xl font-bold text-neutral-100 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] max-w-3xl mx-auto leading-tight">
              {currentBeat.headline}
            </h2>
            <p className="text-xs sm:text-base text-neutral-200 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-light px-2">
              "{currentBeat.narration}"
            </p>
          </div>

          {/* Play/Pause Center Overlay (Hover/Tap) */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 flex items-center justify-center group cursor-pointer"
          >
            {!isPlaying && (
              <div className="w-16 h-16 rounded-full bg-amber-400/90 text-neutral-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 scale-100 group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 fill-neutral-950 ml-1" />
              </div>
            )}
          </button>

          {/* Timeline Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-neutral-900/80 z-20">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 transition-all duration-300 ease-linear shadow-sm shadow-amber-400/50"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Bottom Interactive Chapter Navigation & Call To Action */}
        <div className="p-4 sm:p-5 bg-neutral-950 border-t border-neutral-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Chapter Chips */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {SCRIPT_BEATS.map((beat, idx) => {
              const isActive = idx === activeBeatIndex;
              return (
                <button
                  key={beat.label}
                  type="button"
                  onClick={() => jumpToBeat(idx)}
                  className={`px-2.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-mono font-medium transition cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-400/20 scale-105'
                      : 'bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-400'
                  }`}
                >
                  {beat.label}
                </button>
              );
            })}
          </div>

          {/* Primary Claim Founder Spot CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                onClaimSpot();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Claim Founder Spot (50% Off For Life)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
