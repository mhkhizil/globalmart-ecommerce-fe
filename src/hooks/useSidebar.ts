'use client';

import { useCallback, useState } from 'react';

interface UseSidebarReturn {
  isOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

/**
 * Custom hook to manage sidebar state
 * Provides memoized callbacks for better performance
 */
export const useSidebar = (): UseSidebarReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openSidebar = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsOpen(previous => !previous);
  }, []);

  return {
    isOpen,
    openSidebar,
    closeSidebar,
    toggleSidebar,
  };
};
