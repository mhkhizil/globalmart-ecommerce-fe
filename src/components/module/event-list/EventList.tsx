'use client';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { useGetEventList } from '@/lib/hooks/service/common/useGetEventList';
import { cn } from '@/lib/utils';

const getStatusColor = (status: number) => {
  switch (status) {
    case 1: {
      return 'bg-green-500';
    }
    case 2: {
      return 'bg-blue-500';
    }
    case 3: {
      return 'bg-gray-500';
    }
    default: {
      return 'bg-gray-500';
    }
  }
};

const EventCardSkeleton = () => (
  <div className="group relative mb-4 overflow-hidden rounded-xl border bg-card shadow-sm">
    {/* Image section */}
    <div className="h-48 w-full animate-pulse bg-gray-200" />

    {/* Button section */}
    <div className="flex h-14 items-center justify-end bg-background px-4">
      <div className="h-8 w-32 animate-pulse rounded-lg bg-gray-200" />
    </div>
  </div>
);

const EmptyState = ({ t }: { t: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center"
  >
    <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
    <h3 className="mb-2 text-lg font-semibold">{t('event.noEvents')}</h3>
    <p className="text-sm text-muted-foreground">
      {t('event.noEventsDescription')}
    </p>
  </motion.div>
);

export default function EventList() {
  const { data, isLoading, error } = useGetEventList();
  const t = useTranslations();

  if (isLoading) {
    return (
      <div className="flex h-[92dvh] w-full flex-col overflow-y-auto p-6">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="space-y-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[92dvh] w-full items-center justify-center">
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

  if (!data?.events?.length) {
    return (
      <div className="flex h-[92dvh] w-full flex-col overflow-y-auto p-6">
        <h1 className="mb-6 text-3xl font-bold">{t('event.title')}</h1>
        <EmptyState t={t} />
      </div>
    );
  }

  return (
    <div className="flex h-[92dvh] w-full flex-col overflow-y-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">{t('event.title')}</h1>
      <div className="space-y-6">
        {data.events.map((event, index) => (
          <Link
            href={`/application/event-detail/${event.id}`}
            key={event.id}
            className="block"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group overflow-hidden rounded-xl shadow-md"
            >
              {/* Image section */}
              <div className="relative h-48 overflow-hidden">
                {/* Status indicator dot */}
                <div
                  className={cn(
                    'absolute left-4 top-4 z-10 h-3 w-3 rounded-full',
                    getStatusColor(event.status)
                  )}
                />

                {/* Event image */}
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-contain transition-transform duration-500"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <ImageIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}

                {/* Title and button overlay at bottom of image */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="font-medium text-white line-clamp-1 flex-1 pr-4">
                    {event.title}
                  </div>
                  <motion.div
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="group-hover:translate-x-1 transition-all duration-300"
                  >
                    <div className="flex items-center gap-1 text-white rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-medium shadow-sm">
                      <span>视图</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
