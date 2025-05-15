'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { z } from 'zod';

import BackIcon from '@/components/common/icons/BackIcon';
import Input from '@/components/common/Input';
import Loader from '@/components/common/loader/Loader';
import { useGetUser } from '@/lib/hooks/service/user/useGetUserById';
import { useSession } from '@/lib/hooks/session/useSession';
import { useShippingAddress } from '@/lib/hooks/store/useShippingAddress';

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
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

// Define shipping address data type
export type ShippingAddressData = {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
};

export default function ShippingAddress() {
  const router = useRouter();
  const t = useTranslations();
  const { data: session } = useSession();
  const { data: currentUser, isLoading } = useGetUser();
  const { saveAddress, getAddresses, currentAddress } = useShippingAddress();

  // Create schema for form validation
  const addressSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    addressLine1: z.string().min(1, 'Address is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State/Province is required'),
    zipCode: z.string().min(1, 'Zip/Postal code is required'),
    phone: z.string().min(1, 'Phone number is required'),
    isDefault: z.boolean().default(false),
  });

  // Setup form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ShippingAddressData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      isDefault: false,
    },
  });

  // Load existing address data if available
  useEffect(() => {
    if (currentUser) {
      // Try to pre-fill with current user data
      setValue('fullName', currentUser.name || '');
      setValue('phone', currentUser.phone || '');

      // If we have previously saved address, use it
      if (currentAddress) {
        reset(currentAddress);
      } else if (currentUser.address) {
        // If the user has an address but no saved shipping address
        setValue('addressLine1', currentUser.address || '');
      }
    }
  }, [currentUser, setValue, reset, currentAddress]);

  // Handle form submission
  const onSubmit = useCallback(
    async (data: ShippingAddressData) => {
      try {
        // Save the address to the store
        saveAddress(data);

        // Show success message
        toast.success(t('shipping.addressSaved'));

        // Navigate back to cart or payment
        router.push('/application/payment');
      } catch (error) {
        toast.error(t('shipping.errorSavingAddress'));
        console.error('Error saving address:', error);
      }
    },
    [saveAddress, router, t]
  );

  return (
    <div className="flex w-full h-full flex-col max-h-[92dvh] p-4 overflow-y-auto">
      <Toaster position="top-center" />

      <div className="flex w-full items-center justify-between px-[1.5rem] pt-[0.75rem] flex-shrink-0 sticky top-0 bg-white z-10">
        <button onClick={() => router.back()} aria-label="Go back">
          <BackIcon />
        </button>
        <span className="text-[1rem] font-semibold">
          {t('shipping.shippingAddress')}
        </span>
        <div className="w-6"></div> {/* Empty div for alignment */}
      </div>

      <motion.form
        className="flex flex-col w-full mt-6 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit(onSubmit)}
      >
        <motion.div className="mb-4" variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('shipping.fullName')}
          </label>
          <Input
            label="fullName"
            {...register('fullName')}
            className="py-[16px] focus:outline-gray-500 border-[#D6D6D6] border-[1px] h-[3.25rem]"
            errors={
              errors.fullName?.message
                ? { fullName: errors.fullName.message }
                : undefined
            }
          />
        </motion.div>

        <motion.div className="mb-4" variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('shipping.addressLine1')}
          </label>
          <Input
            label="addressLine1"
            {...register('addressLine1')}
            className="py-[16px] focus:outline-gray-500 border-[#D6D6D6] border-[1px] h-[3.25rem]"
            errors={
              errors.addressLine1?.message
                ? { addressLine1: errors.addressLine1.message }
                : undefined
            }
          />
        </motion.div>

        <motion.div className="mb-4" variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('shipping.addressLine2')} ({t('shipping.optional')})
          </label>
          <Input
            label="addressLine2"
            {...register('addressLine2')}
            className="py-[16px] focus:outline-gray-500 border-[#D6D6D6] border-[1px] h-[3.25rem]"
          />
        </motion.div>

        <div className="flex gap-4 mb-4">
          <motion.div className="w-1/2" variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('shipping.city')}
            </label>
            <Input
              label="city"
              {...register('city')}
              className="py-[16px] focus:outline-gray-500 border-[#D6D6D6] border-[1px] h-[3.25rem]"
              errors={
                errors.city?.message ? { city: errors.city.message } : undefined
              }
            />
          </motion.div>

          <motion.div className="w-1/2" variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('shipping.state')}
            </label>
            <Input
              label="state"
              {...register('state')}
              className="py-[16px] focus:outline-gray-500 border-[#D6D6D6] border-[1px] h-[3.25rem]"
              errors={
                errors.state?.message
                  ? { state: errors.state.message }
                  : undefined
              }
            />
          </motion.div>
        </div>

        <div className="flex gap-4 mb-4">
          <motion.div className="w-1/2" variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('shipping.zipCode')}
            </label>
            <Input
              label="zipCode"
              {...register('zipCode')}
              className="py-[16px] focus:outline-gray-500 border-[#D6D6D6] border-[1px] h-[3.25rem]"
              errors={
                errors.zipCode?.message
                  ? { zipCode: errors.zipCode.message }
                  : undefined
              }
            />
          </motion.div>

          <motion.div className="w-1/2" variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('shipping.phone')}
            </label>
            <Input
              label="phone"
              {...register('phone')}
              className="py-[16px] focus:outline-gray-500 border-[#D6D6D6] border-[1px] h-[3.25rem]"
              errors={
                errors.phone?.message
                  ? { phone: errors.phone.message }
                  : undefined
              }
            />
          </motion.div>
        </div>

        <motion.div className="mb-6" variants={itemVariants}>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('isDefault')}
              className="w-4 h-4 text-[#FE8C00] border-gray-300 rounded focus:ring-[#FE8C00]"
            />
            <span className="ml-2 text-sm text-gray-700">
              {t('shipping.setAsDefault')}
            </span>
          </label>
        </motion.div>

        <motion.button
          variants={itemVariants}
          type="submit"
          disabled={isSubmitting}
          className="rounded-[100px] py-[16px] min-h-[52px] w-full text-[14px] font-semibold leading-[20px] text-white bg-red-500 hover:bg-red-500/70 transition-colors disabled:bg-red-500/40"
        >
          {isSubmitting ? <Loader /> : t('shipping.saveAddress')}
        </motion.button>
      </motion.form>
    </div>
  );
}
