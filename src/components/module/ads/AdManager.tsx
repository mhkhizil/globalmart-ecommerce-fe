'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { PromotionListResponseDto } from '@/core/dtos/promotion/PromotionListResponseDto';
import { useGetPromoList } from '@/lib/hooks/service/promotion/useGetPromoList';

import { AdPopup } from './AdPopup';
import { useAds } from './useAds';

interface Ad {
  id: string;
  imageUrl: string;
  altText: string;
  redirectUrl?: string;
}

/**
 * Display strategy for showing ads
 */
export type AdDisplayStrategy =
  | 'random' // Show a single random ad once (default)
  | 'sequential' // Show ads one after another when closed
  | 'rotation'; // Show ads on a timer, rotating through the list

interface AdManagerProps {
  /**
   * Delay in milliseconds before showing the ad popup
   * @default 3000
   */
  delay?: number;
  /**
   * Whether to show the ad only once per session
   * @default true
   */
  showOnce?: boolean;
  /**
   * Enable/disable ads
   * If not provided, will use the value from useAds hook
   */
  enabled?: boolean;
  /**
   * Callback when ad is closed
   */
  onAdClosed?: () => void;
  /**
   * Callback when ad is clicked
   */
  onAdClicked?: (adId: string) => void;
  /**
   * Use custom ads data instead of sample data
   */
  customAds?: Ad[];
  /**
   * Strategy for displaying ads
   * @default 'random'
   */
  displayStrategy?: AdDisplayStrategy;
  /**
   * Time interval (in milliseconds) for rotating ads (only used with 'rotation' strategy)
   * @default 30000 (30 seconds)
   */
  rotationInterval?: number;
  /**
   * Delay between sequential ads in milliseconds (only used with 'sequential' strategy)
   * @default 2000 (2 seconds)
   */
  sequentialDelay?: number;
  /**
   * Whether to loop back to the first ad after showing all ads in sequential mode
   * @default false
   */
  sequentialLoop?: boolean;
  /**
   * Pre-fetched promotions data to use as ads
   * If provided, component won't fetch data again
   */
  promotionsData?: PromotionListResponseDto;
  /**
   * Loading state if promotions are being fetched externally
   */
  isPromotionsLoading?: boolean;
  /**
   * Error state if promotions fetching failed externally
   */
  promotionsError?: Error | null;
}

/**
 * AdManager Component - Manages the display of ads throughout the application
 */
