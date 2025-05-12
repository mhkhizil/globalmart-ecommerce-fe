'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import OnboardingPageSlider from '@/components/module/onboarding/slider';
import { getOnboardingSlides } from '@/lib/constants/onboarding';

function OnboardingPageClient() {
  const router = useRouter();
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = useTranslations();
  const slides = getOnboardingSlides(t);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 7000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  const navigateTo = (path: string) => {
    try {
      router.push(`/${locale}${path}`);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback
      globalThis.location.href = `/${locale}${path}`;
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  const textVariants = {
    enter: {
      y: 20,
      opacity: 0,
    },
    center: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: -20,
      opacity: 0,
    },
  };

  const logoVariants = {
    initial: {
      scale: 0.8,
      opacity: 0,
      rotateY: 180,
    },
    animate: {
      scale: 1,
      opacity: 1,
      y: [0, -20, 0],
      rotateY: 0,
      transition: {
        scale: {
          duration: 0.5,
          ease: 'easeOut',
        },
        opacity: {
          duration: 0.5,
          ease: 'easeOut',
        },
        rotateY: {
          duration: 1.2,
          ease: [0.6, -0.05, 0.01, 0.99],
        },
        y: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      },
    },
    exit: {
      scale: 1.2,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: 'easeIn',
      },
    },
  };

  const whirlwindVariants = {
    animate: {
      rotate: [0, 360],
      transition: {
        duration: 8,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  };

  const petalVariants = {
    initial: {
      opacity: 0,
      scale: 0,
    },
    animate: (i: number) => ({
      opacity: [0, 0.8, 0],
      scale: [0, 1, 0],
      x: [
        Math.cos(i * 30) * 50,
        Math.cos(i * 30 + 180) * 200,
        Math.cos(i * 30 + 360) * 50,
      ],
      y: [
        Math.sin(i * 30) * 50,
        Math.sin(i * 30 + 180) * 200,
        Math.sin(i * 30 + 360) * 50,
      ],
      rotate: [0, 720],
      transition: {
        duration: 6,
        repeat: Infinity,
        delay: i * 0.1,
        ease: 'easeInOut',
      },
    }),
  };

  const Petal = ({ index }: { index: number }) => (
    <motion.div
      custom={index}
      variants={petalVariants}
      initial="initial"
      animate="animate"
      className="absolute"
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="relative w-4 h-6">
        <div className="absolute inset-0 bg-red-500/60 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] transform rotate-45 blur-[0.5px]" />
        <div className="absolute inset-0 bg-red-400/40 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] transform rotate-45 scale-90" />
        <div className="absolute inset-0 bg-red-300/30 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] transform rotate-45 scale-75" />
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="relative w-[90%] h-full">
          <motion.div
            variants={whirlwindVariants}
            animate="animate"
            className="absolute inset-0"
          >
            {/* Petals */}
            {[...Array(24)].map((_, i) => (
              <Petal key={i} index={i} />
            ))}
          </motion.div>

          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={logoVariants}
            className="relative w-full h-full"
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px',
            }}
          >
            <Image
              src="/images/logo.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-white flex flex-col justify-center items-center">
      {/* Background image container with specific styling */}
      <div className="w-[90%] h-[40%] relative">
        <AnimatePresence initial={false} custom={currentSlide} mode="wait">
          <motion.div
            key={currentSlide}
            custom={currentSlide}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="w-full h-full absolute inset-0"
          >
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              width={100}
              height={100}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentSlide}
          variants={textVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center text-center mt-6 px-4"
        >
          <h1 className="text-2xl font-bold mb-2">
            {slides[currentSlide].title}
          </h1>
          <p className="text-gray-600 max-w-md">
            {slides[currentSlide].description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Very subtle overlay for better readability if needed */}
      <div className="absolute inset-0 bg-black bg-opacity-5 z-10"></div>

      {/* Content container */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between items-center">
        {/* Top section for any future content */}
        <div className="w-full p-6 flex justify-between items-center">
          <p className="text-red-500 text-lg font-bold">{currentSlide + 1}/3</p>
          <p
            onClick={() => navigateTo('/application/home')}
            className="text-red-500 text-lg font-bold cursor-pointer hover:opacity-80"
          >
            Skip
          </p>
        </div>

        {/* Bottom section with slider */}
        <div className="w-full px-2 pb-6">
          <OnboardingPageSlider onSlideChange={setCurrentSlide} />
        </div>
      </div>
    </div>
  );
}

export default OnboardingPageClient;
