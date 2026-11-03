/**
 * Full End-to-End QA Test Suite for YTC Global Education
 * Stack: Next.js 16 (Port 3000) + Express 5 (Port 5000) + MongoDB
 */

const API_BASE = 'http://localhost:5000';
const SITE_BASE = 'http://localhost:3000';

const results = [];

function record(testSuite, testCase, status, details = '') {
  results.push({ testSuite, testCase, status, details });
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} [${status}] [${testSuite}] ${testCase} ${details ? `-> ${details}` : ''}`);
}

async function run() {
  console.log('====================================================');
  console.log('🚀 STARTING FULL QA TEST SUITE: YTC GLOBAL EDUCATION');
  console.log('====================================================\n');

  // --- SUITE 1: API Core & Health ---
  try {
    const res = await fetch(`${API_BASE}/health`);
    const json = await res.json().catch(() => ({}));
    if (res.status === 200 && json.status === 'OK') {
      record('API Health', 'GET /health returns 200 OK', 'PASS');
    } else {
      record('API Health', 'GET /health returns 200 OK', 'FAIL', `Status: ${res.status}`);
    }
  } catch (err) {
    record('API Health', 'GET /health connection', 'FAIL', err.message);
  }

  // --- SUITE 2: Public Content Endpoints ---
  const publicEndpoints = [
    { url: '/api/countries', name: 'Countries list' },
    { url: '/api/universities', name: 'Universities list' },
    { url: '/api/blogs', name: 'Blog posts' },
    { url: '/api/faqs', name: 'FAQs list' },
    { url: '/api/services', name: 'Services list' },
    { url: '/api/testimonials', name: 'Student Testimonials' },
    { url: '/api/settings/footer', name: 'Footer & Socials Settings' },
    { url: '/api/about', name: 'About Page CMS Content' },
  ];

  for (const ep of publicEndpoints) {
    try {
      const res = await fetch(`${API_BASE}${ep.url}`);
      const json = await res.json().catch(() => ({}));
      if (res.status === 200 && (json.success === true || Array.isArray(json.data) || json.data)) {
        record('Public API', `GET ${ep.url} (${ep.name})`, 'PASS');
      } else {
        record('Public API', `GET ${ep.url} (${ep.name})`, 'FAIL', `Status: ${res.status}`);
      }
    } catch (err) {
      record('Public API', `GET ${ep.url} (${ep.name})`, 'FAIL', err.message);
    }
  }

  // --- SUITE 3: Dynamic Footer Settings Verification ---
  try {
    const res = await fetch(`${API_BASE}/api/settings/footer`);
    const json = await res.json().catch(() => ({}));
    if (json.data && json.data.socialLinks && Array.isArray(json.data.recognitions)) {
      const recCount = json.data.recognitions.length;
      record('Footer Settings', 'Data integrity (socialLinks + recognitions)', 'PASS', `${recCount} badges found`);
    } else {
      record('Footer Settings', 'Data integrity (socialLinks + recognitions)', 'FAIL', 'Missing expected structure');
    }
  } catch (err) {
    record('Footer Settings', 'Fetch verification', 'FAIL', err.message);
  }

  // --- SUITE 4: Newsletter Subscription API (Lead & Deduplication) ---
  const testEmail = `qa_test_${Date.now()}@example.com`;
  try {
    // 1st subscription
    const res1 = await fetch(`${API_BASE}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, interest: 'canada' }),
    });
    const json1 = await res1.json().catch(() => ({}));
    if (res1.status === 201 && json1.success) {
      record('Newsletter API', 'New email subscription (HTTP 201)', 'PASS');
    } else {
      record('Newsletter API', 'New email subscription (HTTP 201)', 'FAIL', `Status: ${res1.status}`);
    }

    // 2nd subscription (duplicate check)
    const res2 = await fetch(`${API_BASE}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, interest: 'germany' }),
    });
    const json2 = await res2.json().catch(() => ({}));
    if (res2.status === 200 && json2.success) {
      record('Newsletter API', 'Duplicate subscription gracefully handled (HTTP 200)', 'PASS');
    } else {
      record('Newsletter API', 'Duplicate subscription gracefully handled', 'FAIL', `Status: ${res2.status}`);
    }

    // Invalid email check
    const res3 = await fetch(`${API_BASE}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email' }),
    });
    if (res3.status === 400) {
      record('Newsletter API', 'Invalid email rejection (HTTP 400)', 'PASS');
    } else {
      record('Newsletter API', 'Invalid email rejection', 'FAIL', `Expected 400, got ${res3.status}`);
    }
  } catch (err) {
    record('Newsletter API', 'Execution error', 'FAIL', err.message);
  }

  // --- SUITE 5: Lead Submission API ---
  try {
    const resLead = await fetch(`${API_BASE}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'consultation',
        name: 'QA Test Student',
        phone: '+1 555-019-9123',
        email: 'qa_student@example.com',
        country: 'Canada',
        message: 'Automated QA Lead verification test',
      }),
    });
    const jsonLead = await resLead.json().catch(() => ({}));
    if (resLead.status === 201 && jsonLead.success) {
      record('Leads API', 'Lead submission (HTTP 201)', 'PASS', `Lead ID: ${jsonLead.data?._id || 'OK'}`);
    } else {
      record('Leads API', 'Lead submission', 'FAIL', `Status: ${resLead.status}, msg: ${jsonLead.message}, errs: ${JSON.stringify(jsonLead.errors || [])}`);
    }
  } catch (err) {
    record('Leads API', 'Lead submission error', 'FAIL', err.message);
  }

  // --- SUITE 6: Security & Protected Admin Routes ---
  try {
    // Unauthenticated GET to protected /api/admin/leads
    const resSec = await fetch(`${API_BASE}/api/admin/leads`);
    if (resSec.status === 401) {
      record('Security API', 'Blocked unauthenticated /api/admin/leads (HTTP 401)', 'PASS');
    } else {
      record('Security API', 'Blocked unauthenticated /api/admin/leads', 'FAIL', `Expected 401, got ${resSec.status}`);
    }

    // Unauthenticated GET to protected /api/admin/staff
    const resStaff = await fetch(`${API_BASE}/api/admin/staff`);
    if (resStaff.status === 401) {
      record('Security API', 'Blocked unauthenticated /api/admin/staff (HTTP 401)', 'PASS');
    } else {
      record('Security API', 'Blocked unauthenticated /api/admin/staff', 'FAIL', `Expected 401, got ${resStaff.status}`);
    }

    // Forgot password generic safe response
    const resForgot = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent_account@example.com' }),
    });
    const jsonForgot = await resForgot.json().catch(() => ({}));
    if (resForgot.status === 200 && jsonForgot.message && jsonForgot.message.includes('If this email exists')) {
      record('Security API', 'Forgot Password user enumeration protection', 'PASS');
    } else {
      record('Security API', 'Forgot Password user enumeration protection', 'FAIL', jsonForgot.message);
    }
  } catch (err) {
    record('Security API', 'Security check error', 'FAIL', err.message);
  }

  // --- SUITE 7: Frontend Web Routes (Next.js Port 3000) ---
  const frontendRoutes = [
    { url: '/', name: 'Homepage' },
    { url: '/about', name: 'About Us' },
    { url: '/partner-universities', name: 'Partner Universities Directory' },
    { url: '/study-abroad', name: 'Study Destinations Hub' },
    { url: '/services', name: 'Services' },
    { url: '/overseas-recruitment', name: 'Overseas Recruitment' },
    { url: '/blog', name: 'Blog' },
    { url: '/contact', name: 'Contact Us' },
    { url: '/robots.txt', name: 'Robots.txt Crawler Rules' },
    { url: '/sitemap.xml', name: 'Sitemap.xml Index' },
  ];

  for (const fr of frontendRoutes) {
    try {
      const res = await fetch(`${SITE_BASE}${fr.url}`);
      if (res.status === 200) {
        record('Frontend Web', `GET ${fr.url} (${fr.name})`, 'PASS', `HTTP 200 OK`);
      } else {
        record('Frontend Web', `GET ${fr.url} (${fr.name})`, 'FAIL', `Status: ${res.status}`);
      }
    } catch (err) {
      record('Frontend Web', `GET ${fr.url} (${fr.name})`, 'FAIL', err.message);
    }
  }

  // --- SUITE 8: 301 Redirect Check (/universities -> /partner-universities) ---
  try {
    const resRedir = await fetch(`${SITE_BASE}/universities`, { redirect: 'manual' });
    if (resRedir.status === 307 || resRedir.status === 308 || resRedir.status === 301 || resRedir.status === 302) {
      const location = resRedir.headers.get('location');
      record('SEO Redirect', '/universities -> /partner-universities redirect', 'PASS', `HTTP ${resRedir.status} -> ${location}`);
    } else {
      record('SEO Redirect', '/universities -> /partner-universities redirect', 'FAIL', `Expected 301/308, got ${resRedir.status}`);
    }
  } catch (err) {
    record('SEO Redirect', '/universities redirect error', 'FAIL', err.message);
  }

  // Summary
  console.log('\n====================================================');
  const passCount = results.filter((r) => r.status === 'PASS').length;
  const failCount = results.filter((r) => r.status === 'FAIL').length;
  console.log(`📊 QA SUMMARY: Total: ${results.length} | PASS: ${passCount} | FAIL: ${failCount}`);
  console.log('====================================================');
}

run();
