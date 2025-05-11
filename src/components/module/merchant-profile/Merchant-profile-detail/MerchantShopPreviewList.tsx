'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Store } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Skeleton } from '@/components/ui/skeleton';
import { useGetShopListByMerchantId } from '@/lib/hooks/service/shop/useGetShopsByMerchantId';
interface MerchantShopPreviewListProps {
  merchant_id: number;
}

function MerchantShopPreviewList({
  merchant_id,
}: MerchantShopPreviewListProps) {
  const router = useRouter();
  const t = useTranslations();
  const { data: shopList, isLoading } = useGetShopListByMerchantId({
    merchant_id,
  });

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
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const handleShopClick = (shopId: number) => {
    const parameter = new URLSearchParams();
    parameter.append('shopId', shopId.toString());
    router.push(`/application/merchant-shop-detail?${parameter}`);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">
          {t('merchantHome.yourShops')}
        </h3>
        <Link
          href="/shop-register"
          className="text-orange-500 text-sm font-medium hover:underline flex items-center gap-1"
        >
          {t('merchantHome.addNew')} <ChevronRight size={16} />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-[180px]">
              <Skeleton className="h-24 w-full rounded-md mb-2" />
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex gap-3 overflow-x-auto pb-2 scrollbar-none"
          >
            {shopList?.shops && shopList.shops.length > 0 ? (
              shopList.shops.map(shop => (
                <motion.div
                  key={shop.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleShopClick(shop.id)}
                  className="flex-shrink-0 w-[180px] p-3  bg-gray-50 rounded-lg cursor-pointer hover:shadow-md transition-all duration-200"
                >
                  <div className="mb-2 justify-center flex items-center">
                    {shop.image ? (
                      <Image
                        src={shop.image}
                        alt={shop.name || 'Shop image'}
                        width={160}
                        height={96}
                        className="size-[5rem] object-cover rounded-md"
                      />
                    ) : (
                      <div className="h-24 w-full bg-orange-100 rounded-md flex items-center justify-center">
                        <Store className="text-orange-500" size={32} />
                      </div>
                    )}
                  </div>
                  <h4 className="font-medium text-gray-800 truncate text-center items-center">
                    {shop.name}
                  </h4>
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center justify-center py-6 text-center w-full"
              >
                <Store className="text-gray-300 mb-2" size={48} />
                <p className="text-gray-500 mb-3">
                  {t('merchantHome.noShopsAvailable')}
                </p>
                <Link
                  href="/shop-register"
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  {t('merchantHome.createYourFirstShop')}
                </Link>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default MerchantShopPreviewList;
