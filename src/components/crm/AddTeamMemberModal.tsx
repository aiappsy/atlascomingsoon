import React, { useState } from 'react';
import { X, UserPlus, Shield, Mail, Briefcase, Sparkles } from 'lucide-react';
import { TeamMember, TeamRole } from '../../lib/crmTypes';
import { addTeamMember } from '../../lib/crmService';

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberAdded: (member: TeamMember) => void;
}

export const AddTeamMemberModal: React.FC<AddTeamMemberModalProps> = ({
  isOpen,
  onClose,
  onMemberAdded,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamRole>('concierge');
  const [specialization, setSpecialization] = useState('Luxury Stays & Villas');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide a team member name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid work email.');
      return;
    }

    const newMember = addTeamMember({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      specialization: specialization.trim() || 'General Concierge',
    });

    onMemberAdded(newMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-neutral-900 border border-amber-400/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">
                Add Team Member
              </h3>
              <p className="text-[11px] text-neutral-400">
                Grant CRM access to concierge or sales colleagues
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-100 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Full Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Lindqvist"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 focus:border-amber-400 text-neutral-100 text-sm outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Work Email Address:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. sarah@atlastravelclub.com"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 focus:border-amber-400 text-neutral-100 text-sm outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Team Role & Access:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'concierge', label: 'Concierge', desc: 'Manage & call leads' },
                { id: 'admin', label: 'Admin', desc: 'Full CRM access' },
                { id: 'viewer', label: 'Viewer', desc: 'Read-only access' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id as TeamRole)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                    role === r.id
                      ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-bold text-neutral-200">{r.label}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5 leading-snug">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Specialization / Focus:
            </label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 focus:border-amber-400 text-neutral-200 text-sm outline-none cursor-pointer"
            >
              <option value="Luxury Stays & Villas">Luxury Stays & Villas</option>
              <option value="Family Vacations & Resorts">Family Vacations & Resorts</option>
              <option value="Executive & Business Travel">Executive & Business Travel</option>
              <option value="General Concierge Outreach">General Concierge Outreach</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Confirm & Add Team Member</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