export function AdManager({
  delay = 3000,
  showOnce = true,
  enabled,
  onAdClosed,
  onAdClicked,
  customAds,
  displayStrategy = 'random',
  rotationInterval = 30_000,
  sequentialDelay = 2000,
  sequentialLoop = false,
  promotionsData,
  isPromotionsLoading,
  promotionsError,
}: AdManagerProps) {
  const [currentAd, setCurrentAd] = useState<Ad | undefined>();
  const [adIndex, setAdIndex] = useState<number>(0);
  const [shouldShowAd, setShouldShowAd] = useState<boolean>(false);
  const [sequenceCompleted, setSequenceCompleted] = useState<boolean>(false);
  const rotationTimer = useRef<NodeJS.Timeout | undefined>(undefined);
  const sequentialTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [processedAds, setProcessedAds] = useState<Ad[]>([]);

  // Only fetch data if it wasn't provided via props
  const {
    data: adsData,
    isLoading: isAdsLoading,
    error: adsError,
  } = useGetPromoList(promotionsData ? { type: '' } : { type: 'ads' }, {
    // Skip the query if promotions data is already provided
    enabled: !promotionsData,
  });

  // Determine the actual data, loading and error states
  const data = promotionsData || adsData;
  const isLoading =
    isPromotionsLoading === undefined ? isAdsLoading : isPromotionsLoading;
  const error = promotionsError || adsError;

  // Track when ad was closed for precise sequential timing
  const adClosedTimeRef = useRef<number>(0);

  const adsHook = useAds();
  const { trackAdClick, trackAdImpression } = adsHook;

  // Force enable ads for testing
  const shouldShowAds = enabled === undefined ? true : enabled;

  // Process fetched ad data when it arrives
  useEffect(() => {
    // console.log('AdManager: API data received:', data);
    // console.log('AdManager: API error:', error);

    if (data && data.promotion && data.promotion.length > 0) {
      // Map API response to Ad interface
      const mappedAds = data.promotion.map(promo => ({
        id: promo.id.toString(),
        imageUrl: promo.image,
        altText: promo.name,
        redirectUrl: `/application/product/detail/${promo.p_id}`, // Create a simple redirect path
      }));

      // console.log('AdManager: Using API data:', mappedAds);
      setProcessedAds(mappedAds);
    } else if (customAds && customAds.length > 0) {
      // If API data is not available but custom ads are provided via props
      //console.log('AdManager: Using custom ads:', customAds);
      setProcessedAds(customAds);
    } else {
      // No ads to show
      //console.log('AdManager: No ads available from API or props');
      setProcessedAds([]);
    }
  }, [data, customAds, error]);

  // Clear sessionStorage and timers on mount
  useEffect(() => {
    if (typeof globalThis !== 'undefined') {
      sessionStorage.removeItem('adShown');
    }

    // Reset sequence completed state
    setSequenceCompleted(false);

    // Clear any existing timers on mount and unmount
    return () => {
      if (rotationTimer.current) {
        clearInterval(rotationTimer.current);
        rotationTimer.current = undefined;
      }

      if (sequentialTimerRef.current) {
        clearTimeout(sequentialTimerRef.current);
        sequentialTimerRef.current = undefined;
      }
    };
  }, []);

  // Initialize ad based on display strategy
  useEffect(() => {
    if (typeof globalThis === 'undefined') return;
    if (!shouldShowAds || processedAds.length === 0) return;
    if (displayStrategy === 'sequential' && sequenceCompleted) return;

    // Only select an ad if we haven't already shown one this session (if showOnce is true)
    const hasShownAd = showOnce && sessionStorage.getItem('adShown') === 'true';

    if (hasShownAd) return;

    // Handle different display strategies
    switch (displayStrategy) {
      case 'random': {
        // Get a random ad from our collection
        const randomIndex = Math.floor(Math.random() * processedAds.length);
        setCurrentAd(processedAds[randomIndex]);
        setShouldShowAd(true);
        break;
      }

      case 'sequential': {
        // Start with the first ad
        setAdIndex(0);
        setCurrentAd(processedAds[0]);
        setShouldShowAd(true);
        break;
      }

      case 'rotation': {
        // Start with the first ad and set up rotation
        setAdIndex(0);
        setCurrentAd(processedAds[0]);
        setShouldShowAd(true);

        // Set up rotation timer
        rotationTimer.current = setInterval(() => {
          setAdIndex(previousIndex => {
            const nextIndex = (previousIndex + 1) % processedAds.length;
            setCurrentAd(processedAds[nextIndex]);
            setShouldShowAd(true);
            return nextIndex;
          });
        }, rotationInterval);

        return () => {
          if (rotationTimer.current) {
            clearInterval(rotationTimer.current);
            rotationTimer.current = undefined;
          }
        };
      }
    }
  }, [
    shouldShowAds,
    showOnce,
    processedAds,
    displayStrategy,
    rotationInterval,
    sequenceCompleted,
  ]);

  // Track ad impression when ad changes
  useEffect(() => {
    if (currentAd) {
      trackAdImpression(currentAd.id);
    }
  }, [currentAd, trackAdImpression]);

  // Function to show the next ad in sequence with precise timing
  const showNextSequentialAd = useCallback(
    (nextIndex: number) => {
      // Clear any existing timer
      if (sequentialTimerRef.current) {
        clearTimeout(sequentialTimerRef.current);
        sequentialTimerRef.current = undefined;
      }

      if (nextIndex >= processedAds.length) {
        // If sequentialLoop is true, go back to the first ad
        if (sequentialLoop) {
          // Set next ad index to 0 (first ad)
          setAdIndex(0);
          setCurrentAd(processedAds[0]);

          // Schedule showing the ad after exact delay
          const startTime = performance.now();

          sequentialTimerRef.current = setTimeout(() => {
            setShouldShowAd(true);
          }, sequentialDelay);
        } else {
          // Mark sequence as completed
          setSequenceCompleted(true);

          // Mark ads as shown for this session if showOnce is true
          if (showOnce) {
            sessionStorage.setItem('adShown', 'true');
          }
        }
      } else {
        // Show the next ad after precise delay

        // Update ad index and current ad immediately
        setAdIndex(nextIndex);
        setCurrentAd(processedAds[nextIndex]);

        // Schedule showing the ad after exact delay
        const startTime = performance.now();

        sequentialTimerRef.current = setTimeout(() => {
          setShouldShowAd(true);
        }, sequentialDelay);
      }
    },
    [processedAds, sequentialDelay, sequentialLoop, showOnce]
  );

  const handleAdClick = () => {
    if (!currentAd) return;

    // Track ad click
    trackAdClick(currentAd.id);

    // Call external callback if provided
    if (onAdClicked) {
      onAdClicked(currentAd.id);
    }
  };

  const handleAdClose = () => {
    setShouldShowAd(false);

    // Record the exact time when ad was closed (for sequential timing)
    adClosedTimeRef.current = performance.now();

    // Handle sequential display - show next ad when current one is closed
    if (displayStrategy === 'sequential') {
      const nextIndex = adIndex + 1;
      showNextSequentialAd(nextIndex);
    }

    if (onAdClosed) {
      onAdClosed();
    }
  };

  // If ads are still loading, don't show anything yet
  if (isLoading) {
    return;
  }

  // If no ads available from API or props, don't render anything
  if (processedAds.length === 0) {
    return;
  }

  // If no ad is selected or ads are disabled, don't render anything
  if (!currentAd || !shouldShowAds || !shouldShowAd || sequenceCompleted) {
    return;
  }

  return (
    <AdPopup
      imageUrl={currentAd.imageUrl}
      altText={currentAd.altText}
      redirectUrl={currentAd.redirectUrl}
      delay={displayStrategy === 'sequential' && adIndex > 0 ? 0 : delay}
      showOnce={showOnce}
      onClose={handleAdClose}
      onClick={handleAdClick}
    />
  );
}
