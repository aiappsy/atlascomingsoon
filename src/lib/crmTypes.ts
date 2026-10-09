export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'vip_preview_sent'
  | 'deposit_paid'
  | 'active_member'
  | 'archived';

export type LeadPriority = 'hot' | 'medium' | 'standard';

export interface LeadNote {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface LeadRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  messenger?: string;
  preferredContact?: 'whatsapp' | 'call' | 'sms' | 'email' | 'messenger';
  createdAt: string;
  status: LeadStatus;
  isEmailVerified?: boolean;
  verifiedAt?: string;
  membershipTier: string;
  modeledSavingsUSD: number;
  totalNights: number;
  inviteCode: string;
  assignedTo?: string; // TeamMember id
  priority: LeadPriority;
  notes: LeadNote[];
}

export type TeamRole = 'admin' | 'concierge' | 'viewer';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  specialization: string;
  status: 'active' | 'inactive';
  createdAt: string;
}
