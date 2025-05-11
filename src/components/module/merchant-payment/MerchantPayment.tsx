'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Toaster } from 'react-hot-toast';

import BackIcon from '@/components/common/icons/BackIcon';
import { PaymentMethodDetail } from '@/core/dtos/payment/list/PaymentListResponseDto';
import { useGetPaymentListByMerchantId } from '@/lib/hooks/service/payment/useGetPaymentList';
import { useSession } from '@/lib/hooks/session/useSession';

import PaymentCard from './PaymentCard';
import PaymentForm from './PaymentForm';

function MerchantPayment() {
  const t = useTranslations();
  const router = useRouter();
  const { data: sessionData } = useSession();
  const merchantId = sessionData?.user?.merchant_id;

  // Fetch payment methods
  const {
    data: paymentList,
    isLoading,
    isError,
    error,
  } = useGetPaymentListByMerchantId(merchantId, {
    enabled: !!merchantId,
  });

  // State management
  const [editCardData, setEditCardData] = useState<PaymentMethodDetail>();
  const [isUpdateMode, setIsUpdateMode] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<number | undefined>();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Handlers
  const onSelectHandler = useCallback((id: number) => {
    setSelectedPayment(previousId => (previousId === id ? undefined : id));
  }, []);

  const scrollToTop = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, []);

  const onEditHandler = useCallback(
    (id: number) => {
      if (!paymentList?.payment) return;

      const paymentMethod = paymentList.payment.find(
        payment => payment.id === id
      );
      if (paymentMethod) {
        setEditCardData(paymentMethod);
        setIsUpdateMode(true);
        scrollToTop();
      }
    },
    [paymentList?.payment, scrollToTop]
  );

  // Reset edit mode when payment list changes (e.g. after successful update)
  useEffect(() => {
    if (!isUpdateMode) {
      setEditCardData(undefined);
    }
  }, [paymentList, isUpdateMode]);

  // Error handling
  if (isError && error) {
    console.error('Failed to load payment methods:', error);
  }

  return (
    <div
      className="flex w-full flex-col h-[93dvh] overflow-y-auto"
      ref={scrollRef}
    >
      <Toaster />

      {/* Header */}
      <div className="flex relative w-full px-[1.5rem] items-center justify-center mt-[1.5rem]">
        <div className="absolute left-3">
          <button
            onClick={() => router.back()}
            aria-label={t('common.back')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <BackIcon />
          </button>
        </div>
        <div>
          <h1 className="text-[#101010] text-[16px] leading-[24px] font-semibold">
            {t('payment.payment')}
          </h1>
        </div>
      </div>

      {/* Payment Form */}
      <div className="flex w-full mt-[1.5rem] px-[1.5rem]">
        <PaymentForm
          initialData={editCardData}
          isUpdateMode={isUpdateMode}
          merchantId={merchantId}
        />
      </div>

      {/* Divider */}
      <div className="flex w-full border-t-[1px] border-gray-300 mb-[1rem]"></div>

      {/* Payment Methods List */}
      <div className="flex w-full px-[1.5rem] mb-[1rem]">
        <h2 className="text-[1.5rem] leading-[1.5rem] font-[600]">
          {t('payment.selectPaymentMethod')}
        </h2>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-y-2 mb-[1.5rem] px-[1.5rem]">
        {isLoading && (
          <div className="flex w-full items-center justify-center py-8">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-16 bg-gray-200 rounded w-full"></div>
                <div className="h-16 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        )}

        {!isLoading &&
          paymentList?.payment &&
          paymentList.payment.length > 0 &&
          paymentList.payment.map(payment => (
            <div className="w-full" key={`payment-${payment.id}`}>
              <PaymentCard
                props={payment}
                onSelect={onSelectHandler}
                onEdit={onEditHandler}
                selected={selectedPayment === payment.id}
              />
            </div>
          ))}

        {!isLoading &&
          (!paymentList?.payment || paymentList.payment.length === 0) && (
            <div className="flex w-full items-center justify-center text-gray-400 py-8">
              {t('payment.noPaymentAvailable')}
            </div>
          )}

        {isError && (
          <div className="flex w-full items-center justify-center text-red-500 py-8">
            {t('payment.errorLoadingPayments')}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(MerchantPayment);
