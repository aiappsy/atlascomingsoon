import React, { useState, useEffect, useRef } from 'react';
import { BackgroundVideo } from './components/BackgroundVideo';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RateTicker } from './components/RateTicker';
import { DynamicSavingsCalculator } from './components/DynamicSavingsCalculator';
import { TrustPillars } from './components/TrustPillars';
import { WaitlistModal } from './components/WaitlistModal';
import { Footer } from './components/Footer';
import { CrmDashboard } from './components/crm/CrmDashboard';
import { CrmAuthGate } from './components/crm/CrmAuthGate';
import { FounderCertificateModal, FounderCertificateData } from './components/FounderCertificateModal';
import { PodcastPlayerModal } from './components/PodcastPlayerModal';
import { CalculationResult } from './lib/calculatorModel';

export default function App() {
  const [viewMode, setViewMode] = useState<'site' | 'crm'>('site');
  const [isCrmAuthenticated, setIsCrmAuthenticated] = useState<boolean>(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState<boolean>(false);
  const [isPodcastOpen, setIsPodcastOpen] = useState<boolean>(false);
  const [podcastTrack, setPodcastTrack] = useState<'summary' | 'deepdive'>('summary');
  const [selectedSavings, setSelectedSavings] = useState<CalculationResult | null>(null);
  const [founderCertificateData, setFounderCertificateData] = useState<FounderCertificateData | null>(null);
  const [isCalculatingVideoPulse, setIsCalculatingVideoPulse] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleStopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsVideoPlaying(false);
  };

  // Automatically pause hero video when any modal opens
  useEffect(() => {
    if (isWaitlistOpen || isPodcastOpen || !!founderCertificateData) {
      handleStopVideo();
    }
  }, [isWaitlistOpen, isPodcastOpen, founderCertificateData]);

  useEffect(() => {
    const isAuth = sessionStorage.getItem('atlas_crm_auth') === 'true';
    setIsCrmAuthenticated(isAuth);

    const checkRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        path === '/admin' ||
        path.startsWith('/admin/') ||
        hash === '#admin' ||
        hash === '#/admin' ||
        hash === '#crm' ||
        search.includes('admin') ||
        search.includes('crm')
      ) {
        setViewMode('crm');
      } else {
        setViewMode('site');
      }
    };
    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('popstate', checkRoute);

    // Keyboard shortcut: Alt+C or Ctrl+Shift+C
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'c') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c')) {
        e.preventDefault();
        window.history.pushState(null, '', '/admin');
        setViewMode('crm');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleToggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
        videoRef.current.play().catch(() => {});
        setIsVideoMuted(false);
        setIsVideoPlaying(true);
      }
    } else {
      setIsVideoPlaying((prev) => !prev);
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      const next = !videoRef.current.muted;
      videoRef.current.muted = next;
      videoRef.current.volume = 1.0;
      setIsVideoMuted(next);
    }
  };

  const handleUnmuteAndRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      videoRef.current.play().catch(() => {});
      setIsVideoMuted(false);
      setIsVideoPlaying(true);
    }
  };

  const handleExploreSavings = () => {
    handleStopVideo();
    document.getElementById('visual-savings-calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUnlockSavings = (savings: CalculationResult) => {
    handleStopVideo();
    setSelectedSavings(savings);
    setIsWaitlistOpen(true);
  };

  const handleCalculationTrigger = () => {
    setIsCalculatingVideoPulse(true);
    setTimeout(() => setIsCalculatingVideoPulse(false), 500);
  };

  const handleBackToSite = () => {
    setViewMode('site');
    if (window.location.pathname.startsWith('/admin') || window.location.hash.includes('admin') || window.location.hash.includes('crm')) {
      window.history.pushState(null, '', '/');
    }
  };

  const handleLockCrm = () => {
    sessionStorage.removeItem('atlas_crm_auth');
    setIsCrmAuthenticated(false);
    handleBackToSite();
  };

  // CRM Routing
  if (viewMode === 'crm') {
    if (!isCrmAuthenticated) {
      return (
        <CrmAuthGate
          onAuthenticated={() => setIsCrmAuthenticated(true)}
          onBackToSite={handleBackToSite}
        />
      );
    }
    return (
      <CrmDashboard
        onBackToSite={handleBackToSite}
        onLockCrm={handleLockCrm}
      />
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col justify-between overflow-x-hidden selection:bg-amber-400 selection:text-neutral-900">
      {/* Unified Background Commercial Video with Built-in Studio Voiceover & Music */}
      <BackgroundVideo
        videoRef={videoRef}
        isCalculating={isCalculatingVideoPulse}
        isPlaying={isVideoPlaying}
        isMuted={isVideoMuted}
        onMuteChange={(muted) => setIsVideoMuted(muted)}
        onEnded={handleStopVideo}
      />

      {/* Header */}
      <Header
        onJoinWaitlist={() => {
          handleStopVideo();
          setIsWaitlistOpen(true);
        }}
        onOpenPodcast={() => {
          handleStopVideo();
          setPodcastTrack('summary');
          setIsPodcastOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center w-full">
        {/* Full-Screen Luxury Video Hero Opener */}
        <Hero
          isVideoPlaying={isVideoPlaying}
          isVideoMuted={isVideoMuted}
          onToggleVideo={handleToggleVideo}
          onStopVideo={handleStopVideo}
          onToggleMute={handleToggleMute}
          onUnmuteAndRestart={handleUnmuteAndRestart}
          onOpenPodcast={() => {
            handleStopVideo();
            setPodcastTrack('summary');
            setIsPodcastOpen(true);
          }}
          onJoinWaitlist={() => {
            handleStopVideo();
            setIsWaitlistOpen(true);
          }}
          onExploreSavings={handleExploreSavings}
        />

        {/* Real Rate Parity Arbitrage Audit Ticker (From Original Repo App) */}
        <RateTicker />

        {/* Dynamic & Visual Savings Calculator */}
        <DynamicSavingsCalculator
          onUnlockSavings={handleUnlockSavings}
          onCalculationTrigger={handleCalculationTrigger}
        />

        {/* Club Pillars */}
        <TrustPillars />
      </main>

      {/* Footer with Discreet Staff Lock Icon */}
      <Footer onOpenCrm={() => {
        window.history.pushState(null, '', '/admin');
        setViewMode('crm');
      }} />

      {/* Early Access / Waitlist Lead Modal */}
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        calculatedSavings={selectedSavings}
        onViewCertificate={(data) => setFounderCertificateData(data)}
      />

      {/* Official Founder Member Certificate Modal */}
      <FounderCertificateModal
        isOpen={!!founderCertificateData}
        onClose={() => setFounderCertificateData(null)}
        data={founderCertificateData}
        onOpenPodcast={(track) => {
          setPodcastTrack(track);
          setIsPodcastOpen(true);
        }}
      />

      {/* How It Works Podcast Deep Dive Player Modal */}
      <PodcastPlayerModal
        isOpen={isPodcastOpen}
        onClose={() => setIsPodcastOpen(false)}
        initialTrack={podcastTrack}
        onOpenWaitlist={() => {
          setIsPodcastOpen(false);
          setIsWaitlistOpen(true);
        }}
        onPlaybackStart={() => setIsVideoPlaying(false)}
      />
    </div>
  );
}
