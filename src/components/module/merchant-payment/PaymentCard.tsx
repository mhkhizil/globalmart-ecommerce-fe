import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { memo, useCallback, useEffect, useState } from 'react';

import { Switch } from '@/components/ui/switch';
import { PaymentMethodDetail } from '@/core/dtos/payment/list/PaymentListResponseDto';
import { PaymentMethodList } from '@/lib/constants/PaymentMethod';
import { useUpdateMerchantPayment } from '@/lib/hooks/service/payment/useUpdateMerchantPayment';
import { maskInput } from '@/lib/util/mask-words';

interface PaymentCardProps {
  props: PaymentMethodDetail;
  onSelect: (id: number) => void;
  onEdit: (id: number) => void;
  selected: boolean;
}

const PaymentCard = memo(
  ({ props, onSelect, onEdit, selected }: PaymentCardProps) => {
    const [status, setStatus] = useState<string>(props.status);
    const queryClient = useQueryClient();
    const t = useTranslations('merchant_payment_card');
    const { mutateAsync: updatePayment, isPending } = useUpdateMerchantPayment({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['get-payment-by-merchantid'],
        });
      },
      onError: error => {
        console.error('Failed to update payment status:', error);
        // Revert UI state on error
        setStatus(props.status);
      },
    });

    useEffect(() => {
      if (props) {
        setStatus(props.status);
      }
    }, [props]);

    const onStatusChange = useCallback(async () => {
      try {
        const newStatus = props.status === 'Active' ? 'Inactive' : 'Active';
        setStatus(newStatus); // Optimistic update

        await updatePayment({
          id: props.id.toString(),
          data: {
            ...props,
            status: newStatus,
          },
        });
      } catch {
        // Error handling is in the mutation options
      }
    }, [props, updatePayment]);

    const handleEdit = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        onEdit(props.id);
      },
      [props.id, onEdit]
    );

    const handleStatusToggle = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        if (!isPending) {
          onStatusChange();
        }
      },
      [onStatusChange, isPending]
    );

    const handleCardClick = useCallback(() => {
      onSelect(props.id);
    }, [props.id, onSelect]);

    // Find payment method details
    const paymentMethod = PaymentMethodList.find(
      method => method.id === props.payment_method
    );

    return (
      <div
        className={clsx(
          'flex relative w-full h-[95px] flex-col p-[0.8rem] border-[1px] rounded-[5px] transition-colors duration-200',
          {
            'bg-[#eeeefd] border-[#7670a9] text-[#6559c8] shadow-md': selected,
            'hover:border-[#7670a9] cursor-pointer': !selected,
          }
        )}
        onClick={handleCardClick}
        role="button"
        aria-pressed={selected}
      >
        <div className="flex w-full h-full items-start justify-between">
          <div className="flex gap-x-3">
            <div
              className={clsx(
                'w-[60px] h-full p-[0.5rem] bg-white rounded-[5px]',
                {
                  'shadow-md': selected,
                }
              )}
            >
              <Image
                src={paymentMethod?.url || '/fallback-payment-icon.png'}
                alt={props.account_name || 'Payment method'}
                width={256}
                height={256}
                className="w-full h-full rounded-[5px] object-contain"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col">
              <span
                className={clsx('text-[1.2rem] font-[600]', {
                  'text-[#786fde]': selected,
                  'text-gray-400': !selected,
                })}
              >
                {paymentMethod?.name || 'Unknown Method'}
              </span>
              <span
                className={clsx('text-[1rem]', {
                  'text-[#786fde]': selected,
                  'text-gray-400': !selected,
                })}
              >
                {props.account_name}
              </span>
              <span
                className={clsx('text-[0.8rem]', {
                  'text-[#786fde]': selected,
                  'text-gray-400': !selected,
                })}
              >
                {maskInput(props.account_no)}
              </span>
            </div>
          </div>
          <div className="flex flex-col h-full items-center">
            <Switch
              className="data-[state=checked]:bg-[#FE8C00]"
              color="#FE8C00"
              onClick={handleStatusToggle}
              checked={status === 'Active'}
              disabled={isPending}
              aria-label={`Toggle ${props.payment_method} status`}
            />
            <button
              onClick={handleEdit}
              className="flex h-full items-end justify-end cursor-pointer p-[0.5rem] hover:text-[#FE8C00] transition-colors"
              aria-label={`Edit ${props.payment_method}`}
            >
              {t('edit')}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

PaymentCard.displayName = 'PaymentCard';

export default PaymentCard;
