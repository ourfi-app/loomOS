'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings, DollarSign, Calendar, AlertCircle, Save, Info, Palette, Database } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { PaletteSelector } from '@/components/palette-selector';
import { getAllPalettes } from '@/lib/color-palettes';
import {
  DesktopAppWrapper,
  LoomOSNavigationPane,
  LoomOSLoadingState,
} from '@/components/webos';
import { APP_COLORS } from '@/lib/app-design-system';
import { LoomOSNavListItem } from '@/components/webos/loomos-nav-list-item';

interface DuesSettings {
  id?: string;
  monthlyAmount: number;
  dueDay: number;
  lateFee: number;
  gracePeriod: number;
}

type SettingCategory = 'appearance' | 'dues' | 'system';

export default function SettingsPage() {
  const session = useSession();
  const status = session?.status || 'loading';
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPalette, setSavingPalette] = useState(false);
  const [selectedPaletteId, setSelectedPaletteId] = useState('default');
  const [selectedCategory, setSelectedCategory] = useState<SettingCategory>('appearance');
  const [settings, setSettings] = useState<DuesSettings>({
    monthlyAmount: 0,
    dueDay: 1,
    lateFee: 0,
    gracePeriod: 5
  });

  const userRole = (session?.data?.user as any)?.role;
  const palettes = getAllPalettes();

  useEffect(() => {
    if (status === 'authenticated' && userRole !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, userRole, router]);

  useEffect(() => {
    if (userRole === 'ADMIN') {
      fetchSettings();
      fetchPalette();
    }
  }, [userRole]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSettings({
            id: data.settings.id,
            monthlyAmount: Number(data.settings.monthlyAmount),
            dueDay: data.settings.dueDay,
            lateFee: Number(data.settings.lateFee),
            gracePeriod: data.settings.gracePeriod
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchPalette = async () => {
    try {
      const response = await fetch('/api/admin/palette');
      if (response.ok) {
        const data = await response.json();
        setSelectedPaletteId(data.paletteId || 'default');
      }
    } catch (error) {
      console.error('Failed to fetch palette:', error);
    }
  };

  const handlePaletteChange = async (paletteId: string) => {
    setSelectedPaletteId(paletteId);
    setSavingPalette(true);
    try {
      const response = await fetch('/api/admin/palette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paletteId })
      });

      if (response.ok) {
        toast.success('Color palette updated successfully');
        // Reload the page to apply new colors
        setTimeout(() => window.location.reload(), 1000);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update palette');
      }
    } catch (error) {
      console.error('Error updating palette:', error);
      toast.error('Failed to update palette');
    } finally {
      setSavingPalette(false);
    }
  };

  const handleSaveSettings = async () => {
    if (settings.monthlyAmount <= 0) {
      toast.error('Monthly amount must be greater than 0');
      return;
    }

    if (settings.dueDay < 1 || settings.dueDay > 28) {
      toast.error('Due day must be between 1 and 28');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast.success('Settings saved successfully');
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

  if (status === 'loading' || loading) {
    return <LoomOSLoadingState message="Loading settings..." />;
  }

  if (userRole !== 'ADMIN') {
    return null;
  }

  return (
    <DesktopAppWrapper
      title="Admin Settings"
      icon={<Settings className="w-5 h-5" />}
      gradient={APP_COLORS.settings?.light || 'from-blue-500 to-indigo-600'}
    >
      {/* Pane 1: Settings Categories */}
      <LoomOSNavigationPane
        title="SETTINGS"
        items={[
          {
            id: 'appearance',
            label: 'Appearance',
            icon: <Palette className="h-4 w-4" />,
            active: selectedCategory === 'appearance',
            onClick: () => setSelectedCategory('appearance'),
          },
          {
            id: 'dues',
            label: 'Dues & Payments',
            icon: <DollarSign className="h-4 w-4" />,
            active: selectedCategory === 'dues',
            onClick: () => setSelectedCategory('dues'),
          },
          {
            id: 'system',
            label: 'System',
            icon: <Database className="h-4 w-4" />,
            active: selectedCategory === 'system',
            onClick: () => setSelectedCategory('system'),
          },
        ]}
      />

      {/* Pane 2: Setting Forms */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-4xl">
          
          {/* Appearance Settings */}
          {selectedCategory === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Color Palette
                </CardTitle>
                <CardDescription>
                  Choose a color scheme for your community portal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {savingPalette ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Applying color palette...</p>
                    </div>
                  </div>
                ) : (
                  <PaletteSelector
                    palettes={palettes}
                    selectedPaletteId={selectedPaletteId}
                    onSelect={handlePaletteChange}
                  />
                )}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-blue-800">
                        The selected color palette will be applied throughout the portal. The page will automatically reload to apply the new colors.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dues & Payment Settings */}
          {selectedCategory === 'dues' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Dues & Payment Settings
                  </CardTitle>
                  <CardDescription>
                    Configure monthly dues, late fees, and payment schedules
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="monthlyAmount">
                        Monthly Dues Amount
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="monthlyAmount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={settings.monthlyAmount}
                          onChange={(e) => setSettings({ ...settings, monthlyAmount: parseFloat(e.target.value) || 0 })}
                          className="pl-7"
                          placeholder="0.00"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Standard monthly dues for all residents
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dueDay">
                        Monthly Due Day
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="dueDay"
                        type="number"
                        min="1"
                        max="28"
                        value={settings.dueDay}
                        onChange={(e) => setSettings({ ...settings, dueDay: parseInt(e.target.value) || 1 })}
                        placeholder="1"
                      />
                      <p className="text-xs text-muted-foreground">
                        Day of the month when dues are due (1-28)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lateFee">Late Fee Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="lateFee"
                          type="number"
                          min="0"
                          step="0.01"
                          value={settings.lateFee}
                          onChange={(e) => setSettings({ ...settings, lateFee: parseFloat(e.target.value) || 0 })}
                          className="pl-7"
                          placeholder="0.00"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Fee charged after grace period expires
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gracePeriod">Grace Period (Days)</Label>
                      <Input
                        id="gracePeriod"
                        type="number"
                        min="0"
                        value={settings.gracePeriod}
                        onChange={(e) => setSettings({ ...settings, gracePeriod: parseInt(e.target.value) || 0 })}
                        placeholder="5"
                      />
                      <p className="text-xs text-muted-foreground">
                        Days before late fee is applied
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Current Configuration Preview */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-900 mb-2">Current Configuration</h4>
                        <div className="space-y-1 text-sm text-blue-800">
                          <p>
                            • Residents will be charged <strong>${settings.monthlyAmount.toFixed(2)}</strong> on the <strong>{settings.dueDay}{getDaySuffix(settings.dueDay)}</strong> of each month
                          </p>
                          <p>
                            • Grace period of <strong>{settings.gracePeriod} days</strong> before late fees apply
                          </p>
                          {settings.lateFee > 0 && (
                            <p>
                              • Late fee of <strong>${settings.lateFee.toFixed(2)}</strong> will be charged after grace period
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveSettings} disabled={saving}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Settings'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Notice */}
              <Card className="border-orange-200 bg-orange-50 mt-6">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-orange-900 mb-1">Important Notice</h4>
                      <p className="text-sm text-orange-800">
                        Changes to dues settings will affect all future payment cycles. Existing payment records will not be modified. 
                        Please ensure all residents are notified of any changes to dues or fee structures.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* System Information */}
          {selectedCategory === 'system' && (
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>Application version and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Application Version</span>
                    <Badge variant="secondary">v1.0.0</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Database Status</span>
                    <Badge variant="default" className="bg-green-600">Connected</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Settings Update</span>
                    <span className="text-sm font-medium">
                      {settings.id ? 'Recently configured' : 'Not configured'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DesktopAppWrapper>
  );
}

function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return 'th';
  }
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}
