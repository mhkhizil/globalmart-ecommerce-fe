'use client';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import OnboardingPageSlider from '@/components/module/onboarding/slider';
import { getOnboardingSlides } from '@/lib/constants/onboarding';

function OnboardingPageClient() {
  const router = useRouter();
  const locale = useLocale();
  const navigateTo = (path: string) => {
    try {
      router.push(`/${locale}${path}`);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback
      globalThis.location.href = `/${locale}${path}`;
    }
  };
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = useTranslations();
  const slides = getOnboardingSlides(t);

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
