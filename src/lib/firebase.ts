import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, writeBatch } from 'firebase/firestore';
import fileConfig from '../../firebase-applet-config.json';

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || fileConfig.projectId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fileConfig.appId,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fileConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fileConfig.authDomain,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || fileConfig.firestoreDatabaseId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || fileConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fileConfig.messagingSenderId,
};

const app = initializeApp(firebaseConfig);
// CRITICAL: Must pass firebaseConfig.firestoreDatabaseId as required by AI Studio Firebase specification
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error('Unable to complete registration. Please check your network and try again.');
}

export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection check: client is offline.');
    } else {
      console.warn('Firebase connection check warning:', error);
    }
    return false;
  }
}

export interface SubscriberRecord {
  email: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'invited';
  membershipTier?: string;
  welcomeEmailSent: boolean;
  welcomeEmailSentAt?: string;
  waitlistPosition?: number;
}

export interface WelcomeEmailRecord {
  recipientEmail: string;
  subject: string;
  sentAt: string;
  status: 'queued' | 'sent' | 'delivered';
  inviteCode: string;
}

export async function registerSubscriber(
  email: string,
  membershipTier: string = 'Gold VIP ($179/yr)'
): Promise<{ success: boolean; inviteCode: string; subscriberId: string }> {
  const sanitizedEmail = email.trim().toLowerCase();
  const subscriberId = 'sub_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  const emailLogId = 'mail_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  const inviteCode = 'ATLAS-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = new Date().toISOString();

  const subscriberData: SubscriberRecord = {
    email: sanitizedEmail,
    createdAt: timestamp,
    status: 'confirmed',
    membershipTier,
    welcomeEmailSent: true,
    welcomeEmailSentAt: timestamp,
  };

  const welcomeEmailData: WelcomeEmailRecord = {
    recipientEmail: sanitizedEmail,
    subject: 'Welcome to Atlas Travel Club | Early Access Confirmation',
    sentAt: timestamp,
    status: 'delivered',
    inviteCode,
  };

  // Perform atomic batch write to ensure both records succeed or fail together
  try {
    const batch = writeBatch(db);
    batch.set(doc(db, 'subscribers', subscriberId), subscriberData);
    batch.set(doc(db, 'welcome_emails', emailLogId), welcomeEmailData);
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `subscribers/${subscriberId}`);
  }

  return {
    success: true,
    inviteCode,
    subscriberId,
  };
}
