class HeroAudioManager {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private needsInteraction = false;
  private progress = 0;
  private listeners: Set<() => void> = new Set();
  private hasInitialized = false;

  public init() {
    if (this.hasInitialized || typeof window === 'undefined') return;
    this.hasInitialized = true;

    try {
      this.audio = new Audio('/audio/hero-voiceover-mastered.mp3?v=20261002_master');
      this.audio.preload = 'auto';
      this.audio.volume = 1.0;

      this.audio.addEventListener('timeupdate', () => {
        if (this.audio && this.audio.duration) {
          this.progress = (this.audio.currentTime / this.audio.duration) * 100;
          this.notify();
        }
      });

      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.progress = 0;
        this.notify();
      });

      // Attempt immediate unmuted playback
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            this.needsInteraction = false;
            this.notify();
          })
          .catch(() => {
            // Autoplay blocked by browser policy
            this.isPlaying = false;
            this.needsInteraction = true;
            this.notify();
            this.attachGlobalGestureListener();
          });
      }
    } catch {
      this.needsInteraction = true;
      this.attachGlobalGestureListener();
    }
  }

  private attachGlobalGestureListener() {
    const handleGesture = () => {
      this.play();
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('pointerdown', handleGesture, true);
      window.removeEventListener('click', handleGesture, true);
      window.removeEventListener('touchstart', handleGesture, true);
      window.removeEventListener('keydown', handleGesture, true);
      window.removeEventListener('wheel', handleGesture, true);
    };

    window.addEventListener('pointerdown', handleGesture, true);
    window.addEventListener('click', handleGesture, true);
    window.addEventListener('touchstart', handleGesture, true);
    window.addEventListener('keydown', handleGesture, true);
    window.addEventListener('wheel', handleGesture, true);
  }

  public play() {
    if (!this.audio) this.init();
    if (this.audio) {
      this.audio.muted = false;
      this.audio.volume = 1.0;
      this.audio.play()
        .then(() => {
          this.isPlaying = true;
          this.needsInteraction = false;
          this.notify();
        })
        .catch((err) => {
          console.warn('Hero audio play blocked by browser policy:', err);
          this.needsInteraction = true;
          this.notify();
        });
    }
  }

  public pause() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
      this.notify();
    }
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public restart() {
    if (this.audio) {
      this.audio.currentTime = 0;
      this.play();
    }
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      needsInteraction: this.needsInteraction,
      progress: this.progress,
    };
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const heroAudio = new HeroAudioManager();
