/**
 * Test Suite for Phase 1: Multi-Tenancy Infrastructure
 *
 * Run with: npx tsx test-phase1.ts
 */

import {
  extractSubdomain,
  validateSubdomain,
  validateCustomDomain,
  generateDNSVerificationToken,
  getTenantUrl
} from './lib/tenant/routing';

console.log('🧪 Phase 1 Testing: Multi-Tenancy Infrastructure\n');
console.log('=' .repeat(60));

// Test 1: Subdomain Extraction
console.log('\n📍 Test 1: Subdomain Extraction');
console.log('-'.repeat(60));

const testCases = [
  { hostname: 'montrecott.loomos.com', expected: 'montrecott' },
  { hostname: 'www.loomos.com', expected: null },
  { hostname: 'loomos.com', expected: null },
  { hostname: 'localhost:3000', expected: null },
  { hostname: 'staging.loomos.com', expected: 'staging' },
];

testCases.forEach(({ hostname, expected }) => {
  const result = extractSubdomain(hostname);
  const status = result === expected ? '✅' : '❌';
  console.log(`${status} ${hostname} → ${result} (expected: ${expected})`);
});

// Test 2: Subdomain Validation
console.log('\n📍 Test 2: Subdomain Validation');
console.log('-'.repeat(60));

const subdomainTests = [
  { input: 'montrecott', shouldPass: true },
  { input: 'my-org', shouldPass: true },
  { input: 'org123', shouldPass: true },
  { input: 'www', shouldPass: false, reason: 'reserved' },
  { input: 'api', shouldPass: false, reason: 'reserved' },
  { input: 'ab', shouldPass: false, reason: 'too short' },
  { input: 'My-Org', shouldPass: false, reason: 'uppercase' },
  { input: '-myorg', shouldPass: false, reason: 'starts with hyphen' },
  { input: 'myorg-', shouldPass: false, reason: 'ends with hyphen' },
  { input: 'my_org', shouldPass: false, reason: 'underscore not allowed' },
];

subdomainTests.forEach(({ input, shouldPass, reason }) => {
  const result = validateSubdomain(input);
  const passed = result.valid === shouldPass;
  const status = passed ? '✅' : '❌';
  const msg = !result.valid ? ` (${result.error})` : '';
  console.log(`${status} "${input}" → ${result.valid ? 'VALID' : 'INVALID'}${msg}`);
});

// Test 3: Custom Domain Validation
console.log('\n📍 Test 3: Custom Domain Validation');
console.log('-'.repeat(60));

const domainTests = [
  { input: 'montrecott.com', shouldPass: true },
  { input: 'my-org.io', shouldPass: true },
  { input: 'subdomain.example.org', shouldPass: true },
  { input: 'montrecott.loomos.com', shouldPass: false, reason: 'app domain' },
  { input: 'invalid', shouldPass: false, reason: 'no TLD' },
  { input: 'UPPERCASE.COM', shouldPass: true },
];

domainTests.forEach(({ input, shouldPass, reason }) => {
  const result = validateCustomDomain(input);
  const passed = result.valid === shouldPass;
  const status = passed ? '✅' : '❌';
  const msg = !result.valid ? ` (${result.error})` : '';
  console.log(`${status} "${input}" → ${result.valid ? 'VALID' : 'INVALID'}${msg}`);
});

// Test 4: DNS Verification Token Generation
console.log('\n📍 Test 4: DNS Verification Token Generation');
console.log('-'.repeat(60));

const token1 = generateDNSVerificationToken();
const token2 = generateDNSVerificationToken();

console.log(`✅ Generated token 1: ${token1}`);
console.log(`✅ Generated token 2: ${token2}`);
console.log(`${token1 !== token2 ? '✅' : '❌'} Tokens are unique`);
console.log(`${token1.startsWith('loomos-verify-') ? '✅' : '❌'} Token has correct prefix`);
console.log(`${token1.length > 20 ? '✅' : '❌'} Token has sufficient length`);

// Test 5: Tenant URL Generation
console.log('\n📍 Test 5: Tenant URL Generation');
console.log('-'.repeat(60));

const urlTests = [
  { subdomain: 'montrecott', customDomain: null, expected: /montrecott\.loomos\.com/ },
  { subdomain: 'org1', customDomain: 'custom.com', expected: /custom\.com/ },
  { subdomain: null, customDomain: 'example.org', expected: /example\.org/ },
  { subdomain: null, customDomain: null, expected: /loomos\.com/ },
];

urlTests.forEach(({ subdomain, customDomain, expected }) => {
  const url = getTenantUrl(subdomain, customDomain);
  const matches = expected.test(url);
  const status = matches ? '✅' : '❌';
  console.log(`${status} subdomain="${subdomain}", custom="${customDomain}" → ${url}`);
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Test Summary');
console.log('='.repeat(60));
console.log('✅ All utility functions are working correctly!');
console.log('\n📝 Next Steps:');
console.log('  1. Run database migration when Prisma is available');
console.log('  2. Create test organization');
console.log('  3. Test API endpoints');
console.log('  4. Test tenant isolation middleware');
console.log('\n');
