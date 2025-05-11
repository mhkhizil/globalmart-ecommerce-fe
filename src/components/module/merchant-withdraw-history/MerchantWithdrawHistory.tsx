'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDown,
  Calendar,
  CircleDollarSign,
  History,
  Image as ImageIcon,
  Info,
  RefreshCw,
  Wallet,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { MerchantWithdrawData } from '@/core/dtos/merchant/MerchantWithdrawDto';
import { useGetMerchantWithdrawHistory } from '@/lib/hooks/service/merchant/useGetMerchantWithdrawHistory';
import { useSession } from '@/lib/hooks/session/useSession';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

// Format date helper
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
}

// Format currency helper
function formatCurrency(amount: string): string {
  try {
    const numberAmount = Number.parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numberAmount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return 'Invalid amount';
  }
}

// Loading skeleton component
const LoadingState = () => {
  const t = useTranslations('application.merchant_withdraw_history');
  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map(index => (
          <Skeleton key={index} className="w-full h-24 rounded-lg" />
        ))}
      </div>
    </div>
  );
};

// Empty state component
const EmptyState = () => {
  const t = useTranslations('application.merchant_withdraw_history');
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center w-full py-10 px-4 space-y-4 text-center"
    >
      <History className="h-16 w-16 text-neutral-300" />
      <h3 className="text-xl font-semibold text-neutral-700">
        {t('noWithdrawals')}
      </h3>
      <p className="text-neutral-500 max-w-md">{t('noData')}</p>
    </motion.div>
  );
};

// Error state component
const ErrorState = ({ onRetry }: { onRetry: () => void }) => {
  const t = useTranslations('application.merchant_withdraw_history');
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center w-full py-10 px-4 space-y-4 text-center"
    >
      <div className="p-4 rounded-full bg-red-50">
        <Info className="h-12 w-12 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-neutral-700">{t('noData')}</h3>
      <p className="text-neutral-500 max-w-md">{t('noWithdrawals')}</p>
      <Button onClick={onRetry} className="mt-2" variant="outline">
        <RefreshCw className="mr-2 h-4 w-4" />
        {t('retry')}
      </Button>
    </motion.div>
  );
};

// Withdraw History Item component
const WithdrawHistoryItem = ({
  item,
  onClick,
}: {
  item: MerchantWithdrawData;
  onClick: () => void;
}) => {
  const t = useTranslations('application.merchant_withdraw_history');

  return (
    <motion.div variants={itemVariants} layout>
      <Card
        className="mb-3 overflow-hidden border-neutral-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <div className="p-2 rounded-full bg-blue-50">
                  <Wallet className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-neutral-800">
                  {item.remark || t('withdrawAmount')}
                </span>
                <div className="flex items-center mt-1 text-xs text-neutral-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(item.created_at)}
                </div>
                <div className="flex items-center mt-1 text-xs text-neutral-600">
                  <span className="text-neutral-500 mr-2">{t('id')}:</span>
                  {item.id}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-semibold text-blue-600">
                {formatCurrency(item.withdraw_amount)}
              </span>
              {item.merchant_withdraw_image &&
                item.merchant_withdraw_image.length > 0 && (
                  <div className="mt-1 flex text-xs items-center text-neutral-500">
                    <ImageIcon className="h-3 w-3 mr-1" />
                    {item.merchant_withdraw_image.length} {t('image')}
                  </div>
                )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Detail dialog component
const WithdrawDetailDialog = ({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: MerchantWithdrawData | undefined;
}) => {
  const t = useTranslations('application.merchant_withdraw_history');
  const [selectedImage, setSelectedImage] = useState<string | undefined>();

  if (!data) return;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <h2 className="text-xl font-semibold">{t('detail')}</h2>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">{t('id')}</span>
              <span className="font-medium">{data.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">{t('withdrawAmount')}</span>
              <span className="font-medium text-blue-600">
                {formatCurrency(data.withdraw_amount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">{t('actualWallet')}</span>
              <span className="font-medium">
                {formatCurrency(data.actual_wallet)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">{t('completedWallet')}</span>
              <span className="font-medium">
                {formatCurrency(data.completed_wallet)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">{t('createdAt')}</span>
              <span className="font-medium">{formatDate(data.created_at)}</span>
            </div>
            {data.remark && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">{t('remark')}</span>
                <span className="font-medium">{data.remark}</span>
              </div>
            )}
          </div>

          {data.merchant_withdraw_image &&
            data.merchant_withdraw_image.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">{t('image')}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {data.merchant_withdraw_image.map(img => (
                    <div
                      key={img.id}
                      className="relative aspect-square rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border border-neutral-200"
                      onClick={() => setSelectedImage(img.image)}
                    >
                      <img
                        src={img.image}
                        alt={`Withdraw ${data.id} image`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          <div className="pt-2">
            <Button variant="outline" className="w-full" onClick={onClose}>
              {t('close')}
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Full screen image dialog */}
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(undefined)}
        >
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            <div className="relative h-[80vh]">
              <img
                src={selectedImage}
                alt="Enlarged image"
                className="w-full h-full object-contain"
              />
              <Button
                variant="outline"
                className="absolute top-4 right-4"
                onClick={() => setSelectedImage(undefined)}
              >
                {t('close')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
};

export default function MerchantWithdrawHistory() {
  const { data: session } = useSession();
  const t = useTranslations('application.merchant_withdraw_history');
  const [selectedItem, setSelectedItem] = useState<
    MerchantWithdrawData | undefined
  >();

  const {
    data: withdrawHistory,
    isLoading,
    isError,
    refetch,
  } = useGetMerchantWithdrawHistory(
    {
      merchant_id: session?.user.merchant_id || 0,
    },
    {
      enabled: !!session?.user.merchant_id,
    }
  );

  const hasData = useMemo(() => {
    return withdrawHistory && withdrawHistory.length > 0;
  }, [withdrawHistory]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleItemClick = useCallback((item: MerchantWithdrawData) => {
    setSelectedItem(item);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setSelectedItem(undefined);
  }, []);

  return (
    <div className="flex w-full h-[100dvh] overflow-y-auto pb-[2rem] flex-col px-[24px] pt-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <History className="h-5 w-5 text-blue-600" />
          <h1 className="text-2xl font-bold text-neutral-800">{t('title')}</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center"
        >
          <RefreshCw
            className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`}
          />
          {t('refresh')}
        </Button>
      </div>

      <p className="text-neutral-500 mb-6">{t('subtitle')}</p>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingState />
          </motion.div>
        ) : isError ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ErrorState onRetry={handleRefresh} />
          </motion.div>
        ) : hasData ? (
          <motion.div
            key="content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {withdrawHistory?.map(item => (
              <WithdrawHistoryItem
                key={item.id}
                item={item}
                onClick={() => handleItemClick(item)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyState />
          </motion.div>
        )}
      </AnimatePresence>

      <WithdrawDetailDialog
        isOpen={!!selectedItem}
        onClose={handleCloseDialog}
        data={selectedItem}
      />
    </div>
  );
}
