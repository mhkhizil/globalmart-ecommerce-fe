'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/lib/redux/ReduxStore';
import {
  localeChangeComplete,
  syncLocaleFromCookie,
} from '@/lib/redux/slices/LanguageSlice';
import { getCookie } from '@/lib/util/cookies';

interface ClientLocaleWrapperProps {
  children: React.ReactNode;
  locale: string; // Initial locale from server
}

function supportedLocalePattern(string_: string): boolean {
  return string_?.length === 2; // Simple check for two-letter locale codes
}

export default function ClientLocaleWrapper({
  children,
  locale: initialLocale,
}: ClientLocaleWrapperProps) {
  const { locale: reduxLocale, isChanging } = useSelector(
    (state: RootState) => state.language
  );
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Record<string, any> | undefined>();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  // On first load, sync Redux state with cookie
  useEffect(() => {
    dispatch(syncLocaleFromCookie());
  }, [dispatch]);

  // When URL locale differs from Redux locale (and not in the middle of a change)
  useEffect(() => {
    if (!pathname || isChanging) return;

    const pathLocale = pathname.split('/')[1];

    // If URL locale is valid and different from redux state
    if (supportedLocalePattern(pathLocale) && pathLocale !== reduxLocale) {
      // Sync from cookie (which should match the URL)
      dispatch(syncLocaleFromCookie());
    }
  }, [pathname, reduxLocale, isChanging, dispatch]);

  // Handle URL change when Redux locale changes
  useEffect(() => {
    if (!pathname || !isChanging) return;

    const currentPathLocale = pathname.split('/')[1];

    // Only update if we need to (redux locale differs from path locale)
    if (
      reduxLocale !== currentPathLocale &&
      supportedLocalePattern(currentPathLocale)
    ) {
      try {
        // The setLocale action in LanguageSlice will handle navigation in production
        // We only need to handle dev environment here
        if (process.env.NODE_ENV !== 'production') {
          const newPathname = pathname.replace(
            /^\/([a-z]{2})(\/|$)/,
            `/${reduxLocale}$2`
          );

          if (newPathname !== pathname) {
            router.replace(newPathname, { scroll: false });
          }
        }

        // Mark locale change as complete
        dispatch(localeChangeComplete());
      } catch (error) {
        console.error('Error updating URL with locale:', error);
        dispatch(localeChangeComplete());
      }
    } else {
      // If no change needed, mark as complete
      dispatch(localeChangeComplete());
    }
  }, [reduxLocale, isChanging, pathname, router, dispatch]);

  // Load messages dynamically when locale changes
  useEffect(() => {
    const localeToUse = reduxLocale || initialLocale;

    async function loadMessages() {
      if (!localeToUse) return;

      setIsLoading(true);
      try {
        const response = await import(`@/i18n/locales/${localeToUse}.json`);
        setMessages(response.default);
      } catch (error) {
        console.error(`Failed to load messages for ${localeToUse}`, error);
        try {
          const fallbackResponse = await import('@/i18n/locales/cn.json');
          setMessages(fallbackResponse.default);
        } catch (fallbackError) {
          console.error('Failed to load fallback messages:', fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadMessages();
  }, [reduxLocale, initialLocale]);

  // Return children in all cases, since NextIntlClientProvider handles messages
  return <>{children}</>;
}
