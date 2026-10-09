import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Compass,
  ArrowLeft,
  Download,
  Search,
  Filter,
  Flame,
  CheckCircle,
  Clock,
  Mail,
  Shield,
  Briefcase,
  Trash2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { LeadRecord, TeamMember, LeadStatus } from '../../lib/crmTypes';
import {
  getStoredLeads,
  getStoredTeamMembers,
  updateLeadStatus,
  assignLead,
  exportLeadsToCSV,
  deleteTeamMember,
} from '../../lib/crmService';
import { LeadDetailModal } from './LeadDetailModal';
import { AddTeamMemberModal } from './AddTeamMemberModal';
import { FounderCertificateModal, FounderCertificateData } from '../FounderCertificateModal';

interface CrmDashboardProps {
  onBackToSite: () => void;
  onLockCrm: () => void;
}

export const CrmDashboard: React.FC<CrmDashboardProps> = ({ onBackToSite, onLockCrm }) => {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [currentMemberId, setCurrentMemberId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'leads' | 'team'>('leads');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

  // Modals
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [selectedCertificateData, setSelectedCertificateData] = useState<FounderCertificateData | null>(null);

  const refreshData = () => {
    const loadedTeam = getStoredTeamMembers();
    const loadedLeads = getStoredLeads();
    setTeam(loadedTeam);
    setLeads(loadedLeads);
    if (!currentMemberId && loadedTeam.length > 0) {
      setCurrentMemberId(loadedTeam[0].id);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const currentMember = team.find((t) => t.id === currentMemberId) || team[0] || {
    id: 'guest',
    name: 'Admin User',
    email: 'admin@atlastravelclub.com',
    role: 'admin',
    specialization: 'General',
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.name && lead.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lead.inviteCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.membershipTier.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    let matchesAssignee = true;
    if (assigneeFilter === 'unassigned') {
      matchesAssignee = !lead.assignedTo;
    } else if (assigneeFilter === 'me') {
      matchesAssignee = lead.assignedTo === currentMember.id;
    } else if (assigneeFilter !== 'all') {
      matchesAssignee = lead.assignedTo === assigneeFilter;
    }

    return matchesSearch && matchesStatus && matchesAssignee;
  });

  // KPI Calculations
  const totalModeledSavings = leads.reduce((sum, l) => sum + (l.modeledSavingsUSD || 0), 0);
  const hotLeadsCount = leads.filter((l) => l.priority === 'hot' || l.modeledSavingsUSD >= 3500).length;
  const contactedCount = leads.filter((l) => l.status !== 'new').length;
  const contactRate = leads.length > 0 ? Math.round((contactedCount / leads.length) * 100) : 0;

  const handleExportCSV = () => {
    exportLeadsToCSV(leads, team);
  };

  const handleDeleteMember = (memberId: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      const updated = deleteTeamMember(memberId);
      setTeam(updated);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col justify-between overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-neutral-950/95 pointer-events-none" />

      {/* CRM Main Header */}
      <header className="relative z-10 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToSite}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono text-neutral-400 hover:text-neutral-100 flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Prelaunch Site</span>
            </button>
            <div className="h-4 w-px bg-neutral-800 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-lg font-bold tracking-wider text-neutral-100">
                Founder Members CRM
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                Sales Pipeline
              </span>
            </div>
          </div>

          {/* User selector & Export & Lock */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Logged in as selector */}
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-neutral-500 text-[11px] font-mono">Sales Rep:</span>
              <select
                value={currentMemberId}
                onChange={(e) => setCurrentMemberId(e.target.value)}
                className="bg-transparent text-amber-300 font-semibold outline-none cursor-pointer text-xs"
              >
                {team.map((m) => (
                  <option key={m.id} value={m.id} className="bg-neutral-900 text-neutral-100">
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
              title="Download Leads as CSV"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              type="button"
              onClick={onLockCrm}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
              title="Lock CRM and Log Out"
            >
              <span>Lock CRM</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main CRM Body */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-left">
            <span className="text-[11px] font-mono text-neutral-400 uppercase block mb-1">Total Prelaunch Leads</span>
            <div className="text-2xl font-bold font-mono text-neutral-100">{leads.length}</div>
            <span className="text-[10px] text-neutral-500 font-mono mt-1 block">Registered via waitlist</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-left">
            <span className="text-[11px] font-mono text-neutral-400 uppercase block mb-1">Modeled Savings Pipeline</span>
            <div className="text-2xl font-bold font-mono text-amber-300">
              ${totalModeledSavings.toLocaleString()}
            </div>
            <span className="text-[10px] text-neutral-500 font-mono mt-1 block">Cumulative member value</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-left">
            <span className="text-[11px] font-mono text-neutral-400 uppercase block mb-1">High-Value VIP Leads</span>
            <div className="text-2xl font-bold font-mono text-red-400 flex items-center gap-1.5">
              <span>{hotLeadsCount}</span>
              <Flame className="w-4 h-4 text-red-400" />
            </div>
            <span className="text-[10px] text-neutral-500 font-mono mt-1 block">&gt; $3,500/yr modeled</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-left">
            <span className="text-[11px] font-mono text-neutral-400 uppercase block mb-1">Contact Rate</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">{contactRate}%</div>
            <span className="text-[10px] text-neutral-500 font-mono mt-1 block">{contactedCount} contacted so far</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition cursor-pointer ${
                activeTab === 'leads'
                  ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/20'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Leads Pipeline ({leads.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('team')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'team'
                  ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/20'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Team Members ({team.length})</span>
            </button>
          </div>

          {activeTab === 'team' && (
            <button
              type="button"
              onClick={() => setIsAddTeamModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Team Member</span>
            </button>
          )}
        </div>

        {/* TAB 1: LEADS PIPELINE */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by email, name, or invite code..."
                  className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 outline-none focus:border-amber-400"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-neutral-400">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New Lead</option>
                  <option value="contacted">Contacted</option>
                  <option value="vip_preview_sent">VIP Preview Sent</option>
                  <option value="deposit_paid">Deposit Paid</option>
                  <option value="active_member">Active Member</option>
                </select>
              </div>

              {/* Assignee Filter */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-neutral-400">Assigned:</span>
                <select
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 outline-none cursor-pointer"
                >
                  <option value="all">All Assignees</option>
                  <option value="me">Assigned to Me ({currentMember.name.split(' ')[0]})</option>
                  <option value="unassigned">Unassigned Only</option>
                  {team.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Leads Table */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950/80 text-[11px] font-mono uppercase text-neutral-400 border-b border-neutral-800">
                    <tr>
                      <th className="py-3 px-4">Member Lead</th>
                      <th className="py-3 px-4">Modeled Savings</th>
                      <th className="py-3 px-4">Pipeline Status</th>
                      <th className="py-3 px-4">Assigned Team Member</th>
                      <th className="py-3 px-4">Notes</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-neutral-500 font-mono">
                          No leads matching your current search or filters.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => {
                        const assignedMember = team.find((t) => t.id === lead.assignedTo);
                        return (
                          <tr
                            key={lead.id}
                            className="hover:bg-neutral-800/40 transition cursor-pointer"
                            onClick={() => setSelectedLead(lead)}
                          >
                            {/* Member Lead Info */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-neutral-100">{lead.fullName || 'Founder Member'}</span>
                                {lead.isEmailVerified && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                                    ✓ Verified
                                  </span>
                                )}
                                {lead.priority === 'hot' && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold border border-red-500/40">
                                    VIP
                                  </span>
                                )}
                                {lead.preferredContact && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30">
                                    {lead.preferredContact.toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-neutral-400 block font-mono">
                                {lead.email}
                              </span>
                              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-neutral-500 font-mono">
                                {lead.phone && <span>Tel: {lead.phone}</span>}
                                <span>•</span>
                                <span>Ref: {lead.inviteCode}</span>
                              </div>
                            </td>

                            {/* Modeled Savings */}
                            <td className="py-3 px-4">
                              <span className="font-cinzel font-bold text-amber-300 text-sm">
                                ${lead.modeledSavingsUSD.toLocaleString()} / yr
                              </span>
                              <span className="text-[10px] text-neutral-500 block">
                                {lead.membershipTier}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={lead.status}
                                onChange={(e) => {
                                  updateLeadStatus(lead.id, e.target.value as LeadStatus);
                                  refreshData();
                                }}
                                className="px-2 py-1 bg-neutral-950 border border-neutral-700 rounded-lg text-[11px] font-mono text-neutral-200 outline-none cursor-pointer"
                              >
                                <option value="new">New Lead</option>
                                <option value="contacted">Contacted</option>
                                <option value="vip_preview_sent">VIP Preview Sent</option>
                                <option value="deposit_paid">Deposit Paid</option>
                                <option value="active_member">Active Member</option>
                              </select>
                            </td>

                            {/* Assignee */}
                            <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={lead.assignedTo || ''}
                                onChange={(e) => {
                                  assignLead(lead.id, e.target.value || undefined);
                                  refreshData();
                                }}
                                className={`px-2 py-1 rounded-lg text-[11px] font-mono outline-none cursor-pointer border ${
                                  assignedMember
                                    ? 'bg-neutral-950 border-neutral-700 text-amber-300 font-semibold'
                                    : 'bg-neutral-950 border-neutral-800 text-neutral-500'
                                }`}
                              >
                                <option value="">— Unassigned —</option>
                                {team.map((m) => (
                                  <option key={m.id} value={m.id}>
                                    {m.name}
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* Notes Count */}
                            <td className="py-3 px-4">
                              <span className="text-[11px] font-mono text-neutral-400">
                                {lead.notes?.length || 0} notes
                              </span>
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1.5">
                                {(lead.whatsapp || lead.phone) && (
                                  <a
                                    href={`https://wa.me/${(lead.whatsapp || lead.phone).replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${lead.fullName || 'there'}, this is Atlas Concierge regarding your Founder Membership (${lead.inviteCode})!`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/60 transition"
                                    title="WhatsApp Outreach"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                <a
                                  href={`mailto:${lead.email}?subject=${encodeURIComponent(`Atlas Founder Member Invitation | ${lead.inviteCode}`)}`}
                                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition"
                                  title="Send Email"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => setSelectedLead(lead)}
                                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono transition cursor-pointer"
                                >
                                  Details
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEAM MEMBERS */}
        {activeTab === 'team' && (
          <div className="space-y-4 text-left">
            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-neutral-100">Team Concierge Directory</h4>
                <p className="text-xs text-neutral-400">
                  Assign leads to colleagues based on traveler profile and destination focus.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddTeamModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            </div>

            {/* Team Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {team.map((member) => {
                const assignedCount = leads.filter((l) => l.assignedTo === member.id).length;
                return (
                  <div
                    key={member.id}
                    className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono uppercase font-bold tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">
                          {member.role}
                        </span>
                        {member.role !== 'admin' && (
                          <button
                            type="button"
                            onClick={() => handleDeleteMember(member.id)}
                            className="text-neutral-500 hover:text-red-400 transition cursor-pointer p-1"
                            title="Remove Team Member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-neutral-100">{member.name}</h4>
                      <p className="text-xs text-neutral-400 font-mono mt-0.5">{member.email}</p>

                      <div className="mt-3 p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300 space-y-1">
                        <div className="text-neutral-500 font-mono">Specialization:</div>
                        <div className="font-semibold text-neutral-200">{member.specialization}</div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs font-mono">
                      <span className="text-neutral-400">Assigned Leads:</span>
                      <span className="font-bold text-amber-300">{assignedCount} leads</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <LeadDetailModal
        lead={selectedLead}
        team={team}
        currentMember={currentMember}
        onClose={() => setSelectedLead(null)}
        onLeadUpdated={refreshData}
        onViewCertificate={(lead) =>
          setSelectedCertificateData({
            email: lead.email,
            inviteCode: lead.inviteCode,
            modeledSavings: '$' + lead.modeledSavingsUSD.toLocaleString(),
            issueDate: lead.createdAt,
          })
        }
      />

      <AddTeamMemberModal
        isOpen={isAddTeamModalOpen}
        onClose={() => setIsAddTeamModalOpen(false)}
        onMemberAdded={refreshData}
      />

      <FounderCertificateModal
        isOpen={!!selectedCertificateData}
        onClose={() => setSelectedCertificateData(null)}
        data={selectedCertificateData}
      />
    </div>
  );
};
