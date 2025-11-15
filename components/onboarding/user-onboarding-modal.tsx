
'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useIsMobile, useIsTablet } from '@/hooks/use-responsive';
import { cn } from '@/lib/utils';
import { 
  ArrowRight, 
  ArrowLeft, 
  X,
  CheckCircle2,
  Home,
  Users,
  FileText,
  CreditCard,
  MessageSquare,
  Shield,
  Sparkles,
  Bell,
  Building2,
  Settings,
  BookOpen,
  Layout,
  Search,
  Smartphone,
  Monitor
} from 'lucide-react';

// Onboarding step type
interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  content: React.ReactNode;
  targetElement?: string; // CSS selector for spotlight
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  mobileOnly?: boolean;
  desktopOnly?: boolean;
}

// Board Member onboarding steps
const BOARD_MEMBER_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to the Board!',
    description: 'Let\'s get you started with your board member dashboard',
    icon: Shield,
    content: (
      <div className="space-y-4">
        <p className="text-[var(--semantic-text-secondary)]">
          As a board member, you have access to powerful tools to manage the Montrecott community effectively.
        </p>
        <div className="bg-[var(--semantic-primary-subtle)] border border-[var(--semantic-primary-light)] rounded-lg p-4">
          <h4 className="font-semibold text-[var(--semantic-primary-dark)] mb-2">Your Responsibilities:</h4>
          <ul className="space-y-2 text-sm text-[var(--semantic-primary-dark)]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Review and approve resident requests</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Manage community announcements and communications</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Monitor payments and financial matters</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Maintain documents and community resources</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'admin-panel',
    title: 'Admin Panel Overview',
    description: 'Access your administrative tools',
    icon: Shield,
    content: (
      <div className="space-y-4">
        <p className="text-[var(--semantic-text-secondary)]">
          The Admin Panel (shield icon 🛡️) gives you access to management tools.
        </p>
        <div className="grid gap-3">
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <Users className="h-5 w-5 text-[var(--semantic-primary)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">User Management</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Add, edit, or remove residents and manage roles</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <Bell className="h-5 w-5 text-[var(--semantic-primary)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Announcements</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Post important updates to all residents</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <FileText className="h-5 w-5 text-[var(--semantic-primary)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Directory Requests</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Review and approve profile change requests</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'key-features',
    title: 'Key Features',
    description: 'Explore what you can do',
    icon: Sparkles,
    content: (
      <div className="space-y-4">
        <p className="text-[var(--semantic-text-secondary)]">
          Here are the most important features you'll use regularly:
        </p>
        <div className="grid gap-3">
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <MessageSquare className="h-5 w-5 text-[var(--semantic-accent)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Messages</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Communicate with residents privately</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <FileText className="h-5 w-5 text-[var(--semantic-primary)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Documents</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Upload and manage community documents</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <CreditCard className="h-5 w-5 text-[var(--semantic-success)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Payments</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Track dues and view payment history</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'dock',
    title: 'The App Dock',
    description: 'Your navigation hub',
    icon: Layout,
    targetElement: '[data-tutorial="dock"]',
    position: 'top',
    content: (
      <div className="space-y-4">
        <p className="text-[var(--semantic-text-secondary)]">
          Your main navigation is at the bottom of the screen. Click any icon to open an app or view its menu.
        </p>
        <div className="bg-[var(--semantic-primary-subtle)] border border-[var(--semantic-primary-light)] rounded-lg p-4">
          <h4 className="font-semibold text-[var(--semantic-primary-dark)] mb-2">Pro Tips:</h4>
          <ul className="space-y-2 text-sm text-[var(--semantic-primary-dark)]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Click once to open an app</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Right-click for quick actions menu</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Drag apps to rearrange them</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'search',
    title: 'Universal Search',
    description: 'Find anything instantly',
    icon: Search,
    targetElement: '[data-tutorial="status-bar"]',
    position: 'bottom',
    content: (
      <div className="space-y-4">
        <p className="text-[var(--semantic-text-secondary)]">
          Use the "Just type..." search bar to quickly find apps, documents, residents, or get help from the AI assistant.
        </p>
        <div className="grid gap-3">
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <Search className="h-5 w-5 text-[var(--semantic-primary)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Quick Launch</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Type app names to open them instantly</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <MessageSquare className="h-5 w-5 text-[var(--semantic-accent)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">AI Assistant</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Ask questions in natural language</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'desktop-features',
    title: 'Desktop Power Features',
    description: 'Multitask like a pro',
    icon: Monitor,
    desktopOnly: true,
    position: 'center',
    content: (
      <div className="space-y-4">
        <p className="text-[var(--semantic-text-secondary)]">
          On desktop, you can work with multiple apps at once with powerful window management.
        </p>
        <div className="grid gap-3">
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <Layout className="h-5 w-5 text-[var(--semantic-primary)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Multiple Windows</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Open several apps side by side</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <Settings className="h-5 w-5 text-[var(--semantic-accent)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Window Snapping</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Drag windows to screen edges to snap them</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <Sparkles className="h-5 w-5 text-[var(--semantic-success)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Multitasking View</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Press F3 or click dock to see all open windows</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'mobile-gestures',
    title: 'Mobile Gestures',
    description: 'Navigate with touch',
    icon: Smartphone,
    mobileOnly: true,
    position: 'center',
    content: (
      <div className="space-y-4">
        <p className="text-[var(--semantic-text-secondary)]">
          Use intuitive gestures to navigate quickly on mobile devices.
        </p>
        <div className="grid gap-3">
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <ArrowLeft className="h-5 w-5 text-[var(--semantic-primary)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Swipe Navigation</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Swipe left/right to go back and forward</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <ArrowRight className="h-5 w-5 text-[var(--semantic-accent)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Pull to Refresh</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Pull down on lists to refresh content</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <Bell className="h-5 w-5 text-[var(--semantic-success)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Notification Drawer</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Swipe down from the top for notifications</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Ready to manage the community',
    icon: CheckCircle2,
    position: 'center',
    content: (
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--semantic-success-bg)] mb-2">
          <CheckCircle2 className="h-8 w-8 text-[var(--semantic-success)]" />
        </div>
        <p className="text-[var(--semantic-text-secondary)]">
          You're now ready to start managing the Montrecott community!
        </p>
        <div className="bg-[var(--semantic-primary-subtle)] border border-[var(--semantic-primary-light)] rounded-lg p-4">
          <h4 className="font-semibold text-[var(--semantic-primary-dark)] mb-2">Remember:</h4>
          <ul className="space-y-2 text-sm text-[var(--semantic-primary-dark)] text-left">
            <li className="flex items-start gap-2">
              <span className="font-semibold">•</span>
              <span>Access the Help panel anytime from the status bar</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">•</span>
              <span>Use keyboard shortcuts (press ? to see them all)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">•</span>
              <span>The AI assistant is always ready to help</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
];

// Resident onboarding steps  
const RESIDENT_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Montrecott!',
    description: 'Your community portal is ready',
    icon: Home,
    content: (
      <div className="space-y-4">
        <p className="text-[var(--semantic-text-secondary)]">
          Welcome to the Montrecott community management portal! This is your one-stop platform for everything related to your home and community.
        </p>
        <div className="bg-[var(--semantic-primary-subtle)] border border-[var(--semantic-primary-light)] rounded-lg p-4">
          <h4 className="font-semibold text-[var(--semantic-primary-dark)] mb-2">What You Can Do:</h4>
          <ul className="space-y-2 text-sm text-[var(--semantic-primary-dark)]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>View and pay association dues online</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Access important community documents and policies</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Connect with neighbors and the board</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Stay updated with community announcements</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'profile',
    title: 'Add Household Details',
    description: 'Personalize your household profile',
    icon: Users,
    content: (
      <div className="space-y-4">
        <div className="bg-[var(--semantic-success-bg)] border border-[var(--semantic-success-bg)] rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-[var(--semantic-success)] mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-green-900">Basic Info Complete!</h4>
              <p className="text-sm text-[var(--semantic-success-dark)] mt-1">
                We've saved your name, email, phone, and unit number during signup.
              </p>
            </div>
          </div>
        </div>
        <p className="text-[var(--semantic-text-secondary)]">
          Now you can add additional household details to make your profile complete:
        </p>
        <div className="grid gap-3">
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <Users className="h-5 w-5 text-[var(--semantic-primary)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Additional Residents</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Add family members or roommates living in your unit</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <Users className="h-5 w-5 text-[var(--semantic-accent)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Children</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Register children in your household</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <Home className="h-5 w-5 text-[var(--semantic-success)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Pets</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Register your pets (required by HOA)</p>
            </div>
          </div>
        </div>
        <div className="bg-[var(--semantic-primary-subtle)] border border-[var(--semantic-primary-light)] rounded-lg p-3 mt-4">
          <p className="text-sm text-[var(--semantic-primary-dark)]">
            💡 <strong>Tip:</strong> You can skip this for now and add household details later from <strong>My Household</strong> in the app dock.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'features',
    title: 'Key Features',
    description: 'Explore your portal',
    icon: Sparkles,
    content: (
      <div className="space-y-4">
        <p className="text-[var(--semantic-text-secondary)]">
          Here's what you have access to:
        </p>
        <div className="grid gap-3">
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <Building2 className="h-5 w-5 text-[var(--semantic-primary)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">My Community</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">View resident directory and community documents</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <CreditCard className="h-5 w-5 text-[var(--semantic-success)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Payments</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">View dues and payment history</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <FileText className="h-5 w-5 text-[var(--semantic-primary)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Documents</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Access bylaws, rules, and forms</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'ai-assistant',
    title: 'Meet Your AI Assistant',
    description: 'Get help 24/7',
    icon: MessageSquare,
    content: (
      <div className="space-y-4">
        <p className="text-[var(--semantic-text-secondary)]">
          Have questions? Our AI Assistant is here to help!
        </p>
        <div className="bg-[var(--semantic-accent-subtle)] border border-[var(--semantic-accent-light)] rounded-lg p-4">
          <div className="flex items-start gap-3 mb-3">
            <MessageSquare className="h-6 w-6 text-[var(--semantic-accent)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-purple-900">AI Assistant</h4>
              <p className="text-sm text-purple-800">
                Get instant answers about:
              </p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-purple-800 ml-9">
            <li>• Community policies and rules</li>
            <li>• Payment information and due dates</li>
            <li>• Document locations</li>
            <li>• Contact information for board members</li>
            <li>• General community questions</li>
          </ul>
        </div>
        <p className="text-sm text-[var(--semantic-text-secondary)]">
          Access the AI Assistant anytime from the app dock or by using the "Just type..." search bar.
        </p>
      </div>
    ),
  },
  {
    id: 'dock',
    title: 'The App Dock',
    description: 'Your navigation hub',
    icon: Layout,
    targetElement: '[data-tutorial="dock"]',
    position: 'top',
    content: (
      <div className="space-y-4">
        <p className="text-[var(--semantic-text-secondary)]">
          Your main navigation is at the bottom of the screen. Click any icon to open an app or access quick actions.
        </p>
        <div className="bg-[var(--semantic-primary-subtle)] border border-[var(--semantic-primary-light)] rounded-lg p-4">
          <h4 className="font-semibold text-[var(--semantic-primary-dark)] mb-2">Pro Tips:</h4>
          <ul className="space-y-2 text-sm text-[var(--semantic-primary-dark)]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Click once to open an app</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Right-click for quick actions menu</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Frequently used apps stay in the dock</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'search',
    title: 'Universal Search',
    description: 'Find anything instantly',
    icon: Search,
    targetElement: '[data-tutorial="status-bar"]',
    position: 'bottom',
    content: (
      <div className="space-y-4">
        <p className="text-[var(--semantic-text-secondary)]">
          Use the "Just type..." search bar to quickly find apps, documents, or get help.
        </p>
        <div className="grid gap-3">
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <Search className="h-5 w-5 text-[var(--semantic-primary)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Quick Launch</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Type to find and open apps instantly</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <MessageSquare className="h-5 w-5 text-[var(--semantic-accent)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Ask Questions</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Get help from the AI assistant</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'desktop-features',
    title: 'Desktop Power Features',
    description: 'Multitask efficiently',
    icon: Monitor,
    desktopOnly: true,
    position: 'center',
    content: (
      <div className="space-y-4">
        <p className="text-[var(--semantic-text-secondary)]">
          On desktop, you can use multiple apps at once with advanced window management.
        </p>
        <div className="grid gap-3">
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <Layout className="h-5 w-5 text-[var(--semantic-primary)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Multiple Windows</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Open and arrange apps side by side</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <Settings className="h-5 w-5 text-[var(--semantic-accent)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Window Snapping</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Drag to screen edges to snap windows</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <Sparkles className="h-5 w-5 text-[var(--semantic-success)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Multitasking View</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Press F3 to see all open windows</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'mobile-gestures',
    title: 'Mobile Gestures',
    description: 'Navigate with touch',
    icon: Smartphone,
    mobileOnly: true,
    position: 'center',
    content: (
      <div className="space-y-4">
        <p className="text-[var(--semantic-text-secondary)]">
          Use these intuitive gestures to navigate on mobile.
        </p>
        <div className="grid gap-3">
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <ArrowLeft className="h-5 w-5 text-[var(--semantic-primary)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Swipe Navigation</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Swipe left/right to go back and forward</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <ArrowRight className="h-5 w-5 text-[var(--semantic-accent)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Pull to Refresh</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Pull down on lists to update content</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
            <Bell className="h-5 w-5 text-[var(--semantic-success)] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--semantic-text-primary)]">Notification Drawer</h4>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Swipe down from top for notifications</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Welcome to the community',
    icon: CheckCircle2,
    position: 'center',
    content: (
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--semantic-success-bg)] mb-2">
          <CheckCircle2 className="h-8 w-8 text-[var(--semantic-success)]" />
        </div>
        <p className="text-[var(--semantic-text-secondary)]">
          You're all set to start exploring your Montrecott community portal!
        </p>
        <div className="bg-[var(--semantic-primary-subtle)] border border-[var(--semantic-primary-light)] rounded-lg p-4">
          <h4 className="font-semibold text-[var(--semantic-primary-dark)] mb-2">Remember:</h4>
          <ul className="space-y-2 text-sm text-[var(--semantic-primary-dark)] text-left">
            <li className="flex items-start gap-2">
              <span className="font-semibold">•</span>
              <span>Access the Help panel anytime from the status bar</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">•</span>
              <span>Use keyboard shortcuts (press ? to see them all)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">•</span>
              <span>The AI assistant is always ready to help</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
];

interface UserOnboardingModalProps {
  open: boolean;
  onComplete: () => void;
}

export function UserOnboardingModal({ open, onComplete }: UserOnboardingModalProps) {
  const { data: session, update } = useSession() || {};
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [highlightElement, setHighlightElement] = useState<DOMRect | null>(null);

  // Determine which steps to show based on user role
  const allSteps = session?.user?.role === 'BOARD_MEMBER' ? BOARD_MEMBER_STEPS : RESIDENT_STEPS;
  
  // Filter steps based on device
  const steps = allSteps.filter(s => {
    if (s.mobileOnly && !isMobile && !isTablet) return false;
    if (s.desktopOnly && (isMobile || isTablet)) return false;
    return true;
  });
  
  const progress = ((currentStep + 1) / steps.length) * 100;
  const step = steps[currentStep];

  // Handle spotlight highlighting for UI tour steps
  useEffect(() => {
    if (open && step?.targetElement) {
      const timer = setTimeout(() => {
        const element = document.querySelector(step.targetElement!);
        if (element) {
          const rect = element.getBoundingClientRect();
          setHighlightElement(rect);
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          setHighlightElement(null);
        }
      }, 300); // Delay for dialog animation
      return () => clearTimeout(timer);
    } else {
      setHighlightElement(null);
    }
    return undefined;
  }, [currentStep, step, open]);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Save progress
      await saveProgress(currentStep + 1, false);
    } else {
      // Complete onboarding
      await completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
  };

  const saveProgress = async (step: number, completed: boolean) => {
    try {
      await fetch('/api/user/onboarding/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step, completed }),
      });
    } catch (error) {
      console.error('Error saving onboarding progress:', error);
    }
  };

  const completeOnboarding = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/onboarding/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: steps.length, completed: true }),
      });
      
      if (response.ok) {
        // Trigger session update to refresh token with new onboarding status
        if (update) {
          await update();
        }
        onComplete();
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setSaving(false);
    }
  };

  const StepIcon = step?.icon;
  if (!step) return null;

  return (
    <>
      {/* Backdrop with spotlight effect */}
      {highlightElement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed z-[9998] pointer-events-none"
          style={{
            left: highlightElement.left - 8,
            top: highlightElement.top - 8,
            width: highlightElement.width + 16,
            height: highlightElement.height + 16,
            borderRadius: '12px',
            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.4)',
          }}
        />
      )}

      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleSkip()} modal={true}>
        <DialogContent 
          className={cn(
            "max-w-2xl max-h-[90vh] overflow-hidden p-0",
            highlightElement && "z-[9999]"
          )}
        >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--semantic-primary-subtle)] flex items-center justify-center">
                  <StepIcon className="h-5 w-5 text-[var(--semantic-primary)]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--semantic-text-primary)]">{step.title}</h2>
                  <p className="text-sm text-[var(--semantic-text-secondary)]">{step.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-[var(--semantic-primary-subtle)] text-[var(--semantic-primary-dark)] text-xs font-medium rounded-full">
                  Welcome Tour
                </div>
                {currentStep > 0 && currentStep < steps.length - 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                    disabled={saving}
                    className="text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-text-primary)] text-xs"
                  >
                    Skip Tour
                  </Button>
                )}
              </div>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-[var(--semantic-text-tertiary)] mt-2">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {step.content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-[var(--semantic-bg-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0 || saving}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              {currentStep > 0 && currentStep < steps.length - 1 && (
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  disabled={saving}
                  className="text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-text-primary)]"
                >
                  Skip Tour
                </Button>
              )}
            </div>
            <Button onClick={handleNext} disabled={saving}>
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
