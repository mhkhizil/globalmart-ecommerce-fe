import clsx from 'clsx';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { HTMLAttributes, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import ShopIcon from '@/components/common/icons/ShoppIcon';
import { RootState } from '@/lib/redux/ReduxStore';

interface IPromotionProps extends HTMLAttributes<HTMLDivElement> {
  imageUrl: string | null;
  name: string;
  description?: string;
  en_description?: string;
  mm_description?: string;
  th_description?: string;
  cn_description?: string;
  p_id: number | null;
}

function PromotionCard(props: IPromotionProps) {
  const {
    imageUrl,
    className,
    name,
    p_id,
    en_description,
    mm_description,
    th_description,
    cn_description,
  } = props;
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  const t = useTranslations();
  const selectedLanguage = useSelector(
    (state: RootState) => state.language.locale
  );

  const selectedDescription = useMemo(() => {
    if (selectedLanguage === 'mm') {
      return mm_description;
    }
    if (selectedLanguage === 'th') {
      return th_description;
    }
    if (selectedLanguage === 'cn') {
      return cn_description;
    }
    return en_description;
  }, [
    selectedLanguage,
    mm_description,
    en_description,
    th_description,
    cn_description,
  ]);

  const displayImage = useMemo(() => {
    if (imageError || !imageUrl) {
      return '/food-fallback.png';
    }
    return imageUrl;
  }, [imageUrl, imageError]);

  const handleButtonClick = () => {
    if (p_id !== null) {
      router.push(`/application/product/detail/${p_id}`);
    }
  };

  return (
    <div className={clsx('flex flex-col relative h-[190px]', className)}>
      {/* Background image with overlay gradient */}
      <div className="absolute inset-0 z-0 rounded-[5px] overflow-hidden">
        <Image
          src={displayImage}
          alt={name || 'Promotion'}
          width={512}
          height={512}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
        {/* Enhanced gradient overlay for better text visibility */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" /> */}
      </div>

      {/* Card title - moved to top left with new styling */}
      <motion.div
        className="absolute left-3 top-3 z-10 max-w-[70%]"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="bg-black/40 backdrop-blur-sm px-3 py-2 rounded-lg">
          <h3 className="text-white text-sm font-bold leading-tight tracking-wide drop-shadow-lg line-clamp-2">
            {selectedDescription}
          </h3>
        </div>
      </motion.div>

      {/* Featured Badge */}
      <motion.div
        className="absolute top-3 right-3 z-10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
      >
        <div className="bg-[#FE8C00] rounded-full px-2 py-1 text-white text-xs font-medium shadow-lg">
          {t('promotion.featured')}
        </div>
      </motion.div>

      {/* Action buttons - moved to the side */}
      <motion.div
        className="absolute right-3 bottom-2  z-10 flex flex-col gap-y-2"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {/* <motion.button
          className="bg-white h-[2.2rem] w-[2.2rem] flex items-center justify-center rounded-full shadow-md hover:bg-gray-50 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShopIcon />
        </motion.button> */}
        <motion.button
          className={clsx(
            'bg-[#FE8C00] h-[2.2rem] px-2 gap-x-1 flex items-center justify-center rounded-md shadow-md transition-colors',
            p_id === null ? 'opacity-70 cursor-default' : 'hover:bg-[#FF7A00]'
          )}
          whileHover={p_id === null ? undefined : { scale: 1.1 }}
          whileTap={p_id === null ? undefined : { scale: 0.95 }}
          onClick={handleButtonClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="white"
            viewBox="0 0 16 16"
          >
            <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0" />
          </svg>
          <span className="text-white text-sm font-medium">
            {t('promotion.buyNow')}
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}

export default PromotionCard;
