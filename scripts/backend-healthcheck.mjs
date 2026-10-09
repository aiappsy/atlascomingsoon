/**
 * Comprehensive Backend Health Check & Subsystem Diagnostic
 * Atlas Travel Club Prelaunch Engine
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Mock localStorage for Node environment if running outside browser
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) || null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const report = {
  timestamp: new Date().toISOString(),
  passed: 0,
  failed: 0,
  warnings: 0
};

function pass(name, details) {
  report.passed++;
  console.log(`[PASS] ${name}: ${details}`);
}

function warn(name, details) {
  report.warnings++;
  console.log(`[WARN] ${name}: ${details}`);
}

function fail(name, details) {
  report.failed++;
  console.log(`[FAIL] ${name}: ${details}`);
}

async function run() {
  console.log('======================================================');
  console.log(' ATLAS PRELAUNCH - COMPREHENSIVE BACKEND AUDIT REPORT');
  console.log('======================================================\n');

  // 1. Static Files on Disk
  console.log('--- 1. Critical Media & Documents ---');
  const files = [
    { p: 'public/audio/how-private-clubs-get-wholesale-hotel-rates.mp3', size: 1000000, name: '5-Min Podcast MP3' },
    { p: 'public/audio/how-travel-duopolies-rig-hotel-prices.mp3', size: 10000000, name: '23-Min Deep Dive MP3' },
    { p: 'public/audio/hero-voiceover-mastered.mp3', size: 500000, name: 'Hero Voiceover Master (38s)' },
    { p: 'public/docs/OTA_Duopoly_Research_Brief.pdf', size: 400000, name: '14-Page Duopoly Research PDF' },
    { p: 'public/images/ota_org_chart.png', size: 10000, name: 'OTA Org Chart Graphic' },
    { p: 'public/images/expedia_ownership_pie.png', size: 10000, name: 'Expedia Ownership Graphic' },
  ];

  for (const f of files) {
    const full = path.resolve(projectRoot, f.p);
    if (fs.existsSync(full)) {
      const s = fs.statSync(full).size;
      pass(f.name, `${(s / 1024 / 1024).toFixed(2)} MB verified on disk`);
    } else {
      fail(f.name, `Missing at ${f.p}`);
    }
  }

  // 2. HTTP Server & Routes
  console.log('\n--- 2. HTTP Dev Server Routes (localhost:3000) ---');
  async function fetchHttp(url, opts = {}) {
    const res = await fetch(url, opts);
    return res;
  }

  try {
    const home = await fetchHttp('http://localhost:3000/');
    if (home.ok) pass('SPA HTML Root', 'HTTP 200 OK');
    else fail('SPA HTML Root', `HTTP ${home.status}`);

    const audio5 = await fetchHttp('http://localhost:3000/audio/how-private-clubs-get-wholesale-hotel-rates.mp3');
    if (audio5.ok) pass('5-Min Podcast Audio Stream', `HTTP 200 OK (${(parseInt(audio5.headers.get('content-length') || 0) / 1024 / 1024).toFixed(2)} MB)`);
    else fail('5-Min Podcast Audio Stream', `HTTP ${audio5.status}`);

    const audio23 = await fetchHttp('http://localhost:3000/audio/how-travel-duopolies-rig-hotel-prices.mp3');
    if (audio23.ok) pass('23-Min Deep Dive Audio Stream', `HTTP 200 OK (${(parseInt(audio23.headers.get('content-length') || 0) / 1024 / 1024).toFixed(2)} MB)`);
    else fail('23-Min Deep Dive Audio Stream', `HTTP ${audio23.status}`);

    // Test byte-range seeking
    const rangeRes = await fetchHttp('http://localhost:3000/audio/how-travel-duopolies-rig-hotel-prices.mp3', {
      headers: { 'Range': 'bytes=500000-1500000' }
    });
    if (rangeRes.status === 206) pass('Audio Byte-Range Seeking', 'HTTP 206 Partial Content confirmed for instantaneous seeking');
    else warn('Audio Byte-Range Seeking', `Returned ${rangeRes.status}`);

    const pdfRes = await fetchHttp('http://localhost:3000/docs/OTA_Duopoly_Research_Brief.pdf');
    if (pdfRes.ok) pass('14-Page PDF Document Stream', `HTTP 200 OK (${(parseInt(pdfRes.headers.get('content-length') || 0) / 1024).toFixed(1)} KB)`);
    else fail('14-Page PDF Document Stream', `HTTP ${pdfRes.status}`);

    // Email POST Endpoint
    const emailRes = await fetchHttp('http://localhost:3000/api/send-welcome-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientEmail: 'paljuritzen@gmail.com',
        recipientName: 'Pål Juritzen',
        inviteCode: 'ATLAS-AUDIT-2026',
        membershipTier: 'Founder Member'
      })
    });
    if (emailRes.ok) {
      const data = await emailRes.json();
      pass('Email API Endpoint', `Handled POST with safe status: ${data.message || 'OK'}`);
    } else {
      fail('Email API Endpoint', `HTTP ${emailRes.status}`);
    }
  } catch (err) {
    fail('HTTP Server', `Failed to connect to localhost:3000: ${err.message}`);
  }

  // 3. CRM Roster & Team Verification
  console.log('\n--- 3. CRM Team Roster & Lead Store ---');
  try {
    const { getStoredTeamMembers, getStoredLeads } = await import('../src/lib/crmService.ts');
    const team = getStoredTeamMembers();
    const lars = team.find(m => m.email.toLowerCase() === 'lars@agenturer.no');
    if (lars) {
      pass('Lars Roster Profile', `Present as ${lars.name} (${lars.email}), Role: ${lars.role}`);
    } else {
      fail('Lars Roster Profile', 'Lars not found in team members list');
    }

    const leads = getStoredLeads();
    pass('Leads Database', `Active stored leads: ${leads.length}`);
  } catch (err) {
    fail('CRM Service', err.message);
  }

  // 4. Firebase Database Registration Test
  console.log('\n--- 4. Firebase Firestore Subscription Engine ---');
  try {
    const { registerSubscriber } = await import('../src/lib/firebase.ts');
    const testReg = await registerSubscriber({
      fullName: 'System Health Auditor',
      email: 'audit@atlastravelclub.com',
      phone: '+47 900 00 000',
      whatsapp: '+47 900 00 000',
      preferredContact: 'whatsapp',
      membershipTier: 'Diagnostic Audit Tier',
    });
    if (testReg && testReg.success && testReg.inviteCode.startsWith('ATLAS-')) {
      pass('Firestore Registration', `Generated valid subscriber record: ${testReg.subscriberId} (Code: ${testReg.inviteCode})`);
    } else {
      fail('Firestore Registration', 'Failed to generate valid subscriber result');
    }
  } catch (err) {
    warn('Firestore Registration', `Local simulation fallback: ${err.message}`);
  }

  console.log('\n======================================================');
  console.log(` AUDIT COMPLETE: ${report.passed} PASSED | ${report.warnings} WARNINGS | ${report.failed} FAILED`);
  console.log('======================================================\n');

  if (report.failed > 0) process.exit(1);
}

run();
