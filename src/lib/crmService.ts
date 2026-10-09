import type { LeadRecord, TeamMember, LeadNote, LeadStatus } from './crmTypes.ts';

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: 'team_lars',
    name: 'Lars',
    email: 'lars@agenturer.no',
    role: 'admin',
    specialization: 'Nordic Operations & Founder Concierge',
    status: 'active',
    createdAt: '2026-10-02T12:00:00Z',
  },
  {
    id: 'team_marcus',
    name: 'Marcus Vance',
    email: 'marcus@atlastravelclub.com',
    role: 'admin',
    specialization: 'Founder & Institutional Relations',
    status: 'active',
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'team_sarah',
    name: 'Sarah Lindqvist',
    email: 'sarah@atlastravelclub.com',
    role: 'concierge',
    specialization: 'Luxury Villas & Europe Stays',
    status: 'active',
    createdAt: '2026-09-10T11:30:00Z',
  },
  {
    id: 'team_alex',
    name: 'Alex Rivera',
    email: 'alex@atlastravelclub.com',
    role: 'concierge',
    specialization: 'Family Vacations & Resorts',
    status: 'active',
    createdAt: '2026-09-15T09:15:00Z',
  },
];

const INITIAL_LEADS: LeadRecord[] = [
  {
    id: 'lead_1',
    fullName: 'Hendrik Weber',
    email: 'hendrik.weber@voyager-invest.de',
    phone: '+49 171 8923411',
    whatsapp: '+49 171 8923411',
    messenger: 'hendrik.weber.travel',
    preferredContact: 'whatsapp',
    createdAt: '2026-10-01T14:32:00Z',
    status: 'vip_preview_sent',
    membershipTier: '5-Star Luxury (30% net)',
    modeledSavingsUSD: 4250,
    totalNights: 25,
    inviteCode: 'ATLAS-78KJ92',
    assignedTo: 'team_sarah',
    priority: 'hot',
    notes: [
      {
        id: 'note_1',
        authorId: 'team_sarah',
        authorName: 'Sarah Lindqvist',
        content: 'Frequent luxury traveler between Zurich and London. Sent unmasked rate comparison for Le Grand Palace Vendôme via WhatsApp. Highly interested in Bedbank settlement.',
        createdAt: '2026-10-01T15:10:00Z',
      },
    ],
  },
  {
    id: 'lead_2',
    fullName: 'Claire Dubois',
    email: 'claire.dubois@familyventures.fr',
    phone: '+33 6 12 34 56 78',
    whatsapp: '+33 6 12 34 56 78',
    messenger: 'm.me/claire.dubois.paris',
    preferredContact: 'call',
    createdAt: '2026-10-01T18:45:00Z',
    status: 'contacted',
    membershipTier: 'Family Stays & Suites',
    modeledSavingsUSD: 2890,
    totalNights: 18,
    inviteCode: 'ATLAS-99AB31',
    assignedTo: 'team_alex',
    priority: 'medium',
    notes: [
      {
        id: 'note_2',
        authorId: 'team_alex',
        authorName: 'Alex Rivera',
        content: 'Family of 4 traveling during summer breaks. Explained the 4 complimentary family passes and 50% lifetime rate lock.',
        createdAt: '2026-10-02T08:20:00Z',
      },
    ],
  },
  {
    id: 'lead_3',
    fullName: 'Torstein Holm',
    email: 'nordic.traveller@oslofjord.no',
    phone: '+47 912 34 567',
    whatsapp: '+47 912 34 567',
    preferredContact: 'whatsapp',
    createdAt: '2026-10-02T06:12:00Z',
    status: 'new',
    membershipTier: 'Suites & Private Villas',
    modeledSavingsUSD: 5400,
    totalNights: 21,
    inviteCode: 'ATLAS-11X980',
    priority: 'hot',
    notes: [],
  },
];

const LOCAL_STORAGE_LEADS_KEY = 'atlas_crm_leads_v2';
const LOCAL_STORAGE_TEAM_KEY = 'atlas_crm_team_v2';

export function getStoredTeamMembers(): TeamMember[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TEAM_KEY);
    if (raw) {
      const parsed: TeamMember[] = JSON.parse(raw);
      if (!parsed.some(m => m.email.toLowerCase() === 'lars@agenturer.no' || m.id === 'team_lars')) {
        parsed.unshift(DEFAULT_TEAM[0]);
        localStorage.setItem(LOCAL_STORAGE_TEAM_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch (e) {
    console.warn('Could not read team members from localStorage', e);
  }
  localStorage.setItem(LOCAL_STORAGE_TEAM_KEY, JSON.stringify(DEFAULT_TEAM));
  return DEFAULT_TEAM;
}

export function saveTeamMembers(team: TeamMember[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_TEAM_KEY, JSON.stringify(team));
  } catch (e) {
    console.error('Error saving team members', e);
  }
}

export function getStoredLeads(): LeadRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read leads from localStorage', e);
  }
  localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(INITIAL_LEADS));
  return INITIAL_LEADS;
}

export function saveLeads(leads: LeadRecord[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(leads));
  } catch (e) {
    console.error('Error saving leads', e);
  }
}

export interface NewLeadRegistrationParams {
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  messenger?: string;
  preferredContact?: 'whatsapp' | 'call' | 'sms' | 'email' | 'messenger';
  tierInfo: string;
  inviteCode: string;
}

