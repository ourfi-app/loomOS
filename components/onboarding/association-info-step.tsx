
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Building2, ArrowRight, Loader2, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';

interface AssociationInfoStepProps {
  data: any;
  onNext: (data: any) => void;
  saving: boolean;
}

export default function AssociationInfoStep({
  data,
  onNext,
  saving,
}: AssociationInfoStepProps) {
  const [formData, setFormData] = useState({
    associationName: data?.associationInfo?.associationName || '',
    streetAddress: data?.associationInfo?.streetAddress || '',
    city: data?.associationInfo?.city || '',
    state: data?.associationInfo?.state || '',
    zipCode: data?.associationInfo?.zipCode || '',
    country: data?.associationInfo?.country || 'USA',
    yearEstablished: data?.associationInfo?.yearEstablished || '',
    propertyType: data?.associationInfo?.propertyType || '',
    totalUnits: data?.associationInfo?.totalUnits || '',
    officePhone: data?.associationInfo?.officePhone || '',
    officeEmail: data?.associationInfo?.officeEmail || '',
    emergencyPhone: data?.associationInfo?.emergencyPhone || '',
    managementCompany: data?.associationInfo?.managementCompany || '',
    websiteUrl: data?.associationInfo?.websiteUrl || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const propertyTypes = [
    'Condominium',
    'Townhouse',
    'Co-op',
    'HOA',
    'Mixed-Use',
    'Other',
  ];

  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  ];

  const validateField = (field: string, value: string) => {
    const newErrors: Record<string, string> = { ...errors };

    // Required field validations
    if (field === 'associationName' && !value.trim()) {
      newErrors.associationName = 'Association name is required';
    } else if (field === 'associationName') {
      delete newErrors.associationName;
    }

    if (field === 'streetAddress' && !value.trim()) {
      newErrors.streetAddress = 'Street address is required';
    } else if (field === 'streetAddress') {
      delete newErrors.streetAddress;
    }

    if (field === 'city' && !value.trim()) {
      newErrors.city = 'City is required';
    } else if (field === 'city') {
      delete newErrors.city;
    }

    if (field === 'state' && !value) {
      newErrors.state = 'State is required';
    } else if (field === 'state') {
      delete newErrors.state;
    }

    if (field === 'zipCode') {
      if (!value.trim()) {
        newErrors.zipCode = 'ZIP code is required';
      } else if (!/^\d{5}(-\d{4})?$/.test(value)) {
        newErrors.zipCode = 'Please enter a valid ZIP code';
      } else {
        delete newErrors.zipCode;
      }
    }

    if (field === 'officeEmail') {
      if (!value.trim()) {
        newErrors.officeEmail = 'Office email is required';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        newErrors.officeEmail = 'Please enter a valid email';
      } else {
        delete newErrors.officeEmail;
      }
    }

    if (field === 'totalUnits') {
      if (!value || parseInt(value) < 1) {
        newErrors.totalUnits = 'Must be at least 1 unit';
      } else {
        delete newErrors.totalUnits;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.associationName.trim()) {
      newErrors.associationName = 'Association name is required';
    }
    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = 'Street address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state) {
      newErrors.state = 'State is required';
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code';
    }
    if (!formData.totalUnits || parseInt(formData.totalUnits) < 1) {
      newErrors.totalUnits = 'Total units must be at least 1';
    }
    if (!formData.officeEmail.trim()) {
      newErrors.officeEmail = 'Office email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.officeEmail)) {
      newErrors.officeEmail = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    onNext({ associationInfo: formData });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Validate on change if field has been touched
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field as keyof typeof formData] as string);
  };

  const getFieldState = (field: string) => {
    if (!touched[field]) return null;
    if (errors[field]) return 'error';
    if (formData[field as keyof typeof formData]) return 'success';
    return null;
  };

  return (
    <TooltipProvider>
      <Card className="p-6 md:p-8 shadow-2xl border-2 border-blue-100 bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/20">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-4 shadow-lg">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
            Association Information
          </h2>
          <p className="text-gray-600 text-base">
            Tell us the essentials about your community. You can always update this later.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-5 bg-gradient-to-br from-white to-blue-50/30 p-6 rounded-xl border-2 border-blue-100 shadow-md">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            Basic Information
            <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-semibold border border-red-200">Required</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="associationName" className="flex items-center gap-2">
                Association Name <span className="text-red-500">*</span>
                {getFieldState('associationName') === 'success' && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                <Tooltip>
                  <TooltipTrigger type="button">
                    <HelpCircle className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">The official legal name of your condo/HOA association</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                id="associationName"
                value={formData.associationName}
                onChange={(e) => handleChange('associationName', e.target.value)}
                onBlur={() => handleBlur('associationName')}
                placeholder="e.g., Montrecott Condominium Association"
                className={errors.associationName ? 'border-red-500' : touched.associationName && formData.associationName ? 'border-green-500' : ''}
              />
              {errors.associationName && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.associationName}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="streetAddress" className="flex items-center gap-2">
                  Street Address <span className="text-red-500">*</span>
                  {getFieldState('streetAddress') === 'success' && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </Label>
                <Input
                  id="streetAddress"
                  value={formData.streetAddress}
                  onChange={(e) => handleChange('streetAddress', e.target.value)}
                  onBlur={() => handleBlur('streetAddress')}
                  placeholder="e.g., 1907 Montrose Ave"
                  className={errors.streetAddress ? 'border-red-500' : touched.streetAddress && formData.streetAddress ? 'border-green-500' : ''}
                />
                {errors.streetAddress && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.streetAddress}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="city" className="flex items-center gap-2">
                  City <span className="text-red-500">*</span>
                  {getFieldState('city') === 'success' && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  onBlur={() => handleBlur('city')}
                  placeholder="e.g., Chicago"
                  className={errors.city ? 'border-red-500' : touched.city && formData.city ? 'border-green-500' : ''}
                />
                {errors.city && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.city}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="state" className="flex items-center gap-2">
                  State <span className="text-red-500">*</span>
                  {getFieldState('state') === 'success' && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => {
                    handleChange('state', value);
                    setTouched((prev) => ({ ...prev, state: true }));
                  }}
                >
                  <SelectTrigger className={errors.state ? 'border-red-500' : touched.state && formData.state ? 'border-green-500' : ''}>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {usStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.state}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="zipCode" className="flex items-center gap-2">
                  ZIP Code <span className="text-red-500">*</span>
                  {getFieldState('zipCode') === 'success' && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleChange('zipCode', e.target.value)}
                  onBlur={() => handleBlur('zipCode')}
                  placeholder="e.g., 60613"
                  className={errors.zipCode ? 'border-red-500' : touched.zipCode && formData.zipCode && !errors.zipCode ? 'border-green-500' : ''}
                />
                {errors.zipCode && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.zipCode}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="totalUnits" className="flex items-center gap-2">
                  Total Units <span className="text-red-500">*</span>
                  {getFieldState('totalUnits') === 'success' && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <HelpCircle className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Total number of residential units in your community</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id="totalUnits"
                  type="number"
                  value={formData.totalUnits}
                  onChange={(e) => handleChange('totalUnits', e.target.value)}
                  onBlur={() => handleBlur('totalUnits')}
                  placeholder="e.g., 48"
                  min="1"
                  className={errors.totalUnits ? 'border-red-500' : touched.totalUnits && formData.totalUnits ? 'border-green-500' : ''}
                />
                {errors.totalUnits && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.totalUnits}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information - Now only email is required */}
        <div className="space-y-5 bg-gradient-to-br from-white to-green-50/20 p-6 rounded-xl border-2 border-green-100 shadow-md">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            Contact Information
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-semibold border border-green-200">Email Required</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="officeEmail" className="flex items-center gap-2">
                Office Email <span className="text-red-500">*</span>
                {getFieldState('officeEmail') === 'success' && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                <Tooltip>
                  <TooltipTrigger type="button">
                    <HelpCircle className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Main email address for association communications and resident inquiries</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                id="officeEmail"
                type="email"
                value={formData.officeEmail}
                onChange={(e) => handleChange('officeEmail', e.target.value)}
                onBlur={() => handleBlur('officeEmail')}
                placeholder="office@montrecott.com"
                className={errors.officeEmail ? 'border-red-500' : touched.officeEmail && formData.officeEmail && !errors.officeEmail ? 'border-green-500' : ''}
              />
              {errors.officeEmail && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.officeEmail}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="officePhone">Office Phone</Label>
              <Input
                id="officePhone"
                type="tel"
                value={formData.officePhone}
                onChange={(e) => handleChange('officePhone', e.target.value)}
                placeholder="(312) 555-0100"
              />
            </div>

            <div>
              <Label htmlFor="emergencyPhone">Emergency Phone</Label>
              <Input
                id="emergencyPhone"
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => handleChange('emergencyPhone', e.target.value)}
                placeholder="(312) 555-0911"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-8">
          <Button 
            type="submit" 
            size="lg" 
            disabled={saving}
            className="min-w-48 h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
        </form>
      </Card>
    </TooltipProvider>
  );
}
