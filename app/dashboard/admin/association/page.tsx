
'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  MapPin, 
  Phone, 
  DollarSign, 
  Save,
  Info,
  Home,
  FileText,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  WebOSPaneContainer,
  WebOSNavListItem,
  WebOSGroupBox,
} from '@/components/webos';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';
import { APP_COLORS } from '@/lib/app-design-system';

interface AssociationSettings {
  // Basic Information
  associationName?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  yearEstablished?: number;
  propertyType?: string;
  totalUnits?: number;
  
  // Contact Information
  officePhone?: string;
  officeEmail?: string;
  emergencyPhone?: string;
  managementCompany?: string;
  websiteUrl?: string;
  
  // Financial Settings
  defaultMonthlyDues?: number;
  dueDay?: number;
  lateFeeAmount?: number;
  lateFeeGracePeriod?: number;
  
  // Unit Configuration
  unitPrefix?: string;
  floors?: number;
  parkingSpaces?: number;
  storageUnits?: number;
  
  // Policies & Rules
  petPolicy?: string;
  parkingPolicy?: string;
  rentalPolicy?: string;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

type CategoryType = 'basic' | 'contact' | 'financial' | 'policies';

export default function AssociationConfigPage() {
  const session = useSession();
  const status = session?.status || 'loading';
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('basic');
  const [settings, setSettings] = useState<AssociationSettings>({
    country: 'USA',
    unitPrefix: 'Unit',
    dueDay: 1,
    lateFeeGracePeriod: 5,
  });

  const userRole = (session?.data?.user as any)?.role;

  useEffect(() => {
    if (status === 'authenticated' && userRole !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, userRole, router]);

  useEffect(() => {
    if (userRole === 'ADMIN') {
      fetchSettings();
    }
  }, [userRole]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/association-settings');
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSettings({
            ...data.settings,
            defaultMonthlyDues: data.settings.defaultMonthlyDues ? Number(data.settings.defaultMonthlyDues) : undefined,
            lateFeeAmount: data.settings.lateFeeAmount ? Number(data.settings.lateFeeAmount) : undefined,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to load association settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/association-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast.success('Association settings saved successfully');
        fetchSettings();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof AssociationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (status === 'loading' || loading) {
    return (
      <DesktopAppWrapper
        title="Association"
        icon={<Building2 className="w-5 h-5" />}
        gradient={APP_COLORS.admin.light}
      >
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </DesktopAppWrapper>
    );
  }

  if (userRole !== 'ADMIN') {
    return null;
  }

  const getDaySuffix = (day: number): string => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
    <DesktopAppWrapper
      title="Association"
      icon={<Building2 className="w-5 h-5" />}
      gradient={APP_COLORS.admin.light}
    >
      {/* Fixed Header */}
      <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Association Configuration
          </h1>
          <p className="text-sm text-gray-500">
            Configure your condominium or homeowners association settings
          </p>
        </div>
        <Button onClick={handleSaveSettings} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* 2-Pane Layout */}
      <WebOSPaneContainer>
        {/* Navigation Pane */}
        <div className="w-60 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              SETTINGS
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              <WebOSNavListItem
                label="Basic Info"
                selected={selectedCategory === 'basic'}
                onClick={() => setSelectedCategory('basic')}
                icon={<Building2 className="w-4 h-4" />}
              />
              <WebOSNavListItem
                label="Contact"
                selected={selectedCategory === 'contact'}
                onClick={() => setSelectedCategory('contact')}
                icon={<Phone className="w-4 h-4" />}
              />
              <WebOSNavListItem
                label="Financial"
                selected={selectedCategory === 'financial'}
                onClick={() => setSelectedCategory('financial')}
                icon={<DollarSign className="w-4 h-4" />}
              />
              <WebOSNavListItem
                label="Policies"
                selected={selectedCategory === 'policies'}
                onClick={() => setSelectedCategory('policies')}
                icon={<FileText className="w-4 h-4" />}
              />
            </div>
          </div>
        </div>

        {/* Detail Pane - Settings Form */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Basic Info */}
            {selectedCategory === 'basic' && (
              <>
                <WebOSGroupBox title="Association Details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="associationName">Association Name</Label>
                      <Input
                        id="associationName"
                        value={settings.associationName || ''}
                        onChange={(e) => updateField('associationName', e.target.value)}
                        placeholder="Montrecott Condominium Association"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="propertyType">Property Type</Label>
                      <Select 
                        value={settings.propertyType || 'condo'} 
                        onValueChange={(value) => updateField('propertyType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="condo">Condominium</SelectItem>
                          <SelectItem value="townhouse">Townhouse</SelectItem>
                          <SelectItem value="coop">Co-op</SelectItem>
                          <SelectItem value="hoa">HOA</SelectItem>
                          <SelectItem value="mixed">Mixed Use</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearEstablished">Year Established</Label>
                      <Input
                        id="yearEstablished"
                        type="number"
                        value={settings.yearEstablished || ''}
                        onChange={(e) => updateField('yearEstablished', parseInt(e.target.value) || undefined)}
                        placeholder="2010"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalUnits">Total Units</Label>
                      <Input
                        id="totalUnits"
                        type="number"
                        value={settings.totalUnits || ''}
                        onChange={(e) => updateField('totalUnits', parseInt(e.target.value) || undefined)}
                        placeholder="150"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="floors">Number of Floors</Label>
                      <Input
                        id="floors"
                        type="number"
                        value={settings.floors || ''}
                        onChange={(e) => updateField('floors', parseInt(e.target.value) || undefined)}
                        placeholder="10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parkingSpaces">Parking Spaces</Label>
                      <Input
                        id="parkingSpaces"
                        type="number"
                        value={settings.parkingSpaces || ''}
                        onChange={(e) => updateField('parkingSpaces', parseInt(e.target.value) || undefined)}
                        placeholder="75"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="storageUnits">Storage Units</Label>
                      <Input
                        id="storageUnits"
                        type="number"
                        value={settings.storageUnits || ''}
                        onChange={(e) => updateField('storageUnits', parseInt(e.target.value) || undefined)}
                        placeholder="50"
                      />
                    </div>
                  </div>
                </WebOSGroupBox>

                <WebOSGroupBox title="Location">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="streetAddress">Street Address</Label>
                      <Input
                        id="streetAddress"
                        value={settings.streetAddress || ''}
                        onChange={(e) => updateField('streetAddress', e.target.value)}
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={settings.city || ''}
                          onChange={(e) => updateField('city', e.target.value)}
                          placeholder="New York"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={settings.state || ''}
                          onChange={(e) => updateField('state', e.target.value)}
                          placeholder="NY"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={settings.zipCode || ''}
                          onChange={(e) => updateField('zipCode', e.target.value)}
                          placeholder="10001"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={settings.country || ''}
                        onChange={(e) => updateField('country', e.target.value)}
                        placeholder="USA"
                      />
                    </div>
                  </div>
                </WebOSGroupBox>
              </>
            )}

            {/* Contact Info */}
            {selectedCategory === 'contact' && (
              <WebOSGroupBox title="Contact Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="officePhone">Office Phone</Label>
                    <Input
                      id="officePhone"
                      type="tel"
                      value={settings.officePhone || ''}
                      onChange={(e) => updateField('officePhone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      value={settings.emergencyPhone || ''}
                      onChange={(e) => updateField('emergencyPhone', e.target.value)}
                      placeholder="(555) 987-6543"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="officeEmail">Office Email</Label>
                    <Input
                      id="officeEmail"
                      type="email"
                      value={settings.officeEmail || ''}
                      onChange={(e) => updateField('officeEmail', e.target.value)}
                      placeholder="office@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website URL</Label>
                    <Input
                      id="websiteUrl"
                      type="url"
                      value={settings.websiteUrl || ''}
                      onChange={(e) => updateField('websiteUrl', e.target.value)}
                      placeholder="https://www.example.com"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="managementCompany">Management Company</Label>
                    <Input
                      id="managementCompany"
                      value={settings.managementCompany || ''}
                      onChange={(e) => updateField('managementCompany', e.target.value)}
                      placeholder="ABC Property Management"
                    />
                  </div>
                </div>
              </WebOSGroupBox>
            )}

            {/* Financial */}
            {selectedCategory === 'financial' && (
              <>
                <WebOSGroupBox title="Financial Configuration">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="defaultMonthlyDues">Default Monthly Dues</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          id="defaultMonthlyDues"
                          type="number"
                          min="0"
                          step="0.01"
                          value={settings.defaultMonthlyDues || ''}
                          onChange={(e) => updateField('defaultMonthlyDues', parseFloat(e.target.value) || undefined)}
                          className="pl-7"
                          placeholder="0.00"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Standard monthly dues for all units
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dueDay">Due Day of Month</Label>
                      <Input
                        id="dueDay"
                        type="number"
                        min="1"
                        max="28"
                        value={settings.dueDay || ''}
                        onChange={(e) => updateField('dueDay', parseInt(e.target.value) || undefined)}
                        placeholder="1"
                      />
                      <p className="text-xs text-gray-500">
                        Day of the month when dues are due (1-28)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lateFeeAmount">Late Fee Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          id="lateFeeAmount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={settings.lateFeeAmount || ''}
                          onChange={(e) => updateField('lateFeeAmount', parseFloat(e.target.value) || undefined)}
                          className="pl-7"
                          placeholder="0.00"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Fee charged after grace period expires
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lateFeeGracePeriod">Grace Period (Days)</Label>
                      <Input
                        id="lateFeeGracePeriod"
                        type="number"
                        min="0"
                        value={settings.lateFeeGracePeriod || ''}
                        onChange={(e) => updateField('lateFeeGracePeriod', parseInt(e.target.value) || undefined)}
                        placeholder="5"
                      />
                      <p className="text-xs text-gray-500">
                        Days before late fee is applied
                      </p>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">Financial Summary</h4>
                        <div className="space-y-1 text-sm text-gray-700">
                          {settings.defaultMonthlyDues && (
                            <p>
                              • Default monthly dues: <strong>${settings.defaultMonthlyDues.toFixed(2)}</strong>
                            </p>
                          )}
                          {settings.dueDay && (
                            <p>
                              • Due on the <strong>{settings.dueDay}{getDaySuffix(settings.dueDay)}</strong> of each month
                            </p>
                          )}
                          {settings.lateFeeGracePeriod !== undefined && (
                            <p>
                              • Grace period: <strong>{settings.lateFeeGracePeriod} days</strong>
                            </p>
                          )}
                          {settings.lateFeeAmount && (
                            <p>
                              • Late fee: <strong>${settings.lateFeeAmount.toFixed(2)}</strong>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </WebOSGroupBox>

                <WebOSGroupBox title="Unit Configuration">
                  <div className="space-y-2">
                    <Label htmlFor="unitPrefix">Unit Prefix</Label>
                    <Input
                      id="unitPrefix"
                      value={settings.unitPrefix || ''}
                      onChange={(e) => updateField('unitPrefix', e.target.value)}
                      placeholder="Unit"
                    />
                    <p className="text-xs text-gray-500">
                      e.g., "Unit 101", "Apt 101", "#101"
                    </p>
                  </div>
                </WebOSGroupBox>
              </>
            )}

            {/* Policies */}
            {selectedCategory === 'policies' && (
              <WebOSGroupBox title="Association Policies">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="petPolicy">Pet Policy</Label>
                    <Textarea
                      id="petPolicy"
                      value={settings.petPolicy || ''}
                      onChange={(e) => updateField('petPolicy', e.target.value)}
                      placeholder="Describe your association's pet policy..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parkingPolicy">Parking Policy</Label>
                    <Textarea
                      id="parkingPolicy"
                      value={settings.parkingPolicy || ''}
                      onChange={(e) => updateField('parkingPolicy', e.target.value)}
                      placeholder="Describe your association's parking policy..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rentalPolicy">Rental/Leasing Policy</Label>
                    <Textarea
                      id="rentalPolicy"
                      value={settings.rentalPolicy || ''}
                      onChange={(e) => updateField('rentalPolicy', e.target.value)}
                      placeholder="Describe your association's rental and leasing policy..."
                      rows={4}
                    />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="quietHoursStart">Quiet Hours Start</Label>
                      <Input
                        id="quietHoursStart"
                        type="time"
                        value={settings.quietHoursStart || ''}
                        onChange={(e) => updateField('quietHoursStart', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quietHoursEnd">Quiet Hours End</Label>
                      <Input
                        id="quietHoursEnd"
                        type="time"
                        value={settings.quietHoursEnd || ''}
                        onChange={(e) => updateField('quietHoursEnd', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </WebOSGroupBox>
            )}
          </div>
        </div>
      </WebOSPaneContainer>
    </DesktopAppWrapper>
  );
}

