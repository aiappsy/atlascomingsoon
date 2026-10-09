import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { generateFounderWelcomeHtml, type WelcomeEmailPayload } from '../lib/emailService.ts';

dotenv.config();

export interface SendEmailResult {
  success: boolean;
  message: string;
  messageId?: string;
  error?: string;
}

export async function sendWelcomeEmailServer(payload: WelcomeEmailPayload): Promise<SendEmailResult> {
  const senderEmail = process.env.SENDER_EMAIL || process.env.GMAIL_USER || 'paljuritzen@gmail.com';
  const appPassword = process.env.GMAIL_APP_PASSWORD;

  if (!appPassword || appPassword.includes('PLACEHOLDER') || appPassword.length < 10) {
    console.warn(`[Gmail SMTP Warning] GMAIL_APP_PASSWORD not configured. Skipping live SMTP dispatch for: ${payload.recipientEmail}`);
    return {
      success: false,
      message: 'Gmail App Password not configured in .env',
      error: 'MISSING_CREDENTIALS',
    };
  }

  const cleanPassword = appPassword.replace(/\s+/g, '');

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: senderEmail,
        pass: cleanPassword,
      },
    });

    const pdfPath = path.resolve(process.cwd(), 'public/docs/OTA_Duopoly_Research_Brief.pdf');
    const attachments = [];
    if (fs.existsSync(pdfPath)) {
      attachments.push({
        filename: 'OTA_Duopoly_Research_Brief.pdf',
        path: pdfPath,
      });
    }

    const htmlContent = generateFounderWelcomeHtml(payload);

    const info = await transporter.sendMail({
      from: `"Pål Juritzen - Atlas Travel Club" <${senderEmail}>`,
      to: payload.recipientEmail,
      subject: `Official Founder Certificate & Early Access Pass [${payload.inviteCode}]`,
      html: htmlContent,
      attachments,
    });

    console.log(`[Gmail SMTP Success] Welcome email dispatched to ${payload.recipientEmail} (Message ID: ${info.messageId})`);
    return {
      success: true,
      message: 'Welcome email successfully dispatched via Gmail SMTP',
      messageId: info.messageId,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[Gmail SMTP Failure] Failed to send email to ${payload.recipientEmail}:`, errorMsg);
    return {
      success: false,
      message: 'Failed to send email via SMTP',
      error: errorMsg,
    };
  }
}

export interface VerificationEmailPayload {
  recipientEmail: string;
  recipientName: string;
  verificationCode: string;
}

export async function sendVerificationCodeServer(payload: VerificationEmailPayload): Promise<SendEmailResult> {
  const senderEmail = process.env.SENDER_EMAIL || process.env.GMAIL_USER || 'paljuritzen@gmail.com';
  const appPassword = process.env.GMAIL_APP_PASSWORD;

  if (!appPassword || appPassword.includes('PLACEHOLDER') || appPassword.length < 10) {
    console.warn(`[Gmail SMTP Notice] GMAIL_APP_PASSWORD not set. Verification code [${payload.verificationCode}] generated for ${payload.recipientEmail}`);
    return {
      success: true,
      message: 'Code generated (simulation mode)',
    };
  }

  const cleanPassword = appPassword.replace(/\s+/g, '');

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: senderEmail,
        pass: cleanPassword,
      },
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin: 0; padding: 30px; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f5f5f5;">
      <div style="max-width: 520px; margin: 0 auto; background-color: #141414; border: 1px solid #d4af3750; border-radius: 18px; padding: 32px; text-align: center;">
        <h1 style="font-family: Georgia, serif; color: #ffffff; letter-spacing: 3px; font-size: 20px; margin: 0 0 6px 0;">ATLAS TRAVEL CLUB</h1>
        <p style="color: #f59e0b; font-family: monospace; font-size: 11px; margin: 0 0 24px 0; letter-spacing: 1px; text-transform: uppercase;">Founder Member Security Verification</p>
        
        <p style="color: #e5e5e5; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          Hello <strong>${payload.recipientName || 'Founder Applicant'}</strong>,<br>
          Please use the following 6-digit verification code to authenticate your email and unlock your official Sovereign Founder Member Diploma:
        </p>
        
        <div style="background-color: #1c1917; border: 2px solid #f59e0b; border-radius: 12px; padding: 18px; margin: 0 auto 24px auto; display: inline-block; letter-spacing: 8px; font-size: 32px; font-weight: bold; font-family: monospace; color: #fbbf24;">
          ${payload.verificationCode}
        </div>
        
        <p style="color: #a3a3a3; font-size: 12px; line-height: 1.5;">
          This code expires in 15 minutes. Once verified, your official Diploma of Membership and wholesale travel rates will be issued immediately.
        </p>
        <hr style="border: none; border-top: 1px solid #262626; margin: 24px 0;">
        <p style="color: #737373; font-size: 11px; font-family: monospace; margin: 0;">
          The Sovereign Registry • Atlas Travel Club • atlastravelclub.com
        </p>
      </div>
    </body>
    </html>
    `;

    const info = await transporter.sendMail({
      from: `"Atlas Travel Club Verification" <${senderEmail}>`,
      to: payload.recipientEmail,
      subject: `Your Atlas Founder Verification Code: ${payload.verificationCode}`,
      html: htmlContent,
    });

    console.log(`[Gmail SMTP Success] Verification code dispatched to ${payload.recipientEmail} (ID: ${info.messageId})`);
    return {
      success: true,
      message: 'Verification code dispatched via Gmail SMTP',
      messageId: info.messageId,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[Gmail SMTP Failure] Verification email failed for ${payload.recipientEmail}:`, errorMsg);
    return {
      success: false,
      message: 'Failed to send verification email via SMTP',
      error: errorMsg,
    };
  }
}
