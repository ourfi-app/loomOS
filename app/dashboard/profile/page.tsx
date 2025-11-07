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
  WebOSAppHeader,
  WebOSSectionHeader,
  WebOSActionButton,
  WebOSLoadingState
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
    return <WebOSLoadingState message="Loading profile..." />;
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
      <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Profile Overview Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <WebOSSectionHeader title="Profile Overview" />
            
            <div className="p-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-gray-200">
                    <AvatarImage src={profile.image || undefined} />
                    <AvatarFallback className="bg-gray-100 text-gray-700 text-2xl font-semibold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 p-2 bg-orange-500 text-white rounded-full cursor-pointer hover:bg-orange-600 transition-colors shadow-lg"
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
                  <h3 className="text-xl font-semibold text-gray-900">{profile.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="capitalize bg-orange-500 text-white">
                      {profile.role.toLowerCase().replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{profile.email}</span>
                    </div>
                    {profile.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                    {profile.unitNumber && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Home className="h-4 w-4 flex-shrink-0" />
                        <span>Unit {profile.unitNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
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
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <WebOSSectionHeader title="Edit Profile" />
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {message && (
                <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
                  {message.type === 'success' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Personal Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      placeholder="John"
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      placeholder="Doe"
                      className="border-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="john@example.com"
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="border-gray-300"
                  />
                </div>

                {profile.unitNumber && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Unit Number</Label>
                    <Input
                      value={profile.unitNumber}
                      disabled
                      className="bg-gray-50 border-gray-300"
                    />
                    <p className="text-xs text-gray-500">
                      Contact an administrator to change your unit number
                    </p>
                  </div>
                )}
              </div>

              {/* Security Settings */}
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-gray-600" />
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Change Password</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Leave blank if you don't want to change your password
                </p>

                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-sm font-medium">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="border-gray-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      minLength={6}
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      minLength={6}
                      className="border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="border-gray-300"
                >
                  Reset
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
