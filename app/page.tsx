'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Code,
  Layout,
  Zap,
  Lock,
  Globe,
  Settings,
  Check,
  ChevronRight,
  AlertCircle,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

// loomOS physics constants
const loomOSSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
  mass: 1
};

// Navigation Component
interface NavigationProps {
  onLoginClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onLoginClick }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={loomOSSpring}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-loomos-orange to-loomos-orange-dark rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={loomOSSpring}
            >
              <span className="text-white font-bold text-xl">L</span>
            </motion.div>
            <span className="font-display text-2xl font-bold text-[var(--semantic-text-primary)]">loomOS</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-[var(--semantic-text-primary)] hover:text-loomos-orange transition-colors font-medium">Features</a>
            <a href="#developers" className="text-[var(--semantic-text-primary)] hover:text-loomos-orange transition-colors font-medium">Developers</a>
            <a href="#design" className="text-[var(--semantic-text-primary)] hover:text-loomos-orange transition-colors font-medium">Design</a>
            <a href="https://github.com/ourfi-app/loomOS" target="_blank" rel="noopener noreferrer" className="text-[var(--semantic-text-primary)] hover:text-loomos-orange transition-colors font-medium">GitHub</a>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onLoginClick}
              className="text-[var(--semantic-text-primary)] hover:text-loomos-orange transition-colors font-semibold"
            >
              Log In
            </button>
            <Link href="/auth/register">
              <motion.button
                className="bg-gradient-to-r from-loomos-orange to-loomos-orange-dark text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={loomOSSpring}
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

// Card Stack Demo Component
const CardStack = () => {
  const cards = [
    { title: "Messages", color: "from-purple-500 to-pink-500", offset: 0 },
    { title: "Calendar", color: "from-blue-500 to-cyan-500", offset: 40 },
    { title: "Documents", color: "from-green-500 to-emerald-500", offset: 80 },
  ];

  return (
    <div className="relative h-[400px]">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          className={`absolute w-full h-[300px] bg-gradient-to-br ${card.color} rounded-2xl shadow-2xl p-6 cursor-pointer`}
          style={{
            top: `${card.offset}px`,
            zIndex: cards.length - index,
          }}
          initial={{
            opacity: 0,
            y: 50,
            rotate: index * 2,
            scale: 1 - (index * 0.05)
          }}
          animate={{
            opacity: 1,
            y: 0,
            rotate: index * 2,
            scale: 1 - (index * 0.05)
          }}
          transition={{ ...loomOSSpring, delay: 0.5 + (index * 0.1) }}
          whileHover={{
            y: -10,
            scale: 1.02 - (index * 0.05),
            transition: loomOSSpring
          }}
        >
          <div className="text-white">
            <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
            <div className="space-y-2 mt-6">
              <div className="h-2 bg-white/30 rounded w-3/4"></div>
              <div className="h-2 bg-white/30 rounded w-1/2"></div>
              <div className="h-2 bg-white/30 rounded w-5/6"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Hero Section
const Hero = () => {
  return (
    <div className="relative pt-32 pb-20 overflow-hidden webos-gradient-bg" style={{
      backgroundImage: `
        linear-gradient(rgba(241, 136, 37, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(241, 136, 37, 0.03) 1px, transparent 1px)
      `,
      backgroundSize: '8px 8px'
    }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={loomOSSpring}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-loomos-orange/10 border border-loomos-orange/20 rounded-full px-4 py-2 mb-6 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={loomOSSpring}
            >
              <span className="w-2 h-2 bg-loomos-orange rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-loomos-orange">Open Source • MIT Licensed</span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--semantic-text-primary)] mb-6 leading-tight">
              Computing.<br />
              <span className="bg-gradient-to-r from-loomos-orange to-loomos-orange-dark bg-clip-text text-transparent">
                Liberated.
              </span>
            </h1>

            <p className="text-xl text-[var(--semantic-text-secondary)] mb-8 leading-relaxed">
              The beautiful, open-source operating system that frees you from Apple and Google&apos;s grip.
              Activity-centric design meets modern web technology.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/auth/register">
                <motion.button
                  className="bg-gradient-to-r from-loomos-orange to-loomos-orange-dark text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all flex items-center space-x-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={loomOSSpring}
                >
                  <span>Get Started Free</span>
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <a href="https://github.com/ourfi-app/loomOS" target="_blank" rel="noopener noreferrer">
                <motion.button
                  className="bg-white border-2 border-[var(--semantic-border-medium)] text-[var(--semantic-text-primary)] px-8 py-4 rounded-xl font-semibold text-lg hover:border-loomos-orange hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={loomOSSpring}
                >
                  View Documentation
                </motion.button>
              </a>
            </div>

            <div className="mt-12 flex items-center space-x-8 text-sm text-[var(--semantic-text-secondary)]">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-loomos-orange" />
                <span>No vendor lock-in</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-loomos-orange" />
                <span>Self-hostable</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-loomos-orange" />
                <span>85% revenue share</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...loomOSSpring, delay: 0.2 }}
          >
            <CardStack />
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute top-20 right-20 w-20 h-20 bg-loomos-orange/10 rounded-full blur-xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

// Feature Card Component
interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, delay }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      className="bg-white border border-[var(--semantic-border-medium)] rounded-2xl p-8 shadow-sm cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ ...loomOSSpring, delay: delay * 0.1 }}
      whileHover={{ y: -8, boxShadow: '0 10px 15px -3px rgba(241, 136, 37, 0.15)' }}
    >
      <div className="w-14 h-14 bg-gradient-to-br from-loomos-orange to-loomos-orange-dark rounded-xl flex items-center justify-center mb-6 text-white">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-display text-2xl font-bold text-[var(--semantic-text-primary)] mb-4">{title}</h3>
      <p className="text-[var(--semantic-text-secondary)] leading-relaxed">{description}</p>
    </motion.div>
  );
};

