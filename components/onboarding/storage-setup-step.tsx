'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  HardDrive, 
  Cloud, 
  Check, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  Shield,
  RefreshCcw,
  Clock,
  Database,
} from 'lucide-react';

interface StorageSetupStepProps {
  data: any;
  onNext: (data: any) => void;
  saving: boolean;
}

export default function StorageSetupStep({
  data,
  onNext,
  saving,
}: StorageSetupStepProps) {
  const [storageType, setStorageType] = useState(data?.storageType || 'builtin');

  const handleContinue = () => {
    onNext({ storageType });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-6 md:p-8 bg-gradient-to-br from-white via-white to-blue-50/30 border-none shadow-xl">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 mb-4 shadow-lg shadow-blue-500/30"
          >
            <HardDrive className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-3">
            Document Storage
          </h2>
          <p className="text-[var(--semantic-text-secondary)] text-lg">
            Choose where your association's documents will be stored securely.
          </p>
        </div>

        {/* Storage Options */}
        <div className="space-y-4 mb-8">
          {/* Built-in Cloud Storage */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setStorageType('builtin')}
            className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
              storageType === 'builtin'
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-blue-50/30 shadow-lg shadow-blue-500/20'
                : 'border-[var(--semantic-border-light)] hover:border-[var(--semantic-border-medium)] bg-white hover:shadow-md'
            }`}
          >
            {/* Animated Background */}
            {storageType === 'builtin' && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10" />
            )}
            
            <div className="relative flex items-start gap-4">
              <motion.div
                animate={storageType === 'builtin' ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                  storageType === 'builtin' 
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' 
                    : 'bg-[var(--semantic-surface-hover)] text-[var(--semantic-text-secondary)]'
                }`}
              >
                <Cloud className="h-6 w-6" />
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-[var(--semantic-text-primary)] text-lg">Built-in Cloud Storage</h3>
                  {storageType === 'builtin' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Check className="h-5 w-5 text-blue-600" />
                    </motion.div>
                  )}
                  <span className="text-xs px-2.5 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold shadow-sm">
                    Recommended
                  </span>
                </div>
                <p className="text-sm text-[var(--semantic-text-secondary)] mb-4 leading-relaxed">
                  Secure, built-in cloud storage with automatic backups and enterprise-grade security.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Database, text: 'Unlimited storage space' },
                    { icon: RefreshCcw, text: 'Automatic daily backups' },
                    { icon: Clock, text: 'Version history & recovery' },
                    { icon: Shield, text: 'No additional setup required' },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/50 backdrop-blur-sm"
                      >
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="text-xs text-[var(--semantic-text-secondary)] font-medium">{item.text}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.button>

          {/* Google Drive */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setStorageType('google-drive')}
            disabled
            className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden opacity-60 cursor-not-allowed ${
              storageType === 'google-drive'
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-blue-50/30'
                : 'border-[var(--semantic-border-light)] bg-[var(--semantic-bg-subtle)]'
            }`}
          >
            <div className="relative flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                storageType === 'google-drive' ? 'bg-blue-600 text-white' : 'bg-[var(--semantic-bg-muted)] text-[var(--semantic-text-tertiary)]'
              }`}>
                <HardDrive className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-[var(--semantic-text-primary)] text-lg">Google Drive Integration</h3>
                  {storageType === 'google-drive' && (
                    <Check className="h-5 w-5 text-blue-600" />
                  )}
                  <span className="text-xs px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full font-semibold">
                    Coming Soon
                  </span>
                </div>
                <p className="text-sm text-[var(--semantic-text-secondary)] mb-2">
                  Connect your existing Google Drive account for document storage.
                </p>
                <p className="text-sm text-amber-700 font-medium">
                  This feature will be available in a future update. For now, please use built-in storage.
                </p>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-xl p-5 mb-8 shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-pink-400/5" />
          <div className="relative flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-[var(--semantic-text-primary)] mb-1">Secure & Reliable</p>
              <p className="text-sm text-[var(--semantic-text-secondary)] leading-relaxed">
                All files are encrypted in transit and at rest. Your documents are backed up daily and can be recovered at any time.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <div className="flex justify-end pt-6 border-t border-[var(--semantic-border-light)]">
          <Button 
            size="lg" 
            onClick={handleContinue} 
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
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
    </motion.div>
  );
}
