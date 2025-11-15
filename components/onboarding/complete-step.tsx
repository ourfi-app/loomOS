'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Calendar,
  MessageSquare,
  FileText,
  CreditCard,
  Users,
  ListChecks,
  Bot,
  Bell,
} from 'lucide-react';
import { useLazyConfetti } from '@/components/lazy';

interface CompleteStepProps {
  onComplete: () => void;
}

const features = [
  { icon: Bell, label: 'Announcement system', delay: 0.1 },
  { icon: FileText, label: 'Document library', delay: 0.15 },
  { icon: CreditCard, label: 'Payment processing', delay: 0.2 },
  { icon: Users, label: 'Resident directory', delay: 0.25 },
  { icon: ListChecks, label: 'Task management', delay: 0.3 },
  { icon: Bot, label: 'AI chatbot assistant', delay: 0.35 },
  { icon: Calendar, label: 'Event calendar', delay: 0.4 },
  { icon: MessageSquare, label: 'Messaging system', delay: 0.45 },
];

export default function CompleteStep({ onComplete }: CompleteStepProps) {
  const [showFeatures, setShowFeatures] = useState(false);
  const { fireConfetti } = useLazyConfetti();

  useEffect(() => {
    // Celebrate with confetti!
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      fireConfetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981'],
      });
      fireConfetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Show features after a delay
    setTimeout(() => setShowFeatures(true), 800);
  }, [fireConfetti]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
    >
      <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-white via-white to-green-50/30 border-none shadow-2xl">
        {/* Success Icon with Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 15,
            delay: 0.2 
          }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 mb-6 shadow-2xl shadow-green-500/40"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: 'easeInOut' 
            }}
          >
            <CheckCircle2 className="h-12 w-12 text-white" />
          </motion.div>
        </motion.div>

        {/* Title with Gradient Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            🎉 Setup Complete!
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-[var(--semantic-text-secondary)] mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Congratulations! Your association portal is now fully configured and ready to use.
        </motion.p>

        {/* Features Grid with Staggered Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-[var(--semantic-primary-light)] rounded-2xl p-8 mb-8 shadow-xl"
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-pink-400/5" />
          <motion.div
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
              backgroundSize: '200% 100%',
            }}
          />
          
          <div className="relative">
            <div className="flex items-center justify-center gap-2 mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: 'easeInOut' 
                }}
              >
                <Sparkles className="h-6 w-6 text-[var(--semantic-accent)]" />
              </motion.div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                Your portal includes:
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <AnimatePresence>
                {showFeatures && features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: feature.delay,
                        type: 'spring',
                        stiffness: 200,
                        damping: 20
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-[var(--semantic-primary-light)] shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md flex-shrink-0">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-[var(--semantic-text-primary)]">{feature.label}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-6"
        >
          <Button 
            size="lg" 
            onClick={onComplete}
            className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-xl shadow-green-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/40 hover:scale-105 text-lg px-8 py-6"
          >
            Go to Dashboard
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-sm text-[var(--semantic-text-tertiary)]"
        >
          Need help? Check out our help center or contact support anytime.
        </motion.p>

        {/* Decorative Elements */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ 
            rotate: [360, 0],
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-2xl"
        />
      </Card>
    </motion.div>
  );
}
