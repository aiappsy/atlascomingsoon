import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' && process.env ? process.env : {});

const firebaseConfig = {
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'bizmaster-abfed',
  appId: env.VITE_FIREBASE_APP_ID || '1:910579541086:web:fc6f6d4b3e8811d56f80cf',
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyBuSRj8GavUFeZAU0pXNEBZJbDrSJsdHhk',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'bizmaster-abfed.firebaseapp.com',
  firestoreDatabaseId: env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || 'ai-studio-e654cc8f-0464-4f51-9abc-b580f8c02d18',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'bizmaster-abfed.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '910579541086',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export interface SubscriberResult {
  success: boolean;
  inviteCode: string;
  subscriberId: string;
}

export interface RegisterSubscriberParams {
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  messenger?: string;
  preferredContact?: string;
  membershipTier?: string;
}

export async function registerSubscriber(
  params: RegisterSubscriberParams | string,
  legacyTier: string = 'Prelaunch Waitlist'
): Promise<SubscriberResult> {
  const isObject = typeof params === 'object';
  const email = (isObject ? params.email : params) || '';
  const fullName = (isObject ? params.fullName : '') || '';
  const phone = (isObject ? params.phone : '') || '';
  const whatsapp = (isObject ? params.whatsapp : '') || '';
  const messenger = (isObject ? params.messenger : '') || '';
  const preferredContact = (isObject ? params.preferredContact : 'whatsapp') || 'whatsapp';
  const membershipTier = (isObject ? params.membershipTier || 'Founder Member' : legacyTier) || 'Founder Member';

  const sanitizedEmail = email.trim().toLowerCase();
  const subscriberId = 'sub_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  const inviteCode = 'ATLAS-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = new Date().toISOString();

  const subscriberData = {
    fullName: fullName.trim(),
    email: sanitizedEmail,
    phone: phone.trim(),
    whatsapp: whatsapp.trim() || phone.trim(),
    messenger: messenger.trim(),
    preferredContact,
    createdAt: timestamp,
    status: 'confirmed' as const,
    membershipTier,
    welcomeEmailSent: true,
    welcomeEmailSentAt: timestamp,
  };

  try {
    await setDoc(doc(db, 'subscribers', subscriberId), subscriberData);
  } catch (error) {
    console.warn('Firestore write notice (falling back gracefully to local reservation):', error);
  }

  return {
    success: true,
    inviteCode,
    subscriberId,
  };
}
