import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import Input from '@/components/common/Input';
import Loader from '@/components/common/loader/Loader';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PaymentMethodDetail } from '@/core/dtos/payment/list/PaymentListResponseDto';
import { PaymentMethodList } from '@/lib/constants/PaymentMethod';
import { useAddMerchantPayment } from '@/lib/hooks/service/payment/useAddMerchantPayment';
import { useUpdateMerchantPayment } from '@/lib/hooks/service/payment/useUpdateMerchantPayment';

// Define validation schema using Zod
const paymentFormSchema = z.object({
  payment_method: z.string().min(1, { message: 'Payment method is required' }),
  account_no: z.string().min(1, { message: 'Account number is required' }),
  account_name: z.string().min(1, { message: 'Account name is required' }),
  status: z.enum(['Active', 'Inactive']),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentFormProps {
  initialData: PaymentMethodDetail | undefined;
  isUpdateMode: boolean;
  merchantId: number;
}

function PaymentForm({
  initialData,
  isUpdateMode,
  merchantId,
}: PaymentFormProps) {
  const t = useTranslations();
  const queryClient = useQueryClient();

  // Form setup with validation
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    setValue,
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      payment_method: '',
      account_no: '',
      account_name: '',
      status: 'Active',
    },
  });

  // Add payment mutation
  const { mutateAsync: addPayment, isPending: isAddingPayment } =
    useAddMerchantPayment({
      onSuccess: () => {
        toast.success(t('payment.paymentMethodAddedSuccessfully'));
        resetForm();
        queryClient.invalidateQueries({
          queryKey: ['get-payment-by-merchantid'],
        });
      },
      onError: error => {
        //console.error('Failed to add payment method:', error);
        toast.error(t('payment.unableToAddPaymentMethod'));
      },
    });

  // Update payment mutation
  const { mutateAsync: updatePayment, isPending: isUpdatingPayment } =
    useUpdateMerchantPayment({
      onSuccess: () => {
        toast.success(t('payment.paymentMethodUpdatedSuccessfully'));
        resetForm();
        queryClient.invalidateQueries({
          queryKey: ['get-payment-by-merchantid'],
        });
      },
      onError: error => {
        console.error('Failed to update payment method:', error);
        toast.error(t('payment.unableToUpdatePaymentMethod'));
      },
    });

  // Combined loading state
  const isLoading = isAddingPayment || isUpdatingPayment;

  // Reset form helper
  const resetForm = useCallback(() => {
    reset({
      payment_method: '',
      account_no: '',
      account_name: '',
      status: 'Active',
    });
  }, [reset]);

  // Form submission handler
  const onSubmit = useCallback(
    async (formData: PaymentFormValues) => {
      if (!merchantId) {
        toast.error(t('payment.merchantIdRequired'));
        return;
      }

      try {
        await (isUpdateMode && initialData
          ? updatePayment({
              id: initialData.id.toString(),
              data: {
                ...formData,
                merchant_id: merchantId,
              },
            })
          : addPayment({
              ...formData,
              merchant_id: merchantId,
            }));
      } catch {
        // Error handling is in the mutation callbacks
      }
    },
    [isUpdateMode, initialData, updatePayment, addPayment, merchantId, t]
  );

  // Initialize form with initial data when in update mode
  useEffect(() => {
    if (initialData) {
      setValue('payment_method', initialData.payment_method);
      setValue('account_no', initialData.account_no);
      setValue('account_name', initialData.account_name);
      setValue('status', initialData.status as 'Active' | 'Inactive');
    }
  }, [initialData, setValue]);

  // Payment method options
  const paymentMethodOptions = useMemo(
    () =>
      PaymentMethodList.map(method => ({
        value: method.id,
        label: method.name,
      })),
    []
  );

  return (
    <form className="flex w-full flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-[14px]">
        <span className="text-[0.8rem]">{t('payment.paymentMethod')}</span>
        <Controller
          name="payment_method"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                className={clsx(
                  'w-full h-[45px] rounded-[8px] focus:outline-none focus:ring-0 focus:ring-offset-0',
                  { 'border-red-500': errors.payment_method }
                )}
              >
                <SelectValue placeholder={t('payment.chooseMethod')} />
              </SelectTrigger>
              <SelectContent>
                {paymentMethodOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.payment_method && (
          <p className="text-red-500 text-xs mt-1">
            {errors.payment_method.message}
          </p>
        )}
      </div>

      <div className="mb-[14px]">
        <span className="text-[0.8rem]">{t('payment.accountNo')}</span>
        <Input
          label={t('payment.accNo')}
          {...register('account_no')}
          className={clsx(
            'py-[16px] h-[45px] focus:outline-gray-500 border-[#D6D6D6] border-[1px]',
            { 'border-red-500': errors.account_no }
          )}
        />
        {errors.account_no && (
          <p className="text-red-500 text-xs mt-1">
            {errors.account_no.message}
          </p>
        )}
      </div>

      <div className="mb-[14px]">
        <span className="text-[0.8rem]">{t('payment.accountName')}</span>
        <Input
          label={t('payment.accName')}
          {...register('account_name')}
          className={clsx(
            'py-[16px] h-[45px] focus:outline-gray-500 border-[#D6D6D6] border-[1px]',
            { 'border-red-500': errors.account_name }
          )}
        />
        {errors.account_name && (
          <p className="text-red-500 text-xs mt-1">
            {errors.account_name.message}
          </p>
        )}
      </div>

      <div className="mb-[14px]">
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Active" id="status-active" />
                <label htmlFor="status-active">{t('payment.active')}</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Inactive" id="status-inactive" />
                <label htmlFor="status-inactive">{t('payment.inactive')}</label>
              </div>
            </RadioGroup>
          )}
        />
      </div>

      <div className="flex w-full mt-[0.5rem] mb-[1.5rem]">
        <button
          type="submit"
          disabled={isLoading || (!isDirty && isUpdateMode)}
          className={clsx(
            'rounded-[5px] py-[8px] min-h-[40px] w-full text-[14px] font-semibold leading-[20px] text-white transition-colors',
            {
              'bg-[#FE8C00] hover:bg-[#e07e00]':
                !isLoading && (isDirty || !isUpdateMode),
              'bg-[#FE8C00]/70 cursor-not-allowed':
                isLoading || (!isDirty && isUpdateMode),
            }
          )}
        >
          {isLoading ? (
            <Loader />
          ) : isUpdateMode ? (
            t('payment.update')
          ) : (
            t('payment.confirm')
          )}
        </button>
      </div>
    </form>
  );
}

export default PaymentForm;
