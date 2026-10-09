/**
 * Atlas Travel Club - Transactional Email Dispatch Engine
 * Dispatches official Founder Member Welcome Emails with embedded certificate details,
 * 23-minute investigative deep dive audio, and the 14-page industry research brief.
 */

export interface WelcomeEmailPayload {
  recipientEmail: string;
  recipientName: string;
  inviteCode: string;
  phone?: string;
  membershipTier?: string;
}

export function generateFounderWelcomeHtml(payload: WelcomeEmailPayload): string {
  const name = payload.recipientName || 'Founder Member';
  const siteUrl = 'https://atlaslaunch.ai.studio';
  const audioUrl = `${siteUrl}/audio/how-travel-duopolies-rig-hotel-prices.mp3`;
  const pdfUrl = `${siteUrl}/docs/OTA_Duopoly_Research_Brief.pdf`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Atlas Travel Club</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f5f5f5;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #121212; border: 1px solid #d4af3740; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 30px 40px; background: linear-gradient(135deg, #1c1917 0%, #0a0a0a 100%); border-bottom: 1px solid #d4af3730;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 20px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: #ffffff; display: block; font-family: 'Cinzel', Georgia, serif;">ATLAS</span>
                    <span style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #f59e0b; font-family: monospace;">Founder Member Early Access Confirmation</span>
                  </td>
                  <td align="right">
                    <span style="font-size: 10px; font-family: monospace; background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 4px 8px; border-radius: 6px; font-weight: bold;">OFFICIALLY REGISTERED</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Welcome Message -->
          <tr>
            <td style="padding: 30px 40px 20px 40px;">
              <h2 style="font-size: 20px; color: #f3f4f6; margin-top: 0; font-family: 'Cinzel', Georgia, serif;">Welcome, ${name}.</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #9ca3af; margin-bottom: 20px;">
                Your priority position on the <strong>Atlas Travel Club</strong> early access register is officially confirmed. You have bypassed the retail travel markups and secured direct wholesale bedbank access.
              </p>

              <!-- Founder Credentials Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #171717; border: 1px solid #d4af3750; border-radius: 12px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 1.5px; color: #9ca3af;">Official Founder Reference Code</div>
                    <div style="font-size: 24px; font-family: monospace; font-weight: 700; letter-spacing: 2px; color: #fbbf24; margin: 6px 0 16px 0;">${payload.inviteCode}</div>
                    
                    <div style="border-top: 1px solid #262626; padding-top: 12px;">
                      <div style="font-size: 12px; color: #e5e7eb; margin-bottom: 6px;">✓ <strong>50% Lifetime Membership Discount</strong> (Permanently locked)</div>
                      <div style="font-size: 12px; color: #e5e7eb; margin-bottom: 6px;">✓ <strong>Entry in 5 Free Lifetime Memberships Draw</strong> (Active)</div>
                      <div style="font-size: 12px; color: #e5e7eb; margin-bottom: 6px;">✓ <strong>Direct B2B Net Bedbank Rates</strong> (Zero Middleman Commission)</div>
                      <div style="font-size: 12px; color: #e5e7eb;">✓ <strong>4 Family & Guest Passes</strong> Included</div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Exclusive Founder Intelligence Briefing Section -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(20, 20, 20, 0.95) 100%); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 12px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 22px;">
                    <span style="font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 1.5px; color: #fbbf24; font-weight: 700; display: block; margin-bottom: 8px;">
                      ★ Confidential Founder Intelligence Package Attached
                    </span>
                    <p style="font-size: 13px; line-height: 1.5; color: #d1d5db; margin-top: 0; margin-bottom: 16px;">
                      While our onboarding committee prepares your account credentials, we invite you to review our forensic industry analysis on how public hotel booking sites rig consumer prices:
                    </p>

                    <!-- Audio Deep Dive Card -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0d0d0d; border: 1px solid #262626; border-radius: 8px; margin-bottom: 10px;">
                      <tr>
                        <td style="padding: 14px;">
                          <div style="font-size: 13px; font-weight: 600; color: #ffffff;">
                            🎧 Audio Deep Dive: "How Travel Duopolies Rig Hotel Prices" <span style="font-size: 10px; color: #f59e0b; font-family: monospace; font-weight: normal;">(23:07)</span>
                          </div>
                          <div style="font-size: 11px; color: #888888; margin: 4px 0 10px 0; line-height: 1.4;">
                            An unscripted conversational breakdown of Booking Holdings vs. Expedia Group, Rate Parity MFN legal loopholes, and why closed-loop clubs like Atlas bypass retail markups.
                          </div>
                          <a href="${audioUrl}" style="display: inline-block; font-size: 11px; font-family: monospace; font-weight: bold; color: #0a0a0a; background: linear-gradient(90deg, #fbbf24, #f59e0b); text-decoration: none; padding: 7px 14px; border-radius: 6px;">
                            ▶ Listen to 23-Min Audio Briefing
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- PDF Research Brief Card -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0d0d0d; border: 1px solid #262626; border-radius: 8px;">
                      <tr>
                        <td style="padding: 14px;">
                          <div style="font-size: 13px; font-weight: 600; color: #ffffff;">
                            📄 Industry Research Brief No. 001: The OTA Duopoly <span style="font-size: 10px; color: #f59e0b; font-family: monospace; font-weight: normal;">(14-Page PDF)</span>
                          </div>
                          <div style="font-size: 11px; color: #888888; margin: 4px 0 10px 0; line-height: 1.4;">
                            Complete institutional analysis mapping corporate ownership across 25+ consumer brands and the European vs. US regulatory patchwork.
                          </div>
                          <a href="${pdfUrl}" style="display: inline-block; font-size: 11px; font-family: monospace; font-weight: bold; color: #fbbf24; background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.3); text-decoration: none; padding: 6px 14px; border-radius: 6px;">
                            ⬇ Download 14-Page PDF Report
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; line-height: 1.5; color: #9ca3af; margin-bottom: 25px;">
                We will notify you immediately once your dedicated private club portal access is unlocked.
              </p>

              <div style="border-top: 1px solid #262626; padding-top: 20px; font-size: 12px; font-family: monospace; color: #6b7280; line-height: 1.5;">
                Warm regards,<br />
                <strong style="color: #d1d5db;">The Atlas Membership Committee</strong><br />
                Atlas Travel Club Sovereign Registry • atlastravelclub.com
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export interface DispatchEmailResult {
  success: boolean;
  message?: string;
  isMocked?: boolean;
}

