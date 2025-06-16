'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

// Dynamically import the Sidebar component with loading skeleton
const Sidebar = dynamic(() => import('./Sidebar'), {
  loading: () => <SidebarLoadingSkeleton />,
  ssr: false,
});

interface SidebarLazyProps {
  isOpen: boolean;
  onClose: () => void;
}

// Loading skeleton component that matches the final sidebar position
const SidebarLoadingSkeleton: React.FC = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        style={{
          left: isLargeScreen ? 'calc(50vw - 215px)' : '0px',
          right: isLargeScreen ? 'calc(50vw - 215px)' : '0px',
        }}
      />

      {/* Skeleton sidebar - positioned exactly where the final sidebar will be */}
      <div
        className="fixed top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col"
        style={{
          left: isLargeScreen ? 'calc(50vw - 215px)' : '0px',
        }}
        data-testid="sidebar-loading"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
            <div>
              <div className="h-5 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="p-6 flex-1">
          <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map(index => (
              <div key={index} className="flex items-center gap-4 p-4">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * Sidebar wrapper component with loading skeleton
 * Shows skeleton in final position to prevent double animation
 */
const SidebarLazy: React.FC<SidebarLazyProps> = ({ isOpen, onClose }) => {
  // Only render when sidebar should be open
  if (!isOpen) {
    return null;
  }

  return <Sidebar isOpen={isOpen} onClose={onClose} />;
};

export default React.memo(SidebarLazy);
