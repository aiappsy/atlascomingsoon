import React, { useState, useRef } from 'react';
import {
  X,
  Award,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Mail,
  QrCode,
  ShieldCheck,
  Building2,
  Users,
  Smartphone,
  CreditCard,
  Gift,
  Play,
  Pause,
  Radio,
  FileText,
  Headphones,
} from 'lucide-react';

export interface FounderCertificateData {
  fullName?: string;
  email: string;
  phone?: string;
  inviteCode: string;
  subscriberId?: string;
  modeledSavings?: string;
  totalNights?: number;
  issueDate?: string;
}

interface FounderCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FounderCertificateData | null;
  onOpenPodcast?: (track: 'summary' | 'deepdive') => void;
}

export const FounderCertificateModal: React.FC<FounderCertificateModalProps> = ({
  isOpen,
  onClose,
  data,
  onOpenPodcast,
}) => {
  const [activeTab, setActiveTab] = useState<'certificate' | 'email'>('certificate');
  const [isCopied, setIsCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const [isPlayingDeepDive, setIsPlayingDeepDive] = useState(false);
  const deepDiveAudioRef = useRef<HTMLAudioElement | null>(null);

  if (!isOpen || !data) return null;

  const toggleDeepDivePlay = () => {
    if (!deepDiveAudioRef.current) {
      deepDiveAudioRef.current = new Audio('/audio/how-travel-duopolies-rig-hotel-prices.mp3');
      deepDiveAudioRef.current.addEventListener('ended', () => setIsPlayingDeepDive(false));
    }
    if (isPlayingDeepDive) {
      deepDiveAudioRef.current.pause();
      setIsPlayingDeepDive(false);
    } else {
      deepDiveAudioRef.current.play().then(() => setIsPlayingDeepDive(true)).catch(() => {});
    }
  };

  const handleClose = () => {
    if (deepDiveAudioRef.current) {
      deepDiveAudioRef.current.pause();
      setIsPlayingDeepDive(false);
    }
    onClose();
  };

  const issueDateFormatted = data.issueDate
    ? new Date(data.issueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  const copyCode = () => {
    navigator.clipboard.writeText(data.inviteCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const printOrDownload = () => {
    window.print();
  };

  return (
    <div
      id="founder-certificate-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="founder-certificate-modal-container"
        className="relative w-full max-w-4xl bg-neutral-900 border border-amber-400/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
      >
        {/* Header Bar (Hidden in Print) */}
        <div className="no-print px-5 sm:px-6 py-3.5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Award className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-neutral-100 font-cinzel">
                  Founder Member Diploma & Credentials
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  Verified & Issued
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono">
                Holder: <span className="text-amber-300">{data.fullName || data.email}</span> • Registry ID: <span className="text-amber-300 font-bold">{data.inviteCode}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveTab('certificate')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer font-semibold ${
                  activeTab === 'certificate'
                    ? 'bg-amber-400 text-neutral-950 shadow'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Official Diploma
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('email')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer font-semibold ${
                  activeTab === 'email'
                    ? 'bg-amber-400 text-neutral-950 shadow'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Welcome Dispatch
              </button>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-100 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-3 sm:p-6 overflow-y-auto space-y-4 text-left">
          {activeTab === 'certificate' ? (
            /* ======================================================== */
            /* TAB 1: LUXURY MANILLA DIPLOMA WITH STAMP OF AUTHORIZATION */
            /* ======================================================== */
            <div className="space-y-4">
              {/* THE AUTHENTIC MANILLA DIPLOMA */}
              <div
                id="printable-founder-diploma"
                className="relative p-6 sm:p-10 md:p-12 bg-[#faf6eb] bg-gradient-to-br from-[#fdfaf2] via-[#f7f1e1] to-[#f2e7ce] text-[#1c170f] rounded-2xl shadow-2xl border-[6px] border-[#9c7526] overflow-hidden select-none"
              >
                {/* Inner Fine Gold Pinstripe Border with Inset */}
                <div className="absolute inset-3 border-2 border-[#b8862d]/60 pointer-events-none rounded-xl" />
                <div className="absolute inset-4 border border-[#8c6218]/30 pointer-events-none rounded-lg" />

                {/* Classical Corner Flourishes */}
                <div className="absolute top-4 left-4 text-[#9c7526] text-xl font-serif select-none pointer-events-none">✦</div>
                <div className="absolute top-4 right-4 text-[#9c7526] text-xl font-serif select-none pointer-events-none">✦</div>
                <div className="absolute bottom-4 left-4 text-[#9c7526] text-xl font-serif select-none pointer-events-none">✦</div>
                <div className="absolute bottom-4 right-4 text-[#9c7526] text-xl font-serif select-none pointer-events-none">✦</div>

                {/* Subtle Guilloche / Security Background Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
                  <div className="w-[500px] h-[500px] rounded-full border-[40px] border-[#1c170f] flex items-center justify-center">
                    <span className="font-cinzel text-9xl font-bold">A</span>
                  </div>
                </div>

                <div className="relative z-10 text-center space-y-3">
                  {/* Top Sovereign Crest */}
                  <div className="flex items-center justify-center gap-2 text-[#9c7526]">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-[#9c7526]" />
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span className="text-[10px] font-mono tracking-[0.3em] uppercase font-bold text-[#8a6522]">
                      Sovereign Wholesale Registry
                    </span>
                    <Sparkles className="w-4 h-4 fill-current" />
                    <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-[#9c7526]" />
                  </div>

                  {/* Institution Name */}
                  <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[0.2em] text-[#1a150e] uppercase leading-tight drop-shadow-sm">
                    The Atlas Travel Club
                  </h1>

                  {/* Diploma Subtitle */}
                  <div className="space-y-0.5">
                    <p className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.22em] text-[#966b1e] uppercase">
                      Sovereign Charter & Diploma of Founding Membership
                    </p>
                    <p className="font-mono text-[9px] sm:text-[10px] tracking-wider text-[#735a34] uppercase">
                      Instituted under Private Association Conventions • Geneva & Oslo • Registry Ref. {data.inviteCode}
                    </p>
                  </div>

                  <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-[#b8862d] to-transparent mx-auto my-2" />

                  {/* Conferral Statement */}
                  <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[#7a6037] font-semibold pt-1">
                    Be it known to all persons present that:
                  </p>

                  {/* Recipient Full Name */}
                  <div className="py-1">
                    <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-black text-[#1a150e] tracking-wide uppercase inline-block px-8 py-1 border-b-2 border-[#b8862d]/60">
                      {data.fullName || 'Accredited Member'}
                    </h2>
                    <p className="font-mono text-[10px] sm:text-[11px] text-[#7a6037] mt-1.5">
                      Registry Email: <strong className="text-[#1a150e]">{data.email}</strong> {data.phone ? `• Priority Mobile: ${data.phone}` : ''}
                    </p>
                  </div>

                  {/* Proclamation Citation Paragraph */}
                  <p className="font-diploma italic text-xs sm:text-sm text-[#382f22] max-w-2xl mx-auto leading-relaxed px-4 pt-1">
                    Having established verified eligibility and met the charter standards of the Admissions Committee, is hereby inducted as an accredited <strong>Founding Lifetime Member</strong> of Atlas Travel Club, permanently vested with direct wholesale bedbank access, immunity from retail OTA price markups, and sovereign booking privileges in perpetuity.
                  </p>

                  {/* Guaranteed Privileges Grid on Diploma */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-2xl mx-auto pt-2 text-left">
                    <div className="p-2.5 rounded-lg bg-[#f4ecd8] border border-[#d9c79f] shadow-sm">
                      <div className="flex items-center gap-1.5 text-[#8a6522] font-cinzel text-xs font-bold uppercase">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#9c7526] shrink-0" />
                        <span>B2B Net Rate Parity</span>
                      </div>
                      <p className="text-[10px] font-mono text-[#57462c] mt-0.5">
                        Direct wholesale pass-through with zero OTA commission markup.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#f4ecd8] border border-[#d9c79f] shadow-sm">
                      <div className="flex items-center gap-1.5 text-[#8a6522] font-cinzel text-xs font-bold uppercase">
                        <Award className="w-3.5 h-3.5 text-[#9c7526] shrink-0" />
                        <span>50% Lifetime Lock</span>
                      </div>
                      <p className="text-[10px] font-mono text-[#57462c] mt-0.5">
                        Annual membership fee locked at half price permanently for life.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#f4ecd8] border border-[#d9c79f] shadow-sm">
                      <div className="flex items-center gap-1.5 text-[#8a6522] font-cinzel text-xs font-bold uppercase">
                        <Gift className="w-3.5 h-3.5 text-[#9c7526] shrink-0" />
                        <span>Sovereign Allocation</span>
                      </div>
                      <p className="text-[10px] font-mono text-[#57462c] mt-0.5">
                        4 Family Guest Passes & Launch Draw Entry for 1 of 5 Free Memberships.
                      </p>
                    </div>
                  </div>

                  {/* Bottom Credentials, Sole Signature & Stamp of Authorization */}
                  <div className="pt-5 flex flex-col sm:flex-row items-center justify-around gap-6 border-t border-[#b8862d]/30 mt-3 px-4 sm:px-10">
                    {/* Center-Left: THE OFFICIAL EMBOSSED GOLD STAMP OF AUTHORIZATION */}
                    <div className="relative flex flex-col items-center justify-center order-2 sm:order-1 my-2 sm:my-0 shrink-0">
                      {/* Crimson Hanging Ribbons */}
                      <div className="absolute -bottom-6 flex gap-2 pointer-events-none z-0">
                        <div className="w-4 h-11 bg-gradient-to-b from-[#8b1515] to-[#550808] border-l border-r border-[#d4af37] shadow-md transform -rotate-6 clip-ribbon" />
                        <div className="w-4 h-11 bg-gradient-to-b from-[#8b1515] to-[#550808] border-l border-r border-[#d4af37] shadow-md transform rotate-6 clip-ribbon" />
                      </div>

                      {/* Circular Metallic Seal */}
                      <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#ffe58f] via-[#d4af37] via-[#aa7c11] to-[#634305] p-1.5 shadow-[0_6px_20px_rgba(140,90,10,0.5)] border-2 border-[#fff3b0] flex items-center justify-center">
                        {/* Outer Serrated Ring Effect */}
                        <div className="w-full h-full rounded-full border-2 border-dashed border-[#ffe58f]/80 bg-gradient-to-br from-[#d4af37] via-[#b8860b] to-[#7c530c] flex flex-col items-center justify-center text-center p-1.5 shadow-inner">
                          <span className="text-[7px] sm:text-[8px] font-cinzel font-bold text-[#fff7cf] tracking-widest uppercase">
                            ATLAS TRAVEL CLUB
                          </span>
                          <div className="my-0.5 text-[#fff7cf]">
                            <Award className="w-5 h-5 mx-auto fill-[#fff7cf]/20" />
                          </div>
                          <span className="text-[8px] sm:text-[9px] font-cinzel font-black text-[#ffffff] tracking-wider uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                            ★ AUTHORIZED ★
                          </span>
                          <span className="text-[6px] sm:text-[7px] font-mono text-[#ffe58f] tracking-widest uppercase font-semibold">
                            SOVEREIGN CHARTER 2026
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Center-Right: Sole Signatory - Pål Juritzen */}
                    <div className="text-center sm:text-right order-1 sm:order-2 shrink-0">
                      <div className="font-signature text-4xl sm:text-5xl text-[#1a150e] leading-none mb-1">
                        Pål Juritzen
                      </div>
                      <div className="w-48 sm:w-56 border-t-2 border-[#8c651e]/70 my-1.5 mx-auto sm:ml-auto sm:mr-0" />
                      <div className="font-cinzel text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1a150e]">
                        Pål Juritzen
                      </div>
                      <div className="text-xs font-mono text-[#66502e] font-semibold">
                        Founder & Managing Director
                      </div>
                      <div className="text-[10px] font-mono text-[#8a6522] tracking-wider uppercase">
                        Atlas Intelligence & Sovereign Travel Club
                      </div>
                    </div>
                  </div>

                  {/* Bottom Legal Registry Line */}
                  <div className="pt-2 text-[9px] font-mono text-[#7a6037] flex flex-col sm:flex-row items-center justify-between border-t border-[#b8862d]/20">
                    <span>Issued under Great Seal of Atlas • {issueDateFormatted}</span>
                    <span className="font-bold text-[#8a6522]">CERTIFICATE SERIAL: {data.inviteCode}-VERIFIED</span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar Below Diploma (Hidden in Print) */}
              <div className="no-print flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={printOrDownload}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-amber-500/30 transition transform hover:scale-[1.01]"
                >
                  <Download className="w-4 h-4" />
                  <span>Print / Download Diploma PDF</span>
                </button>

                <button
                  type="button"
                  onClick={copyCode}
                  className="py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono text-xs flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopied ? 'Code Copied' : `Copy ID: ${data.inviteCode}`}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onOpenPodcast) {
                      onOpenPodcast('deepdive');
                    } else {
                      toggleDeepDivePlay();
                    }
                  }}
                  className="py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 hover:text-white font-mono text-xs flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <Radio className="w-4 h-4 text-amber-400" />
                  <span>23-Min Audio Briefing</span>
                </button>

                <a
                  href="/docs/OTA_Duopoly_Research_Brief.pdf"
                  download="OTA_Duopoly_Research_Brief.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 hover:text-white font-mono text-xs flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>14-Page PDF</span>
                </a>
              </div>
            </div>
          ) : (
            /* ======================================================== */
            /* TAB 2: OFFICIAL WELCOME EMAIL DISPATCH (ORIGINAL REPO)   */
            /* ======================================================== */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-2 text-xs font-mono text-neutral-400">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <span className="text-neutral-500">Dispatch Status:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Delivered to Member</span>
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500">From: </span>
                  <span className="text-neutral-200">Atlas Travel Club &lt;invitations@atlastravelclub.com&gt;</span>
                </div>
                <div>
                  <span className="text-neutral-500">To: </span>
                  <span className="text-neutral-200">{data.email}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Subject: </span>
                  <span className="text-amber-300 font-semibold">
                    Welcome to Atlas Travel Club | Founder Member Early Access Confirmation
                  </span>
                </div>
              </div>

              {/* Email Content Body */}
              <div className="p-6 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                <p>Hello,</p>
                <p>
                  Thank you for securing your position on the <strong>Atlas Travel Club</strong> early access waitlist.
                </p>
                <p>
                  As an initial Founder Member, your exclusive privileges are officially recorded:
                </p>

                <div className="p-4 rounded-xl bg-neutral-900 border border-amber-400/30 space-y-2 text-xs">
                  <div className="text-amber-300 font-bold font-mono">1. 50% Lifetime Membership Discount:</div>
                  <p className="text-neutral-300">
                    Your club membership is locked at half price for life upon launch.
                  </p>
                  <div className="text-amber-300 font-bold font-mono pt-1">2. Entry in 5 Free Lifetime Memberships Draw:</div>
                  <p className="text-neutral-300">
                    Your email is entered in the launch draw to win 100% free membership with zero annual dues permanently.
                  </p>
                  <div className="text-amber-300 font-bold font-mono pt-1">3. Founder Reference Code:</div>
                  <p className="font-mono text-base font-bold text-amber-400">{data.inviteCode}</p>
                </div>

                {/* Attached Confidential Founder Intelligence Dossier */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-neutral-900 via-amber-950/20 to-neutral-950 border border-amber-400/30 space-y-3 text-xs">
                  <div className="text-amber-300 font-bold font-mono flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <Radio className="w-3.5 h-3.5 text-amber-400" />
                    CONFIDENTIAL FOUNDER INTELLIGENCE PACKAGE ATTACHED:
                  </div>
                  <p className="text-neutral-300">
                    While our membership committee finalizes your private bedbank credentials, we invite you to review our forensic research on why hotel retail prices are rigged:
                  </p>

                  <div className="p-3 rounded-lg bg-neutral-950/80 border border-neutral-800 space-y-1.5">
                    <div className="font-semibold text-neutral-100 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Headphones className="w-3.5 h-3.5 text-amber-400" />
                        <span>Audio Deep Dive: "How Travel Duopolies Rig Hotel Prices"</span>
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono">23:07 Duration</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      An unscripted conversational breakdown of Booking Holdings vs. Expedia Group, Rate Parity MFN clauses, and how closed-loop private clubs bypass the retail price-rigging system.
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => onOpenPodcast?.('deepdive')}
                        className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 font-mono font-semibold cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Stream 23-Min Audio Briefing →</span>
                      </button>

                      <a
                        href="/audio/how-travel-duopolies-rig-hotel-prices.mp3"
                        download="How_Travel_Duopolies_Rig_Hotel_Prices.mp3"
                        className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white font-mono"
                      >
                        <Download className="w-3 h-3 text-amber-400" />
                        <span>Download MP3</span>
                      </a>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-neutral-950/80 border border-neutral-800 space-y-1.5">
                    <div className="font-semibold text-neutral-100 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>Industry Research Brief No. 001: The OTA Duopoly</span>
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono">14-Page PDF</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Complete institutional research brief with ownership structures, brand portfolios across 25+ consumer sites, and the European vs. US rate-parity regulatory landscape.
                    </p>
                    <a
                      href="/docs/OTA_Duopoly_Research_Brief.pdf"
                      download="OTA_Duopoly_Research_Brief.pdf"
                      className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 font-mono font-semibold pt-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download 14-Page Industry Research Brief (PDF) →</span>
                    </a>
                  </div>
                </div>

                <p className="text-xs text-neutral-400">
                  We are finalizing direct B2B integrations with institutional bedbanks (Hotelbeds, WebBeds) to bring you wholesale net rates across 1M+ hotels and villas. You will be notified the moment member onboarding opens.
                </p>

                <div className="pt-2 text-xs text-neutral-400 font-mono">
                  Warm regards,<br />
                  <strong>The Atlas Membership Committee</strong><br />
                  atlastravelclub.com
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs">
          <span className="text-neutral-500 font-mono">
            Atlas Travel Club Sovereign Registry
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold cursor-pointer transition"
          >
            Close Certificate
          </button>
        </div>
      </div>
    </div>
  );
};
