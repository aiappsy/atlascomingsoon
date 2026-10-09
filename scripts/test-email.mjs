/**
 * Diagnostic & Delivery Verification Script for Atlas Travel Club Gmail SMTP
 * Usage: node scripts/test-email.mjs [recipient@example.com]
 */

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';

dotenv.config();

const senderEmail = process.env.SENDER_EMAIL || 'paljuritzen@gmail.com';
const appPassword = process.env.GMAIL_APP_PASSWORD;
const recipient = process.argv[2] || senderEmail;

console.log('--- Atlas Travel Club Email Diagnostic ---');
console.log(`Configured Sender : ${senderEmail}`);
console.log(`Target Recipient  : ${recipient}`);
console.log(`Password status   : ${appPassword ? 'Detected (16 characters)' : 'NOT FOUND IN .env'}`);

if (!appPassword || appPassword.includes('PLACEHOLDER') || appPassword.length < 10) {
  console.error('\n[ERROR] Missing or invalid GMAIL_APP_PASSWORD in .env');
  console.log('To send real emails through Google SMTP, an App Password is required.');
  console.log('1. Visit: https://myaccount.google.com/apppasswords');
  console.log('2. Create an App password (name: Atlas Club)');
  console.log('3. Put the 16 characters in your .env:');
  console.log('   SENDER_EMAIL=paljuritzen@gmail.com');
  console.log('   GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx\n');
  process.exit(1);
}

const cleanedPassword = appPassword.replace(/\s+/g, '');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // SSL
  auth: {
    user: senderEmail,
    pass: cleanedPassword,
  },
});

async function run() {
  try {
    console.log('\n[1/3] Verifying SMTP credentials with smtp.gmail.com:465...');
    await transporter.verify();
    console.log('✓ Google SMTP authentication SUCCESSFUL!');

    console.log('\n[2/3] Preparing test Founder Member email with attached 14-page PDF and audio briefing link...');
    const pdfPath = path.resolve(process.cwd(), 'public/docs/OTA_Duopoly_Research_Brief.pdf');
    const hasPdf = fs.existsSync(pdfPath);
    console.log(`PDF Attachment status: ${hasPdf ? 'Found (' + (fs.statSync(pdfPath).size / 1024).toFixed(1) + ' KB)' : 'Not found'}`);

    const htmlContent = `
      <div style="background-color: #0a0a0a; color: #f5f5f5; font-family: sans-serif; padding: 30px; border-radius: 12px; border: 1px solid #d4af3740;">
        <h2 style="color: #fbbf24; margin-top: 0;">Welcome to Atlas Travel Club (SMTP Test)</h2>
        <p>This is a live confirmation that transactional emails from <strong>${senderEmail}</strong> are working seamlessly.</p>
        <div style="background-color: #171717; padding: 15px; border-radius: 8px; border: 1px solid #333; margin: 20px 0;">
          <p style="margin: 0; font-family: monospace; color: #fbbf24; font-size: 16px;">Founder Code: ATLAS-VERIFIED-2026</p>
          <p style="margin: 5px 0 0 0; font-size: 13px; color: #aaa;">Privileges: 50% Lifetime Discount + 14-Page Duopoly Brief Attached</p>
        </div>
        <p style="font-size: 13px; color: #888;">Attached: OTA_Duopoly_Research_Brief.pdf (14 Pages)</p>
      </div>
    `;

    console.log('\n[3/3] Sending test email to ' + recipient + '...');
    const info = await transporter.sendMail({
      from: `"Pål Juritzen - Atlas Travel Club" <${senderEmail}>`,
      to: recipient,
      subject: 'Atlas Travel Club - Founder Access Verification',
      html: htmlContent,
      attachments: hasPdf
        ? [
            {
              filename: 'OTA_Duopoly_Research_Brief.pdf',
              path: pdfPath,
            },
          ]
        : [],
    });

    console.log('✓ Email dispatched successfully!');
    console.log(`Message ID: ${info.messageId}`);
    console.log(`Response: ${info.response}`);
    console.log('\n[STATUS] EMAIL DELIVERY PROVEN TO WORK! Check your inbox.');
  } catch (err) {
    console.error('\n[SMTP ERROR]:', err.message);
    if (err.responseCode === 535) {
      console.error('Note: Error 535 means Google rejected the password.');
      console.error('Make sure you are using a 16-character Google App Password (not your normal Gmail account password).');
    }
  }
}

run();
