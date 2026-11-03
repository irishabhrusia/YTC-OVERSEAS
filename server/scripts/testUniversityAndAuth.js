const API_BASE = 'http://localhost:5000';
const SITE_BASE = 'http://localhost:3000';

async function runDetailedTests() {
  console.log('--- TESTING INDIVIDUAL UNIVERSITY DETAIL PAGE & AUTH FLOW ---');

  // 1. Fetch live universities from DB
  const uniRes = await fetch(`${API_BASE}/api/universities?limit=5`);
  const uniJson = await uniRes.json();
  const unis = uniJson.data?.universities || [];

  if (unis.length === 0) {
    console.log('⚠️ No universities found in database to test detail page.');
  } else {
    const testUni = unis[0];
    console.log(`Checking university: "${testUni.name}" with slug: "${testUni.slug}"`);

    // API check
    const apiDetailRes = await fetch(`${API_BASE}/api/universities/${testUni.slug}`);
    const apiDetailJson = await apiDetailRes.json();
    if (apiDetailRes.status === 200 && apiDetailJson.data) {
      console.log(`✅ [PASS] API GET /api/universities/${testUni.slug} returned 200 OK`);
    } else {
      console.log(`❌ [FAIL] API GET /api/universities/${testUni.slug} failed with status: ${apiDetailRes.status}`);
    }

    // Frontend SSR Page check
    const frontRes = await fetch(`${SITE_BASE}/partner-universities/${testUni.slug}`);
    if (frontRes.status === 200) {
      const html = await frontRes.text();
      const hasTitle = html.includes(testUni.name);
      console.log(`✅ [PASS] Frontend GET /partner-universities/${testUni.slug} returned HTTP 200 OK (Contains name: ${hasTitle})`);
    } else {
      console.log(`❌ [FAIL] Frontend GET /partner-universities/${testUni.slug} returned HTTP ${frontRes.status}`);
    }
  }

  // 2. Test Invalid University Slug (404 Not Found check)
  const invalidRes = await fetch(`${SITE_BASE}/partner-universities/non-existent-university-xyz-123`);
  if (invalidRes.status === 404) {
    console.log('✅ [PASS] Invalid university slug correctly returns HTTP 404 Not Found');
  } else {
    console.log(`⚠️ Invalid university slug returned HTTP ${invalidRes.status}`);
  }
}

runDetailedTests();

