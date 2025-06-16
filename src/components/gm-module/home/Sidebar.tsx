'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Flame, Home, Package, Star, TrendingUp, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { NAVIGATION_ROUTES, NavigationMenuItem } from '@/types/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems: NavigationMenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: NAVIGATION_ROUTES.HOME,
    icon: <Home className="w-5 h-5" />,
    description: 'Go to homepage',
  },
  {
    id: 'trending',
    label: 'Trending',
    href: NAVIGATION_ROUTES.TRENDING,
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Explore trending products',
  },
  {
    id: 'deal-of-the-day',
    label: 'Deal of the Day',
    href: NAVIGATION_ROUTES.DEAL_OF_THE_DAY,
    icon: <Flame className="w-5 h-5" />,
    description: "Today's special offers",
  },
  {
    id: 'new-arrival',
    label: 'New Arrival',
    href: NAVIGATION_ROUTES.NEW_ARRIVAL,
    icon: <Package className="w-5 h-5" />,
    description: 'Latest products',
  },
];

// Sidebar overlay component for backdrop
const SidebarOverlay = React.memo(
  ({
    onClose,
    isLargeScreen,
  }: {
    onClose: () => void;
    isLargeScreen: boolean;
  }) => (
    <motion.div
      className="fixed inset-0 bg-black/40 z-40"
      style={{
        left: isLargeScreen ? 'calc(50vw - 215px)' : '0px',
        right: isLargeScreen ? 'calc(50vw - 215px)' : '0px',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
      onClick={onClose}
      data-testid="sidebar-overlay"
    />
  )
);

SidebarOverlay.displayName = 'SidebarOverlay';

// Individual menu item component
const MenuItem = React.memo(
  ({ item, onClose }: { item: NavigationMenuItem; onClose: () => void }) => {
    const router = useRouter();

    const handleClick = useCallback(
      (event: React.MouseEvent) => {
        event.preventDefault();
        onClose();
        router.push(item.href);
      },
      [item.href, onClose, router]
    );

    return (
      <motion.div
        className="w-full"
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link
          href={item.href}
          onClick={handleClick}
          className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 group w-full"
          data-testid={`menu-item-${item.id}`}
        >
          <div className="text-gray-600 group-hover:text-blue-600 transition-colors duration-200">
            {item.icon}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              {item.label}
            </span>
            <span className="text-sm text-gray-500 group-hover:text-blue-500 transition-colors duration-200">
              {item.description}
            </span>
          </div>
        </Link>
      </motion.div>
    );
  }
);

MenuItem.displayName = 'MenuItem';

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  // Check if we're on a large screen
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <SidebarOverlay onClose={onClose} isLargeScreen={isLargeScreen} />

          <motion.aside
            className="fixed top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col"
            style={{
              left: isLargeScreen ? 'calc(50vw - 215px)' : '0px',
            }}
            initial={{
              x: 0,
              opacity: 1,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: isLargeScreen ? 0 : '-100%',
              opacity: 0,
            }}
            transition={{
              x: {
                type: 'tween',
                ease: 'easeOut',
                duration: isLargeScreen ? 0 : 0.3,
              },
              opacity: {
                duration: 0.25,
                ease: 'easeOut',
              },
            }}
            data-testid="sidebar"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Global Marts
                  </h2>
                  <p className="text-sm text-gray-500">Navigation Menu</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-lg hover:bg-gray-100"
                data-testid="close-sidebar-button"
              >
                <X className="w-4 h-4" />
                <span className="sr-only">Close sidebar</span>
              </Button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Navigation
                </h3>
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.1 + 0.2,
                      duration: 0.3,
                    }}
                  >
                    <MenuItem item={item} onClose={onClose} />
                  </motion.div>
                ))}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-500">© 2024 Global Marts</p>
                <p className="text-xs text-gray-400 mt-1">Version 1.0.0</p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default React.memo(Sidebar);
