

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

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

export default function ProfileTab() {
  const { data: session, update } = useSession() || {};
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/profile');
      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
        setFirstName(data.user.firstName || '');
        setLastName(data.user.lastName || '');
        setEmail(data.user.email || '');
        setPhone(data.user.phone || '');
      } else {
        toast.error(data.error || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password fields if changing password
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        setMessage({ type: 'error', text: 'Current password is required to change password' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match' });
        return;
      }
      if (newPassword.length < 6) {
        setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
        return;
      }
    }

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined
        })
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
        setMessage({ type: 'success', text: data.message || 'Profile updated successfully' });
        toast.success('Profile updated successfully');
        
        // Clear password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        // Update session
        await update();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(prev => prev ? { ...prev, image: data.image } : null);
        toast.success('Avatar updated successfully');
        await update();
      } else {
        toast.error(data.error || 'Failed to upload avatar');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load profile</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Profile Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Overview</CardTitle>
          <CardDescription>Your current profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.image || undefined} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
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
              <h3 className="text-xl font-semibold">{profile.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="capitalize">
                  {profile.role.toLowerCase().replace('_', ' ')}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-[var(--semantic-text-secondary)]">
                  <Mail className="h-4 w-4" />
                  <span>{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-2 text-sm text-[var(--semantic-text-secondary)]">
                    <Phone className="h-4 w-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.unitNumber && (
                  <div className="flex items-center gap-2 text-sm text-[var(--semantic-text-secondary)]">
                    <Home className="h-4 w-4" />
                    <span>Unit {profile.unitNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {profile.unitNumber && (
              <div className="space-y-2">
                <Label>Unit Number</Label>
                <Input
                  value={profile.unitNumber}
                  disabled
                  className="bg-[var(--semantic-bg-subtle)]"
                />
                <p className="text-xs text-[var(--semantic-text-tertiary)]">
                  Contact an administrator to change your unit number
                </p>
              </div>
            )}

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-[var(--semantic-text-secondary)]" />
                <h3 className="text-lg font-semibold">Change Password</h3>
              </div>
              <p className="text-sm text-[var(--semantic-text-secondary)]">
                Leave blank if you don't want to change your password
              </p>

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFirstName(profile.firstName || '');
                  setLastName(profile.lastName || '');
                  setEmail(profile.email || '');
                  setPhone(profile.phone || '');
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setMessage(null);
                }}
              >
                Reset
              </Button>
              <Button type="submit" disabled={saving}>
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
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Read-only account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-[var(--semantic-text-secondary)]">Account Role</p>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="h-4 w-4 text-blue-600" />
                <p className="text-sm capitalize">
                  {profile.role.toLowerCase().replace('_', ' ')}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--semantic-text-secondary)]">Member Since</p>
              <p className="text-sm mt-1">
                {new Date(profile.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

