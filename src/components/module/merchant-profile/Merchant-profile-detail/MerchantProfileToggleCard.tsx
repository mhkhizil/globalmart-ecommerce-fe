import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { useSession } from '@/lib/hooks/session/useSession';
import { maskInput } from '@/lib/util/mask-words';

interface InputProps {
  description: string;
}

const FlipTabs = (props: InputProps) => {
  const { data: sessionData } = useSession();
  const [selectedTab, setSelectedTab] = useState<'shop' | 'owner'>('shop');

  const cardVariants = {
    initial: {
      rotateX: 90,
      opacity: 0,
      transition: { duration: 0.2 },
    },
    animate: {
      rotateX: 0,
      opacity: 1,
      transition: { duration: 0.2 },
    },
    exit: {
      rotateX: -90,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="container mx-auto min-h-[15rem]">
      {/* Tab Buttons */}
      <div className="relative flex w-full mb-[0.5rem] bg-gray-200 rounded-lg overflow-hidden">
        {/* Animated Background */}
        <motion.div
          className="absolute top-0 left-0 w-1/2 h-full bg-[#FE8C00] rounded-lg"
          initial={{ x: '0%' }}
          animate={{ x: selectedTab === 'shop' ? '0%' : '100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />

        <button
          className={clsx(
            'relative z-10 px-4 w-full py-2  font-semibold transition-all duration-300',
            {
              'text-white': selectedTab === 'shop',
              'text-gray-400': selectedTab !== 'shop',
            }
          )}
          onClick={() => setSelectedTab('shop')}
        >
          Shop
        </button>
        <button
          className={clsx(
            'relative z-10 px-4 w-full py-2  font-semibold transition-all duration-300',
            {
              'text-white': selectedTab === 'owner',
              'text-gray-400': selectedTab !== 'owner',
            }
          )}
          onClick={() => setSelectedTab('owner')}
        >
          Owner
        </button>
      </div>

      {/* Card Container */}
      <div className="relative  h-[6rem]">
        <AnimatePresence mode="wait">
          {selectedTab === 'shop' && (
            <motion.div
              key="shop"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute rounded-[10px] my-[1rem] bg-gray-300/50 shadow-md p-[1rem] min-h-[10rem] h-[10rem] overflow-y-auto flex w-full flex-col"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <span className="text-[1rem] text-black font-[600]">About</span>
              <span className="text-[0.8rem] leading-[1.4rem] text-black/50 font-[400]">
                {props.description || 'No Decription for this shop.'}
              </span>
            </motion.div>
          )}

          {selectedTab === 'owner' && (
            <motion.div
              key="owner"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute rounded-[10px] my-[1rem] gap-y-1 bg-gray-300/50 shadow-md p-[1rem] min-h-[10rem] h-[10rem] flex w-full flex-col"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="flex flex-col justify-start items-start">
                <span className="text-black font-[600] text-[1rem]">
                  Name&nbsp;{' '}
                </span>
                <span className="text-[0.8rem] text-gray-500">
                  {sessionData?.user?.name}
                </span>
              </div>
              <div className="flex flex-col justify-start items-start">
                <span className="text-black font-[600] text-[1rem]">
                  Email&nbsp;{' '}
                </span>
                <span className="text-[0.8rem] text-gray-500">
                  {maskInput(sessionData?.user?.email || '')}
                </span>
              </div>
              <div className="flex flex-col justify-start items-start">
                <span className="text-black font-[600] text-[1rem]">
                  Phone&nbsp;{' '}
                </span>
                <span className="text-[0.8rem] text-gray-500">
                  {maskInput(sessionData?.user?.phone || '')}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FlipTabs;
