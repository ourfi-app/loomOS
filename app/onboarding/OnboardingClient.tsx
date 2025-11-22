// TODO: Review setTimeout calls for proper cleanup in useEffect return functions
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  FileText,
  Mail,
  Users,
  Shield,
  Settings,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Save,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

// Import step components
import WelcomeStep from '@/components/onboarding/welcome-step';
import AssociationInfoStep from '@/components/onboarding/association-info-step';
import DocumentsStep from '@/components/onboarding/documents-step';
import EmailSetupStep from '@/components/onboarding/email-setup-step';
import OfficersStep from '@/components/onboarding/officers-step';
import ResidentsStep from '@/components/onboarding/residents-step';
import SettingsStep from '@/components/onboarding/settings-step';
import ReviewStep from '@/components/onboarding/review-step';
import CompleteStep from '@/components/onboarding/complete-step';

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome',
    description: 'Get started',
    icon: Building2,
    component: WelcomeStep,
    required: true,
  },
  {
    id: 'association-info',
    title: 'Basic Info',
    description: 'Your community details',
    icon: Building2,
    component: AssociationInfoStep,
    required: true,
  },
  {
    id: 'documents',
    title: 'Documents',
    description: 'Upload key documents',
    icon: FileText,
    component: DocumentsStep,
    required: true,
  },
  {
    id: 'email-setup',
    title: 'Email',
    description: 'Connect email (optional)',
    icon: Mail,
    component: EmailSetupStep,
    required: false,
  },
  {
    id: 'officers',
    title: 'Board Members',
    description: 'Add leadership (optional)',
    icon: Shield,
    component: OfficersStep,
    required: false,
  },
  {
    id: 'residents',
    title: 'Residents',
    description: 'Import residents (optional)',
    icon: Users,
    component: ResidentsStep,
    required: false,
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Configure policies (optional)',
    icon: Settings,
    component: SettingsStep,
    required: false,
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Confirm your setup',
    icon: CheckCircle2,
    component: ReviewStep,
    required: true,
  },
  {
    id: 'complete',
    title: 'Complete',
    description: 'All set!',
    icon: CheckCircle2,
    component: CompleteStep,
    required: true,
  },
];

