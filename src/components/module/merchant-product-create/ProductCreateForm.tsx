// import { useGetCategoryList } from '@/lib/hooks/service/category/useGetCategoryList';
// import { useStoreProduct } from '@/lib/hooks/service/product/useStoreProduct';
// import { useSession } from '@/lib/hooks/session/useSession';
// import { toast } from 'react-hot-toast';

// interface ProductCreateFormData {
//   c_id: string; //category id
//   m_id: string; //merchant id(user id)
//   price: string; //price
//   stock: string; //stock
//   name: string;
//   image: File;
//   product_images: File[];
//   descriptions: {
//     mm: string;
//     en: string;
//     cn: string;
//   };
// }

// const LANGUAGE_TABS = [
//   { code: 'mm', label: 'Myanmar', flag: '🇲🇲' },
//   { code: 'en', label: 'English', flag: '🇬🇧' },
//   { code: 'cn', label: 'cnnese', flag: '🇨🇳' },
// ] as const;

// function ProductCreateForm() {
//   const { data: categoryList } = useGetCategoryList();
//   const { data: session } = useSession();//session?.User?.data?.id will be used as merchant id
//   const { mutate: createProduct } = useStoreProduct({
//     onSuccess: () => {
//       toast.success('Product created successfully');
//     },
//     onError: () => {
//       toast.error('Failed to create product');
//     },
//   });
//   return <></>;
// }
// export default ProductCreateForm;
'use client';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
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
import { useGetCategoryList } from '@/lib/hooks/service/category/useGetCategoryList';
import { useStoreProduct } from '@/lib/hooks/service/product/useStoreProduct';
import { useGetShopListByMerchantId } from '@/lib/hooks/service/shop/useGetShopsByMerchantId';
import { useSession } from '@/lib/hooks/session/useSession';

// Types
interface ProductCreateFormData {
  c_id: string; // Category ID
  m_id: string; // Merchant ID
  price: string; // Price
  stock: string; // Stock
  name: string;
  image: File | undefined; // Single preview image
  product_images: File[]; // Multiple product images
  descriptions: {
    mm: string;
    en: string;
    cn: string;
    th: string;
  };
  shop_id: string;
}

interface ProductCreateFormProps {}

// Constants
const LANGUAGE_TABS = [
  { code: 'mm', label: 'Myanmar', flag: '🇲🇲' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'cn', label: 'chinese', flag: '🇨🇳' },
  { code: 'th', label: 'Thai', flag: '🇹🇭' },
] as const;

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, staggercnldren: 0.1 },
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