export async function dispatchFounderWelcomeEmail(payload: WelcomeEmailPayload): Promise<DispatchEmailResult> {
  // 1. Try EmailJS client-side dispatch if configured
  const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (emailJsPublicKey) {
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service';
      const welcomeTemplateId = import.meta.env.VITE_EMAILJS_WELCOME_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      
      const emailJsRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: welcomeTemplateId,
          user_id: emailJsPublicKey,
          template_params: {
            to_email: payload.recipientEmail,
            to_name: payload.recipientName,
            invite_code: payload.inviteCode,
            phone: payload.phone || '',
            membership_tier: payload.membershipTier || 'Founder Member',
            pdf_link: 'https://atlaslaunch.ai.studio/docs/OTA_Duopoly_Research_Brief.pdf',
            audio_link: 'https://atlaslaunch.ai.studio/audio/how-travel-duopolies-rig-hotel-prices.mp3',
          },
        }),
      });

      if (emailJsRes.ok) {
        return {
          success: true,
          message: 'Welcome email dispatched via EmailJS client relay',
        };
      }
    } catch (e) {
      console.warn('[EmailJS Client Error]:', e);
    }
  }

  // 2. Try Custom Webhook Relay (e.g. Google Apps Script, Resend, or Cloudflare Worker)
  const webhookUrl = import.meta.env.VITE_EMAIL_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const hookRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'welcome',
          payload,
        }),
      });
      if (hookRes.ok) {
        return { success: true, message: 'Welcome email dispatched via Webhook' };
      }
    } catch (e) {
      console.warn('[Webhook Relay Error]:', e);
    }
  }

  // 3. Fallback to local dev server /api/send-welcome-email
  try {
    const res = await fetch('/api/send-welcome-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.warn('Email dispatch server returned status:', res.status, data);
      return {
        success: false,
        message: data.error || 'Email dispatch failed on server',
      };
    }

    return {
      success: true,
      message: data.message || 'Email dispatched successfully',
    };
  } catch (err: unknown) {
    console.warn('Network error during email dispatch:', err);
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Network error',
    };
  }
}

export async function dispatchVerificationCode(
  email: string,
  name: string,
  code: string
): Promise<{ success: boolean; message?: string }> {
  // 1. Try EmailJS client-side dispatch if configured
  const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (emailJsPublicKey) {
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_verification';

      const emailJsRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: emailJsPublicKey,
          template_params: {
            to_email: email,
            to_name: name || 'Applicant',
            verification_code: code,
          },
        }),
      });

      if (emailJsRes.ok) {
        return {
          success: true,
          message: 'Verification code sent to your inbox via EmailJS',
        };
      }
    } catch (e) {
      console.warn('[EmailJS Client Error]:', e);
    }
  }

  // 2. Try Custom Webhook Relay
  const webhookUrl = import.meta.env.VITE_EMAIL_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const hookRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'verification',
          email,
          name,
          code,
        }),
      });
      if (hookRes.ok) {
        return { success: true, message: 'Verification code sent via Webhook' };
      }
    } catch (e) {
      console.warn('[Webhook Relay Error]:', e);
    }
  }

  // 3. Fallback to local dev server /api/send-verification-code
  try {
    const res = await fetch('/api/send-verification-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientEmail: email,
        recipientName: name,
        verificationCode: code,
      }),
    });

    const data = await res.json().catch(() => ({}));
    return {
      success: res.ok,
      message: data.message || (res.ok ? 'Verification code sent' : 'Failed to send verification code'),
    };
  } catch (err) {
    console.warn('Notice during verification code dispatch:', err);
    return {
      success: false,
      message: 'Network notice',
    };
  }
}