export default function OnboardingClient() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set([0]));
  const [stepData, setStepData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // Check if user is admin and if onboarding is already completed
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      toast({
        title: 'Access Denied',
        description: 'Only administrators can access onboarding.',
        variant: 'destructive',
      });
      router.push('/dashboard');
      return;
    }
  }, [status, session, router, toast]);

  // Load onboarding progress and check if already completed
  useEffect(() => {
    if (status === 'authenticated') {
      loadProgress();
    }
  }, [status]);

  const loadProgress = async () => {
    try {
      const response = await fetch('/api/onboarding/progress');
      if (response.ok) {
        const data = await response.json();

        // If onboarding is already completed, redirect to dashboard
        if (data.onboardingCompleted) {
          toast({
            title: 'Setup Already Complete',
            description: 'Your association has already been set up.',
          });
          router.push('/dashboard');
          return;
        }

        if (data.currentStep !== undefined) {
          setCurrentStep(data.currentStep);
          // Mark all previous steps as completed
          const completed = new Set<number>();
          for (let i = 0; i <= data.currentStep; i++) {
            completed.add(i);
          }
          setCompletedSteps(completed);
        }
        if (data.data) {
          setStepData(data.data);
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (step: number, data: any) => {
    setSaving(true);
    try {
      const response = await fetch('/api/onboarding/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentStep: step,
          data: { ...stepData, ...data },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save progress');
      }

      setStepData((prev) => ({ ...prev, ...data }));

      // Show saved indicator
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);

      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: 'Error',
        description: 'Failed to save progress. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndExit = async () => {
    const saved = await saveProgress(currentStep, {});
    if (saved) {
      toast({
        title: 'Progress Saved',
        description: 'You can resume onboarding anytime from where you left off.',
      });
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    }
  };

  const handleNext = async (data?: any) => {
    // Save current step data if provided
    if (data && currentStep < ONBOARDING_STEPS.length - 1) {
      const saved = await saveProgress(currentStep + 1, data);
      if (!saved) return;
    }

    // Mark current step as completed
    setCompletedSteps((prev) => new Set([...prev, currentStep]));

    // Move to next step
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setCompletedSteps((prev) => new Set([...prev, currentStep + 1]));
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    await handleNext();
  };

  const handleComplete = async () => {
    try {
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
      });

      if (response.ok) {
        toast({
          title: 'Setup Complete!',
          description: 'Your association is now ready to use.',
        });

        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete setup. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading || status === 'loading') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'var(--webos-bg-gradient)',
          fontFamily: 'Helvetica Neue, Arial, sans-serif'
        }}
      >
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--webos-app-blue)' }} />
      </div>
    );
  }

  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;
  const currentStepInfo = ONBOARDING_STEPS[currentStep];

  if (!currentStepInfo) {
    return <div>Invalid step</div>;
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'var(--webos-bg-gradient)',
        fontFamily: 'Helvetica Neue, Arial, sans-serif'
      }}
    >
      {/* Enhanced Header with WebOS Glassmorphism */}
      <div 
        className="border-b sticky top-0 z-10"
        style={{
          background: 'var(--webos-bg-glass)',
          backdropFilter: 'blur(20px)',
          borderColor: 'var(--webos-border-glass)',
          boxShadow: 'var(--webos-shadow-md)'
        }}
      >
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              {/* Logo/Icon */}
              <motion.div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: 'var(--webos-ui-dark)',
                  boxShadow: 'var(--webos-shadow-md)'
                }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Building2 className="h-6 w-6" style={{ color: 'var(--webos-text-white)' }} />
              </motion.div>
              <div>
                <h1 
                  className="text-2xl font-light tracking-tight"
                  style={{ color: 'var(--webos-text-primary)' }}
                >
                  Association Setup Wizard
                </h1>
                <p 
                  className="text-sm font-light mt-0.5 flex items-center gap-2"
                  style={{ color: 'var(--webos-text-secondary)' }}
                >
                  <span className="font-light tracking-wide uppercase text-xs" style={{ color: 'var(--webos-text-tertiary)' }}>
                    Step {currentStep + 1} of {ONBOARDING_STEPS.length}:
                  </span>
                  <span style={{ color: 'var(--webos-text-primary)' }}>{currentStepInfo.title}</span>
                  {!currentStepInfo.required && (
                    <span 
                      className="text-xs px-2 py-0.5 rounded-full font-light border"
                      style={{
                        background: 'var(--webos-bg-tertiary)',
                        color: 'var(--webos-text-tertiary)',
                        borderColor: 'var(--webos-border-secondary)'
                      }}
                    >
                      Optional
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Enhanced Saved Indicator */}
              <AnimatePresence>
                {showSaved && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-light"
                    style={{
                      background: 'var(--webos-bg-glass)',
                      border: '1px solid var(--webos-border-glass)',
                      color: 'var(--webos-app-green)',
                      boxShadow: 'var(--webos-shadow-sm)'
                    }}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Saved!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {currentStep > 0 && currentStep < ONBOARDING_STEPS.length - 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveAndExit}
                  disabled={saving}
                  className="border-[var(--semantic-border-medium)] hover:border-[var(--semantic-border-strong)] hover:bg-[var(--semantic-bg-subtle)] shadow-sm"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save & Exit
                    </>
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="hover:bg-[var(--semantic-surface-hover)]"
              >
                Exit Setup
              </Button>
            </div>
          </div>

          {/* Enhanced Progress Bar - WebOS Style */}
          <div className="relative">
            <div 
              className="h-3 rounded-full overflow-hidden"
              style={{
                background: 'var(--webos-bg-tertiary)',
                boxShadow: 'var(--webos-shadow-inset)'
              }}
            >
              <motion.div
                className="h-full rounded-full relative"
                style={{
                  background: 'var(--webos-ui-dark)'
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
              </motion.div>
            </div>
            {/* Progress percentage */}
            <motion.div
              className="absolute -top-7 text-xs font-light px-2 py-0.5 rounded"
              style={{
                background: 'var(--webos-bg-white)',
                color: 'var(--webos-text-secondary)',
                border: '1px solid var(--webos-border-primary)',
                boxShadow: 'var(--webos-shadow-sm)'
              }}
              initial={{ left: 0 }}
              animate={{ left: `${Math.min(progress, 95)}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {Math.round(progress)}%
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Step Navigator - Desktop - WebOS Style */}
      <div className="container mx-auto px-4 py-10">
        <div className="hidden lg:flex justify-between mb-10 max-w-6xl mx-auto relative">
          {/* Background connector line */}
          <div 
            className="absolute top-8 left-0 right-0 h-1 rounded-full" 
            style={{ 
              background: 'var(--webos-border-primary)', 
              zIndex: 0 
            }} 
          />

          {ONBOARDING_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.has(index);
            const isCurrent = index === currentStep;
            const isAccessible = index <= currentStep;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center relative z-10"
                style={{ width: `${100 / ONBOARDING_STEPS.length}%` }}
              >
                {/* Animated Connector Line - WebOS */}
                {index < ONBOARDING_STEPS.length - 1 && (
                  <div className="absolute top-8 left-1/2 w-full h-1 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: 'var(--webos-ui-dark)'
                      }}
                      initial={{ width: 0 }}
                      animate={{
                        width: isCompleted ? '100%' : '0%'
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  </div>
                )}

                {/* Enhanced Step Icon - WebOS Style */}
                <motion.button
                  onClick={() => isAccessible && setCurrentStep(index)}
                  disabled={!isAccessible}
                  className={`relative z-20 w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all ${
                    isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                  }`}
                  style={{
                    background: isCurrent
                      ? 'var(--webos-ui-dark)'
                      : isCompleted
                      ? 'var(--webos-bg-glass)'
                      : 'var(--webos-bg-white)',
                    borderColor: isCurrent
                      ? 'var(--webos-ui-dark)'
                      : isCompleted
                      ? 'var(--webos-ui-light)'
                      : 'var(--webos-border-secondary)',
                    color: isCurrent
                      ? 'var(--webos-text-white)'
                      : isCompleted
                      ? 'var(--webos-ui-medium)'
                      : 'var(--webos-text-muted)',
                    boxShadow: isCurrent ? 'var(--webos-shadow-lg)' : 'var(--webos-shadow-sm)'
                  }}
                  whileHover={isAccessible ? { scale: 1.08, y: -2 } : {}}
                  whileTap={isAccessible ? { scale: 0.95 } : {}}
                >
                  {isCompleted && !isCurrent ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    >
                      <CheckCircle2 className="h-7 w-7" />
                    </motion.div>
                  ) : (
                    <Icon className="h-7 w-7" />
                  )}

                  {/* Step number badge for current/upcoming - WebOS */}
                  {!isCompleted && (
                    <div 
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-light"
                      style={{
                        background: isCurrent
                          ? 'var(--webos-bg-white)'
                          : 'var(--webos-bg-tertiary)',
                        color: isCurrent
                          ? 'var(--webos-ui-dark)'
                          : 'var(--webos-text-secondary)',
                        boxShadow: 'var(--webos-shadow-sm)'
                      }}
                    >
                      {index + 1}
                    </div>
                  )}
                </motion.button>

                {/* Step Label - WebOS Style */}
                <motion.div
                  className="mt-3 text-center max-w-[110px]"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <p
                    className="text-xs font-light mb-0.5"
                    style={{
                      color: isCurrent
                        ? 'var(--webos-text-primary)'
                        : isCompleted
                        ? 'var(--webos-text-primary)'
                        : 'var(--webos-text-tertiary)'
                    }}
                  >
                    {step.title}
                  </p>
                  <p 
                    className="text-[10px] font-light"
                    style={{
                      color: isCurrent
                        ? 'var(--webos-text-secondary)'
                        : 'var(--webos-text-muted)'
                    }}
                  >
                    {step.description}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Mobile Step Indicator - WebOS Style */}
        <div className="lg:hidden mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div 
              className="p-4 rounded-3xl"
              style={{
                background: 'var(--webos-bg-glass)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--webos-border-glass)',
                boxShadow: 'var(--webos-shadow-xl)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'var(--webos-ui-dark)',
                      boxShadow: 'var(--webos-shadow-md)'
                    }}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                  >
                    {(() => {
                      const Icon = currentStepInfo.icon;
                      return <Icon className="h-6 w-6" style={{ color: 'var(--webos-text-white)' }} />;
                    })()}
                  </motion.div>
                  <div>
                    <p 
                      className="font-light flex items-center gap-2"
                      style={{ color: 'var(--webos-text-primary)' }}
                    >
                      {currentStepInfo.title}
                      {!currentStepInfo.required && (
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full font-light border"
                          style={{
                            background: 'var(--webos-bg-tertiary)',
                            color: 'var(--webos-text-tertiary)',
                            borderColor: 'var(--webos-border-secondary)'
                          }}
                        >
                          Optional
                        </span>
                      )}
                    </p>
                    <p 
                      className="text-xs font-light mt-0.5"
                      style={{ color: 'var(--webos-text-secondary)' }}
                    >
                      {currentStepInfo.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span 
                    className="text-lg font-light"
                    style={{ color: 'var(--webos-text-primary)' }}
                  >
                    {currentStep + 1}/{ONBOARDING_STEPS.length}
                  </span>
                  <span 
                    className="text-[10px] font-light"
                    style={{ color: 'var(--webos-text-tertiary)' }}
                  >
                    {Math.round(progress)}% complete
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Step Content with improved animations */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 30, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.98 }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              {currentStep === 0 && (
                <WelcomeStep onNext={handleNext} isFirst={true} />
              )}
              {currentStep === 1 && (
                <AssociationInfoStep
                  data={stepData}
                  onNext={handleNext}
                  saving={saving}
                />
              )}
              {currentStep === 2 && (
                <DocumentsStep
                  data={stepData}
                  onNext={handleNext}
                  saving={saving}
                />
              )}
              {currentStep === 3 && (
                <EmailSetupStep
                  data={stepData}
                  onNext={handleNext}
                  saving={saving}
                />
              )}
              {currentStep === 4 && (
                <OfficersStep
                  data={stepData}
                  onNext={handleNext}
                  saving={saving}
                />
              )}
              {currentStep === 5 && (
                <ResidentsStep
                  data={stepData}
                  onNext={handleNext}
                  saving={saving}
                />
              )}
              {currentStep === 6 && (
                <SettingsStep
                  data={stepData}
                  onNext={handleNext}
                  saving={saving}
                />
              )}
              {currentStep === 7 && (
                <ReviewStep
                  data={stepData}
                  onNext={handleNext}
                  saving={saving}
                />
              )}
              {currentStep === 8 && (
                <CompleteStep onComplete={handleComplete} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Enhanced Navigation Buttons */}
        {currentStep > 0 && currentStep < ONBOARDING_STEPS.length - 1 && (
          <motion.div
            className="max-w-4xl mx-auto mt-8 flex justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={saving}
              size="lg"
              className="border-2 border-[var(--semantic-border-medium)] hover:border-[var(--semantic-border-strong)] hover:bg-[var(--semantic-bg-subtle)] shadow-md hover:shadow-lg transition-all"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            {!currentStepInfo.required && (
              <Button
                variant="ghost"
                onClick={handleSkip}
                disabled={saving}
                size="lg"
                className="text-[var(--semantic-text-tertiary)] hover:text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-surface-hover)]"
              >
                Skip for now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
