/**
 * App Management Page
 * View and manage individual app details, analytics, and versions
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { App } from '@/lib/marketplace';
import type { AnalyticsSummary, DeveloperAnalytics } from '@/lib/marketplace';

interface AppWithDetails extends App {
  versions?: any[];
  reviews?: any[];
}

export default function AppManagementPage() {
  const params = useParams();
  const router = useRouter();
  const [app, setApp] = useState<AppWithDetails | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'versions' | 'reviews'>('overview');

  useEffect(() => {
    loadAppData();
  }, [params.appId]);

  const loadAppData = async () => {
    try {
      setLoading(true);

      const [appRes, analyticsRes] = await Promise.all([
        fetch(`/api/developer/apps/${params.appId}`),
        fetch(`/api/developer/apps/${params.appId}/analytics`),
      ]);

      if (!appRes.ok) {
        throw new Error('Failed to load app');
      }

      const appData = await appRes.json();
      setApp(appData.app);

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData.summary);
      }
    } catch (error) {
      console.error('Failed to load app data:', error);
      alert('Failed to load app. Redirecting...');
      router.push('/dashboard/developer');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this app? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/developer/apps/${params.appId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete app');
      }

      router.push('/dashboard/developer');
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-[var(--semantic-text-secondary)] mb-4">App not found</p>
          <Link
            href="/dashboard/developer"
            className="text-[var(--semantic-primary)] hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/developer"
          className="text-[var(--semantic-primary)] hover:underline mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>

        <div className="flex items-center gap-6 mb-6">
          <img
            src={app.icon}
            alt={app.name}
            className="w-20 h-20 rounded-xl shadow"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{app.name}</h1>
            <p className="text-[var(--semantic-text-secondary)]">{app.tagline}</p>
            <div className="flex gap-4 mt-2">
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
              <span className="text-sm text-[var(--semantic-text-secondary)]">v{app.currentVersion}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/dashboard/developer/apps/${app.id}/edit`}
              className="px-4 py-2 border border-[var(--semantic-border-medium)] rounded-lg hover:bg-[var(--semantic-bg-subtle)]"
            >
              Edit Details
            </Link>
            <Link
              href={`/dashboard/developer/apps/${app.id}/submit-version`}
              className="px-4 py-2 bg-[var(--semantic-primary)] text-white rounded-lg hover:bg-[var(--semantic-primary-dark)]"
            >
              Submit Update
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex gap-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'versions', label: 'Versions' },
            { id: 'reviews', label: 'Reviews' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-1 ${
                activeTab === tab.id
                  ? 'border-b-2 border-orange-500 text-[var(--semantic-primary)] font-semibold'
                  : 'text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-text-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-[var(--semantic-text-secondary)] mb-1">Downloads</div>
                <div className="text-2xl font-bold">
                  {analytics.downloads.toLocaleString()}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-[var(--semantic-text-secondary)] mb-1">Installations</div>
                <div className="text-2xl font-bold">
                  {analytics.installations.toLocaleString()}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-[var(--semantic-text-secondary)] mb-1">Active Users</div>
                <div className="text-2xl font-bold">
                  {analytics.activeUsers.toLocaleString()}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-[var(--semantic-text-secondary)] mb-1">Avg Rating</div>
                <div className="text-2xl font-bold">
                  ⭐ {analytics.averageRating.toFixed(1)}
                </div>
              </div>
            </div>
          )}

          {/* App Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">App Details</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-[var(--semantic-text-secondary)]">Description</div>
                <p className="mt-1">{app.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-[var(--semantic-text-secondary)]">Category</div>
                  <div className="mt-1">{app.category}</div>
                </div>
                <div>
                  <div className="text-sm text-[var(--semantic-text-secondary)]">Pricing</div>
                  <div className="mt-1 capitalize">{app.pricing.model}</div>
                </div>
                <div>
                  <div className="text-sm text-[var(--semantic-text-secondary)]">Installation Type</div>
                  <div className="mt-1">{app.installationType}</div>
                </div>
                <div>
                  <div className="text-sm text-[var(--semantic-text-secondary)]">Min loomOS Version</div>
                  <div className="mt-1">{app.minimumLoomOSVersion}</div>
                </div>
              </div>
              {app.tags && app.tags.length > 0 && (
                <div>
                  <div className="text-sm text-[var(--semantic-text-secondary)] mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {app.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[var(--semantic-surface-hover)] text-[var(--semantic-text-secondary)] px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Screenshots */}
          {app.screenshots && app.screenshots.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Screenshots</h2>
              <div className="grid grid-cols-3 gap-4">
                {app.screenshots.map((screenshot, index) => (
                  <img
                    key={index}
                    src={screenshot.url}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full rounded-lg border"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Danger Zone */}
          {(app.status === 'DRAFT' || app.status === 'REJECTED') && (
            <div className="bg-[var(--semantic-error-bg)] p-6 rounded-lg border border-[var(--semantic-error-border)]">
              <h2 className="text-xl font-semibold text-[var(--semantic-error-dark)] mb-2">
                Danger Zone
              </h2>
              <p className="text-[var(--semantic-error)] mb-4">
                Delete this app permanently. This action cannot be undone.
              </p>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-[var(--semantic-error)] text-white rounded-lg hover:bg-[var(--semantic-error-dark)]"
              >
                Delete App
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Analytics</h2>
          {analytics ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-[var(--semantic-text-secondary)]">Total Downloads</div>
                  <div className="text-2xl font-bold mt-1">
                    {analytics.downloads.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[var(--semantic-text-secondary)]">Installations</div>
                  <div className="text-2xl font-bold mt-1">
                    {analytics.installations.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[var(--semantic-text-secondary)]">Uninstalls</div>
                  <div className="text-2xl font-bold mt-1">
                    {analytics.uninstalls.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[var(--semantic-text-secondary)]">Net Installs</div>
                  <div className="text-2xl font-bold mt-1">
                    {(analytics.installations - analytics.uninstalls).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[var(--semantic-text-secondary)]">Active Users</div>
                  <div className="text-2xl font-bold mt-1">
                    {analytics.activeUsers.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[var(--semantic-text-secondary)]">Total Launches</div>
                  <div className="text-2xl font-bold mt-1">
                    {analytics.launches.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[var(--semantic-text-secondary)]">Crash Rate</div>
                  <div className="text-2xl font-bold mt-1">
                    {(analytics.crashRate * 100).toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[var(--semantic-text-secondary)]">Revenue</div>
                  <div className="text-2xl font-bold mt-1">
                    ${analytics.revenue.toFixed(2)}
                  </div>
                </div>
              </div>
              <p className="text-sm text-[var(--semantic-text-secondary)]">
                Data shown for the last 30 days
              </p>
            </div>
          ) : (
            <p className="text-[var(--semantic-text-secondary)]">No analytics data available yet.</p>
          )}
        </div>
      )}

      {activeTab === 'versions' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Version History</h2>
          {app.versions && app.versions.length > 0 ? (
            <div className="space-y-4">
              {app.versions.map((version: any) => (
                <div
                  key={version.id}
                  className="border rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">Version {version.version}</h3>
                      <p className="text-sm text-[var(--semantic-text-secondary)]">
                        {new Date(version.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        version.status === 'published'
                          ? 'bg-[var(--semantic-success-bg)] text-[var(--semantic-success-dark)]'
                          : 'bg-[var(--semantic-surface-hover)] text-[var(--semantic-text-secondary)]'
                      }`}
                    >
                      {version.status}
                    </span>
                  </div>
                  <p className="text-sm">{version.releaseNotes}</p>
                  <div className="text-sm text-[var(--semantic-text-secondary)] mt-2">
                    {version.downloads.toLocaleString()} downloads
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--semantic-text-secondary)]">No versions yet.</p>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">User Reviews</h2>
          {app.reviews && app.reviews.length > 0 ? (
            <div className="space-y-4">
              {app.reviews.map((review: any) => (
                <div
                  key={review.id}
                  className="border rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold">{review.userName || 'Anonymous'}</div>
                      <div className="text-sm text-[var(--semantic-text-secondary)]">
                        {'⭐'.repeat(review.rating)} {review.rating}/5
                      </div>
                    </div>
                    <div className="text-sm text-[var(--semantic-text-secondary)]">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {review.title && (
                    <h4 className="font-semibold mb-1">{review.title}</h4>
                  )}
                  <p className="text-sm">{review.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--semantic-text-secondary)]">No reviews yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
