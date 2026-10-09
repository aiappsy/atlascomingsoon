import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const user = process.env.SENDER_EMAIL || process.env.GMAIL_USER || 'paljuritzen@gmail.com';
const pass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');

console.log('Testing SMTP connection with:');
console.log('User:', user);
console.log('Password length:', pass.length);

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: { user, pass }
});

try {
  await transporter.verify();
  console.log('>>> SUCCESS: Gmail SMTP connection verified!');

  const info = await transporter.sendMail({
    from: `"Atlas Travel Club" <${user}>`,
    to: user,
    subject: "Atlas Verification Test - Connection Successful",
    html: `
      <div style="font-family: sans-serif; padding: 20px; background: #0a0a0a; color: #fff; border-radius: 12px; max-width: 500px;">
        <h2 style="color: #f59e0b;">Atlas Travel Club</h2>
        <p>Gmail SMTP verification was successful!</p>
        <p>Your 6-digit test code is: <strong style="font-size: 24px; color: #fbbf24; letter-spacing: 3px;">789456</strong></p>
        <p style="color: #888; font-size: 12px;">Dispatched from paljuritzen@gmail.com via smtp.gmail.com:465</p>
      </div>
    `
  });

  console.log('>>> SUCCESS: Test email sent! MessageId:', info.messageId);
} catch (err) {
  console.error('>>> ERROR connecting to Gmail SMTP:', err.message);
  process.exit(1);
}
