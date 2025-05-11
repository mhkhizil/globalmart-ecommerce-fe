'use client';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';

import { FileUpload } from '@/components/common/FileUpload';
import Input from '@/components/common/Input';
import Loader from '@/components/common/loader/Loader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ShopType } from '@/core/entity/Shop';
import { useRegisterShop } from '@/lib/hooks/service/shop/useRegisterShop';
import { useSession } from '@/lib/hooks/session/useSession';

import ShopSelect from '../authentication/merchant-register/ShopSelect';

// Types
interface ShopRegisterFormData {
  name: string;
  phone: string;
  addresses: {
    mm: string;
    en: string;
    cn: string;
    th: string;
  };
  descriptions: {
    mm: string;
    en: string;
    cn: string;
    th: string;
  };
  link: string;
}

interface MerchantProfileFormProps {
  shopList: ShopType[];
}

// Constants
const LANGUAGE_TABS = [
  { code: 'mm', label: 'Myanmar', flag: '🇲🇲' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'cn', label: 'Chinese', flag: '🇨🇳' },
  { code: 'th', label: 'Thai', flag: '🇹🇭' },
] as const;

const TIME_OPTIONS = Array.from({ length: 24 }, (_, index) => ({
  value: `${index + 1}:00`,
  label: `${index + 1}:00`,
}));

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const tabContentVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export default function MerchantProfileForm({
  shopList,
}: MerchantProfileFormProps) {
  const router = useRouter();
  const [openTime, setOpenTime] = useState<string>('');
  const [closeTime, setCloseTime] = useState<string>('');
  const [isLoading, setLoading] = useState(false);
  const [logo, setLogo] = useState<File | undefined>();
  const [coverPhoto, setCoverPhoto] = useState<File | undefined>();
  const [currentShop, setCurrentShop] = useState(shopList[0]?.id || 0);
  const [activeLangTab, setActiveLangTab] = useState<'mm' | 'en' | 'cn' | 'th'>(
    'en'
  );
  const t = useTranslations();
  const { data: sessionData } = useSession();
  const { mutateAsync: registerShop } = useRegisterShop({
    onSuccess: () => {
      setLoading(false);
      toast.success(t('merchantProfile.shopRegisteredSuccessfully'));
      router.push('/application/merchant-home');
    },
    onError: error => {
      setLoading(false);
      toast.error(error.message || t('merchantProfile.failedToRegisterShop'));
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ShopRegisterFormData>({
    defaultValues: {
      name: '',
      phone: '',
      addresses: { mm: '', en: '', cn: '', th: '' },
      descriptions: { mm: '', en: '', cn: '', th: '' },
      link: '',
    },
  });

  const buildFormData = useCallback(
    (data: ShopRegisterFormData): FormData => {
      const formData = new FormData();
      formData.append('merchant_id', sessionData?.user?.merchant_id || '');
      formData.append('name', data.name);
      formData.append('shop_type_id', currentShop.toString());
      formData.append('phone', data.phone);
      formData.append('link', data.link);
      if (logo) formData.append('image', logo);
      if (coverPhoto) formData.append('cover_image', coverPhoto);

      LANGUAGE_TABS.forEach(({ code }) => {
        formData.append(`${code}_addr`, data.addresses[code]);
        formData.append(`${code}_description`, data.descriptions[code]);
      });

      formData.append('opening_time', openTime);
      formData.append('closing_time', closeTime);
      return formData;
    },
    [sessionData, currentShop, logo, coverPhoto, openTime, closeTime]
  );

  const onSubmit = useCallback(
    async (data: ShopRegisterFormData) => {
      try {
        setLoading(true);
        await registerShop({ formData: buildFormData(data) });
      } catch (error) {
        console.error('Registration error:', error);
      }
    },
    [registerShop, buildFormData]
  );

  const renderLanguageTabs = useMemo(
    () => (
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {LANGUAGE_TABS.map(({ code, label, flag }) => (
          <motion.button
            key={code}
            type="button"
            onClick={() => setActiveLangTab(code)}
            className={clsx(
              'px-4 py-2 rounded-lg flex items-center gap-2 transition-colors flex-shrink-0 ',
              activeLangTab === code
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{flag}</span>
            <span>{t(`common.${code}`)}</span>
          </motion.button>
        ))}
      </div>
    ),
    [activeLangTab, t]
  );

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-6"
    >
      <Toaster position="top-right" />

      {/* Section Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm font-medium text-gray-600">
          {t('merchantProfile.shopInformation')}
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </motion.div>

      {/* Form Fields */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('merchantProfile.shopType')}
        </label>
        <ShopSelect options={shopList} setShop={setCurrentShop} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Controller
          name="name"
          control={control}
          rules={{ required: t('errors.requiredField') }}
          render={({ field }) => (
            <Input
              label={t('merchantProfile.shopName')}
              {...field}
              // error={errors.name?.message}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
            />
          )}
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        <Controller
          name="phone"
          control={control}
          rules={{ required: t('errors.requiredField') }}
          render={({ field }) => (
            <Input
              label={t('merchantProfile.businessPhone')}
              {...field}
              // error={errors.phone?.message}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
            />
          )}
        />
        {errors.phone && (
          <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        <Controller
          name="link"
          control={control}
          render={({ field }) => (
            <Input
              label={t('merchantProfile.websiteLink')}
              {...field}
              // error={errors.phone?.message}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
            />
          )}
        />
        {errors.link && (
          <p className="text-sm text-red-500 mt-1">{errors.link.message}</p>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('merchantProfile.logoImage')}
        </label>
        <FileUpload
          onFileUpload={(files: File[]) => setLogo(files[0])}
          multiple={false}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('merchantProfile.coverImage')}
        </label>
        <FileUpload
          onFileUpload={(files: File[]) => setCoverPhoto(files[0])}
          multiple={false}
        />
      </motion.div>

      {/* Multi-language Address */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('merchantProfile.address')}
        </label>
        {renderLanguageTabs}
        <AnimatePresence mode="wait">
          {LANGUAGE_TABS.map(
            ({ code }) =>
              activeLangTab === code && (
                <motion.div
                  key={code}
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <Controller
                    name={`addresses.${code}`}
                    control={control}
                    rules={{
                      required:
                        code === 'en' ? t('errors.requiredField') : false,
                    }}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder={`${t('merchantProfile.enterAddressIn')} ${code} ${code === 'en' ? `(${t('common.required')})` : `(${t('common.optional')})`}`}
                        className="w-full rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
                      />
                    )}
                  />
                  {errors.addresses?.[code] && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.addresses[code]?.message}
                    </p>
                  )}
                </motion.div>
              )
          )}
        </AnimatePresence>
      </motion.div>

      {/* Multi-language Description */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('merchantProfile.description')}
        </label>
        {renderLanguageTabs}
        <AnimatePresence mode="wait">
          {LANGUAGE_TABS.map(
            ({ code }) =>
              activeLangTab === code && (
                <motion.div
                  key={code}
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <Controller
                    name={`descriptions.${code}`}
                    control={control}
                    rules={{
                      required:
                        code === 'en' ? t('errors.requiredField') : false,
                    }}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder={`${t('merchantProfile.enterDescriptionIn')} ${code} ${code === 'en' ? `(${t('common.required')})` : `(${t('common.optional')})`}`}
                        className="w-full rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
                      />
                    )}
                  />
                  {errors.descriptions?.[code] && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.descriptions[code]?.message}
                    </p>
                  )}
                </motion.div>
              )
          )}
        </AnimatePresence>
      </motion.div>

      {/* Time Selectors */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('merchantProfile.openTime')}
        </label>
        <Select value={openTime} onValueChange={setOpenTime}>
          <SelectTrigger className="w-full h-12 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
            <SelectValue placeholder={t('merchant.selectOpenTime')} />
          </SelectTrigger>
          <SelectContent>
            {TIME_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('merchantProfile.closeTime')}
        </label>
        <Select value={closeTime} onValueChange={setCloseTime}>
          <SelectTrigger className="w-full h-12 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
            <SelectValue placeholder={t('merchantProfile.selectCloseTime')} />
          </SelectTrigger>
          <SelectContent>
            {TIME_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Submit Button */}
      <motion.div variants={itemVariants} className="space-y-4">
        <motion.button
          type="submit"
          disabled={isLoading}
          className={clsx(
            'w-full py-3 px-6 rounded-full text-white font-semibold transition-all',
            isLoading
              ? 'bg-orange-500/70 cursor-not-allowed'
              : 'bg-orange-500 hover:bg-orange-600'
          )}
          whileHover={{ scale: isLoading ? 1 : 1.05 }}
          whileTap={{ scale: isLoading ? 1 : 0.95 }}
        >
          {isLoading ? <Loader /> : t('merchantProfile.registerShop')}
        </motion.button>

        <motion.button
          type="button"
          onClick={() => router.push('/application/merchant-home')}
          className="w-full text-orange-500 hover:text-orange-600 underline text-sm"
          whileHover={{ x: 5 }}
        >
          {t('merchantProfile.backToShopList')}
        </motion.button>
      </motion.div>
    </motion.form>
  );
}
