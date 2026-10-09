import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Play,
  Square,
  Volume2,
  VolumeX,
  Award,
  Gift,
} from 'lucide-react';

interface HeroProps {
  onJoinWaitlist: () => void;
  onExploreSavings: () => void;
  onOpenPodcast?: () => void;
  isVideoPlaying?: boolean;
  isVideoMuted?: boolean;
  onToggleVideo?: () => void;
  onStopVideo?: () => void;
  onToggleMute?: () => void;
  onUnmuteAndRestart?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onJoinWaitlist,
  onExploreSavings,
  onOpenPodcast,
  isVideoPlaying = true,
  isVideoMuted = true,
  onToggleVideo,
  onStopVideo,
  onToggleMute,
  onUnmuteAndRestart,
}) => {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between items-center text-center px-4 sm:px-6 pt-6 pb-12 overflow-hidden select-none bg-transparent">
      {/* Soft, Transparent Luxury Vignettes — Background Video Is 100% Vividly Visible */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-neutral-950/40 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-neutral-950/40 pointer-events-none" />

      {/* Top Floating Badge */}
      <div className="relative z-10 pt-2 animate-in fade-in duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-950/60 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-medium shadow-xl shadow-black/50">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Bedbank Wholesale Hotels &amp; Duffel NDC Flights • Zero Middleman Fees</span>
        </div>
      </div>

      {/* Center Hero: Translucent Minimalist Typography — Video Visible Right Through Text */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-6 my-auto py-8">
        <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-neutral-100 leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
          Sovereign Travel. <br />
          <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            Half Price For Life.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-neutral-100 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] px-4">
          Booking.com and Expedia charge massive markups to fund retail ad campaigns. Atlas connects private members directly to wholesale bedbank inventory and Duffel NDC commercial flights at pure cost.
        </p>

        {/* Prominent Golden Sound Prompt (Shown whenever video is playing muted) */}
        {isVideoMuted && isVideoPlaying && (
          <div className="pt-1 animate-in fade-in duration-500">
            <button
              type="button"
              data-action="toggle-audio"
              onClick={onUnmuteAndRestart}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/25 via-amber-400/35 to-amber-500/25 hover:from-amber-400/40 hover:to-amber-300/40 border border-amber-400 text-amber-200 font-semibold text-xs sm:text-sm shadow-xl shadow-amber-500/20 backdrop-blur-md animate-pulse cursor-pointer transition-all scale-100 hover:scale-105"
            >
              <Volume2 className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>Click to Unmute Voiceover & Music (0:38)</span>
              <span className="text-[10px] bg-amber-400/25 px-2 py-0.5 rounded font-mono text-amber-300 font-bold">0:38</span>
            </button>
          </div>
        )}

        {/* Primary Action Button Cluster: "See Your Savings" + "Claim Founder Spot" */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          {/* Main Primary Button: Glides straight to calculator */}
          <button
            type="button"
            onClick={() => {
              onStopVideo?.();
              onExploreSavings();
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold text-sm sm:text-base uppercase tracking-wider shadow-2xl shadow-amber-500/40 transition-all scale-100 hover:scale-105 cursor-pointer flex items-center justify-center gap-2.5"
          >
            <Sparkles className="w-4 h-4 text-neutral-950" />
            <span>See Your Savings (Calculator)</span>
            <ArrowRight className="w-4 h-4 text-neutral-950" />
          </button>

          {/* Secondary Action: Join waiting list */}
          <button
            type="button"
            onClick={() => {
              onStopVideo?.();
              onJoinWaitlist();
            }}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-neutral-950/70 hover:bg-neutral-900 border border-amber-400/40 hover:border-amber-400 text-amber-300 font-bold text-xs sm:text-sm uppercase tracking-wider backdrop-blur-md shadow-xl transition-all scale-100 hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Claim Founder Spot (50% Off)</span>
          </button>
        </div>

        {/* Video & Sound Controls Bar */}
        <div className="pt-3 flex items-center justify-center gap-2.5 flex-wrap">
          {/* Stop / Resume Video Button */}
          <button
            type="button"
            data-action="toggle-video"
            onClick={onToggleVideo}
            className="px-4 py-2 rounded-full border border-neutral-700 bg-neutral-950/70 hover:bg-neutral-900 text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-2 transition-all shadow-xl backdrop-blur-md cursor-pointer"
          >
            {isVideoPlaying ? (
              <>
                <Square className="w-3 h-3 fill-red-400 text-red-400" />
                <span className="font-semibold">Stop Video</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-amber-300 text-amber-300" />
                <span className="font-semibold text-amber-300">Play Video & Sound</span>
              </>
            )}
          </button>

          {/* Audio Controller Indicator */}
          {isVideoPlaying && (
            <button
              type="button"
              data-action="toggle-audio"
              onClick={onToggleMute}
              className={`px-4 py-2 rounded-full border text-xs font-mono flex items-center gap-2.5 transition-all shadow-xl backdrop-blur-md cursor-pointer ${
                !isVideoMuted
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-emerald-400/20'
                  : 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-amber-400/20 animate-pulse'
              }`}
              title={!isVideoMuted ? 'Mute Voiceover and Music' : 'Play Voiceover and Music'}
            >
              {!isVideoMuted ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="font-semibold text-emerald-300">Voiceover & Music Active</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                  <span className="text-amber-300 font-bold">Tap to Unmute Sound</span>
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-400/20 px-1.5 py-0.5 rounded">0:38</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Bottom Floating Bar: 2 Core Guarantees & Live Destination */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-neutral-300">
        {/* Left: 50% Lifetime + 5 Free Draws */}
        <div className="flex items-center gap-3 bg-neutral-950/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-neutral-800/80 shadow-lg">
          <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
            <Award className="w-3.5 h-3.5" />
            50% Off Membership For Life
          </span>
          <span className="text-neutral-600">•</span>
          <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
            <Gift className="w-3.5 h-3.5" />
            5 Free Lifetime Memberships Draw
          </span>
        </div>

        {/* Right: Live Luxury Destination Pill */}
        <div className="flex items-center gap-2 bg-neutral-950/60 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-neutral-800/80 text-[11px] shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-neutral-300 font-medium">White Dunes Luxury Suites • Paros</span>
          <span className="text-neutral-600">•</span>
          <span className="text-emerald-400 font-bold">Save 45% Net</span>
        </div>
      </div>
    </section>
  );
};