// Features Section
const Features = () => {
  const features = [
    {
      icon: Layout,
      title: "Card-Based Multitasking",
      description: "Live app previews in a fluid card interface. Switch between tasks with a flick. See everything at once."
    },
    {
      icon: Zap,
      title: "Just Type Search",
      description: "One search box. Everything you need. Apps, documents, contacts, calendar—all accessible instantly."
    },
    {
      icon: Code,
      title: "Modern Stack",
      description: "React, Next.js, TypeScript, Tailwind—the tools you already know. No proprietary frameworks."
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "No telemetry without opt-in. Self-hostable. Your data stays yours. No mysterious cloud syncing."
    },
    {
      icon: Globe,
      title: "Cross-Platform",
      description: "One OS, every device. Web, mobile, desktop. Write once, run anywhere. For real this time."
    },
    {
      icon: Settings,
      title: "Service Abstraction",
      description: "Choose your own email, storage, AI providers. Swap them out anytime. No vendor lock-in."
    }
  ];

  return (
    <div id="features" className="py-24 webos-gradient-bg">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={loomOSSpring}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--semantic-text-primary)] mb-4">
            Everything You Need.{' '}
            <span className="bg-gradient-to-r from-loomos-orange to-loomos-orange-dark bg-clip-text text-transparent">
              Nothing You Don&apos;t.
            </span>
          </h2>
          <p className="text-xl text-[var(--semantic-text-secondary)] max-w-3xl mx-auto">
            Built on the revolutionary design principles of webOS, rebuilt for today with modern web technologies.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Stats Section
const Stats = () => {
  const stats = [
    { value: "15%", label: "Platform Fee (Not 30%)" },
    { value: "0", label: "Vendor Lock-In" },
    { value: "100%", label: "Open Source" },
    { value: "MIT", label: "License" }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...loomOSSpring, delay: index * 0.1 }}
            >
              <div className="font-display text-4xl md:text-5xl font-bold bg-gradient-to-r from-loomos-orange to-loomos-orange-dark bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-[var(--semantic-text-secondary)] font-semibold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Design System Section
