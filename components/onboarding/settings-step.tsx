
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Settings, ArrowRight, Loader2, DollarSign, HelpCircle, Sparkles, CreditCard, Building2 } from 'lucide-react';

interface SettingsStepProps {
  data: any;
  onNext: (data: any) => void;
  saving: boolean;
}

export default function SettingsStep({
  data,
  onNext,
  saving,
}: SettingsStepProps) {
  const [formData, setFormData] = useState({
    defaultMonthlyDues: data?.defaultMonthlyDues || '',
    dueDay: data?.dueDay || '1',
    lateFeeAmount: data?.lateFeeAmount || '',
    lateFeeGracePeriod: data?.lateFeeGracePeriod || '5',
    acceptCreditCard: data?.acceptCreditCard ?? true,
    acceptACH: data?.acceptACH ?? true,
    acceptCheck: data?.acceptCheck ?? true,
  });

  const handleContinue = () => {
    onNext({ settings: formData });
  };

  return (
    <TooltipProvider>
      <Card className="p-6 md:p-8 bg-gradient-to-br from-white via-orange-50/30 to-amber-50/20 border-0 shadow-xl backdrop-blur-sm">
        {/* Enhanced Header */}
        <div className="mb-8 relative">
          <div className="absolute -top-2 -left-2 w-24 h-24 bg-[var(--semantic-primary)]/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-2 -right-2 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/30 mb-4 group hover:scale-110 transition-transform duration-300">
              <Settings className="h-8 w-8 text-white" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-orange-900 to-amber-900 bg-clip-text text-transparent">
                  Configure Settings
                </h2>
                <span className="text-sm px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
                  Optional
                </span>
              </div>
              <p className="text-[var(--semantic-text-secondary)] text-lg">
                Set up your association's financial policies and payment preferences.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Financial Settings */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-[var(--semantic-border-light)] p-6 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[var(--semantic-text-primary)]">Financial Settings</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="monthlyDues" className="flex items-center gap-2 text-sm font-semibold text-[var(--semantic-text-primary)] mb-2">
                  Default Monthly Dues
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <HelpCircle className="h-4 w-4 text-[var(--semantic-text-tertiary)] hover:text-[var(--semantic-text-secondary)]" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Standard monthly maintenance fee. You can customize this per unit later.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--semantic-text-tertiary)]" />
                  <Input
                    id="monthlyDues"
                    type="number"
                    step="0.01"
                    value={formData.defaultMonthlyDues}
                    onChange={(e) =>
                      setFormData({ ...formData, defaultMonthlyDues: e.target.value })
                    }
                    placeholder="350.00"
                    className="pl-10 h-11 border-[var(--semantic-border-medium)] focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <p className="text-xs text-[var(--semantic-text-tertiary)] mt-2">
                  Can be customized per unit later
                </p>
              </div>

              <div>
                <Label htmlFor="dueDay" className="text-sm font-semibold text-[var(--semantic-text-primary)] mb-2 block">
                  Payment Due Day
                </Label>
                <Input
                  id="dueDay"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.dueDay}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDay: e.target.value })
                  }
                  placeholder="1"
                  className="h-11 border-[var(--semantic-border-medium)] focus:border-orange-500 focus:ring-orange-500"
                />
                <p className="text-xs text-[var(--semantic-text-tertiary)] mt-2">
                  Day of month (1-31)
                </p>
              </div>

              <div>
                <Label htmlFor="lateFee" className="text-sm font-semibold text-[var(--semantic-text-primary)] mb-2 block">
                  Late Fee Amount
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--semantic-text-tertiary)]" />
                  <Input
                    id="lateFee"
                    type="number"
                    step="0.01"
                    value={formData.lateFeeAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, lateFeeAmount: e.target.value })
                    }
                    placeholder="50.00"
                    className="pl-10 h-11 border-[var(--semantic-border-medium)] focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="gracePeriod" className="flex items-center gap-2 text-sm font-semibold text-[var(--semantic-text-primary)] mb-2">
                  Late Fee Grace Period
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <HelpCircle className="h-4 w-4 text-[var(--semantic-text-tertiary)] hover:text-[var(--semantic-text-secondary)]" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Number of days after the due date before late fees are assessed</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id="gracePeriod"
                  type="number"
                  min="0"
                  value={formData.lateFeeGracePeriod}
                  onChange={(e) =>
                    setFormData({ ...formData, lateFeeGracePeriod: e.target.value })
                  }
                  placeholder="5"
                  className="h-11 border-[var(--semantic-border-medium)] focus:border-orange-500 focus:ring-orange-500"
                />
                <p className="text-xs text-[var(--semantic-text-tertiary)] mt-2">
                  Days after due date
                </p>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-[var(--semantic-border-light)] p-6 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[var(--semantic-text-primary)]">
                Accepted Payment Methods
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl border-2 border-[var(--semantic-border-light)] hover:border-[var(--semantic-primary-light)] hover:bg-[var(--semantic-primary-subtle)]/50 transition-all duration-300 cursor-pointer">
                <Checkbox
                  id="creditCard"
                  checked={formData.acceptCreditCard}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, acceptCreditCard: !!checked })
                  }
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <Label htmlFor="creditCard" className="font-semibold text-[var(--semantic-text-primary)] cursor-pointer text-base">
                    Credit/Debit Cards
                  </Label>
                  <p className="text-sm text-[var(--semantic-text-secondary)] mt-1">
                    Visa, Mastercard, American Express, Discover
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border-2 border-[var(--semantic-border-light)] hover:border-[var(--semantic-success-border)] hover:bg-[var(--semantic-success-bg)]/50 transition-all duration-300 cursor-pointer">
                <Checkbox
                  id="ach"
                  checked={formData.acceptACH}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, acceptACH: !!checked })
                  }
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <Label htmlFor="ach" className="font-semibold text-[var(--semantic-text-primary)] cursor-pointer text-base">
                    ACH/Bank Transfer
                  </Label>
                  <p className="text-sm text-[var(--semantic-text-secondary)] mt-1">
                    Direct bank account transfers
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border-2 border-[var(--semantic-border-light)] hover:border-[var(--semantic-accent-light)] hover:bg-[var(--semantic-accent-subtle)]/50 transition-all duration-300 cursor-pointer">
                <Checkbox
                  id="check"
                  checked={formData.acceptCheck}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, acceptCheck: !!checked })
                  }
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <Label htmlFor="check" className="font-semibold text-[var(--semantic-text-primary)] cursor-pointer text-base">
                    Check/Money Order
                  </Label>
                  <p className="text-sm text-[var(--semantic-text-secondary)] mt-1">
                    Traditional paper checks
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border-2 border-[var(--semantic-primary-light)] rounded-xl p-5 backdrop-blur-sm">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-[var(--semantic-primary)] flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[var(--semantic-primary-dark)] mb-1">Customize Anytime</p>
                <p className="text-sm text-[var(--semantic-primary-dark)]">
                  All these settings can be changed later from System Settings. You can also set custom dues amounts for individual units.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Action Button */}
        <div className="flex justify-end pt-6 border-t-2 border-[var(--semantic-border-light)] mt-8">
          <Button 
            size="lg" 
            onClick={handleContinue} 
            disabled={saving}
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 px-8 h-12 text-base font-semibold"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </TooltipProvider>
  );
}
