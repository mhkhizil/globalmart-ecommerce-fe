import { AnimatePresence, motion } from 'framer-motion';
import { Edit, Plus, QrCode, Trash2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { FileUpload } from '@/components/common/FileUpload';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAddMerchantPaymentV2 } from '@/lib/hooks/service/payment/useAddMerchantPayment';
import { useGetPaymentListByMerchantId } from '@/lib/hooks/service/payment/useGetPaymentList';
import { useUpdateMerchantPaymentV2 } from '@/lib/hooks/service/payment/useUpdateMerchantPayment';
import { useSession } from '@/lib/hooks/session/useSession';

interface MerchantPaymentV2FormProps {
  merchant_id: string;
  payment_method: string;
  account_no: string;
  account_name: string;
  status: string;
  type: 'Myanmar' | 'Chinese' | 'International';
  image: File;
}

interface PaymentItem {
  id: number;
  payment_method: string;
  account_no: string;
  account_name: string;
  merchant_id: number;
  status: string;
  type: string;
  image: string;
  created_at: string;
  updated_at: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

const typeOptions = [
  { value: 'Myanmar', label: 'Myanmar' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'International', label: 'International' },
];

const paymentMethodsByType: Record<
  'Myanmar' | 'Chinese' | 'International',
  Array<{ value: string; label: string }>
> = {
  Myanmar: [
    { value: 'Aya_Bank_Account', label: 'Aya Bank Account' },
    { value: 'KBZ_Bank_Account', label: 'KBZ Bank Account' },
    { value: 'CB_Bank_Account', label: 'CB Bank Account' },
    { value: 'UAB_Bank_Account', label: 'UAB Bank Account' },
    { value: 'CBPAY', label: 'CBPAY' },
    { value: 'KPAY', label: 'KPAY' },
    { value: 'AYAPAY', label: 'AYAPAY' },
    { value: 'WaveMoney', label: 'WaveMoney' },
    { value: 'TrueMoney', label: 'TrueMoney' },
  ],
  Chinese: [
    { value: 'AliPay', label: 'AliPay' },
    { value: 'WechatPay', label: 'WechatPay' },
  ],
  International: [
    { value: 'Crypto', label: 'Crypto' },
    { value: 'Stripe', label: 'Stripe' },
    { value: 'Paypal', label: 'Paypal' },
    { value: 'Skrill', label: 'Skrill' },
  ],
};

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
];

// Move getStatusBadgeColor to outer scope
const getStatusBadgeColor = (status: string) => {
  return status === 'Active'
    ? 'bg-green-100 text-green-800'
    : 'bg-gray-100 text-gray-800';
};

