'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Check, Home, LogIn, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

function EmailVerifiedSuccess() {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  const checkMarkVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 260,
        damping: 20,
        delay: 0.2,
      },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  // Helper function to handle navigation with locale
  const navigateTo = (path: string) => {
    try {
      router.push(`/${locale}${path}`);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback
      globalThis.location.href = `/${locale}${path}`;
    }
  };

  if (!mounted) {
    return; // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#FE8C00]/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-[#FE8C00]/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-[#FE8C00]/8 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-10 w-16 h-16 bg-[#FE8C00]/12 rounded-full blur-lg"></div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-md mx-auto"
      >
        {/* Success Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center relative overflow-hidden"
        >
          {/* Card background pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FE8C00]/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>

          {/* Success Icon */}
          <motion.div
            variants={checkMarkVariants}
            animate="visible"
            className="relative z-10 mx-auto w-20 h-20 bg-[#FE8C00] rounded-full flex items-center justify-center mb-6"
          >
            <motion.div
              variants={pulseVariants}
              animate="pulse"
              className="absolute inset-0 bg-[#FE8C00] rounded-full opacity-25"
            />
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
          >
            Email Verified!
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-gray-600 text-base md:text-lg leading-relaxed mb-8"
          >
            Your email has been successfully verified. Welcome to Global
            Takeout!
          </motion.p>

          {/* Success Info Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-[#FFF8F0] to-orange-50/50 border border-[#FE8C00]/20 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 bg-[#FE8C00]/10 rounded-full">
                <Mail className="w-6 h-6 text-[#FE8C00]" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">
                  Account Activated
                </h3>
                <p className="text-gray-600 text-sm">
                  You can now access all features
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FE8C00] rounded-full"></div>
                <span>Browse thousands of restaurants</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FE8C00] rounded-full"></div>
                <span>Place orders with ease</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FE8C00] rounded-full"></div>
                <span>Track your deliveries in real-time</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="space-y-4">
            {/* Primary Action - Continue to Login */}
            <Button
              onClick={() => navigateTo('/login')}
              className="w-full bg-[#FE8C00] hover:bg-[#FE8C00]/90 text-white font-semibold py-4 rounded-2xl text-base transition-all duration-300 hover:shadow-lg hover:shadow-[#FE8C00]/25 group"
            >
              <span>Continue to Login</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>

            {/* Secondary Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => navigateTo('/application/home')}
                variant="outline"
                className="flex-1 border-2 border-[#FE8C00]/20 text-[#FE8C00] hover:bg-[#FE8C00]/5 hover:border-[#FE8C00]/40 py-3 rounded-xl font-medium transition-all duration-300 group"
              >
                <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>Go Home</span>
              </Button>

              <Button
                onClick={() => navigateTo('/login')}
                variant="outline"
                className="flex-1 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 py-3 rounded-xl font-medium transition-all duration-300 group"
              >
                <LogIn className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>Login</span>
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Message */}
        {/* <motion.div variants={itemVariants} className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Need help?{' '}
            <Link
              href={`/${locale}/support`}
              className="text-[#FE8C00] hover:text-[#FE8C00]/80 font-medium underline underline-offset-2 transition-colors duration-300"
            >
              Contact Support
            </Link>
          </p>
        </motion.div> */}
      </motion.div>
    </div>
  );
}

export default EmailVerifiedSuccess;
