/**
 * Create New App Page
 * Form for developers to create a new app listing
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppCategory, AppPricingModel, AppInstallationType, AppPermission } from '@/lib/marketplace';

const CATEGORIES = [
  { value: AppCategory.COMMUNICATION, label: 'Communication' },
  { value: AppCategory.PRODUCTIVITY, label: 'Productivity' },
  { value: AppCategory.COMMUNITY, label: 'Community' },
  { value: AppCategory.ENTERTAINMENT, label: 'Entertainment' },
  { value: AppCategory.UTILITIES, label: 'Utilities' },
  { value: AppCategory.LIFESTYLE, label: 'Lifestyle' },
  { value: AppCategory.FINANCE, label: 'Finance' },
  { value: AppCategory.EDUCATION, label: 'Education' },
  { value: AppCategory.BUSINESS, label: 'Business' },
  { value: AppCategory.HEALTH, label: 'Health' },
  { value: AppCategory.SOCIAL, label: 'Social' },
  { value: AppCategory.DEVELOPER_TOOLS, label: 'Developer Tools' },
];

const PERMISSIONS = [
  { value: AppPermission.STORAGE_READ, label: 'Read Storage' },
  { value: AppPermission.STORAGE_WRITE, label: 'Write Storage' },
  { value: AppPermission.CONTACTS_READ, label: 'Read Contacts' },
  { value: AppPermission.CONTACTS_WRITE, label: 'Write Contacts' },
  { value: AppPermission.CALENDAR_READ, label: 'Read Calendar' },
  { value: AppPermission.CALENDAR_WRITE, label: 'Write Calendar' },
  { value: AppPermission.EMAIL_SEND, label: 'Send Email' },
  { value: AppPermission.EMAIL_READ, label: 'Read Email' },
  { value: AppPermission.LOCATION, label: 'Location' },
  { value: AppPermission.CAMERA, label: 'Camera' },
  { value: AppPermission.MICROPHONE, label: 'Microphone' },
  { value: AppPermission.NOTIFICATIONS, label: 'Notifications' },
  { value: AppPermission.NETWORK, label: 'Network' },
  { value: AppPermission.AI_SERVICES, label: 'AI Services' },
];

export default function NewAppPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AppCategory>(AppCategory.UTILITIES);
  const [selectedPermissions, setSelectedPermissions] = useState<AppPermission[]>([]);
  const [pricingModel, setPricingModel] = useState<AppPricingModel>(AppPricingModel.FREE);
  const [price, setPrice] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const togglePermission = (permission: AppPermission) => {
    if (selectedPermissions.includes(permission)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permission));
    } else {
      setSelectedPermissions([...selectedPermissions, permission]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Create slug from name
      const name = formData.get('name') as string;
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const appData = {
        name,
        slug,
        tagline: formData.get('tagline'),
        shortDescription: formData.get('shortDescription'),
        description: formData.get('description'),
        category: selectedCategory,
        tags,
        pricing: {
          model: pricingModel,
          price: pricingModel === AppPricingModel.FREE ? 0 : price,
          currency: 'USD',
        },
        icon: formData.get('icon') || 'https://via.placeholder.com/128',
        screenshots: [
          formData.get('screenshot1'),
          formData.get('screenshot2'),
          formData.get('screenshot3'),
        ].filter(Boolean),
        video: formData.get('video') || undefined,
        permissions: selectedPermissions,
        minimumLoomOSVersion: '1.0.0',
        installationType: AppInstallationType.WEB_APP,
        features: (formData.get('features') as string)
          .split('\n')
          .filter((f: string) => f.trim()),
      };

      const response = await fetch('/api/developer/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create app');
      }

      const { app } = await response.json();
      router.push(`/dashboard/developer/apps/${app.id}`);
    } catch (error: any) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <Link
          href="/dashboard/developer"
          className="text-[var(--semantic-primary)] hover:underline mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold">Create New App</h1>
        <p className="text-[var(--semantic-text-secondary)] mt-2">
          Fill in the details to create your app listing
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Basic Information</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                App Name *
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-2 border border-[var(--semantic-border-medium)] rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="My Awesome App"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tagline *
              </label>
              <input
                type="text"
                name="tagline"
                required
                maxLength={60}
                className="w-full px-4 py-2 border border-[var(--semantic-border-medium)] rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Brief description (60 characters)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Short Description *
              </label>
              <textarea
                name="shortDescription"
                required
                maxLength={200}
                rows={3}
                className="w-full px-4 py-2 border border-[var(--semantic-border-medium)] rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Short description (200 characters)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Full Description *
              </label>
              <textarea
                name="description"
                required
                rows={8}
                className="w-full px-4 py-2 border border-[var(--semantic-border-medium)] rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Detailed description of your app, its features, and benefits"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Category *
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as AppCategory)}
                className="w-full px-4 py-2 border border-[var(--semantic-border-medium)] rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-4 py-2 border border-[var(--semantic-border-medium)] rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Add tags (press Enter)"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-[var(--semantic-bg-muted)] rounded-lg hover:bg-[var(--semantic-bg-muted)]"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[var(--semantic-primary-subtle)] text-[var(--semantic-primary-dark)] px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-orange-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Key Features (one per line)
              </label>
              <textarea
                name="features"
                rows={5}
                className="w-full px-4 py-2 border border-[var(--semantic-border-medium)] rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              />
            </div>
          </div>
        </section>

        {/* Assets */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Assets</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Icon URL *
              </label>
              <input
                type="url"
                name="icon"
                required
                className="w-full px-4 py-2 border border-[var(--semantic-border-medium)] rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="https://example.com/icon.png"
              />
              <p className="text-sm text-[var(--semantic-text-secondary)] mt-1">
                Square image, minimum 512x512px
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Screenshots (up to 3)
              </label>
              <input
                type="url"
                name="screenshot1"
                className="w-full px-4 py-2 border border-[var(--semantic-border-medium)] rounded-lg focus:ring-2 focus:ring-orange-500 mb-2"
                placeholder="Screenshot 1 URL"
              />
              <input
                type="url"
                name="screenshot2"
                className="w-full px-4 py-2 border border-[var(--semantic-border-medium)] rounded-lg focus:ring-2 focus:ring-orange-500 mb-2"
                placeholder="Screenshot 2 URL"
              />
              <input
                type="url"
                name="screenshot3"
                className="w-full px-4 py-2 border border-[var(--semantic-border-medium)] rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Screenshot 3 URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Video URL (Optional)
              </label>
              <input
                type="url"
                name="video"
                className="w-full px-4 py-2 border border-[var(--semantic-border-medium)] rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Pricing</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Pricing Model *
              </label>
              <select
                value={pricingModel}
                onChange={(e) => setPricingModel(e.target.value as AppPricingModel)}
                className="w-full px-4 py-2 border border-[var(--semantic-border-medium)] rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value={AppPricingModel.FREE}>Free</option>
                <option value={AppPricingModel.PAID}>Paid (One-time)</option>
                <option value={AppPricingModel.SUBSCRIPTION}>Subscription</option>
                <option value={AppPricingModel.FREEMIUM}>Freemium</option>
              </select>
            </div>

            {pricingModel !== AppPricingModel.FREE && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Price (USD) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-[var(--semantic-border-medium)] rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="9.99"
                />
              </div>
            )}
          </div>
        </section>

        {/* Permissions */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Permissions</h2>
          <p className="text-sm text-[var(--semantic-text-secondary)] mb-4">
            Select the permissions your app requires
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PERMISSIONS.map((perm) => (
              <label
                key={perm.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(perm.value)}
                  onChange={() => togglePermission(perm.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm">{perm.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[var(--semantic-primary)] text-white py-3 rounded-lg hover:bg-[var(--semantic-primary-dark)] disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create App'}
          </button>
          <Link
            href="/dashboard/developer"
            className="px-6 py-3 border border-[var(--semantic-border-medium)] rounded-lg hover:bg-[var(--semantic-bg-subtle)]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
