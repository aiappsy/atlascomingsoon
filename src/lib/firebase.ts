import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, setDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

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
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
    // We catch and return false gracefully so the UI continues smoothly
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

  // 1. Write subscriber to Firestore
  const subPath = `subscribers/${subscriberId}`;
  try {
    await setDoc(doc(db, 'subscribers', subscriberId), subscriberData);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, subPath);
  }

  // 2. Write welcome email trigger record to Firestore
  const mailPath = `welcome_emails/${emailLogId}`;
  try {
    await setDoc(doc(db, 'welcome_emails', emailLogId), welcomeEmailData);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, mailPath);
  }

  return {
    success: true,
    inviteCode,
    subscriberId,
  };
}
