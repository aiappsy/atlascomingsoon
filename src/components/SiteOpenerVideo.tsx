import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Compass,
  CheckCircle2,
} from 'lucide-react';

interface SiteOpenerVideoProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimSpot: () => void;
  onExploreSavings: () => void;
}

interface ScriptBeat {
  startSec: number;
  endSec: number;
  badge: string;
  headline: string;
  subtext: string;
}

// 100% Direct, Blunt, Natural Language — Zero Jargon
const SCRIPT_BEATS: ScriptBeat[] = [
  {
    startSec: 0,
    endSec: 4.8,
    badge: 'THE MIDDLEMAN RIP-OFF',
    headline: 'Booking.com and Expedia Are Ripping You Off',
    subtext: 'They add massive markups—up to 45%—just to pay for their TV commercials and corporate profits.',
  },
  {
    startSec: 4.8,
    endSec: 10.2,
    badge: 'THE SECRET WHOLESALE PRICE',
    headline: 'Hotels Have A Secret Wholesale Price Tourists Never See',
    subtext: 'Atlas Travel Club cuts out the middlemen and gives you that wholesale price directly.',
  },
  {
    startSec: 10.2,
    endSec: 15.5,
    badge: 'SAME 5-STAR LUXURY • UP TO 45% LESS',
    headline: 'Same 5-Star Hotels. Same Luxury Villas. 45% Less Out Of Your Pocket.',
    subtext: 'No fake loyalty point traps. No middleman fees. Just direct wholesale prices.',
  },
  {
    startSec: 15.5,
    endSec: 20.8,
    badge: 'LOCK IN HALF PRICE FOR LIFE',
    headline: 'Join The Waiting List — Lock In Half Price For Life',
    subtext: 'Join our prelaunch waiting list today, and lock in your membership at half price for life.',
  },
  {
    startSec: 20.8,
    endSec: 28.0,
    badge: '5 FREE LIFETIME PASSES',
    headline: 'Win 1 of 5 Free Lifetime Memberships (Zero Dues Forever)',
    subtext: 'Plus, five founder members will win a completely free lifetime membership—you will never pay a single cent in annual dues.',
  },
];

