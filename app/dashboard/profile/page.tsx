'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Mail, 
  Phone, 
  Home,
  Lock,
  Save,
  Loader2,
  Camera,
  CheckCircle,
  AlertCircle,
  Shield,
  RefreshCw
} from 'lucide-react';
import { ErrorBoundary } from '@/components/common';
import { CardSkeleton } from '@/components/common/skeleton-screens';
import { toastSuccess, toastError, toastValidationError } from '@/lib/toast-helpers';
import {
  LoomOSAppHeader,
  LoomOSSectionHeader,
  LoomOSLoadingState
} from '@/components/webos';
import { APP_COLORS } from '@/lib/app-design-system';
import { useProfile, useProfileMutations } from '@/hooks/use-api';

interface UserProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  unitNumber: string | null;
  phone: string | null;
  image: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const update = sessionData?.update;
  
  // Use API hooks
  const { data: profileData, error: profileError, isLoading, refresh } = useProfile();
  const { updateProfile, uploadAvatar } = useProfileMutations();
  
  const profile = profileData?.user;
  
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Initialize form when profile loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password fields if changing password
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        setMessage({ type: 'error', text: 'Current password is required to change password' });
        toastValidationError('Current password is required to change password');
        return;
      }
      if (newPassword !== confirmPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match' });
        toastValidationError('New passwords do not match');
        return;
      }
      if (newPassword.length < 6) {
        setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
        toastValidationError('New password must be at least 6 characters');
        return;
      }
    }

    setSaving(true);
    setMessage(null);

    try {
      const result = await updateProfile({
        firstName,
        lastName,
        email,
        phone,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined
      });

      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Profile updated successfully' });
        toastSuccess(result.message || 'Profile updated successfully');
        
        // Clear password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        // Update session
        await update();
        
        // Refresh profile data
        refresh();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toastValidationError('Only image files are allowed');
      return;
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      toastValidationError('File size must be less than 5MB');
      return;
    }

    setUploadingAvatar(true);

    try {
      const result = await uploadAvatar(file);

      if (result.success) {
        toastSuccess(result.message || 'Avatar updated successfully');
        await update();
        refresh(); // Refresh profile to get new avatar
      } else {
        toastError(result.error || 'Failed to upload avatar');
      }
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toastError(error.message || 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (profile?.name) {
      const parts = profile.name.split(' ');
      return parts.length > 1 && parts[0] && parts[1]
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : profile.name.slice(0, 2).toUpperCase();
    }
    return profile?.email?.slice(0, 2).toUpperCase() || 'U';
  };

  const handleReset = () => {
    setFirstName(profile?.firstName || '');
    setLastName(profile?.lastName || '');
    setEmail(profile?.email || '');
    setPhone(profile?.phone || '');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage(null);
  };

  // Loading state
  if (isLoading) {
    return <LoomOSLoadingState message="Loading profile..." />;
  }

  // Error state
  if (profileError) {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{profileError || 'Failed to load profile'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // No profile data
  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load profile</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div 
        className="flex-1 overflow-y-auto"
        style={{
          background: 'var(--webos-bg-gradient)',
          fontFamily: 'Helvetica Neue, Arial, sans-serif'
        }}
      >
          <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Profile Overview Section */}
          <div 
            className="rounded-3xl overflow-hidden"
            style={{
              background: 'var(--webos-bg-glass)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--webos-border-glass)',
              boxShadow: 'var(--webos-shadow-xl)'
            }}
          >
            <LoomOSSectionHeader title="Profile Overview" />
            
            <div className="p-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Avatar 
                    className="h-24 w-24"
                    style={{ border: '2px solid var(--webos-border-primary)' }}
                  >
                    <AvatarImage src={profile.image || undefined} />
                    <AvatarFallback 
                      className="text-2xl font-light"
                      style={{
                        background: 'var(--webos-bg-secondary)',
                        color: 'var(--webos-text-secondary)'
                      }}
                    >
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 p-2 rounded-full cursor-pointer transition-opacity hover:opacity-90"
                    style={{
                      background: 'var(--webos-ui-dark)',
                      color: 'var(--webos-text-white)',
                      boxShadow: 'var(--webos-shadow-lg)'
                    }}
                  >
                    {uploadingAvatar ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploadingAvatar}
                  />
                </div>
                
                <div className="flex-1">
                  <h3 
                    className="text-xl font-light tracking-tight"
                    style={{ color: 'var(--webos-text-primary)' }}
                  >
                    {profile.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      className="capitalize font-light"
                      style={{
                        background: 'var(--webos-ui-dark)',
                        color: 'var(--webos-text-white)'
                      }}
                    >
                      {profile.role.toLowerCase().replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    <div 
                      className="flex items-center gap-2 text-sm font-light"
                      style={{ color: 'var(--webos-text-secondary)' }}
                    >
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{profile.email}</span>
                    </div>
                    {profile.phone && (
                      <div 
                        className="flex items-center gap-2 text-sm font-light"
                        style={{ color: 'var(--webos-text-secondary)' }}
                      >
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                    {profile.unitNumber && (
                      <div 
                        className="flex items-center gap-2 text-sm font-light"
                        style={{ color: 'var(--webos-text-secondary)' }}
                      >
                        <Home className="h-4 w-4 flex-shrink-0" />
                        <span>Unit {profile.unitNumber}</span>
                      </div>
                    )}
                    <div 
                      className="flex items-center gap-2 text-sm font-light"
                      style={{ color: 'var(--webos-text-secondary)' }}
                    >
                      <Shield className="h-4 w-4 flex-shrink-0" />
                      <span>
                        Member since {new Date(profile.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div 
            className="rounded-3xl overflow-hidden"
            style={{
              background: 'var(--webos-bg-glass)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--webos-border-glass)',
              boxShadow: 'var(--webos-shadow-xl)'
            }}
          >
            <LoomOSSectionHeader title="Edit Profile" />
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {message && (
                <Alert 
                  variant={message.type === 'success' ? 'default' : 'destructive'}
                  style={{
                    background: message.type === 'success' 
                      ? 'var(--webos-bg-secondary)' 
                      : 'rgba(239, 68, 68, 0.6)',
                    border: `1px solid ${message.type === 'success' 
                      ? 'var(--webos-border-primary)' 
                      : 'rgba(239, 68, 68, 0.3)'}`,
                    borderRadius: '12px'
                  }}
                >
                  {message.type === 'success' ? (
                    <CheckCircle className="h-4 w-4" style={{ color: 'var(--webos-app-green)' }} />
                  ) : (
                    <AlertCircle className="h-4 w-4" style={{ color: '#ef4444' }} />
                  )}
                  <AlertDescription 
                    className="font-light"
                    style={{ color: message.type === 'success' ? 'var(--webos-text-primary)' : '#dc2626' }}
                  >
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                <h4 
                  className="text-xs font-light tracking-wider uppercase"
                  style={{ color: 'var(--webos-text-tertiary)' }}
                >
                  Personal Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label 
                      htmlFor="firstName" 
                      className="text-sm font-light"
                      style={{ color: 'var(--webos-text-secondary)' }}
                    >
                      First Name <span style={{ color: '#ef4444' }}>*</span>
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      placeholder="John"
                      className="rounded-xl font-light"
                      style={{
                        border: '1px solid var(--webos-border-secondary)',
                        background: 'var(--webos-bg-white)',
                        color: 'var(--webos-text-primary)'
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label 
                      htmlFor="lastName" 
                      className="text-sm font-light"
                      style={{ color: 'var(--webos-text-secondary)' }}
                    >
                      Last Name <span style={{ color: '#ef4444' }}>*</span>
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      placeholder="Doe"
                      className="rounded-xl font-light"
                      style={{
                        border: '1px solid var(--webos-border-secondary)',
                        background: 'var(--webos-bg-white)',
                        color: 'var(--webos-text-primary)'
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label 
                    htmlFor="email" 
                    className="text-sm font-light"
                    style={{ color: 'var(--webos-text-secondary)' }}
                  >
                    Email <span style={{ color: '#ef4444' }}>*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="john@example.com"
                    className="rounded-xl font-light"
                    style={{
                      border: '1px solid var(--webos-border-secondary)',
                      background: 'var(--webos-bg-white)',
                      color: 'var(--webos-text-primary)'
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label 
                    htmlFor="phone" 
                    className="text-sm font-light"
                    style={{ color: 'var(--webos-text-secondary)' }}
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="rounded-xl font-light"
                    style={{
                      border: '1px solid var(--webos-border-secondary)',
                      background: 'var(--webos-bg-white)',
                      color: 'var(--webos-text-primary)'
                    }}
                  />
                </div>

                {profile.unitNumber && (
                  <div className="space-y-2">
                    <Label 
                      className="text-sm font-light"
                      style={{ color: 'var(--webos-text-secondary)' }}
                    >
                      Unit Number
                    </Label>
                    <Input
                      value={profile.unitNumber}
                      disabled
                      className="rounded-xl font-light"
                      style={{
                        background: 'var(--webos-bg-tertiary)',
                        border: '1px solid var(--webos-border-primary)',
                        color: 'var(--webos-text-secondary)'
                      }}
                    />
                    <p 
                      className="text-xs font-light"
                      style={{ color: 'var(--webos-text-muted)' }}
                    >
                      Contact an administrator to change your unit number
                    </p>
                  </div>
                )}
              </div>

              {/* Security Settings */}
              <div 
                className="pt-6 space-y-4"
                style={{ borderTop: '1px solid var(--webos-border-primary)' }}
              >
                <div className="flex items-center gap-2">
                  <Lock 
                    className="h-5 w-5" 
                    style={{ color: 'var(--webos-text-tertiary)' }} 
                  />
                  <h4 
                    className="text-xs font-light tracking-wider uppercase"
                    style={{ color: 'var(--webos-text-tertiary)' }}
                  >
                    Change Password
                  </h4>
                </div>
                <p 
                  className="text-sm font-light"
                  style={{ color: 'var(--webos-text-secondary)' }}
                >
                  Leave blank if you don't want to change your password
                </p>

                <div className="space-y-2">
                  <Label 
                    htmlFor="currentPassword" 
                    className="text-sm font-light"
                    style={{ color: 'var(--webos-text-secondary)' }}
                  >
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="rounded-xl font-light"
                    style={{
                      border: '1px solid var(--webos-border-secondary)',
                      background: 'var(--webos-bg-white)',
                      color: 'var(--webos-text-primary)'
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label 
                      htmlFor="newPassword" 
                      className="text-sm font-light"
                      style={{ color: 'var(--webos-text-secondary)' }}
                    >
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      minLength={6}
                      className="rounded-xl font-light"
                      style={{
                        border: '1px solid var(--webos-border-secondary)',
                        background: 'var(--webos-bg-white)',
                        color: 'var(--webos-text-primary)'
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label 
                      htmlFor="confirmPassword" 
                      className="text-sm font-light"
                      style={{ color: 'var(--webos-text-secondary)' }}
                    >
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      minLength={6}
                      className="rounded-xl font-light"
                      style={{
                        border: '1px solid var(--webos-border-secondary)',
                        background: 'var(--webos-bg-white)',
                        color: 'var(--webos-text-primary)'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div 
                className="flex justify-end gap-3 pt-4"
                style={{ borderTop: '1px solid var(--webos-border-primary)' }}
              >
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-xl py-3 px-6 text-sm font-light tracking-wide uppercase transition-all hover:opacity-90"
                  style={{
                    background: 'var(--glass-white-60)',
                    border: '1px solid var(--webos-border-secondary)',
                    color: 'var(--webos-text-primary)',
                    boxShadow: 'var(--webos-shadow-sm)'
                  }}
                >
                  <RefreshCw className="h-4 w-4 inline mr-2" />
                  Reset
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="rounded-xl py-3 px-6 text-sm font-light tracking-wide uppercase transition-all hover:opacity-90 disabled:opacity-50"
                  style={{
                    background: 'var(--webos-ui-dark)',
                    color: 'var(--webos-text-white)',
                    boxShadow: 'var(--webos-shadow-md)'
                  }}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 inline mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 inline mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
