import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/lib/redux/ReduxStore';
import {
  Currency,
  currencyChangeComplete,
  setCurrency,
  syncCurrencyFromCookie,
} from '@/lib/redux/slices/CurrencySlice';

export const useCurrency = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCurrency, isChanging } = useSelector(
    (state: RootState) => state.currency
  );

  // Sync currency from cookie on component mount
  useEffect(() => {
    dispatch(syncCurrencyFromCookie());
  }, [dispatch]);

  // Handle currency change completion
  useEffect(() => {
    if (isChanging) {
      const timer = setTimeout(() => {
        dispatch(currencyChangeComplete());
      }, 300); // Small delay for smooth transitions

      return () => clearTimeout(timer);
    }
  }, [isChanging, dispatch]);

  const changeCurrency = useCallback(
    (currency: Currency) => {
      dispatch(setCurrency(currency));
    },
    [dispatch]
  );

  return {
    selectedCurrency,
    isChanging,
    changeCurrency,
  };
};