export default function ProductCreateForm(_props: ProductCreateFormProps) {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<File | undefined>();
  const [productImages, setProductImages] = useState<File[]>([]);
  const t = useTranslations();
  const pT = useTranslations('merchantProduct');

  const { data: categoryList } = useGetCategoryList();
  const { data: session } = useSession();
  const { data: shopList } = useGetShopListByMerchantId(
    {
      merchant_id: session?.user?.merchant_id || '',
    },
    {
      enabled: !!session?.user?.merchant_id,
    }
  );
  const { mutateAsync: createProduct } = useStoreProduct({
    onSuccess: () => {
      setLoading(false);
      toast.success(pT('productCreatedSuccessfully'));
      router.push('/application/merchant-home'); // Adjust redirect as needed
    },
    onError: error => {
      setLoading(false);
      toast.error(error.message || pT('failedToCreateProduct'));
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductCreateFormData>({
    defaultValues: {
      c_id: '',
      m_id: session?.user?.merchant_id || '', // Pre-fill merchant ID from session
      price: '',
      stock: '',
      name: '',
      image: undefined,
      product_images: [],
      descriptions: { mm: '', en: '', cn: '', th: '' },
    },
  });

  const buildFormData = useCallback(
    (data: ProductCreateFormData): FormData => {
      const formData = new FormData();
      formData.append('c_id', data.c_id);
      formData.append('m_id', data.m_id || session?.user?.merchant_id || '');
      formData.append('price', data.price);
      formData.append('stock', data.stock);
      formData.append('name', data.name);
      formData.append('shop_id', data.shop_id);
      if (data.image) formData.append('image', data.image);
      data.product_images.forEach((file, index) => {
        formData.append(`product_image[${index}][link]`, file);
      });

      LANGUAGE_TABS.forEach(({ code }) => {
        formData.append(`${code}_description`, data.descriptions[code]);
      });

      return formData;
    },
    [session]
  );

  const onSubmit = useCallback(
    async (data: ProductCreateFormData) => {
      try {
        setLoading(true);
        data.image = previewImage; // Assign single preview image
        data.product_images = productImages; // Assign multiple product images
        await createProduct(buildFormData(data));
      } catch (error) {
        console.error('Product creation error:', error);
      }
    },
    [createProduct, buildFormData, previewImage, productImages]
  );

  const [activeLangTab, setActiveLangTab] = useState<'mm' | 'en' | 'cn' | 'th'>(
    'en'
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
              'px-4 py-2 rounded-lg flex items-center gap-2 transition-colors flex-shrink-0',
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
          {pT('productInformation')}
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </motion.div>

      {/* Form Fields */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {pT('category')}
        </label>
        <Controller
          name="c_id"
          control={control}
          rules={{ required: t('errors.requiredField') }}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full h-12 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                <SelectValue placeholder={pT('selectCategory')} />
              </SelectTrigger>
              <SelectContent>
                {categoryList?.category.map(cat => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.c_id && (
          <p className="text-sm text-red-500 mt-1">{errors.c_id.message}</p>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {pT('shop')}
        </label>
        <Controller
          name="shop_id"
          control={control}
          rules={{ required: t('errors.requiredField') }}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full h-12 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                <SelectValue placeholder={pT('selectShop')} />
              </SelectTrigger>
              <SelectContent>
                {shopList?.shops.map(shop => (
                  <SelectItem key={shop.id} value={shop.id.toString()}>
                    {shop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.shop_id && (
          <p className="text-sm text-red-500 mt-1">{errors.shop_id.message}</p>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        <Controller
          name="name"
          control={control}
          rules={{ required: t('errors.requiredField') }}
          render={({ field }) => (
            <Input
              label={pT('productName')}
              {...field}
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
          name="price"
          control={control}
          rules={{
            required: t('errors.requiredField'),
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: pT('invalidPriceFormat'),
            },
          }}
          render={({ field }) => (
            <Input
              label={pT('price')}
              type="number"
              step="0.01"
              {...field}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
            />
          )}
        />
        {errors.price && (
          <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        <Controller
          name="stock"
          control={control}
          rules={{
            required: t('errors.requiredField'),
            pattern: {
              value: /^\d+$/,
              message: pT('stockMustBeWholeNumber'),
            },
          }}
          render={({ field }) => (
            <Input
              label={pT('stock')}
              type="number"
              {...field}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
            />
          )}
        />
        {errors.stock && (
          <p className="text-sm text-red-500 mt-1">{errors.stock.message}</p>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {pT('previewImage')}
        </label>
        <FileUpload
          onFileUpload={files => setPreviewImage(files[0] || undefined)}
          accept="image/*"
          multiple={false}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {pT('productImages')}
        </label>
        <FileUpload
          onFileUpload={setProductImages}
          accept="image/*"
          multiple={true}
          maxFiles={5} // Adjust as needed
        />
      </motion.div>

      {/* Multi-language Description */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {pT('productDescription')}
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
                        placeholder={`${pT('enterDescriptionIn')} ${t(`common.${code}`)} ${code === 'en' ? `(${t('common.required')})` : `(${t('common.optional')})`}`}
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

      {/* Submit Button */}
      <motion.div variants={itemVariants} className="space-y-4">
        <motion.button
          type="submit"
          disabled={isLoading}
          className={clsx(
            'w-full py-3 px-6 rounded-full text-white font-semibold transition-all',
            isLoading
              ? 'bg-orange-400 cursor-not-allowed'
              : 'bg-orange-500 hover:bg-orange-600'
          )}
          whileHover={{ scale: isLoading ? 1 : 1.05 }}
          whileTap={{ scale: isLoading ? 1 : 0.95 }}
        >
          {isLoading ? <Loader /> : pT('createProduct')}
        </motion.button>

        <motion.div
          className="w-full text-orange-500 flex items-center justify-center hover:text-orange-600 underline text-sm"
          whileHover={{ x: 5 }}
        >
          <Link href="/application/merchant-home">{pT('backToDashboard')}</Link>
        </motion.div>
      </motion.div>
    </motion.form>
  );
}
