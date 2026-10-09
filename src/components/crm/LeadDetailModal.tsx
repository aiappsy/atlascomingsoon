import React, { useState } from 'react';
import {
  X,
  Mail,
  User,
  Calendar,
  DollarSign,
  Send,
  MessageSquare,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Award,
} from 'lucide-react';
import { LeadRecord, TeamMember, LeadStatus } from '../../lib/crmTypes';
import { updateLeadStatus, assignLead, addLeadNote } from '../../lib/crmService';

interface LeadDetailModalProps {
  lead: LeadRecord | null;
  team: TeamMember[];
  currentMember: TeamMember;
  onClose: () => void;
  onLeadUpdated: () => void;
  onViewCertificate?: (lead: LeadRecord) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  team,
  currentMember,
  onClose,
  onLeadUpdated,
  onViewCertificate,
}) => {
  const [newNote, setNewNote] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  if (!lead) return null;

  const handleStatusChange = (newStatus: LeadStatus) => {
    updateLeadStatus(lead.id, newStatus);
    onLeadUpdated();
  };

  const handleAssigneeChange = (memberId: string) => {
    assignLead(lead.id, memberId || undefined);
    onLeadUpdated();
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    addLeadNote(lead.id, currentMember.id, currentMember.name, newNote.trim());
    setNewNote('');
    onLeadUpdated();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(lead.inviteCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const openMailtoDraft = () => {
    const subject = encodeURIComponent(`Atlas Founder Member Invitation | 50% Lifetime Rate Lock (${lead.inviteCode})`);
    const body = encodeURIComponent(
      `Hello ${lead.fullName || ''},\n\nCongratulations on reserving your Founder Member spot for Atlas Travel Club!\n\nAs one of our initial founder members on the waiting list, you have secured two exclusive privileges:\n1. 50% OFF Membership For Life (permanently locked in)\n2. Automatic entry into our launch draw for 1 of 5 Free Lifetime Memberships (zero annual dues forever)\n\nBased on your travel profile, you are projected to save $${lead.modeledSavingsUSD.toLocaleString()} / year using our direct B2B bedbank rates without public retail markups.\n\nYour Founder Reference Code: ${lead.inviteCode}\n\nWhen is your next upcoming journey? I would be delighted to run a private rate audit for your preferred destinations.\n\nWarm regards,\n${currentMember.name}\nAtlas Sales & Concierge Team\nAtlas Travel Club`
    );
    window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_blank');
  };

  const openWhatsAppDraft = () => {
    const rawNumber = lead.whatsapp || lead.phone;
    if (!rawNumber) return;
    const phoneClean = rawNumber.replace(/\D/g, '');
    const text = encodeURIComponent(
      `Hello ${lead.fullName || ''}! This is ${currentMember.name} from Atlas Travel Club Concierge.\n\nCongratulations on reserving your Founder Member spot! You have locked in 50% OFF membership for life and automatic entry into our draw for 1 of 5 Free Lifetime Memberships.\n\nYour Founder Reference Code is: ${lead.inviteCode}.\n\nBased on your travel preferences, you are projected to save ~$${lead.modeledSavingsUSD.toLocaleString()}/year. When is your next planned getaway? I'd love to share an unmasked rate comparison with you.`
    );
    window.open(`https://wa.me/${phoneClean}?text=${text}`, '_blank');
  };

  const openMessengerChat = () => {
    if (!lead.messenger) return;
    const handle = lead.messenger.replace('@', '').trim();
    window.open(`https://m.me/${handle}`, '_blank');
  };

  const statuses: { id: LeadStatus; label: string }[] = [
    { id: 'new', label: 'New Lead' },
    { id: 'contacted', label: 'Contacted' },
    { id: 'vip_preview_sent', label: 'VIP Preview Sent' },
    { id: 'deposit_paid', label: 'Deposit Paid' },
    { id: 'active_member', label: 'Active Member' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-neutral-900 border border-amber-400/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-cinzel text-lg font-bold text-neutral-100">
                {lead.fullName || 'Founder Member'}
              </h3>
              {lead.isEmailVerified && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                  ✓ Verified Email
                </span>
              )}
              {lead.priority === 'hot' && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold border border-red-500/40">
                  HOT VIP
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
              <span>{lead.email}</span>
              <span>•</span>
              <span>Signed up {new Date(lead.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-100 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-left">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">Modeled Savings</span>
              <span className="text-lg font-cinzel font-bold text-amber-300">
                ${lead.modeledSavingsUSD.toLocaleString()} / yr
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-left">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">Tier / Style</span>
              <span className="text-xs font-semibold text-neutral-200 line-clamp-1">
                {lead.membershipTier}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-left">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">VIP Invite Code</span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">{lead.inviteCode}</span>
                <button
                  type="button"
                  onClick={copyCode}
                  className="text-neutral-400 hover:text-amber-300 cursor-pointer"
                  title="Copy Code"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Member Contact Information Grid */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                Contact Channels
              </span>
              {lead.preferredContact && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Prefers: {lead.preferredContact.toUpperCase()}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Phone */}
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 font-mono block">Cell Phone</span>
                  <span className="font-mono font-semibold text-neutral-200">{lead.phone || '—'}</span>
                </div>
                {lead.phone && (
                  <a
                    href={`tel:${lead.phone}`}
                    className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-mono flex items-center gap-1 transition"
                  >
                    Call
                  </a>
                )}
              </div>

              {/* WhatsApp */}
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 font-mono block">WhatsApp</span>
                  <span className="font-mono font-semibold text-neutral-200">{lead.whatsapp || lead.phone || '—'}</span>
                </div>
                {(lead.whatsapp || lead.phone) && (
                  <button
                    type="button"
                    onClick={openWhatsAppDraft}
                    className="px-2 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono flex items-center gap-1 transition cursor-pointer"
                  >
                    Chat
                  </button>
                )}
              </div>

              {/* Messenger */}
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 font-mono block">FB Messenger</span>
                  <span className="font-mono font-semibold text-neutral-200">{lead.messenger || '—'}</span>
                </div>
                {lead.messenger && (
                  <button
                    type="button"
                    onClick={openMessengerChat}
                    className="px-2 py-1 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 text-[11px] font-mono flex items-center gap-1 transition cursor-pointer"
                  >
                    Open
                  </button>
                )}
              </div>

              {/* Email */}
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div className="truncate pr-2">
                  <span className="text-[10px] text-neutral-500 font-mono block">Email Address</span>
                  <span className="font-mono font-semibold text-neutral-200 truncate block">{lead.email}</span>
                </div>
                <button
                  type="button"
                  onClick={openMailtoDraft}
                  className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-mono flex items-center gap-1 transition cursor-pointer shrink-0"
                >
                  Mail
                </button>
              </div>
            </div>
          </div>

          {/* Pipeline Status Selector */}
          <div className="text-left space-y-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              Pipeline Stage:
            </label>
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleStatusChange(s.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition cursor-pointer ${
                    lead.status === s.id
                      ? 'bg-amber-400 text-neutral-950 font-bold shadow'
                      : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lead Assignment */}
          <div className="text-left space-y-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              Assigned Concierge Team Member:
            </label>
            <select
              value={lead.assignedTo || ''}
              onChange={(e) => handleAssigneeChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-200 text-sm outline-none cursor-pointer"
            >
              <option value="">— Unassigned —</option>
              {team.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.specialization})
                </option>
              ))}
            </select>
          </div>

          {/* 1-Click Outreach Action Bar */}
          <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
            <div>
              <h5 className="text-xs font-bold text-amber-200">1-Click Founder Outreach</h5>
              <p className="text-[11px] text-neutral-400">
                Reach out instantly with pre-written Founder welcome templates.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {onViewCertificate && (
                <button
                  type="button"
                  onClick={() => onViewCertificate(lead)}
                  className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Certificate</span>
                </button>
              )}

              {(lead.whatsapp || lead.phone) && (
                <button
                  type="button"
                  onClick={openWhatsAppDraft}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
                >
                  <span>WhatsApp</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}

              <button
                type="button"
                onClick={openMailtoDraft}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer shrink-0"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Draft Email</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Concierge Notes Feed */}
          <div className="text-left space-y-3 pt-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Concierge Follow-Up History & Notes:</span>
            </label>

            {/* Note Input */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log a conversation, trip preferences, or next step..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 focus:border-amber-400 text-neutral-100 text-xs outline-none transition"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Add Note</span>
              </button>
            </form>

            {/* Notes List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {!lead.notes || lead.notes.length === 0 ? (
                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80 text-center text-xs text-neutral-500 font-mono">
                  No notes recorded yet. Add the first follow-up note above.
                </div>
              ) : (
                lead.notes.map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                      <span className="font-semibold text-amber-300">{n.authorName}</span>
                      <span>{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-neutral-200 leading-relaxed">{n.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
