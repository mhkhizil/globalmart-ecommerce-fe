'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQData {
  platform_name: string;
  faqs: FAQItem[];
  disclaimer: string;
}

// Fallback data in case fetching fails
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

interface FaqData {
  faq: any;
}

export default function FAQ(props: FaqData) {
  const [faqData, setFaqData] = useState<FAQData | undefined>();
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | undefined>();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const t = useTranslations('application.faq');

  // useEffect(() => {
  //   async function fetchFAQData() {
  //     try {
  //       setLoading(true);
  //       // Use the locale from params to determine which JSON file to fetch
  //       const response = await fetch(
  //         `https://resources.elitestars.dev/takeout/FAQ/${locale}/FAQ.json`
  //       ).catch(() => {
  //         // Silently handle network errors
  //         return { ok: false } as Response;
  //       });

  //       if (!response.ok) {
  //         // Don't throw error, just set fallback data silently
  //         console.debug(`Using fallback FAQ data for locale: ${locale}`);
  //         setFaqData(fallbackData);
  //         return;
  //       }

  //       const data = await response.json().catch(() => {});
  //       if (data) {
  //         setFaqData(data);
  //       } else {
  //         // JSON parsing error, use fallback silently
  //         setFaqData(fallbackData);
  //       }
  //     } catch (error_) {
  //       // Log error but don't show to user
  //       console.debug('Error fetching FAQ data:', error_);
  //       // Use fallback data on any error
  //       setFaqData(fallbackData);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchFAQData();
  // }, [locale]);

  useEffect(() => {
    if (props.faq) {
      setFaqData(props.faq);
    }
  }, [props]);

  console.log(faqData);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? undefined : index);
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!faqData) {
    return <div className="hidden"></div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header Section */}
      <motion.div
        className="bg-primary text-black py-8 px-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">
          {t('frequently_asked_questions')}
        </h1>
        <p className="text-black/80 max-w-2xl mx-auto">{t('faq_subtitle')}</p>
      </motion.div>

      {/* FAQ Section */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          {faqData.faqs?.map((faq, index) => (
            <motion.div
              key={faq.id}
              className={`border-b border-gray-100 last:border-none ${
                openIndex === index ? 'bg-gray-50' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="flex w-full items-center justify-between p-5 text-left focus:outline-none"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {faq.question}
                </h3>
                <span className="ml-2 flex-shrink-0 text-primary">
                  {openIndex === index ? (
                    <FiChevronUp size={20} />
                  ) : (
                    <FiChevronDown size={20} />
                  )}
                </span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-gray-600">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Disclaimer */}
        {faqData.disclaimer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 text-sm text-gray-500 p-4 bg-gray-100 rounded-lg"
          >
            <p>{faqData.disclaimer}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
