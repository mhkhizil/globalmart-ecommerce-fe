'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, FileImage, History, QrCode } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import { z } from 'zod';

import { FileUpload } from '@/components/common/FileUpload';
import Input from '@/components/common/Input';
import Loader from '@/components/common/loader/Loader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PaymentMethodList } from '@/lib/constants/PaymentMethod';
import { useGetAvailablePaymentList } from '@/lib/hooks/service/payment/useGetAvailablePaymentList';
import { useRefillWallet } from '@/lib/hooks/service/payment/useRefillWallet';
import { useSession } from '@/lib/hooks/session/useSession';

// Define validation schema using Zod
const refillFormSchema = z.object({
  amount: z
    .number({ required_error: 'Amount is required' })
    .positive('Amount must be positive'),
  payment_method: z.string().min(1, { message: 'Payment method is required' }),
  account_number: z.string().optional(),
  account_name: z.string().optional(),
  transaction_id: z.string().min(1, { message: 'Transaction ID is required' }),
  transaction_screenshot: z.any().optional(),
  remark: z.string().optional(),
});

type RefillFormData = z.infer<typeof refillFormSchema>;

// Animation variants
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
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

// Button hover animation
const buttonHoverVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 10,
    },
  },
  tap: { scale: 0.95 },
};

const getPaymentMethodDetails = (id: string) => {
  return PaymentMethodList.find(method => method.id === id);
};

