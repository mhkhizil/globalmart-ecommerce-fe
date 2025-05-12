import Image from 'next/image';
import { motion } from 'framer-motion';

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

export default function SplashScreen() {
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
