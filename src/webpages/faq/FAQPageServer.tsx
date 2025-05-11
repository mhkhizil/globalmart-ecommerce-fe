import axios from 'axios';
import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import FAQPageClient from './FAQPageClient';

interface FaqProps {
  locale: string;
}

interface FAQData {
  platform_name: string;
  faqs: FAQItem[];
  disclaimer: string;
}
interface FAQItem {
  id: number;
  question: string;
  answer: string;
}
const fallbackData: FAQData = {
  platform_name: 'Global Takeout',
  faqs: [
    {
      id: 1,
      question: 'What is Global Takeout?',
      answer:
        'Global Takeout is a multi-merchant marketplace where users can purchase food, physical products, and services (like appointments or rentals).',
    },
    {
      id: 2,
      question: 'How do I place an order?',
      answer:
        'Browse categories, select items, choose delivery or pickup, and complete your payment through our secure system.',
    },
    {
      id: 3,
      question: 'What payment methods are accepted?',
      answer:
        'We accept wallet payments and offline payment methods like bank transfers and cash on delivery.',
    },
  ],
  disclaimer: 'For more information, please contact support@globaltakeout.com',
};
async function fetchFAQData(locale: string) {
  try {
    // Use the locale from params to determine which JSON file to fetch

    const response = await fetch(
      `https://resources.elitestars.dev/takeout/FAQ/${locale}/wu.FAQ.json`
    ).catch(() => {
      // Silently handle network errors
      return { ok: false } as Response;
    });

    if (!response.ok) {
      // Don't throw error, just set fallback data silently
      console.debug(`Using fallback FAQ data for locale: ${locale}`);
      return fallbackData;
    }

    const data = await response.json().catch(() => {});

    return data || fallbackData;
    // if (data) {
    //   return data;
    // } else {
    //   // JSON parsing error, use fallback silently
    //   return fallbackData;
    // }
  } catch (error_) {
    // Log error but don't show to user
    console.debug('Error fetching FAQ data:', error_);
    // Use fallback data on any error
    return fallbackData;
  }
}

async function FAQPageServer(props: FaqProps) {
  let faq = await fetchFAQData(props.locale);
  return <FAQPageClient faq={faq} />;
}

export default function FAQPageServerWithSuspense(props: FaqProps) {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <FAQPageServer {...props} />
    </Suspense>
  );
}