function CustomerRefillWallet() {
  const t = useTranslations('wallet');
  const commonT = useTranslations('common');
  const paymentT = useTranslations('payment');

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | undefined
  >();
  const [transactionScreenshot, setTransactionScreenshot] = useState<File[]>(
    []
  );
  // State to store the selected payment method details
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState<
    | {
        account_name: string;
        account_no: string;
        payment_method: string;
        image: string;
      }
    | undefined
  >();

  // Add states for copy button feedback
  const [copiedAccountNo, setCopiedAccountNo] = useState(false);
  const [copiedAccountName, setCopiedAccountName] = useState(false);

  // Add a key state to reset FileUpload component
  const [fileUploadKey, setFileUploadKey] = useState<number>(0);

  // Form setup with validation
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<RefillFormData>({
    resolver: zodResolver(refillFormSchema),
    defaultValues: {
      amount: 0,
      payment_method: '',
      account_number: '',
      account_name: '',
      transaction_id: '',
      transaction_screenshot: undefined,
      remark: '',
    },
  });

  // Handle file upload
  const handleTransactionScreenshotUpload = (files: File[]) => {
    if (files.length === 0) {
      setTransactionScreenshot([]);
      setValue('transaction_screenshot', undefined, { shouldValidate: true });
      return;
    }

    // Validate file size (5MB max)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (files[0].size > MAX_FILE_SIZE) {
      toast.error(t('fileExceedsLimit'));
      return;
    }

    setTransactionScreenshot(files);
    setValue('transaction_screenshot', files[0], { shouldValidate: true });
    toast.success(t('screenshotUploaded'));
  };

  // Function to explicitly clear the file upload
  const clearFileUpload = () => {
    handleTransactionScreenshotUpload([]);
  };

  const { mutate: refillWallet, isPending } = useRefillWallet({
    onSuccess: () => {
      toast.success(t('refillSuccess'));
      reset();
      // Clear the file upload component by setting empty array
      handleTransactionScreenshotUpload([]);
      setTransactionScreenshot([]);
      setSelectedPaymentMethod(undefined);
      setSelectedPaymentDetails(undefined);
      // Increment the key to force the FileUpload component to re-render
      setFileUploadKey(previous => previous + 1);
    },
    onError: () => {
      toast.error(t('refillFailed'));
    },
  });

  const { data: availablePaymentList } = useGetAvailablePaymentList();

  const { data: userData } = useSession();

  // Form submission handler
  const onSubmit = (data: RefillFormData) => {
    // Validate screenshot for larger transactions
    if (data.amount > 100 && transactionScreenshot.length === 0) {
      toast.error(t('screenshotRequired'));
      return;
    }

    // Validate that a payment method is selected and details are available
    if (!selectedPaymentDetails) {
      toast.error(t('selectValidPaymentMethod'));
      return;
    }

    const formData = new FormData();

    // Append all form fields to FormData
    formData.append('wallet_amount', data.amount.toString());
    formData.append('user_id', userData?.user?.id || '');
    // Use the selected payment details for account details
    formData.append('account_no', selectedPaymentDetails.account_no);
    formData.append('account_name', selectedPaymentDetails.account_name);
    formData.append('payment_id', data.payment_method);
    formData.append('transaction_id', data.transaction_id);

    // Append transaction screenshot if available
    if (transactionScreenshot.length > 0) {
      formData.append('image', transactionScreenshot[0]);
    }

    if (data.remark) {
      formData.append('remark', data.remark);
    }

    refillWallet(formData);
  };

  // Watch payment method to update UI
  const watchedPaymentMethod = watch('payment_method');

  // Update selected payment method when form value changes
  useEffect(() => {
    if (watchedPaymentMethod !== selectedPaymentMethod) {
      setSelectedPaymentMethod(watchedPaymentMethod);

      // Find and set the selected payment details
      if (watchedPaymentMethod && availablePaymentList?.payment) {
        const paymentDetails = availablePaymentList.payment.find(
          method => method.id.toString() === watchedPaymentMethod
        );

        if (paymentDetails) {
          setSelectedPaymentDetails({
            account_name: paymentDetails.account_name,
            account_no: paymentDetails.account_no,
            payment_method: paymentDetails.payment_method,
            image: paymentDetails.image,
          });

          // Update form values
          setValue('account_name', paymentDetails.account_name, {
            shouldValidate: true,
          });
          setValue('account_number', paymentDetails.account_no, {
            shouldValidate: true,
          });
        } else {
          setSelectedPaymentDetails(undefined);
          setValue('account_name', '', { shouldValidate: true });
          setValue('account_number', '', { shouldValidate: true });
        }
      } else {
        setSelectedPaymentDetails(undefined);
        setValue('account_name', '', { shouldValidate: true });
        setValue('account_number', '', { shouldValidate: true });
      }
    }
  }, [
    watchedPaymentMethod,
    selectedPaymentMethod,
    availablePaymentList,
    setValue,
  ]);

  const paymentMethodDetails = selectedPaymentMethod
    ? getPaymentMethodDetails(selectedPaymentMethod)
    : undefined;

  const watchedAmount = watch('amount');

  return (
    <div className="h-[92dvh] w-full overflow-y-auto scrollbar-none ">
      {/* History Button */}
      <Toaster />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full"
      >
        <motion.div variants={itemVariants}>
          <Card className="border-none shadow-lg w-full">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                {t('refillYourWallet')}
              </CardTitle>
              <CardDescription className="text-center">
                {t('addFundsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-medium">{t('amount')}</label>
                  <Controller
                    name="amount"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <div className="relative">
                        <Input
                          type="number"
                          label={t('enterAmount')}
                          className="py-[16px] h-[45px] focus:outline-gray-500 border-[#D6D6D6] border-[1px] pl-8"
                          onChange={event =>
                            onChange(Number.parseFloat(event.target.value) || 0)
                          }
                          value={value === 0 ? '' : value}
                          {...field}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                      </div>
                    )}
                  />
                  {errors.amount && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.amount.message}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-medium">
                    {paymentT('paymentMethod')}
                  </label>
                  <Controller
                    name="payment_method"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full h-[45px] rounded-[8px] focus:outline-none focus:ring-0 focus:ring-offset-0 border-[#D6D6D6] border-[1px]">
                          <SelectValue placeholder={t('selectPaymentMethod')} />
                        </SelectTrigger>
                        <SelectContent>
                          {availablePaymentList?.payment.map(method => (
                            <SelectItem
                              key={method.id}
                              value={method.id.toString()}
                              className="flex items-center"
                            >
                              {method.payment_method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.payment_method && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.payment_method.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-600">
                    {t('selectPaymentMethodHelp')}
                  </p>
                </motion.div>

                {selectedPaymentDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-orange-50 p-5 rounded-lg border-2 border-orange-300 shadow-md"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#FE8C00"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      <h3 className="font-medium text-[#FE8C00] text-lg">
                        {t('transferInstructions')}
                      </h3>
                    </div>

                    <div className="mb-4 bg-yellow-100 p-3 rounded-md border border-yellow-200">
                      <p className="text-sm font-medium text-yellow-800">
                        {t('useOnlyTheseDetails')}
                      </p>
                    </div>

                    {/* Display payment method name */}
                    <div className="mb-4 flex items-center justify-between rounded-md bg-white border border-orange-200 p-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-orange-100 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#FE8C00"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="2"
                              y="5"
                              width="20"
                              height="14"
                              rx="2"
                            ></rect>
                            <line x1="2" y1="10" x2="22" y2="10"></line>
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">
                            {paymentT('paymentMethod')}
                          </p>
                          <p className="font-medium text-black">
                            {selectedPaymentDetails.payment_method}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Display QR code if available */}
                    {selectedPaymentDetails.image && (
                      <div className="mb-4 bg-white border border-orange-200 rounded-md p-3">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center gap-2 mb-2 w-full">
                            <QrCode size={16} className="text-[#FE8C00]" />
                            <span className="text-sm font-medium text-gray-700">
                              {t('scanQrCode')}
                            </span>
                          </div>
                          <div className="bg-white p-2 rounded-md shadow-sm border border-gray-200 max-w-[220px] mx-auto">
                            <Image
                              src={selectedPaymentDetails.image}
                              alt={`${selectedPaymentDetails.payment_method} QR code`}
                              width={200}
                              height={200}
                              className="rounded-md object-contain"
                              unoptimized
                            />
                          </div>
                          <p className="text-xs text-center text-gray-500 mt-2">
                            {t('scanToTransfer')}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4 p-3 bg-white rounded-md border border-orange-200">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {paymentT('accountNo')}:
                        </p>
                        <div className="flex mt-1">
                          <p className="flex-1 font-medium text-black bg-gray-50 p-2 rounded-l border border-orange-200 select-all">
                            {selectedPaymentDetails.account_no}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                selectedPaymentDetails.account_no
                              );
                              setCopiedAccountNo(true);
                              setTimeout(() => setCopiedAccountNo(false), 2000);
                            }}
                            className="flex items-center justify-center px-3 bg-orange-100 border border-l-0 border-orange-200 rounded-r hover:bg-orange-200 transition-colors"
                          >
                            {copiedAccountNo ? (
                              <Check size={16} className="text-green-600" />
                            ) : (
                              <Copy size={16} className="text-[#FE8C00]" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {paymentT('accountName')}:
                        </p>
                        <div className="flex mt-1">
                          <p className="flex-1 font-medium text-black bg-gray-50 p-2 rounded-l border border-orange-200 select-all">
                            {selectedPaymentDetails.account_name}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                selectedPaymentDetails.account_name
                              );
                              setCopiedAccountName(true);
                              setTimeout(
                                () => setCopiedAccountName(false),
                                2000
                              );
                            }}
                            className="flex items-center justify-center px-3 bg-orange-100 border border-l-0 border-orange-200 rounded-r hover:bg-orange-200 transition-colors"
                          >
                            {copiedAccountName ? (
                              <Check size={16} className="text-green-600" />
                            ) : (
                              <Copy size={16} className="text-[#FE8C00]" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-red-50 rounded-md border border-red-200">
                      <p className="text-xs text-red-600 font-medium flex items-start gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mt-0.5 flex-shrink-0"
                        >
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                          <line x1="12" y1="9" x2="12" y2="13"></line>
                          <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        <span>{t('incorrectDetailsWarning')}</span>
                      </p>
                    </div>
                  </motion.div>
                )}

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-medium">
                    {t('transactionID')}
                  </label>
                  <Input
                    label={t('enterTransactionID')}
                    {...register('transaction_id')}
                    className="py-[16px] h-[45px] focus:outline-gray-500 border-[#D6D6D6] border-[1px]"
                  />
                  {errors.transaction_id && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.transaction_id.message}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FileImage size={16} className="text-gray-500" />
                    {t('transactionScreenshot')}
                  </label>
                  <FileUpload
                    key={fileUploadKey}
                    onFileUpload={handleTransactionScreenshotUpload}
                    accept="image/*"
                    multiple={false}
                    className="w-full"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                      {t('uploadScreenshotInstructions')}
                    </p>
                    {transactionScreenshot.length > 0 && (
                      <p className="text-xs text-green-600 font-medium">
                        ✓ {t('screenshotUploaded')}
                      </p>
                    )}
                  </div>
                  {watchedAmount > 100 &&
                    transactionScreenshot.length === 0 && (
                      <p className="text-xs text-amber-600 mt-1">
                        {t('recommendedForLargeAmounts')}
                      </p>
                    )}
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-medium">
                    {t('remark')} ({commonT('optional')})
                  </label>
                  <Textarea
                    placeholder={t('additionalInformation')}
                    className="min-h-[80px] border-[#D6D6D6] border-[1px] focus:border-gray-500 focus:ring-0"
                    {...register('remark')}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    disabled={isPending || !selectedPaymentDetails}
                    className="w-full h-[45px] bg-[#FE8C00] hover:bg-[#e07e00] text-white font-semibold rounded-[5px]"
                  >
                    {isPending ? <Loader /> : t('refillWallet')}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 pt-0">
              <p className="text-xs text-gray-500 text-center">
                {t('processingTimeInfo')}
              </p>
              <div className="flex justify-end mb-4">
                <motion.div
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonHoverVariants}
                  className="w-full "
                >
                  <Link href="/application/transaction-history" passHref>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border-[#FE8C00] text-[#FE8C00] hover:bg-[#FE8C00]/10"
                    >
                      <History size={16} />
                      <span>{t('paymentHistory')}</span>
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
export default CustomerRefillWallet;
