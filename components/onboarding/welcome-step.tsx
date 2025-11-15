
'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Sparkles, Shield, Users, ArrowRight, Clock, CheckCircle } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
  isFirst: boolean;
}

export default function WelcomeStep({ onNext, isFirst }: WelcomeStepProps) {
  const features = [
    {
      icon: Building2,
      title: 'Association Management',
      description: 'Comprehensive tools to manage your community',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50'
    },
    {
      icon: Users,
      title: 'Resident Portal',
      description: 'Empower residents with self-service capabilities',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50'
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'Bank-level security with audit trails',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Assistance',
      description: 'Intelligent chatbot to help residents 24/7',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'from-amber-50 to-orange-50'
    },
  ];

  return (
    <Card className="p-8 md:p-12 shadow-2xl border-2 border-[var(--semantic-primary-light)] bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30">
      <div className="text-center mb-10">
        <motion.div 
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-xl"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Building2 className="h-10 w-10 text-white" />
        </motion.div>
        
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Welcome to Your Association Portal
        </motion.h2>
        
        <motion.p 
          className="text-lg text-[var(--semantic-text-secondary)] max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Let's get your community set up! This guided process will help you configure everything your association needs to run smoothly.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-10">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group"
            >
              <div className={`flex gap-4 p-5 rounded-xl border-2 border-transparent bg-gradient-to-br ${feature.bgColor} hover:border-[var(--semantic-border-light)] transition-all shadow-md hover:shadow-xl`}>
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-[var(--semantic-text-primary)] mb-1.5 text-base">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[var(--semantic-text-secondary)] leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-[var(--semantic-primary-light)] rounded-xl p-6 mb-10 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-[var(--semantic-primary)]" />
          <h3 className="font-bold text-[var(--semantic-primary-dark)] text-lg">
            What you'll set up:
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-[var(--semantic-primary-dark)]">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md">
                <CheckCircle className="h-4 w-4" />
              </div>
              Required Steps
            </div>
            <ul className="space-y-2 ml-8 text-sm text-[var(--semantic-primary-dark)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--semantic-primary)] font-bold mt-0.5">•</span>
                <span>Basic association information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--semantic-primary)] font-bold mt-0.5">•</span>
                <span>Essential documents (Bylaws)</span>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-[var(--semantic-primary-dark)]">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center shadow-md">
                <span className="text-xs font-bold">~</span>
              </div>
              Optional Steps (Skip if needed)
            </div>
            <ul className="space-y-2 ml-8 text-sm text-[var(--semantic-primary-dark)]">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold mt-0.5">•</span>
                <span>Email configuration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold mt-0.5">•</span>
                <span>Board members</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold mt-0.5">•</span>
                <span>Resident import</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold mt-0.5">•</span>
                <span>Financial settings</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Button 
          size="lg" 
          onClick={onNext} 
          className="min-w-56 h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
        >
          Get Started
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
        <p className="text-sm text-[var(--semantic-text-tertiary)] mt-4 flex items-center justify-center gap-2">
          <Clock className="h-4 w-4" />
          Streamlined setup takes just 5-10 minutes. Optional steps can be completed anytime.
        </p>
      </motion.div>
    </Card>
  );
}
