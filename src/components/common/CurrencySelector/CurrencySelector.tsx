import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { memo, useCallback, useMemo, useRef, useState } from 'react';

import { useCurrency } from '@/lib/hooks/store/useCurrency';
import {
  Currency,
  currencyInfo,
  supportedCurrencies,
} from '@/lib/redux/slices/CurrencySlice';

import { useClickOutside } from '../../../lib/hooks/useClickOutside';

interface CurrencySelectorProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact';
}

const CurrencySelector = memo<CurrencySelectorProps>(
  ({ className = '', showLabel = false, size = 'md', variant = 'default' }) => {
    const { selectedCurrency, isChanging, changeCurrency } = useCurrency();

    // If no currency is selected yet (during hydration), show USD as default
    const currentCurrencyCode = selectedCurrency || 'USD';
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Close dropdown when clicking outside
    useClickOutside(dropdownRef, () => setIsOpen(false));

    // Memoized current currency info
    const currentCurrency = useMemo(() => {
      return currencyInfo[currentCurrencyCode];
    }, [currentCurrencyCode]);

    // Memoized available currencies (excluding the selected one)
    const availableCurrencies = useMemo(() => {
      return supportedCurrencies
        .filter(currency => currency !== currentCurrencyCode)
        .map(currency => currencyInfo[currency]);
    }, [currentCurrencyCode]);

    // Handle currency selection
    const handleCurrencySelect = useCallback(
      (currency: Currency) => {
        try {
          if (currency !== currentCurrencyCode && !isChanging) {
            changeCurrency(currency);
            setIsOpen(false);
          }
        } catch (error) {
          console.warn('Error changing currency:', error);
          setIsOpen(false);
        }
      },
      [currentCurrencyCode, isChanging, changeCurrency]
    );

    // Toggle dropdown
    const toggleDropdown = useCallback(() => {
      if (!isChanging) {
        setIsOpen(previous => !previous);
      }
    }, [isChanging]);

    // Size-based styling
    const sizeStyles = useMemo(() => {
      switch (size) {
        case 'sm': {
          return {
            button: 'px-2 py-1 text-xs',
            flag: 'text-sm',
            symbol: 'text-xs',
            dropdown: 'text-xs',
          };
        }
        case 'lg': {
          return {
            button: 'px-4 py-3 text-base',
            flag: 'text-xl',
            symbol: 'text-base',
            dropdown: 'text-base',
          };
        }
        default: {
          return {
            button: 'px-3 py-2 text-sm',
            flag: 'text-base',
            symbol: 'text-sm',
            dropdown: 'text-sm',
          };
        }
      }
    }, [size]);

    const buttonContent = useMemo(() => {
      if (variant === 'compact') {
        return (
          <>
            <span className={`${sizeStyles.flag} mr-1`}>
              {currentCurrency.flag}
            </span>
            <span className={`font-medium ${sizeStyles.symbol}`}>
              {currentCurrency.symbol}
            </span>
          </>
        );
      }

      return (
        <>
          <span className={`${sizeStyles.flag} mr-2`}>
            {currentCurrency.flag}
          </span>
          <span className={`font-medium ${sizeStyles.symbol} mr-1`}>
            {currentCurrency.code}
          </span>
          {showLabel && (
            <span className="text-gray-600 text-xs hidden sm:inline">
              ({currentCurrency.name})
            </span>
          )}
        </>
      );
    }, [variant, currentCurrency, sizeStyles, showLabel]);

    return (
      <div className={`relative inline-block ${className}`} ref={dropdownRef}>
        {/* Trigger Button */}
        <motion.button
          type="button"
          onClick={toggleDropdown}
          disabled={isChanging}
          className={`
          ${sizeStyles.button}
          bg-white border border-gray-200 rounded-lg
          flex items-center gap-1
          hover:border-gray-300 hover:shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          ${isOpen ? 'border-blue-500 shadow-sm' : ''}
        `}
          whileTap={{ scale: isChanging ? 1 : 0.98 }}
          aria-label={`Current currency: ${currentCurrency.name}`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          {buttonContent}
          <ChevronDown
            className={`
            w-4 h-4 text-gray-400 transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}
          `}
          />
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`
              absolute top-full mt-1 right-0 z-50
              min-w-[160px] bg-white border border-gray-200 rounded-lg shadow-lg
              ${sizeStyles.dropdown}
            `}
              role="listbox"
              aria-label="Currency options"
            >
              {availableCurrencies.map(currency => (
                <motion.button
                  key={currency.code}
                  type="button"
                  onClick={() => handleCurrencySelect(currency.code)}
                  className={`
                  w-full px-3 py-2 text-left
                  flex items-center gap-2
                  hover:bg-gray-50 hover:text-blue-600
                  focus:outline-none focus:bg-blue-50 focus:text-blue-600
                  transition-colors duration-150
                  first:rounded-t-lg last:rounded-b-lg
                `}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  role="option"
                  aria-selected={false}
                >
                  <span className={sizeStyles.flag}>{currency.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{currency.code}</span>
                    <span className="text-xs text-gray-500 leading-none">
                      {currency.name}
                    </span>
                  </div>
                  <span className="ml-auto font-medium text-gray-400">
                    {currency.symbol}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

CurrencySelector.displayName = 'CurrencySelector';

export default CurrencySelector;
