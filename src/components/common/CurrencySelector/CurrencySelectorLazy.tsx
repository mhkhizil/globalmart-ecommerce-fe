import { lazy, Suspense } from 'react';

import { Currency } from '@/lib/redux/slices/CurrencySlice';

// Lazy load the CurrencySelector component
const CurrencySelector = lazy(() => import('./CurrencySelector'));

interface CurrencySelectorLazyProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact';
}

// Loading skeleton component
const CurrencySelectorSkeleton = () => (
  <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg animate-pulse">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 bg-gray-300 rounded"></div>
      <div className="w-8 h-4 bg-gray-300 rounded"></div>
      <div className="w-3 h-3 bg-gray-300 rounded"></div>
    </div>
  </div>
);

const CurrencySelectorLazy: React.FC<CurrencySelectorLazyProps> = props => {
  return (
    <Suspense fallback={<CurrencySelectorSkeleton />}>
      <CurrencySelector {...props} />
    </Suspense>
  );
};

export default CurrencySelectorLazy;
