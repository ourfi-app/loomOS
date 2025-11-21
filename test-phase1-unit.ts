/**
 * Unit Tests for Phase 1: Multi-Tenancy Infrastructure
 * Tests utility functions without Next.js dependencies
 */

// Inline the functions to test without importing
function extractSubdomain(hostname: string): string | null {
  const host = hostname.split(':')[0];

  if (host === 'localhost' || host === '127.0.0.1') {
    return null;
  }

  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'loomos.com';

  if (host === appDomain || host === `www.${appDomain}`) {
    return null;
  }

  const parts = host.split('.');

  if (!host.endsWith(appDomain)) {
    return null;
  }

  const subdomain = host.replace(`.${appDomain}`, '');

  if (subdomain === 'www') {
    return null;
  }

  return subdomain;
}

function validateSubdomain(subdomain: string): { valid: boolean; error?: string } {
  const reserved = [
    'www', 'api', 'admin', 'app', 'mail', 'smtp', 'ftp', 'localhost',
    'staging', 'dev', 'test', 'demo', 'support', 'help', 'blog',
    'docs', 'status', 'superadmin', 'super-admin',
  ];

  if (!subdomain) {
    return { valid: false, error: 'Subdomain is required' };
  }

  if (subdomain.length < 3 || subdomain.length > 63) {
    return { valid: false, error: 'Subdomain must be between 3 and 63 characters' };
  }

  if (!/^[a-z0-9-]+$/.test(subdomain)) {
    return { valid: false, error: 'Subdomain can only contain lowercase letters, numbers, and hyphens' };
  }

  if (subdomain.startsWith('-') || subdomain.endsWith('-')) {
    return { valid: false, error: 'Subdomain cannot start or end with a hyphen' };
  }

  if (reserved.includes(subdomain)) {
    return { valid: false, error: 'This subdomain is reserved' };
  }

  return { valid: true };
}

function validateCustomDomain(domain: string): { valid: boolean; error?: string } {
  if (!domain) {
    return { valid: false, error: 'Domain is required' };
  }

  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;

  if (!domainRegex.test(domain)) {
    return { valid: false, error: 'Invalid domain format' };
  }

  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'loomos.com';
  if (domain.endsWith(appDomain)) {
    return { valid: false, error: `Cannot use ${appDomain} as custom domain. Use subdomain instead.` };
  }

  return { valid: true };
}

function generateDNSVerificationToken(): string {
  return `loomos-verify-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
}

function getTenantUrl(subdomain: string | null, customDomain: string | null): string {
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'loomos.com';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

  if (customDomain) {
    return `${protocol}://${customDomain}`;
  }

  if (subdomain) {
    return `${protocol}://${subdomain}.${appDomain}`;
  }

  return `${protocol}://${appDomain}`;
}

// Test Runner

let passed = 0;
let failed = 0;

function test(name: string, fn: () => boolean) {
  try {
    const result = fn();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  } catch (error: any) {
    failed++;
  }
}

// Test 1: Subdomain Extraction

test('Extract subdomain from montrecott.loomos.com', () => {
  return extractSubdomain('montrecott.loomos.com') === 'montrecott';
});

test('Return null for www.loomos.com', () => {
  return extractSubdomain('www.loomos.com') === null;
});

test('Return null for root domain loomos.com', () => {
  return extractSubdomain('loomos.com') === null;
});

test('Return null for localhost:3000', () => {
  return extractSubdomain('localhost:3000') === null;
});

test('Extract staging subdomain', () => {
  return extractSubdomain('staging.loomos.com') === 'staging';
});

// Test 2: Subdomain Validation

test('Valid: montrecott', () => {
  return validateSubdomain('montrecott').valid === true;
});

test('Valid: my-org-123', () => {
  return validateSubdomain('my-org-123').valid === true;
});

test('Invalid: www (reserved)', () => {
  return validateSubdomain('www').valid === false;
});

test('Invalid: api (reserved)', () => {
  return validateSubdomain('api').valid === false;
});

test('Invalid: ab (too short)', () => {
  return validateSubdomain('ab').valid === false;
});

test('Invalid: My-Org (uppercase)', () => {
  return validateSubdomain('My-Org').valid === false;
});

test('Invalid: -myorg (starts with hyphen)', () => {
  return validateSubdomain('-myorg').valid === false;
});

test('Invalid: myorg- (ends with hyphen)', () => {
  return validateSubdomain('myorg-').valid === false;
});

test('Invalid: my_org (underscore)', () => {
  return validateSubdomain('my_org').valid === false;
});

// Test 3: Custom Domain Validation

test('Valid: montrecott.com', () => {
  return validateCustomDomain('montrecott.com').valid === true;
});

test('Valid: subdomain.example.org', () => {
  return validateCustomDomain('subdomain.example.org').valid === true;
});

test('Invalid: montrecott.loomos.com (app domain)', () => {
  return validateCustomDomain('montrecott.loomos.com').valid === false;
});

test('Invalid: invalid (no TLD)', () => {
  return validateCustomDomain('invalid').valid === false;
});

test('Valid: uppercase.COM (case insensitive)', () => {
  return validateCustomDomain('UPPERCASE.COM').valid === true;
});

// Test 4: DNS Verification Token

const token1 = generateDNSVerificationToken();
const token2 = generateDNSVerificationToken();

test('Token has correct prefix', () => {
  return token1.startsWith('loomos-verify-');
});

test('Tokens are unique', () => {
  return token1 !== token2;
});

test('Token has sufficient length', () => {
  return token1.length > 20;
});

// Test 5: Tenant URL Generation

test('Subdomain URL generation', () => {
  const url = getTenantUrl('montrecott', null);
  return url.includes('montrecott.loomos.com');
});

test('Custom domain preferred over subdomain', () => {
  const url = getTenantUrl('montrecott', 'custom.com');
  return url.includes('custom.com') && !url.includes('montrecott');
});

test('Custom domain only', () => {
  const url = getTenantUrl(null, 'example.org');
  return url.includes('example.org');
});

test('Root domain fallback', () => {
  const url = getTenantUrl(null, null);
  return url.includes('loomos.com') && !url.includes('undefined');
});

// Summary

if (failed === 0) {
} else {
  process.exit(1);
}

