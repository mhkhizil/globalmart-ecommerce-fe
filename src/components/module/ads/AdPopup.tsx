'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { Dialog, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface AdPopupProps {
  /**
   * Delay in milliseconds before showing the ad popup
   * @default 3000
   */
  delay?: number;
  /**
   * The URL for the ad image
   */
  imageUrl: string;
  /**
   * Alt text for the ad image
   */
  altText?: string;
  /**
   * URL to redirect when ad is clicked
   */
  redirectUrl?: string;
  /**
   * Whether to show the ad only once per session
   * @default true
   */
  showOnce?: boolean;
  /**
   * Callback when ad is closed
   */
  onClose?: () => void;
  /**
   * Callback when ad is clicked
   */
  onClick?: () => void;
}

// Custom Dialog Content without close button
const CustomDialogContent = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogPrimitive.Content
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border-0 bg-transparent p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg w-[calc(100%-2rem)] sm:max-w-md mx-auto',
        className
      )}
      {...props}
    >
      {children}
      {/* No close button here */}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);

export function AdPopup({
  delay = 3000,
  imageUrl,
  altText = 'Advertisement',
  redirectUrl,
  showOnce = true,
  onClose,
  onClick,
}: AdPopupProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const delayTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    // Ensure we're running in the browser
    if (typeof globalThis === 'undefined') return;

    startTimeRef.current = performance.now();

    // Check if we've shown the ad before in this session
    const hasShownAd = showOnce && sessionStorage.getItem('adShown') === 'true';

    if (!hasShownAd) {
      // If delay is 0 or very small, show immediately
      if (delay <= 0) {
        setIsOpen(true);
        if (showOnce) {
          sessionStorage.setItem('adShown', 'true');
        }
        return;
      }

      // Clear any existing timer
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = undefined;
      }

      // Set up new timer with exact delay
      delayTimerRef.current = setTimeout(() => {
        const actualDelay = performance.now() - startTimeRef.current;

        setIsOpen(true);
        if (showOnce) {
          sessionStorage.setItem('adShown', 'true');
        }
      }, delay);

      return () => {
        if (delayTimerRef.current) {
          clearTimeout(delayTimerRef.current);
          delayTimerRef.current = undefined;
        }
      };
    }
  }, [delay, showOnce]);

  const handleClose = () => {
    setIsOpen(false);

    // Clear any lingering timers on close
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = undefined;
    }

    if (onClose) onClose();
  };

  const handleAdClick = () => {
    if (onClick) onClick();
    if (redirectUrl) {
      window.open(redirectUrl, '_blank');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <CustomDialogContent>
            {/* Add DialogTitle for accessibility - visually hidden */}
            <DialogTitle className="sr-only">
              {t('ads.advertisement', { name: altText })}
            </DialogTitle>

            <div className="p-4 rounded-lg overflow-hidden">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 350,
                  damping: 25,
                }}
                className="relative w-full"
              >
                {/* Ad Content */}
                <div
                  className="relative cursor-pointer overflow-hidden rounded-lg shadow-xl"
                  //onClick={handleAdClick}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  />

                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative aspect-[4/3] w-full"
                  >
                    <Image
                      src={imageUrl}
                      alt={altText}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 500px"
                      priority
                    />
                  </motion.div>

                  {/* Call to action button */}
                  <motion.div
                    className="absolute bottom-4 right-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                  >
                    <button className="bg-[#FE8C00] text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:bg-[#FE7C00] transform hover:scale-105 transition duration-300">
                      <Link href={redirectUrl || ''}>{t('ads.viewOffer')}</Link>
                    </button>
                  </motion.div>
                </div>

                {/* Close button */}
                <motion.button
                  className="absolute -right-3 -top-3 rounded-full bg-gray-100 p-1.5 text-gray-500 shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  onClick={handleClose}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  aria-label={t('common.close')}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </motion.div>
            </div>
          </CustomDialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
