'use client';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import parse from 'html-react-parser';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Share2,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { useGetEventDetail } from '@/lib/hooks/service/common/useGetEventDetail';
import { cn } from '@/lib/utils';

interface IEventDetailProps {
  id: string;
}

const getStatusText = (status: number, t: any) => {
  switch (status) {
    case 1: {
      return t('event.status.upcoming');
    }
    case 2: {
      return t('event.status.ongoing');
    }
    case 3: {
      return t('event.status.completed');
    }
    default: {
      return t('event.status.unknown');
    }
  }
};

const getStatusColor = (status: number) => {
  switch (status) {
    case 1: {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    case 2: {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    case 3: {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
    default: {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
};

// Function to check if a string contains HTML
const containsHTML = (string_: string) => {
  return /<\/?[a-z][\s\S]*>/i.test(string_);
};

export default function EventDetail(props: IEventDetailProps) {
  const { id } = props;
  const { data, isLoading, error } = useGetEventDetail(Number(id));
  const t = useTranslations();

  if (isLoading) {
    return (
      <div className="flex h-[92dvh] w-full flex-col items-center justify-center p-6">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-center text-muted-foreground">
          {t('common.loading')}
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[92dvh] w-full items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center"
        >
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div>
            <h3 className="mb-2 text-lg font-semibold text-destructive">
              {t('event.error')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('event.errorDescription')}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Determine if detail contains HTML
  const hasHTML = data.detail ? containsHTML(data.detail) : false;

  return (
    <div className="flex h-[92dvh] w-full flex-col overflow-y-auto pb-6">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background/80 p-4 backdrop-blur-sm">
        <Link
          href="/application/event-list"
          className="rounded-full p-2 hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="flex-1 truncate text-lg font-medium">{data.title}</h1>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col"
      >
        {/* Event image */}
        <div className="relative">
          {data.image ? (
            <div className="aspect-video w-full overflow-hidden">
              <motion.img
                initial={{ scale: 1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                src={data.image}
                alt={data.title}
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex aspect-video w-full items-center justify-center bg-muted">
              <ImageIcon className="h-16 w-16 text-muted-foreground" />
            </div>
          )}

          {/* Status badge */}
          {/* <div className="absolute right-4 top-4">
            <motion.span
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={cn(
                'rounded-full border px-3 py-1 text-sm font-medium shadow-sm',
                getStatusColor(data.status)
              )}
            >
              {getStatusText(data.status, t)}
            </motion.span>
          </div> */}
        </div>

        {/* Event details */}
        <div className="p-6">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-2 text-2xl font-bold"
          >
            {data.title}
          </motion.h1>

          {/* <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(data.created_at), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(data.created_at), 'h:mm a')}</span>
            </div>
          </motion.div> */}

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {/* <h2 className="mb-2 text-lg font-semibold">
              {t('event.description')}
            </h2> */}

            {/* Conditionally render the content based on whether it contains HTML */}
            {hasHTML ? (
              <div className="event-html-content text-muted-foreground">
                {parse(data.detail)}
              </div>
            ) : (
              <p className="whitespace-pre-line text-muted-foreground">
                {data.detail}
              </p>
            )}
          </motion.div>

          {/* Share button */}
          {/* <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-8"
          >
            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg border bg-muted/50 px-4 py-3 font-medium transition-colors hover:bg-muted"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: data.title,
                    text: data.detail.replace(/<[^>]*>?/gm, ''), // Strip HTML tags for sharing
                    url: window.location.href,
                  });
                }
              }}
            >
              <Share2 className="h-5 w-5" />
              {t('common.share')}
            </button>
          </motion.div> */}
        </div>
      </motion.div>

      {/* Add styles for HTML content */}
      <style jsx global>{`
        .event-html-content {
          line-height: 1.6;
        }
        .event-html-content h1 {
          font-size: 1.8rem;
          font-weight: bold;
          margin: 1rem 0;
        }
        .event-html-content h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0.8rem 0;
        }
        .event-html-content h3 {
          font-size: 1.3rem;
          font-weight: bold;
          margin: 0.6rem 0;
        }
        .event-html-content p {
          margin-bottom: 1rem;
        }
        .event-html-content ul,
        .event-html-content ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        .event-html-content li {
          margin-bottom: 0.5rem;
        }
        .event-html-content a {
          color: #3b82f6;
          text-decoration: underline;
        }
        .event-html-content img {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
          border-radius: 0.375rem;
        }
        .event-html-content blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          font-style: italic;
          margin: 1rem 0;
        }
        .event-html-content pre {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.375rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
      `}</style>
    </div>
  );
}
