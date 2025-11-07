'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import './marketing.css';

// loomOS physics constants
const loomOSSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
  mass: 1
};

export default function LoomOSLanding() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-[#EAEAEA] flex flex-col" style={{ fontFamily: 'Lato, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              className="w-10 h-10 bg-loomos-orange rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={loomOSSpring}
            >
              <span className="text-white font-bold text-xl">L</span>
            </motion.div>
            <span className="text-xl font-bold text-gray-900">loomOS</span>
          </div>

          <Link href="/auth/login">
            <motion.button
              className="min-h-[44px] min-w-[44px] px-6 py-2 bg-loomos-orange text-white font-bold rounded-lg text-base hover:bg-loomos-orange-dark transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={loomOSSpring}
            >
              Sign In
            </motion.button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <AnimatePresence mode="wait">
          {!showLogin ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={loomOSSpring}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.h1
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...loomOSSpring, delay: 0.1 }}
              >
                Liberation Computing
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl font-medium text-gray-800 mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...loomOSSpring, delay: 0.2 }}
              >
                Break free from proprietary ecosystems.
              </motion.p>

              <motion.p
                className="text-base md:text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...loomOSSpring, delay: 0.3 }}
              >
                loomOS is an open-source operating system framework that gives you complete control over your digital life. No walled gardens. No vendor lock-in. Just beautiful, powerful software that works for you.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...loomOSSpring, delay: 0.4 }}
              >
                <Link href="/auth/login">
                  <motion.button
                    className="min-h-[44px] px-8 py-3 bg-loomos-orange text-white font-bold rounded-lg text-base hover:bg-loomos-orange-dark transition-colors shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={loomOSSpring}
                  >
                    Get Started
                  </motion.button>
                </Link>

                <motion.a
                  href="https://github.com/ourfi-app/loomOS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-8 py-3 bg-white text-gray-900 font-bold rounded-lg text-base border-2 border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={loomOSSpring}
                >
                  View on GitHub
                </motion.a>
              </motion.div>

              {/* Feature Cards */}
              <motion.div
                className="grid md:grid-cols-3 gap-6 mt-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...loomOSSpring, delay: 0.5 }}
              >
                {[
                  {
                    title: "Open Source",
                    description: "Fully transparent codebase. No secrets, no surprises."
                  },
                  {
                    title: "Beautiful Design",
                    description: "Intuitive interfaces inspired by the best of webOS."
                  },
                  {
                    title: "Your Data",
                    description: "Complete ownership and control of your information."
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="bg-white p-6 rounded-lg shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...loomOSSpring, delay: 0.6 + (index * 0.1) }}
                    whileHover={{ y: -5 }}
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={loomOSSpring}
              className="w-full max-w-md"
            >
              {/* Redirect to /auth/login */}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 text-sm">
          <p>© 2025 loomOS. Open source software for a free world.</p>
        </div>
      </footer>
    </div>
  );
}
