import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import CurrencySelectorLazy from '@/components/common/CurrencySelector/CurrencySelectorLazy';
import { useSidebar } from '@/hooks/useSidebar';
import { useSession } from '@/lib/hooks/session/useSession';

import Logo from './Logo';
import SidebarLazy from './SidebarLazy';

// Generate a consistent color based on username
const getProfileColor = (name: string) => {
  let hash = 0;
  for (let index = 0; index < name.length; index++) {
    const codePoint = name.codePointAt(index) || 0;
    hash = codePoint + ((hash << 5) - hash);
  }

  // Generate hue between 0 and 360
  const hue = hash % 360;
  // Use a pleasing saturation and lightness
  return `hsl(${hue}, 65%, 55%)`;
};

function HomeNav() {
  const { data: sessionData, isLoading } = useSession();
  const [imgError, setImgError] = useState(false);
  const { isOpen: isSidebarOpen, openSidebar, closeSidebar } = useSidebar();

  // Get the user's display name for the tooltip
  const userDisplayName = useMemo(() => {
    if (isLoading) return 'Loading...';
    if (!sessionData?.user) return 'Guest';
    return sessionData.user.name || sessionData.user.email || 'User';
  }, [sessionData, isLoading]);

  // Prepare the first letter and background color for the avatar
  const userName = useMemo(() => {
    if (!sessionData?.user) return '';
    return sessionData.user.name || sessionData.user.email || 'User';
  }, [sessionData]);

  const firstLetter = useMemo(() => {
    return userName ? userName.charAt(0).toUpperCase() : '';
  }, [userName]);

  const backgroundColor = useMemo(() => {
    return userName ? getProfileColor(userName) : '';
  }, [userName]);

  const renderProfileImage = () => {
    // Show loading skeleton
    if (isLoading) {
      return <div className="w-full h-full bg-gray-200 animate-pulse" />;
    }

    // If session data doesn't exist, show fallback image
    if (!sessionData?.user) {
      return (
        <div className="relative w-full h-full">
          <Image
            src="/assets/profile-image.png"
            alt="Profile"
            fill
            className="object-cover"
            priority
          />
        </div>
      );
    }

    // If user has an image and no loading error occurred, show it
    if (sessionData.user.image && !imgError) {
      return (
        <div className="relative w-full h-full">
          <Image
            src={sessionData.user.image}
            alt={userName}
            fill
            className="object-cover"
            priority
            onError={() => setImgError(true)}
          />
        </div>
      );
    }

    // Otherwise, show first letter of user's name in a colored circle
    return (
      <div
        className="w-full h-full flex items-center justify-center text-white text-xl font-semibold"
        style={{ backgroundColor }}
      >
        {firstLetter}
      </div>
    );
  };

  return (
    <motion.nav
      className="bg-transparent w-full h-[56px] flex items-center justify-between relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hamburger Menu */}
      <motion.div
        className="w-8 h-8 bg-[#F2F2F2] rounded-full flex items-center justify-center cursor-pointer"
        whileTap={{ scale: 0.95 }}
        onClick={openSidebar}
        role="button"
        aria-label="Open navigation menu"
        tabIndex={0}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openSidebar();
          }
        }}
      >
        <Image
          src="/assets/menu-icon-inner.svg"
          alt="Menu"
          width={14}
          height={14}
          className="pointer-events-none"
        />
      </motion.div>

      {/* Logo and Name */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Logo size={32} />
        <Link href="/">
          <h1 className="text-[#4392F9] font-bold text-lg font-['Libre_Caslon_Text']">
            Global Marts
          </h1>
        </Link>
      </motion.div>

      {/* Currency Select */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <CurrencySelectorLazy variant="compact" size="sm" />
      </motion.div>

      {/* Profile Image with Tooltip */}
      <div className="relative group">
        <motion.div
          className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
          whileHover={isLoading ? {} : { scale: 1.05 }}
          whileTap={isLoading ? {} : { scale: 0.95 }}
        >
          {renderProfileImage()}
        </motion.div>

        {/* Tooltip */}
        <div className="absolute right-0 top-full mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
          {userDisplayName}
        </div>
      </div>

      {/* Sidebar Component */}
      <SidebarLazy isOpen={isSidebarOpen} onClose={closeSidebar} />
    </motion.nav>
  );
}

export default HomeNav;
