/**
 * CravCards E2E Test Suite
 * Run: npx ts-node scripts/e2e-tests.ts
 * 
 * This tests every page and critical user flow automatically.
 */

const BASE_URL = process.env.BASE_URL || 'https://cravcards.com';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

const results: TestResult[] = [];

async function testPage(name: string, path: string, expectedContent?: string): Promise<void> {
  const start = Date.now();
  try {
    const response = await fetch(`${BASE_URL}${path}`);
    const html = await response.text();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    if (expectedContent && !html.includes(expectedContent)) {
      throw new Error(`Expected content "${expectedContent}" not found`);
    }
    
    results.push({ name, passed: true, duration: Date.now() - start });
    console.log(`✅ ${name}`);
  } catch (error) {
    results.push({ 
      name, 
      passed: false, 
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start 
    });
    console.log(`❌ ${name}: ${error}`);
  }
}

async function testAPI(name: string, path: string, method = 'GET'): Promise<void> {
  const start = Date.now();
  try {
    const response = await fetch(`${BASE_URL}${path}`, { method });
    
    // API routes should return JSON or redirect, not error
    if (response.status >= 500) {
      throw new Error(`Server error: HTTP ${response.status}`);
    }
    
    results.push({ name, passed: true, duration: Date.now() - start });
    console.log(`✅ ${name}`);
  } catch (error) {
    results.push({ 
      name, 
      passed: false, 
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start 
    });
    console.log(`❌ ${name}: ${error}`);
  }
}

async function runTests() {
  console.log('🧪 CravCards E2E Test Suite');
  console.log(`📍 Testing: ${BASE_URL}`);
  console.log('─'.repeat(50));
  console.log('');
  
  // ═══════════════════════════════════════════════════════
  // PUBLIC PAGES
  // ═══════════════════════════════════════════════════════
  console.log('📄 PUBLIC PAGES');
  await testPage('Homepage', '/', 'CravCards');
  await testPage('Pricing', '/pricing', 'Pricing');
  await testPage('Clubs', '/clubs', 'Clubs');
  await testPage('Create Club', '/clubs/create', 'Create');
  await testPage('Marketplace', '/marketplace', 'Marketplace');
  await testPage('Trivia', '/trivia', 'Trivia');
  await testPage('Collection (public)', '/collection', 'Collection');
  
  console.log('');
  
  // ═══════════════════════════════════════════════════════
  // AUTH PAGES
  // ═══════════════════════════════════════════════════════
  console.log('🔐 AUTH PAGES');
  await testPage('Login', '/auth/login', 'Sign');
  await testPage('Signup', '/auth/signup', 'Sign');
  
  console.log('');
  
  // ═══════════════════════════════════════════════════════
  // PROTECTED PAGES (should redirect or show login)
  // ═══════════════════════════════════════════════════════
  console.log('🔒 PROTECTED PAGES');
  await testPage('Dashboard', '/dashboard', ''); // May redirect
  await testPage('Settings', '/settings', '');
  await testPage('Achievements', '/achievements', '');
  
  console.log('');
  
  // ═══════════════════════════════════════════════════════
  // API ROUTES
  // ═══════════════════════════════════════════════════════
  console.log('🔌 API ROUTES');
  await testAPI('Checkout API', '/api/checkout', 'POST');
  await testAPI('Webhook API', '/api/webhook', 'POST');
  
  console.log('');
  
  // ═══════════════════════════════════════════════════════
  // RESULTS SUMMARY
  // ═══════════════════════════════════════════════════════
  console.log('─'.repeat(50));
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const totalTime = results.reduce((a, r) => a + r.duration, 0);
  
  console.log('');
  console.log(`📊 RESULTS: ${passed} passed, ${failed} failed`);
  console.log(`⏱️  Total time: ${totalTime}ms`);
  console.log('');
  
  if (failed > 0) {
    console.log('❌ FAILED TESTS:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`   • ${r.name}: ${r.error}`);
    });
    process.exit(1);
  } else {
    console.log('✅ ALL TESTS PASSED!');
    process.exit(0);
  }
}

runTests().catch(console.error);