export const MerchantPaymentV2 = () => {
  const { data: session } = useSession();
  const { mutate: addPaymentV2, isPending: isAddingPaymentV2 } =
    useAddMerchantPaymentV2();
  const { mutate: updatePaymentV2, isPending: isUpdatingPaymentV2 } =
    useUpdateMerchantPaymentV2();
  const {
    data: paymentList,
    isLoading: isLoadingPaymentList,
    refetch,
  } = useGetPaymentListByMerchantId(session?.user?.merchant_id, {
    enabled: !!session?.user?.merchant_id,
  });
  const t = useTranslations();

  const [selectedPayment, setSelectedPayment] = useState<
    PaymentItem | undefined
  >();
  const [qrImage, setQrImage] = useState<File | undefined>();
  const [selectedType, setSelectedType] = useState<
    'Myanmar' | 'Chinese' | 'International'
  >('Myanmar');
  const [fileUploadKey, setFileUploadKey] = useState<number>(0);

  // Add error state for tracking rendering errors
  const [renderError, setRenderError] = useState<string | undefined>();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm<MerchantPaymentV2FormProps>({
    defaultValues: {
      merchant_id: session?.user?.merchant_id || '',
      payment_method: '',
      account_no: '',
      account_name: '',
      status: 'active',
      type: 'Myanmar',
    },
  });

  // Register the fields we're handling manually
  useEffect(() => {
    register('type', { required: 'Payment type is required' });
    register('payment_method', { required: 'Payment method is required' });
  }, [register]);

  // Watch the type field to update payment method options
  const watchType = watch('type');

  // Update selected type when type changes in the form
  useEffect(() => {
    if (watchType) {
      setSelectedType(watchType);
    }
  }, [watchType]);

  // Update merchant_id when session changes
  useEffect(() => {
    if (session?.user?.merchant_id) {
      setValue('merchant_id', session.user.merchant_id);
    }
  }, [session, setValue]);

  // Set form values when a payment is selected
  useEffect(() => {
    if (selectedPayment) {
      // Set merchant_id and form fields that don't depend on cascading dropdowns
      setValue('merchant_id', selectedPayment.merchant_id.toString());
      setValue('account_no', selectedPayment.account_no);
      setValue('account_name', selectedPayment.account_name);
      setValue('status', selectedPayment.status);

      // Handle the payment type
      let paymentType: 'Myanmar' | 'Chinese' | 'International' = 'Myanmar';
      if (
        selectedPayment.type === 'Myanmar' ||
        selectedPayment.type === 'Chinese' ||
        selectedPayment.type === 'International'
      ) {
        paymentType = selectedPayment.type;
      }

      // Update type in both form and state
      setValue('type', paymentType);
      setSelectedType(paymentType);

      // After a brief delay to ensure type selection has processed
      setTimeout(() => {
        // Get available payment methods for the selected type
        const availablePaymentMethods = paymentMethodsByType[paymentType].map(
          option => option.value
        );

        // Check if the selected payment's method is in available options
        if (availablePaymentMethods.includes(selectedPayment.payment_method)) {
          setValue('payment_method', selectedPayment.payment_method);
        } else {
          // If not available, try to find a partial match
          const paymentMethod = selectedPayment.payment_method
            .replaceAll('-', '_')
            .replaceAll(/\s+/g, '_');
          const similarOption = availablePaymentMethods.find(
            option =>
              option.toLowerCase().includes(paymentMethod.toLowerCase()) ||
              paymentMethod.toLowerCase().includes(option.toLowerCase())
          );

          if (similarOption) {
            setValue('payment_method', similarOption);
          } else {
            // If no match found, set to first available option for this type
            if (availablePaymentMethods.length > 0) {
              setValue('payment_method', availablePaymentMethods[0]);
            } else {
              setValue('payment_method', '');
            }
          }
        }
      }, 100);
    }
  }, [selectedPayment, setValue]);

  const onSubmit = async (data: MerchantPaymentV2FormProps) => {
    // Only require image for new payments, not for updates
    if (!qrImage && !selectedPayment) {
      alert(t('merchantPaymentV2.pleaseUploadQRImage'));
      return;
    }

    const formData = new FormData();
    formData.append('merchant_id', data.merchant_id);
    formData.append('payment_method', data.payment_method);
    formData.append('account_no', data.account_no);
    formData.append('account_name', data.account_name);
    formData.append('status', data.status);
    formData.append('type', data.type);

    // Only append image if a new one is uploaded
    if (qrImage) {
      formData.append('image', qrImage);
    }

    if (selectedPayment) {
      updatePaymentV2(
        {
          id: selectedPayment.id.toString(),
          data: formData,
        },
        {
          onSuccess: () => {
            handleClearForm();
            refetch();
          },
        }
      );
    } else {
      addPaymentV2(formData, {
        onSuccess: () => {
          handleClearForm();
          refetch();
        },
      });
    }
  };

  const handleClearForm = () => {
    reset({
      merchant_id: session?.user?.merchant_id || '',
      payment_method: '',
      account_no: '',
      account_name: '',
      status: 'active',
      type: 'Myanmar',
    });
    setSelectedPayment(undefined);
    setQrImage(undefined);
    setSelectedType('Myanmar');
    setFileUploadKey(previousKey => previousKey + 1);
  };

  // Wrap the handleSelectPayment function in a try/catch to handle potential DOM errors
  const handleSelectPayment = (payment: PaymentItem) => {
    try {
      setSelectedPayment(payment);
    } catch (error) {
      console.error('Error selecting payment:', error);
      setRenderError(
        'Failed to select payment. Please try refreshing the page.'
      );
    }
  };

  const handleQrImageUpload = (files: File[]) => {
    if (files.length > 0) {
      setQrImage(files[0]);
    }
  };

  // Create a safe rendering function for motion components
  const safeRenderPaymentItem = (payment: PaymentItem) => {
    // Check if key elements exist before rendering
    if (!payment || !payment.id) return;

    try {
      return (
        <motion.div
          key={payment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="cursor-pointer"
          onClick={() => handleSelectPayment(payment)}
        >
          <Card
            className={`overflow-hidden ${selectedPayment?.id === payment.id ? 'ring-2 ring-neutral-900' : ''}`}
          >
            <div className="grid grid-cols-3 md:grid-cols-4">
              <div className="flex justify-center items-center p-4 bg-neutral-50">
                <div className="w-28 h-28 flex items-center justify-center">
                  <img
                    src={payment.image}
                    alt={`${payment.payment_method} ${t('merchantPaymentV2.qrCode')}`}
                    className="max-w-full max-h-full object-contain rounded"
                    onError={event => {
                      // Handle image load errors gracefully
                      event.currentTarget.src =
                        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+';
                    }}
                  />
                </div>
              </div>
              <div className="col-span-2 md:col-span-3 p-4">
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium text-lg capitalize">
                      {payment.payment_method.replace('_', ' ')}
                    </h3>
                    <Badge className={getStatusBadgeColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 space-y-1 text-sm text-neutral-700">
                  <p>
                    <span className="font-medium">
                      {t('merchantPaymentV2.account')}:
                    </span>{' '}
                    {payment.account_no}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t('merchantPaymentV2.name')}:
                    </span>{' '}
                    {payment.account_name}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t('merchantPaymentV2.type')}:
                    </span>{' '}
                    {payment.type}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      );
    } catch (error) {
      console.error('Error rendering payment item:', error);
      return (
        <Card key={`fallback-${payment.id}`} className="p-4 border-red-100">
          <p className="text-sm text-red-500">
            {t('merchantPaymentV2.errorDisplayingPayment')}
          </p>
        </Card>
      );
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {renderError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
          {renderError}
        </div>
      )}
      <div className="flex flex-col gap-8">
        {/* Payment Form Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full"
        >
          <Card className="w-full shadow-md border-neutral-200">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>
                  {selectedPayment
                    ? t('merchantPaymentV2.updatePaymentMethod')
                    : t('merchantPaymentV2.addPaymentMethod')}
                </span>
                {selectedPayment && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearForm}
                    className="text-neutral-500 hover:text-neutral-700"
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <motion.div variants={itemVariants}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('merchantPaymentV2.paymentType')}
                    </label>
                    <Select
                      value={selectedType}
                      onValueChange={(
                        value: 'Myanmar' | 'Chinese' | 'International'
                      ) => {
                        setSelectedType(value);
                        setValue('type', value);
                        // Don't reset payment method automatically when editing
                        // Only clear it if we're not in edit mode or if the payment method
                        // isn't valid for the new type
                        if (selectedPayment) {
                          // Check if current payment method is valid for new type
                          const availableMethods = paymentMethodsByType[
                            value
                          ].map(opt => opt.value);
                          const currentMethod = watch('payment_method');
                          if (
                            currentMethod &&
                            !availableMethods.includes(currentMethod)
                          ) {
                            setValue('payment_method', '');
                          }
                        } else {
                          setValue('payment_method', '');
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t('merchantPaymentV2.selectPaymentType')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {typeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.type.message}
                      </p>
                    )}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('merchantPaymentV2.paymentMethod')}
                    </label>
                    <Select
                      value={watch('payment_method') || undefined}
                      onValueChange={(value: string) => {
                        setValue('payment_method', value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t(
                            'merchantPaymentV2.selectPaymentMethod'
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethodsByType[selectedType].map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.payment_method && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.payment_method.message}
                      </p>
                    )}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Controller
                    name="account_no"
                    control={control}
                    rules={{
                      required: t('merchantPaymentV2.accountNumberRequired'),
                    }}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {t('merchantPaymentV2.accountNumber')}
                        </label>
                        <Input
                          {...field}
                          placeholder={t(
                            'merchantPaymentV2.enterAccountNumber'
                          )}
                        />
                        {errors.account_no && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.account_no.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Controller
                    name="account_name"
                    control={control}
                    rules={{
                      required: t('merchantPaymentV2.accountNameRequired'),
                    }}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {t('merchantPaymentV2.accountName')}
                        </label>
                        <Input
                          {...field}
                          placeholder={t('merchantPaymentV2.enterAccountName')}
                        />
                        {errors.account_name && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.account_name.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-2 gap-4"
                >
                  <Controller
                    name="status"
                    control={control}
                    rules={{ required: t('merchantPaymentV2.statusRequired') }}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {t('merchantPaymentV2.status')}
                        </label>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || undefined}
                          disabled={false}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t('merchantPaymentV2.selectStatus')}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(option => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.status && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.status.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <QrCode className="size-4" />
                      {t('merchantPaymentV2.qrCodeImage')}
                      {selectedPayment && (
                        <span className="ml-1 text-xs text-neutral-500">
                          {t('merchantPaymentV2.uploadOnlyIfUpdate')}
                        </span>
                      )}
                    </label>
                    <FileUpload
                      key={fileUploadKey}
                      onFileUpload={handleQrImageUpload}
                      accept="image/jpeg, image/jpg, image/png"
                      multiple={false}
                      className={errors.image ? 'border-red-500' : ''}
                    />
                    {qrImage && (
                      <p className="text-xs text-green-600">
                        {t('merchantPaymentV2.newImageSelected')}
                      </p>
                    )}
                    {selectedPayment && !qrImage && (
                      <p className="text-xs text-neutral-500">
                        {t('merchantPaymentV2.leaveEmptyToKeepExisting')}
                      </p>
                    )}
                    {!selectedPayment && !qrImage && (
                      <p className="text-xs text-neutral-500">
                        {t('merchantPaymentV2.uploadClearQRImage')}
                      </p>
                    )}
                    {errors.image && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.image.message}
                      </p>
                    )}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white"
                    disabled={isAddingPaymentV2 || isUpdatingPaymentV2}
                  >
                    {isAddingPaymentV2 || isUpdatingPaymentV2 ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {selectedPayment
                          ? t('merchantPaymentV2.updating')
                          : t('merchantPaymentV2.adding')}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {selectedPayment ? (
                          <Edit className="size-4" />
                        ) : (
                          <Plus className="size-4" />
                        )}
                        {selectedPayment
                          ? t('merchantPaymentV2.updatePaymentMethod')
                          : t('merchantPaymentV2.addPaymentMethod')}
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment List Section */}
        <div className="w-full">
          <Card className="w-full shadow-md border-neutral-200 h-full">
            <CardHeader>
              <CardTitle>{t('merchantPaymentV2.paymentMethods')}</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-100px)] overflow-y-auto">
              {isLoadingPaymentList ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neutral-900"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {paymentList?.payment && paymentList.payment.length > 0 ? (
                      paymentList.payment.map((payment: PaymentItem) =>
                        safeRenderPaymentItem(payment)
                      )
                    ) : (
                      <div className="text-center py-10 text-neutral-500">
                        <QrCode className="mx-auto size-10 mb-3 text-neutral-400" />
                        <p>{t('merchantPaymentV2.noPaymentMethodsAdded')}</p>
                        <p className="text-sm mt-1">
                          {t('merchantPaymentV2.addFirstPaymentMethod')}
                        </p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
