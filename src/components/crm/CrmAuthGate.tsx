import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, ArrowRight, ArrowLeft, KeyRound, Eye, EyeOff, AlertTriangle } from 'lucide-react';

interface CrmAuthGateProps {
  onAuthenticated: () => void;
  onBackToSite: () => void;
}

export const CrmAuthGate: React.FC<CrmAuthGateProps> = ({ onAuthenticated, onBackToSite }) => {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Default team access passkey
  const CORRECT_PASSCODE = import.meta.env.VITE_CRM_PASSCODE || 'atlas2026';

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLockedOut && lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            setIsLockedOut(false);
            setFailedAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLockedOut, lockoutTimer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    setError(null);

    if (passcode.trim() === CORRECT_PASSCODE) {
      sessionStorage.setItem('atlas_crm_auth', 'true');
      onAuthenticated();
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      if (nextAttempts >= 5) {
        setIsLockedOut(true);
        setLockoutTimer(30);
        setError('Too many failed authorization attempts. Access locked for 30 seconds.');
      } else {
        setError(`Invalid admin security passkey. (${5 - nextAttempts} attempts remaining)`);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col justify-center items-center px-4 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-neutral-950/95 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-neutral-900/90 border border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-lg">
          <KeyRound className="w-7 h-7" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Admin Portal • /admin</span>
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-wider text-neutral-100">
            Atlas Administration
          </h2>
          <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
            Restricted to authorized founders, executives, and concierge staff for member registry management.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Admin Access Passkey:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passcode}
                disabled={isLockedOut}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passkey (atlas2026)"
                required
                autoFocus
                className="w-full px-4 py-3 pr-10 rounded-xl bg-neutral-950 border border-neutral-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-neutral-100 text-sm outline-none transition font-mono disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 p-1 cursor-pointer"
                title={showPassword ? 'Hide passkey' : 'Show passkey'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLockedOut || !passcode.trim()}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {isLockedOut ? `Locked (${lockoutTimer}s)` : 'Authenticate & Enter Admin'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-neutral-800">
          <button
            type="button"
            onClick={onBackToSite}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition cursor-pointer font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Prelaunch Site</span>
          </button>
        </div>
      </div>
    </div>
  );
};
