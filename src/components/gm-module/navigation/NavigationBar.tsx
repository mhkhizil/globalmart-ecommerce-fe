'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CartIcon from '@/components/common/icons/CartIcon';
import EventIcon from '@/components/common/icons/EventIcon';
import HomeIcon from '@/components/common/icons/HomeIcon';
import ListIcon from '@/components/common/icons/ListIcon';
import MessageIcon from '@/components/common/icons/MessageIcon';
import PaymentMenuIcon from '@/components/common/icons/PaymentMenuIcon';
import ProfileIcon from '@/components/common/icons/ProfileIcon';
import SearchIcon from '@/components/common/icons/SearchIcon';
import SettingIcon from '@/components/common/icons/SettingIcon';
import ShopIcon from '@/components/common/icons/ShopIcon';
import WishlistIcon from '@/components/common/icons/WishlistIcon';
import {
  NavigationMenu,
  NavigationMenuDriver,
  NavigationMenuMerchant,
} from '@/lib/constants/NavigationMenu';
import { useSession } from '@/lib/hooks/session/useSession';
import { RootState } from '@/lib/redux/ReduxStore';
import {
  setIsSelected,
  setNavigationMenu,
} from '@/lib/redux/slices/NavigationBarSlice';

// Define icon types with strict typing
type IconType =
  | 'HomeIcon'
  | 'CartIcon'
  | 'MessageIcon'
  | 'ProfileIcon'
  | 'PaymentMenuIcon'
  | 'ShopIcon'
  | 'ListIcon'
  | 'EventIcon'
  | 'WishlistIcon'
  | 'SearchIcon'
  | 'SettingIcon';

// Icon map with type safety
const iconMap = {
  HomeIcon,
  CartIcon,
  MessageIcon,
  ProfileIcon,
  PaymentMenuIcon,
  ShopIcon,
  ListIcon,
  EventIcon,
  WishlistIcon,
  SearchIcon,
  SettingIcon,
} as const satisfies Record<IconType, React.FC<{ isSelected: boolean }>>;

// Navigation item interface
interface NavigationItem {
  id: string;
  label: string;
  href: string;
  iconType: IconType;
  isSelected: boolean;
}

// Main NavigationBar component
const NavigationBar: React.FC = () => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const navigationMenu = useSelector(
    (state: RootState) => state.navigationBar as NavigationItem[]
  );
  const { data: session, isLoading, error } = useSession();
  const [navigatingTo, setNavigatingTo] = useState<string | undefined>();

  // Get cart items count from Redux store
  const cartState = useSelector((state: RootState) => state.cart);
  const cartItemsCount = useMemo(() => {
    const userId = cartState.currentUserId || 'guest';
    const userCart = cartState.carts[userId];
    if (!userCart) return 0;

    return userCart.items.reduce((total, item) => total + item.quantity, 0);
  }, [cartState]);

  // Determine the target menu based on session
  const targetMenu = useMemo(() => {
    if (!session?.user) return NavigationMenu;
    return session.user.roles === 2
      ? NavigationMenuMerchant
      : session?.user?.roles === 3
        ? NavigationMenuDriver
        : NavigationMenu;
  }, [session]);

  // Sync navigation menu with session and prefetch routes
  useEffect(() => {
    if (isLoading || error) return;

    dispatch(setNavigationMenu(targetMenu));
    targetMenu.forEach(menu => router.prefetch(menu.href));
  }, [targetMenu, isLoading, error, dispatch, router]);

  // Sync active menu item with pathname
  useEffect(() => {
    if (!pathname) return;

    const currentMenu = navigationMenu.find(menu => menu.href === pathname);
    if (currentMenu && !currentMenu.isSelected) {
      dispatch(setIsSelected(currentMenu.id));
    }
  }, [pathname, navigationMenu, dispatch]);

  // Handle navigation with optimistic updates
  const handleNavigation = useCallback(
    async (item: NavigationItem) => {
      if (!pathname || pathname === item.href) return;

      setNavigatingTo(item.id); // Optimistic UI update
      dispatch(setIsSelected(item.id));

      try {
        await router.push(item.href, { scroll: false });
      } catch (navError) {
        console.error(`Failed to navigate to ${item.href}:`, navError);
        // Optionally revert state or notify user
      } finally {
        setNavigatingTo(undefined);
      }
    },
    [pathname, router, dispatch]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex w-full h-16 items-center justify-center border-t bg-white">
        <span className="text-gray-600">{t('common.loading')}</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex w-full h-16 items-center justify-center border-t bg-white">
        <span className="text-red-600">{t('navigation.unavailable')}</span>
      </div>
    );
  }

  return (
    <motion.nav
      className="flex h-16 w-full items-center justify-between border-t bg-white px-4 shadow-[0px_-1px_1px_0px_rgba(0,0,0,0.1)]"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{
        duration: 0.3,
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      aria-label="Main navigation"
    >
      {navigationMenu.map(item => (
        <NavigationItemComponent
          key={item.id}
          item={item}
          isNavigating={navigatingTo === item.id}
          onNavigate={handleNavigation}
          cartItemsCount={item.label === 'Cart' ? cartItemsCount : 0}
        />
      ))}
    </motion.nav>
  );
};

// Memoized Navigation Item Component
interface NavigationItemProps {
  item: NavigationItem;
  isNavigating: boolean;
  onNavigate: (item: NavigationItem) => void;
  cartItemsCount?: number;
}

const NavigationItemComponent = memo(
  ({
    item,
    isNavigating,
    onNavigate,
    cartItemsCount = 0,
  }: NavigationItemProps) => {
    const t = useTranslations();
    const IconComponent = iconMap[item.iconType];
    const isActive = item.isSelected || isNavigating;

    return (
      <motion.button
        type="button"
        onClick={() => onNavigate(item)}
        disabled={isNavigating}
        className={clsx(
          'flex flex-1 flex-col items-center justify-center gap-1 p-2 transition-all duration-200 ease-in-out',
          {
            'opacity-50': isNavigating && !isActive,
            'cursor-not-allowed': isNavigating,
            '-mt-6': item.label === 'Cart', // Elevate the cart button
          }
        )}
        whileHover={item.label === 'Cart' ? {} : { scale: 1.05 }}
        whileTap={item.label === 'Cart' ? {} : { scale: 0.95 }}
        aria-label={t('navigation.itemLabel', {
          name: t(`navigation.${item.label.toLowerCase()}`),
        })}
        aria-current={isActive ? 'page' : undefined}
      >
        <div className="relative">
          <IconComponent isSelected={isActive} />
          {item.label === 'Cart' && cartItemsCount > 0 && (
            <span className="absolute -top-2 right-0 flex h-5 w-5 min-w-5 items-center justify-center rounded-full bg-[#FE8C00] text-[10px] font-bold text-white">
              {cartItemsCount > 99 ? '99+' : cartItemsCount}
            </span>
          )}
        </div>
        <span
          className={clsx('text-xs font-medium tracking-[0.033em]', {
            'text-[#FE8C00]': isActive,
            'text-black': !isActive,
          })}
        >
          {t(`navigation.${item.label.toLowerCase()}`)}
        </span>
      </motion.button>
    );
  }
);

NavigationItemComponent.displayName = 'NavigationItemComponent';

export default NavigationBar;
