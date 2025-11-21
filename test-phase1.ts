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


// Test 1: Subdomain Extraction

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
});

// Test 2: Subdomain Validation

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
});

// Test 3: Custom Domain Validation

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
});

// Test 4: DNS Verification Token Generation

const token1 = generateDNSVerificationToken();
const token2 = generateDNSVerificationToken();


// Test 5: Tenant URL Generation

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
});

// Summary