const DesignSystem = () => {
  return (
    <div id="design" className="py-24 bg-gradient-to-b from-[#EAEAEA] to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={loomOSSpring}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--semantic-text-primary)] mb-4">
            Beautiful by Design.<br />
            <span className="bg-gradient-to-r from-loomos-orange to-loomos-orange-dark bg-clip-text text-transparent">
              Consistent by System.
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={loomOSSpring}
          >
            <h3 className="font-display text-3xl font-bold text-[var(--semantic-text-primary)] mb-6">Signature Orange</h3>
            <p className="text-[var(--semantic-text-secondary)] text-lg mb-6">
              Every element uses our distinctive{' '}
              <span className="bg-gradient-to-r from-loomos-orange to-loomos-orange-dark bg-clip-text text-transparent font-bold">
                #F18825 orange accent
              </span>{' '}
              paired with clean off-white backgrounds. Not garish. Not corporate. Just warm, inviting, and unmistakably loomOS.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-loomos-orange rounded-xl shadow-lg"></div>
                <div>
                  <div className="font-semibold text-[var(--semantic-text-primary)]">#F18825</div>
                  <div className="text-sm text-[var(--semantic-text-secondary)]">Primary Orange</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 webos-gradient-bg rounded-xl border-2 border-[var(--semantic-border-medium)]"></div>
                <div>
                  <div className="font-semibold text-[var(--semantic-text-primary)]">#EAEAEA</div>
                  <div className="text-sm text-[var(--semantic-text-secondary)]">Off-White Background</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-[#2C3440] rounded-xl"></div>
                <div>
                  <div className="font-semibold text-[var(--semantic-text-primary)]">#2C3440</div>
                  <div className="text-sm text-[var(--semantic-text-secondary)]">Navy Gray Text</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={loomOSSpring}
          >
            <div className="bg-white border border-[var(--semantic-border-medium)] rounded-2xl p-6 shadow-lg">
              <h4 className="font-display text-xl font-bold text-[var(--semantic-text-primary)] mb-4">Physics-Based Motion</h4>
              <p className="text-[var(--semantic-text-secondary)] mb-4">
                Every animation follows real-world physics with spring parameters (stiffness: 300, damping: 25).
              </p>
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-loomos-orange to-loomos-orange-dark rounded-xl"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            <div className="bg-white border border-[var(--semantic-border-medium)] rounded-2xl p-6 shadow-lg">
              <h4 className="font-display text-xl font-bold text-[var(--semantic-text-primary)] mb-4">44px Touch Targets</h4>
              <p className="text-[var(--semantic-text-secondary)] mb-4">
                No hunting for tiny buttons. Every interactive element is touch-optimized.
              </p>
              <div className="flex space-x-2">
                {['A', 'B', 'C'].map((letter) => (
                  <motion.button
                    key={letter}
                    className="w-11 h-11 bg-loomos-orange text-white rounded-lg hover:bg-loomos-orange-dark transition-colors font-semibold"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={loomOSSpring}
                  >
                    {letter}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Developer Section
const DeveloperSection = () => {
  return (
    <div id="developers" className="py-24 bg-[#2C3440] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '8px 8px'
      }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={loomOSSpring}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Build Apps That Matter.{' '}
            <span className="bg-gradient-to-r from-loomos-orange to-loomos-orange-dark bg-clip-text text-transparent">
              Keep What You Earn.
            </span>
          </h2>
          <p className="text-xl text-[var(--semantic-text-tertiary)] max-w-3xl mx-auto">
            React, TypeScript, and the tools you love. Publish without gatekeepers. Keep 85% of revenue.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "Modern Stack",
              description: "React, Next.js 14, TypeScript, Tailwind CSS, Framer Motion. The best tools, no lock-in."
            },
            {
              title: "85% Revenue Share",
              description: "Not 70%. 85%. Plus full Stripe Dashboard access and weekly payouts."
            },
            {
              title: "Real Documentation",
              description: "Actual guides. Working examples. Real patterns. Built for humans, not lawyers."
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...loomOSSpring, delay: index * 0.1 }}
              whileHover={{ y: -8, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <h3 className="font-display text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-[var(--semantic-text-tertiary)]">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-gradient-to-r from-loomos-orange to-loomos-orange-dark rounded-2xl p-8 md:p-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={loomOSSpring}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-display text-3xl font-bold mb-4">Developer Portal Now Live</h3>
              <p className="text-white/90 mb-6">
                Submit apps, track analytics, monitor revenue. Everything you need to build a successful app business.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5" />
                  <span>Free tier: 3 apps</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5" />
                  <span>Pro ($29/mo): 25 apps</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5" />
                  <span>Enterprise: Unlimited</span>
                </li>
              </ul>
              <a href="https://github.com/ourfi-app/loomOS" target="_blank" rel="noopener noreferrer">
                <motion.button
                  className="bg-white text-loomos-orange px-8 py-4 rounded-xl font-semibold hover:bg-[var(--semantic-surface-hover)] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={loomOSSpring}
                >
                  Start Building
                </motion.button>
              </a>
            </div>

            <div className="bg-[#2C3440]/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 font-mono text-sm">
              <div className="text-purple-300">import</div>
              <div className="ml-4 text-blue-300">{`{ Card, Button }`}</div>
              <div className="text-purple-300">from</div>
              <div className="ml-4 text-green-300">&apos;@loomos/ui&apos;</div>
              <div className="mt-4 text-[var(--semantic-text-tertiary)]">// Beautiful by default</div>
              <div className="text-yellow-300">export default</div>
              <div className="ml-4 text-blue-300">MyApp</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// CTA Section
const CTA = () => {
  return (
    <div className="py-24 bg-gradient-to-br from-loomos-orange to-loomos-orange-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '8px 8px'
      }} />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.h2
          className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={loomOSSpring}
        >
          Ready to Break Free?
        </motion.h2>
        <motion.p
          className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...loomOSSpring, delay: 0.1 }}
        >
          Join thousands of users and developers who&apos;ve chosen computing freedom.
          Beautiful design, modern technology, zero lock-in.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...loomOSSpring, delay: 0.2 }}
        >
          <Link href="/auth/register">
            <motion.button
              className="bg-white text-loomos-orange px-10 py-5 rounded-xl font-bold text-lg hover:bg-[var(--semantic-surface-hover)] transition-colors shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={loomOSSpring}
            >
              Start Using loomOS
            </motion.button>
          </Link>

          <a href="https://github.com/ourfi-app/loomOS" target="_blank" rel="noopener noreferrer">
            <motion.button
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={loomOSSpring}
            >
              View on GitHub
            </motion.button>
          </a>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-8 text-sm text-white/80"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ...loomOSSpring, delay: 0.3 }}
        >
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>5-minute setup</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Free forever</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="bg-[#2C3440] text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-loomos-orange to-loomos-orange-dark rounded-xl flex items-center justify-center">
                <span className="font-bold text-xl">L</span>
              </div>
              <span className="font-display text-2xl font-bold">loomOS</span>
            </div>
            <p className="text-[var(--semantic-text-tertiary)] mb-4">
              Built to liberate, not to lock in.
            </p>
            <div className="text-sm text-[var(--semantic-text-tertiary)]">
              © 2025 loomOS Contributors
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-[var(--semantic-text-tertiary)]">
              <li><a href="#features" className="hover:text-loomos-orange transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-loomos-orange transition-colors">Pricing</a></li>
              <li><a href="https://github.com/ourfi-app/loomOS" target="_blank" rel="noopener noreferrer" className="hover:text-loomos-orange transition-colors">Roadmap</a></li>
              <li><a href="https://github.com/ourfi-app/loomOS/releases" target="_blank" rel="noopener noreferrer" className="hover:text-loomos-orange transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Developers</h4>
            <ul className="space-y-2 text-[var(--semantic-text-tertiary)]">
              <li><a href="https://github.com/ourfi-app/loomOS" target="_blank" rel="noopener noreferrer" className="hover:text-loomos-orange transition-colors">Documentation</a></li>
              <li><a href="https://github.com/ourfi-app/loomOS" target="_blank" rel="noopener noreferrer" className="hover:text-loomos-orange transition-colors">API Reference</a></li>
              <li><a href="#design" className="hover:text-loomos-orange transition-colors">Component Library</a></li>
              <li><a href="https://github.com/ourfi-app/loomOS" target="_blank" rel="noopener noreferrer" className="hover:text-loomos-orange transition-colors">GitHub</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Community</h4>
            <ul className="space-y-2 text-[var(--semantic-text-tertiary)]">
              <li><a href="#" className="hover:text-loomos-orange transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-loomos-orange transition-colors">Twitter</a></li>
              <li><a href="https://github.com/ourfi-app/loomOS" target="_blank" rel="noopener noreferrer" className="hover:text-loomos-orange transition-colors">Blog</a></li>
              <li><a href="https://github.com/ourfi-app/loomOS/issues" target="_blank" rel="noopener noreferrer" className="hover:text-loomos-orange transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-[var(--semantic-text-tertiary)] text-sm">
          <p>Inspired by Palm/HP webOS. Built with ❤️ by the open source community.</p>
          <p className="mt-2">MIT Licensed • Privacy First • Self-Hostable</p>
        </div>
      </div>
    </footer>
  );
};

// Login Modal Component
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignup) {
        // Redirect to registration page for signup
        router.push('/auth/register');
      } else {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError('Invalid email or password');
          setIsLoading(false);
        } else if (result?.ok) {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-[#2C3440]/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={loomOSSpring}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-3xl font-bold text-[var(--semantic-text-primary)]">
                {isSignup ? 'Create Account' : 'Welcome Back'}
              </h2>
              <button
                onClick={onClose}
                className="text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-text-primary)] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <Alert className="bg-[var(--semantic-error-bg)] border-[var(--semantic-error-border)] rounded-lg mb-5">
                <AlertCircle className="h-4 w-4 text-[var(--semantic-error)]" />
                <AlertDescription className="text-[var(--semantic-error)] text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div>
                  <Label className="block text-sm font-semibold text-[var(--semantic-text-primary)] mb-2">
                    Full Name
                  </Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--semantic-surface-hover)] border-2 border-[var(--semantic-border-medium)] rounded-xl text-[var(--semantic-text-primary)] transition-all focus:border-loomos-orange"
                    placeholder="John Doe"
                    required={isSignup}
                  />
                </div>
              )}

              <div>
                <Label className="block text-sm font-semibold text-[var(--semantic-text-primary)] mb-2">
                  Email
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--semantic-surface-hover)] border-2 border-[var(--semantic-border-medium)] rounded-xl text-[var(--semantic-text-primary)] transition-all focus:border-loomos-orange"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <Label className="block text-sm font-semibold text-[var(--semantic-text-primary)] mb-2">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--semantic-surface-hover)] border-2 border-[var(--semantic-border-medium)] rounded-xl text-[var(--semantic-text-primary)] pr-12 transition-all focus:border-loomos-orange"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--semantic-text-secondary)] hover:text-loomos-orange transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {!isSignup && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4 text-loomos-orange rounded" />
                    <span className="text-[var(--semantic-text-secondary)]">Remember me</span>
                  </label>
                  <Link href="/auth/forgot-password" className="text-loomos-orange hover:text-loomos-orange-dark font-semibold">
                    Forgot password?
                  </Link>
                </div>
              )}

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={loomOSSpring}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-loomos-orange to-loomos-orange-dark text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all"
                  disabled={isLoading || isGoogleLoading}
                >
                  {isLoading ? 'Loading...' : (isSignup ? 'Create Account' : 'Log In')}
                </Button>
              </motion.div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[var(--semantic-text-secondary)]">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}
                {' '}
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-loomos-orange hover:text-loomos-orange-dark font-semibold"
                >
                  {isSignup ? 'Log In' : 'Sign Up'}
                </button>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--semantic-border-medium)]">
              <p className="text-sm text-[var(--semantic-text-secondary)] text-center mb-4">Or continue with</p>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isLoading}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-[var(--semantic-surface-hover)] border-2 border-[var(--semantic-border-medium)] rounded-xl hover:border-loomos-orange transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={loomOSSpring}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-semibold text-[var(--semantic-text-primary)]">Google</span>
                </motion.button>
                <a href="https://github.com/ourfi-app/loomOS" target="_blank" rel="noopener noreferrer">
                  <motion.button
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-[var(--semantic-surface-hover)] border-2 border-[var(--semantic-border-medium)] rounded-xl hover:border-loomos-orange transition-all w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={loomOSSpring}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span className="text-sm font-semibold text-[var(--semantic-text-primary)]">GitHub</span>
                  </motion.button>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main App Component
export default function LoomOSLanding() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen webos-gradient-bg">
      <Navigation onLoginClick={() => setShowLogin(true)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <Hero />
      <Features />
      <Stats />
      <DesignSystem />
      <DeveloperSection />
      <CTA />
      <Footer />
    </div>
  );
}