export function addNewLeadFromRegistration(params: NewLeadRegistrationParams | string, legacyTier?: string, legacyCode?: string): LeadRecord {
  const leads = getStoredLeads();
  const isObject = typeof params === 'object';
  const email = isObject ? params.email : params;
  const fullName = isObject ? params.fullName : '';
  const phone = isObject ? params.phone : '';
  const whatsapp = isObject ? params.whatsapp : '';
  const messenger = isObject ? params.messenger : '';
  const preferredContact = isObject ? params.preferredContact : 'whatsapp';
  const tierInfo = isObject ? params.tierInfo : legacyTier || 'Founder Member';
  const inviteCode = isObject ? params.inviteCode : legacyCode || 'ATLAS-DEMO';

  const existing = leads.find((l) => l.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return existing;
  }

  // Derive modeled savings if present
  let modeledSavings = 2500;
  const match = tierInfo.match(/\$([0-9,]+)/);
  if (match && match[1]) {
    modeledSavings = Number(match[1].replace(/,/g, ''));
  }

  const priority = modeledSavings >= 3500 ? 'hot' : modeledSavings >= 2000 ? 'medium' : 'standard';

  const newLead: LeadRecord = {
    id: 'lead_' + Math.random().toString(36).substring(2, 9),
    fullName: fullName.trim() || email.split('@')[0],
    email: email.toLowerCase(),
    phone: phone.trim(),
    whatsapp: whatsapp.trim() || phone.trim(),
    messenger: messenger.trim(),
    preferredContact,
    createdAt: new Date().toISOString(),
    status: 'new',
    isEmailVerified: true,
    verifiedAt: new Date().toISOString(),
    membershipTier: tierInfo,
    modeledSavingsUSD: modeledSavings,
    totalNights: 14,
    inviteCode,
    priority,
    notes: [
      {
        id: 'note_' + Math.random().toString(36).substring(2, 9),
        authorId: 'system',
        authorName: 'Admissions Gatekeeper',
        content: 'Email verified via 6-digit OTP code before Founder Member Diploma issuance.',
        createdAt: new Date().toISOString(),
      },
    ],
  };

  const updated = [newLead, ...leads];
  saveLeads(updated);
  return newLead;
}

export function updateLeadStatus(leadId: string, status: LeadStatus): LeadRecord[] {
  const leads = getStoredLeads();
  const updated = leads.map((lead) => (lead.id === leadId ? { ...lead, status } : lead));
  saveLeads(updated);
  return updated;
}

export function assignLead(leadId: string, teamMemberId?: string): LeadRecord[] {
  const leads = getStoredLeads();
  const updated = leads.map((lead) => (lead.id === leadId ? { ...lead, assignedTo: teamMemberId || undefined } : lead));
  saveLeads(updated);
  return updated;
}

export function addLeadNote(leadId: string, authorId: string, authorName: string, content: string): LeadRecord[] {
  const leads = getStoredLeads();
  const newNote: LeadNote = {
    id: 'note_' + Math.random().toString(36).substring(2, 8),
    authorId,
    authorName,
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  const updated = leads.map((lead) => {
    if (lead.id === leadId) {
      return {
        ...lead,
        notes: [newNote, ...(lead.notes || [])],
        // Progress 'new' leads to 'contacted' automatically on note addition
        status: lead.status === 'new' ? 'contacted' : lead.status,
      };
    }
    return lead;
  });

  saveLeads(updated);
  return updated;
}

export function addTeamMember(member: Omit<TeamMember, 'id' | 'createdAt' | 'status'>): TeamMember {
  const team = getStoredTeamMembers();
  const newMember: TeamMember = {
    ...member,
    id: 'team_' + Math.random().toString(36).substring(2, 9),
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  const updated = [...team, newMember];
  saveTeamMembers(updated);
  return newMember;
}

export function updateTeamMemberStatus(id: string, status: 'active' | 'inactive'): TeamMember[] {
  const team = getStoredTeamMembers();
  const updated = team.map((m) => (m.id === id ? { ...m, status } : m));
  saveTeamMembers(updated);
  return updated;
}

export function deleteTeamMember(id: string): TeamMember[] {
  const team = getStoredTeamMembers();
  const updated = team.filter((m) => m.id !== id);
  saveTeamMembers(updated);
  return updated;
}

export function exportLeadsToCSV(leads: LeadRecord[], team: TeamMember[]): void {
  const headers = [
    'Full Name',
    'Email',
    'Cell Phone',
    'WhatsApp',
    'Messenger',
    'Preferred Contact',
    'Status',
    'Modeled Savings USD',
    'Tier',
    'Invite Code',
    'Assignee',
    'Created At',
    'Notes Count',
  ];

  const rows = leads.map((l) => {
    const assignee = team.find((t) => t.id === l.assignedTo)?.name || 'Unassigned';
    return [
      `"${l.fullName}"`,
      `"${l.email}"`,
      `"${l.phone || ''}"`,
      `"${l.whatsapp || ''}"`,
      `"${l.messenger || ''}"`,
      `"${l.preferredContact || 'whatsapp'}"`,
      `"${l.status}"`,
      `"${l.modeledSavingsUSD}"`,
      `"${l.membershipTier}"`,
      `"${l.inviteCode}"`,
      `"${assignee}"`,
      `"${l.createdAt}"`,
      `"${l.notes?.length || 0}"`,
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `atlas_founder_members_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
