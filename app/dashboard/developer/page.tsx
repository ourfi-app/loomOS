/**
 * Developer Portal Dashboard
 * Main dashboard for developers to manage their apps
 */

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Developer, DeveloperStats } from '@/lib/marketplace';
import type { App } from '@/lib/marketplace';

export default function DeveloperDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [stats, setStats] = useState<DeveloperStats | null>(null);
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      loadDashboardData();
    }
  }, [status, router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Try to get developer profile
      const profileRes = await fetch('/api/developer/profile');

      if (profileRes.status === 404) {
        // Not registered as developer yet
        setDeveloper(null);
        setLoading(false);
        return;
      }

      if (!profileRes.ok) {
        throw new Error('Failed to load profile');
      }

      const profileData = await profileRes.json();

      // Load stats and apps in parallel
      const [statsRes, appsRes] = await Promise.all([
        fetch('/api/developer/stats'),
        fetch('/api/developer/apps'),
      ]);

      const statsData = await statsRes.json();
      const appsData = await appsRes.json();

      setDeveloper(profileData.developer);
      setStats(statsData.stats);
      setApps(appsData.apps);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterDeveloper = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsRegistering(true);

    try {
      const formData = new FormData(e.currentTarget);

      const response = await fetch('/api/developer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: formData.get('displayName'),
          companyName: formData.get('companyName'),
          bio: formData.get('bio'),
          website: formData.get('website'),
          supportEmail: formData.get('supportEmail'),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      // Reload dashboard
      await loadDashboardData();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  // Show registration form if not registered as developer
  if (!developer) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-2">Become a loomOS Developer</h1>
        <p className="text-[var(--semantic-text-secondary)] mb-8">
          Create and publish apps for the loomOS marketplace
        </p>

        <form onSubmit={handleRegisterDeveloper} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Display Name *
            </label>
            <input
              type="text"
              name="displayName"
              required
              className="w-full px-4 py-2 border border-[var(--semantic-border-medium)] rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Your name or company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Company Name (Optional)
            </label>
            <input
              type="text"
              name="companyName"
              className="w-full px-4 py-2 border border-[var(--semantic-border-medium)] rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Your company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Bio *
            </label>
            <textarea
              name="bio"
              required
              rows={4}
              className="w-full px-4 py-2 border border-[var(--semantic-border-medium)] rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Tell us about yourself and what you plan to build"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Website (Optional)
            </label>
            <input
              type="url"
              name="website"
              className="w-full px-4 py-2 border border-[var(--semantic-border-medium)] rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Support Email *
            </label>
            <input
              type="email"
              name="supportEmail"
              required
              className="w-full px-4 py-2 border border-[var(--semantic-border-medium)] rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="support@yourcompany.com"
            />
          </div>

          <button
            type="submit"
            disabled={isRegistering}
            className="w-full bg-[var(--semantic-primary)] text-white py-3 rounded-lg hover:bg-[var(--semantic-primary-dark)] disabled:opacity-50"
          >
            {isRegistering ? 'Registering...' : 'Register as Developer'}
          </button>
        </form>
      </div>
    );
  }

  // Show main dashboard
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Developer Portal</h1>
          <p className="text-[var(--semantic-text-secondary)] mt-1">
            Welcome back, {developer.displayName}!
          </p>
        </div>
        <Link
          href="/dashboard/developer/apps/new"
          className="bg-[var(--semantic-primary)] text-white px-6 py-3 rounded-lg hover:bg-[var(--semantic-primary-dark)]"
        >
          Create New App
        </Link>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-[var(--semantic-text-secondary)] mb-1">Total Apps</div>
            <div className="text-3xl font-bold">{stats.totalApps}</div>
            <div className="text-sm text-[var(--semantic-success)] mt-2">
              {stats.publishedApps} published
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-[var(--semantic-text-secondary)] mb-1">Total Downloads</div>
            <div className="text-3xl font-bold">
              {stats.totalDownloads.toLocaleString()}
            </div>
            <div className="text-sm text-[var(--semantic-text-secondary)] mt-2">
              +{stats.recentDownloads.toLocaleString()} this month
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-[var(--semantic-text-secondary)] mb-1">Total Revenue</div>
            <div className="text-3xl font-bold">
              ${stats.totalRevenue.toFixed(2)}
            </div>
            <div className="text-sm text-[var(--semantic-text-secondary)] mt-2">
              +${stats.recentRevenue.toFixed(2)} this month
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-[var(--semantic-text-secondary)] mb-1">Average Rating</div>
            <div className="text-3xl font-bold">
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="text-sm text-[var(--semantic-text-secondary)] mt-2">⭐ out of 5</div>
          </div>
        </div>
      )}

      {/* Apps List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold">Your Apps</h2>
        </div>

        {apps.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[var(--semantic-text-secondary)] mb-4">
              You haven't created any apps yet
            </p>
            <Link
              href="/dashboard/developer/apps/new"
              className="inline-block bg-[var(--semantic-primary)] text-white px-6 py-3 rounded-lg hover:bg-[var(--semantic-primary-dark)]"
            >
              Create Your First App
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {apps.map((app) => (
              <Link
                key={app.id}
                href={`/dashboard/developer/apps/${app.id}`}
                className="block p-6 hover:bg-[var(--semantic-bg-subtle)] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={app.icon}
                    alt={app.name}
                    className="w-16 h-16 rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{app.name}</h3>
                    <p className="text-[var(--semantic-text-secondary)] text-sm">{app.tagline}</p>
                    <div className="flex gap-3 mt-2 text-sm text-[var(--semantic-text-secondary)]">
                      <span>v{app.currentVersion}</span>
                      <span>•</span>
                      <span>{app.downloads.toLocaleString()} downloads</span>
                      <span>•</span>
                      <span>⭐ {app.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        app.status === 'PUBLISHED'
                          ? 'bg-[var(--semantic-success-bg)] text-[var(--semantic-success-dark)]'
                          : app.status === 'DRAFT'
                          ? 'bg-[var(--semantic-surface-hover)] text-[var(--semantic-text-secondary)]'
                          : app.status === 'PENDING_REVIEW'
                          ? 'bg-[var(--semantic-primary-subtle)] text-[var(--semantic-primary-dark)]'
                          : 'bg-[var(--semantic-warning-bg)] text-[var(--semantic-warning-dark)]'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