export const SiteOpenerVideo: React.FC<SiteOpenerVideoProps> = ({
  isOpen,
  onClose,
  onClaimSpot,
  onExploreSavings,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasStartedAudio, setHasStartedAudio] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentSec, setCurrentSec] = useState<number>(0);
  const [activeBeatIndex, setActiveBeatIndex] = useState<number>(0);

  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize and handle playback
  useEffect(() => {
    if (!isOpen) {
      stopAllAudio();
      return;
    }

    // Prepare voiceover audio element
    const audio = new Audio('/audio/founder-voiceover.mp3');
    audio.preload = 'auto';
    voiceAudioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio) {
        setCurrentSec(audio.currentTime);
      }
    };

    const handleEnded = () => {
      // Voiceover ended: fade out music smoothly over 4 seconds
      fadeOutMusic(4);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      stopAllAudio();
    };
  }, [isOpen]);

  // Track active storyboard beat
  useEffect(() => {
    const idx = SCRIPT_BEATS.findIndex(
      (b) => currentSec >= b.startSec && currentSec < b.endSec
    );
    if (idx !== -1 && idx !== activeBeatIndex) {
      setActiveBeatIndex(idx);
    }
  }, [currentSec, activeBeatIndex]);

  // Start combined Voiceover + Cinematic Ambient Background Music
  const startFullAudioExperience = async () => {
    try {
      // 1. Initialize Web Audio API for ambient cinematic music
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx && !audioCtxRef.current) {
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Master gain for music
        const musicGain = ctx.createGain();
        musicGain.gain.setValueAtTime(0.06, ctx.currentTime); // Sits gently under the voice
        musicGain.connect(ctx.destination);
        musicGainRef.current = musicGain;

        // Warm luxury harmonic chords (F#m9 / Dmaj7)
        const chordFreqs = [73.42, 110.0, 146.83, 220.0, 277.18, 329.63, 440.0];
        chordFreqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          // Gentle undulating harmonic movement
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(0.15 + idx * 0.04, ctx.currentTime);
          lfoGain.gain.setValueAtTime(0.015, ctx.currentTime);
          lfo.connect(lfoGain.gain);
          lfo.start();

          gain.gain.setValueAtTime(0.035 / chordFreqs.length, ctx.currentTime);
          osc.connect(gain);
          gain.connect(musicGain);
          osc.start();
        });
      }

      // 2. Play voiceover
      if (voiceAudioRef.current) {
        voiceAudioRef.current.currentTime = 0;
        voiceAudioRef.current.volume = 1.0;
        await voiceAudioRef.current.play();
      }

      setIsPlaying(true);
      setHasStartedAudio(true);
    } catch {
      // Audio autoplay policy handled
      setHasStartedAudio(true);
      setIsPlaying(true);
    }
  };

  const fadeOutMusic = (durationSec = 4) => {
    if (musicGainRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      musicGainRef.current.gain.linearRampToValueAtTime(0.0001, now + durationSec);
      setTimeout(() => {
        stopAllAudio();
      }, durationSec * 1000);
    }
  };

  const stopAllAudio = () => {
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current.currentTime = 0;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {
        // ignore
      }
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const toggleMute = () => {
    if (voiceAudioRef.current) {
      voiceAudioRef.current.muted = !isMuted;
    }
    if (musicGainRef.current && audioCtxRef.current) {
      if (!isMuted) {
        musicGainRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
      } else {
        musicGainRef.current.gain.setValueAtTime(0.06, audioCtxRef.current.currentTime);
      }
    }
    setIsMuted(!isMuted);
  };

  if (!isOpen) return null;

  const currentBeat = SCRIPT_BEATS[activeBeatIndex] || SCRIPT_BEATS[0];
  const progressPct = Math.min(100, (currentSec / 25) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden select-none animate-in fade-in duration-300">
      {/* Background 4K Cinematic Luxury Drone Video Stream — HIGH VISIBILITY */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <iframe
          className="w-full h-full object-cover scale-110 pointer-events-none opacity-85"
          src="https://www.youtube-nocookie.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&controls=0&loop=1&playlist=LXb3EKWsInQ&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3"
          title="Atlas 4K Opener"
          allow="autoplay; encrypted-media"
        />
        {/* Soft, Transparent Vignette: Preserves vibrant ocean & villa visuals */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/50 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-neutral-950/60 pointer-events-none" />
      </div>

      {/* Top Header Bar inside Opener */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-amber-400/50 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-xl shadow-black/80">
            <Compass className="w-5 h-5 text-amber-300 animate-spin-slow" />
          </div>
          <div>
            <span className="font-cinzel text-lg font-bold tracking-[0.2em] text-neutral-100 uppercase drop-shadow">
              Atlas
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 ml-2 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 font-bold backdrop-blur-md">
              Private Prelaunch
            </span>
          </div>
        </div>

        {/* Controls: Audio Toggle & Skip/Enter Club */}
        <div className="flex items-center gap-3">
          {hasStartedAudio && (
            <button
              type="button"
              onClick={toggleMute}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-700 text-xs font-mono text-neutral-300 flex items-center gap-2 transition cursor-pointer backdrop-blur-md"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-neutral-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span>{isMuted ? 'Unmute' : 'Voiceover & Music Active'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-neutral-950/85 hover:bg-neutral-900 border border-neutral-700 text-xs font-mono text-neutral-200 hover:text-white transition cursor-pointer flex items-center gap-1.5 backdrop-blur-md"
          >
            <span>Skip to Club</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Center Stage: Glassmorphic Contrast Card over Visible Luxury Video */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        {/* Play with Sound Starter Overlay (Prominently unblocks browser audio autoplay) */}
        {!hasStartedAudio ? (
          <div className="p-6 sm:p-10 rounded-3xl bg-neutral-950/75 border border-amber-400/40 backdrop-blur-xl shadow-2xl shadow-black/90 space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-xs font-mono uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Wholesale Hotel Rates • Zero Middleman Fees</span>
            </div>

            <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-neutral-100 leading-[1.12] drop-shadow-lg">
              Never Pay Retail Travel <br />
              <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 bg-clip-text text-transparent">
                Markups Again.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-200 max-w-xl mx-auto leading-relaxed">
              Booking.com and Expedia charge up to 45% markups just to pay for TV ads. Atlas cuts out the middlemen and gives you secret wholesale hotel prices directly.
            </p>

            {/* Giant Play with Voiceover & Music Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={startFullAudioExperience}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold text-sm sm:text-base uppercase tracking-wider shadow-2xl shadow-amber-500/40 transition-all scale-100 hover:scale-105 cursor-pointer flex items-center justify-center gap-3 group"
              >
                <div className="w-7 h-7 rounded-full bg-neutral-950 text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-3.5 h-3.5 fill-amber-300 text-amber-300 ml-0.5" />
                </div>
                <span>Play With Voiceover & Music</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-sm font-semibold transition cursor-pointer"
              >
                Enter Site Directly
              </button>
            </div>
          </div>
        ) : (
          /* Active Playing Opener: Blunt, Direct Sales Copy Synced with Audio */
          <div className="p-6 sm:p-10 rounded-3xl bg-neutral-950/80 border-2 border-amber-400/60 backdrop-blur-xl shadow-2xl shadow-black/95 space-y-5 animate-in fade-in duration-300">
            {/* Active Beat Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-xs font-mono font-bold uppercase tracking-widest shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentBeat.badge}</span>
            </div>

            {/* Active Selling Headline */}
            <h1 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold text-neutral-100 leading-tight drop-shadow-md">
              {currentBeat.headline}
            </h1>

            {/* Active Spoken Sentence in Quotes */}
            <p className="text-sm sm:text-lg text-amber-100 max-w-xl mx-auto leading-relaxed drop-shadow font-light">
              "{currentBeat.subtext}"
            </p>

            {/* Timeline Progress Bar */}
            <div className="max-w-md mx-auto h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 transition-all duration-200 ease-linear shadow-sm shadow-amber-400/50"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Direct Blunt Call To Action Cluster (SELL, SELL, SELL) */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  stopAllAudio();
                  onClose();
                  onClaimSpot();
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-2xl shadow-amber-500/40 transition-all scale-100 hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-neutral-950" />
                <span>Lock In Half Price For Life</span>
                <ArrowRight className="w-4 h-4 text-neutral-950" />
              </button>

              <button
                type="button"
                onClick={() => {
                  stopAllAudio();
                  onClose();
                  onExploreSavings();
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-amber-400/40 text-neutral-100 font-semibold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Calculate Your Savings</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Blunt Guarantees */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-neutral-300">
              <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Award className="w-3.5 h-3.5" />
                5 Free Lifetime Memberships Draw
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Up To 45% Wholesale Discount
              </span>
              <span>•</span>
              <span>Zero Middleman Fees</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 py-4 bg-neutral-950/70 border-t border-neutral-900/80 flex items-center justify-between text-xs text-neutral-400 font-mono">
        <div className="flex items-center gap-2">
          <span>Atlas Travel Club</span>
          <span>•</span>
          <span>Direct Wholesale Hotel Rates</span>
        </div>
        <div>
          <span className="text-amber-300 font-semibold">Founder Member Prelaunch Active</span>
        </div>
      </div>
    </div>
  );
};
