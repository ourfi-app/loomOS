'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Building2,
  FileText,
  Mail,
  HardDrive,
  Shield,
  Users,
  Settings,
  Edit,
  Check,
  X,
  Sparkles,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface ReviewStepProps {
  data: any;
  onNext: () => void;
  saving: boolean;
}

export default function ReviewStep({ data, onNext, saving }: ReviewStepProps) {
  const sections = [
    {
      id: 'association',
      title: 'Association Information',
      icon: Building2,
      items: [
        { label: 'Name', value: data?.associationInfo?.associationName },
        { label: 'Address', value: data?.associationInfo?.streetAddress },
        { label: 'City, State', value: data?.associationInfo?.city && data?.associationInfo?.state ? `${data.associationInfo.city}, ${data.associationInfo.state}` : '' },
        { label: 'Total Units', value: data?.associationInfo?.totalUnits },
      ],
      isComplete: !!data?.associationInfo?.associationName,
      required: true,
    },
    {
      id: 'documents',
      title: 'Documents & Storage',
      icon: FileText,
      items: [
        { label: 'Documents Uploaded', value: data?.documents ? Object.keys(data.documents).length : 0 },
        { label: 'Storage', value: data?.storageType === 'builtin' ? 'Built-in Cloud' : 'Google Drive' },
      ],
      isComplete: data?.documents && Object.keys(data.documents).length > 0,
      required: true,
    },
    {
      id: 'email',
      title: 'Email Configuration',
      icon: Mail,
      items: [
        { label: 'Status', value: data?.emailConfigured ? '✓ Connected' : 'Not configured' },
        { label: 'From Email', value: data?.emailFrom || 'N/A' },
      ],
      isComplete: !!data?.emailConfigured,
      required: false,
    },
    {
      id: 'officers',
      title: 'Board & Officers',
      icon: Shield,
      items: [
        { label: 'Officers Added', value: data?.officers?.length || 0 },
      ],
      isComplete: data?.officers && data.officers.length > 0,
      required: false,
    },
    {
      id: 'residents',
      title: 'Residents',
      icon: Users,
      items: [
        {
          label: 'Import Status',
          value: data?.residentImport
            ? `${data.residentImport.success} imported`
            : 'Not imported',
        },
      ],
      isComplete: !!data?.residentImport,
      required: false,
    },
    {
      id: 'settings',
      title: 'Financial Settings',
      icon: Settings,
      items: [
        {
          label: 'Monthly Dues',
          value: data?.settings?.defaultMonthlyDues
            ? `$${data.settings.defaultMonthlyDues}`
            : 'Not set',
        },
      ],
      isComplete: !!data?.settings,
      required: false,
    },
  ];

  const requiredSections = sections.filter(s => s.required);
  const optionalSections = sections.filter(s => !s.required);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-6 md:p-8 bg-gradient-to-br from-white via-white to-blue-50/30 border-none shadow-xl">
        {/* Header with Gradient Background */}
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 mb-4 shadow-lg shadow-blue-500/30"
          >
            <CheckCircle2 className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-3">
            Review Your Setup
          </h2>
          <p className="text-gray-600 text-lg">
            Quick review of your configuration. You can update anything later from the dashboard.
          </p>
        </div>

        {/* Required Sections */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
            <h3 className="text-sm font-semibold text-gray-900 px-3 py-1.5 bg-blue-100 rounded-full">
              Core Setup
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
          </div>
          <div className="space-y-3">
            {requiredSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative overflow-hidden border-2 rounded-xl p-5 transition-all duration-300 ${
                    section.isComplete
                      ? 'bg-gradient-to-br from-green-50 via-emerald-50/50 to-green-50/30 border-green-200 shadow-sm hover:shadow-md'
                      : 'bg-gradient-to-br from-red-50 via-rose-50/50 to-red-50/30 border-red-200 shadow-sm'
                  }`}
                >
                  {/* Animated Background Gradient */}
                  <div className={`absolute inset-0 opacity-10 ${
                    section.isComplete ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-red-400 to-rose-400'
                  }`} />
                  
                  <div className="relative flex items-start gap-4">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: index * 0.1 + 0.2 }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                        section.isComplete
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                          : 'bg-gradient-to-br from-red-500 to-rose-600 text-white'
                      }`}
                    >
                      {section.isComplete ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <X className="h-5 w-5" />
                      )}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-3 text-lg flex items-center gap-2">
                        <Icon className="h-5 w-5 text-gray-700" />
                        {section.title}
                      </h4>
                      <div className="space-y-2">
                        {section.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between gap-4 p-2 rounded-lg bg-white/50 backdrop-blur-sm"
                          >
                            <span className="text-gray-600 truncate font-medium">{item.label}:</span>
                            <span className="font-semibold text-gray-900 truncate">
                              {item.value || 'Not provided'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Optional Sections */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
            <h3 className="text-sm font-semibold text-gray-900 px-3 py-1.5 bg-purple-100 rounded-full">
              Optional Configuration
              <span className="text-xs text-gray-500 font-normal ml-2">(Can be added later)</span>
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {optionalSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (requiredSections.length + index) * 0.1 }}
                  className={`relative overflow-hidden border-2 rounded-xl p-4 transition-all duration-300 ${
                    section.isComplete
                      ? 'bg-gradient-to-br from-blue-50 via-indigo-50/50 to-blue-50/30 border-blue-200 shadow-sm hover:shadow-md'
                      : 'bg-gradient-to-br from-gray-50 via-slate-50/50 to-gray-50/30 border-gray-200'
                  }`}
                >
                  <div className={`absolute inset-0 opacity-5 ${
                    section.isComplete ? 'bg-gradient-to-r from-blue-400 to-indigo-400' : 'bg-gradient-to-r from-gray-400 to-slate-400'
                  }`} />
                  
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        section.isComplete ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-500'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <h4 className="font-semibold text-sm text-gray-900 flex-1">
                        {section.title}
                      </h4>
                      {section.isComplete && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <Check className="h-4 w-4 text-blue-600" />
                        </motion.div>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      {section.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between gap-2">
                          <span className="text-gray-500">{item.label}:</span>
                          <span className="font-medium text-gray-900">{item.value || 'Not set'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* What's Next Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 mb-8 shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">What happens next?</h3>
            </div>
            <ul className="space-y-3">
              {[
                'Your portal will be fully configured and ready to use',
                'Board members and residents will receive invitation emails',
                'You can access all management features immediately',
                'You can always update settings and information later',
              ].map((text, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 leading-relaxed">{text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Action Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <Button
            size="lg"
            onClick={onNext}
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Complete Setup
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
