'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Flame,
  Grid3X3,
  Home,
  Package,
  Star,
  TrendingUp,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useGetCategoryList } from '@/lib/hooks/service/category/useGetCategoryList';
import { NAVIGATION_ROUTES, NavigationMenuItem } from '@/types/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Category {
  id: string;
  name: string;
  image?: string | null;
  subcategories?: Category[];
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

// Category Image Component with fallback
const CategoryImage = React.memo(
  ({
    src,
    alt,
    className = 'w-6 h-6',
  }: {
    src?: string | null;
    alt: string;
    className?: string;
  }) => {
    const [imgError, setImgError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const imageSource = src && !imgError ? src : '/food-fallback.png';

    return (
      <div
        className={`relative ${className} rounded-md overflow-hidden bg-gray-100`}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <Image
          src={imageSource}
          alt={alt}
          fill
          className="object-cover"
          sizes="24px"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImgError(true);
            setIsLoading(false);
          }}
        />
      </div>
    );
  }
);

CategoryImage.displayName = 'CategoryImage';

// Subcategory Component
const SubcategoryItem = React.memo(
  ({
    subcategory,
    onClose,
  }: {
    subcategory: Category;
    onClose: () => void;
  }) => {
    const router = useRouter();

    const handleClick = useCallback(
      (event: React.MouseEvent) => {
        event.preventDefault();
        onClose();
        router.push(`/application/category/${subcategory.id}`);
      },
      [subcategory.id, onClose, router]
    );

    return (
      <motion.div
        className="ml-8"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.2 }}
      >
        <Link
          href={`/application/category/${subcategory.id}`}
          onClick={handleClick}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
        >
          <CategoryImage
            src={subcategory.image}
            alt={subcategory.name}
            className="w-5 h-5"
          />
          <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
            {subcategory.name}
          </span>
        </Link>
      </motion.div>
    );
  }
);

SubcategoryItem.displayName = 'SubcategoryItem';

// Main Category Component
const CategoryItem = React.memo(
  ({ category, onClose }: { category: Category; onClose: () => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const router = useRouter();
    const hasSubcategories =
      category.subcategories && category.subcategories.length > 0;

    const handleCategoryClick = useCallback(
      (event: React.MouseEvent) => {
        if (hasSubcategories) {
          event.preventDefault();
          setIsExpanded(previous => !previous);
        } else {
          event.preventDefault();
          onClose();
          router.push(`/application/category/${category.id}`);
        }
      },
      [hasSubcategories, category.id, onClose, router]
    );

    return (
      <div className="w-full">
        <motion.div
          className="w-full"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href={`/application/category/${category.id}`}
            onClick={handleCategoryClick}
            className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 group w-full"
          >
            <CategoryImage src={category.image} alt={category.name} />
            <div className="flex-1">
              <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {category.name}
              </span>
            </div>
            {hasSubcategories && (
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-gray-400 group-hover:text-blue-600"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            )}
          </Link>
        </motion.div>

        {/* Subcategories */}
        <AnimatePresence>
          {hasSubcategories && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="py-2">
                {category.subcategories!.map(subcategory => (
                  <SubcategoryItem
                    key={subcategory.id}
                    subcategory={subcategory}
                    onClose={onClose}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

CategoryItem.displayName = 'CategoryItem';

// Category Section Component
const CategorySection = React.memo(({ onClose }: { onClose: () => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: categoryData, isLoading, error } = useGetCategoryList();

  const handleToggle = useCallback(() => {
    setIsExpanded(previous => !previous);
  }, []);

  return (
    <div className="w-full">
      <motion.div
        className="w-full"
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <button
          onClick={handleToggle}
          className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 group w-full text-left"
        >
          <div className="text-gray-600 group-hover:text-blue-600 transition-colors duration-200">
            <Grid3X3 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              Categories
            </span>
            <span className="block text-sm text-gray-500 group-hover:text-blue-500 transition-colors duration-200">
              Browse product categories
            </span>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-400 group-hover:text-blue-600"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </button>
      </motion.div>

      {/* Categories List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="ml-4 py-2 border-l-2 border-gray-100">
              {isLoading && (
                <div className="p-4">
                  {[1, 2, 3].map(index => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 mb-2"
                    >
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse" />
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="p-4">
                  <p className="text-sm text-red-500">
                    Failed to load categories
                  </p>
                </div>
              )}

              {categoryData?.category && categoryData.category.length > 0 && (
                <div className="space-y-1">
                  {categoryData.category.map((category: any, index: number) => (
                    <motion.div
                      key={category.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.2,
                      }}
                    >
                      <CategoryItem
                        category={{
                          id: category.id?.toString() || index.toString(),
                          name: category.name || 'Unnamed Category',
                          image: category.image,
                          subcategories:
                            category.subcategories?.map((sub: any) => ({
                              id: sub.id?.toString() || `${index}-${sub.name}`,
                              name: sub.name || 'Unnamed Subcategory',
                              image: sub.image,
                            })) || [],
                        }}
                        onClose={onClose}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {categoryData?.category && categoryData.category.length === 0 && (
                <div className="p-4">
                  <p className="text-sm text-gray-500">
                    No categories available
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

CategorySection.displayName = 'CategorySection';

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
                  {/* <p className="text-sm text-gray-500">Navigation Menu</p> */}
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
            <nav className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-2">
                {/* <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Navigation
                </h3> */}

                {/* Home Menu Item */}
                <motion.div
                  key={menuItems[0].id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.3,
                  }}
                >
                  <MenuItem item={menuItems[0]} onClose={onClose} />
                </motion.div>

                {/* Category Section - placed after Home */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.3,
                    duration: 0.3,
                  }}
                >
                  <CategorySection onClose={onClose} />
                </motion.div>

                {/* Remaining Menu Items */}
                {menuItems.slice(1).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: (index + 2) * 0.1 + 0.2,
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
