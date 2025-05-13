import Link from 'next/link';
import { useTranslations } from 'next-intl';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
function ForgotPasswordDrawer() {
  const t = useTranslations();
  return (
    <Drawer>
      <DrawerTrigger>
        <span className="text-red-500 text-[14px] font-[500] leading-[20px]">
          {t('auth.forgotPassword')}
        </span>
      </DrawerTrigger>
      <DrawerContent className="max-w-[430px]">
        <DrawerHeader className="flex w-full flex-col items-start px-[20px] py-[3px]">
          <DrawerTitle className="text-[24px] leading[32px] font-semibold">
            {t('auth.forgotPassword')}
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex w-full pt-0 px-[20px] flex-col">
          <span className="text-[#878787] font-[500] text-[14px] leading-[20px] mb-[24px]">
            {t('auth.selectContactDetails')}
          </span>
          <div className="px-[4px] mb-[36px]">
            <Link
              className="bg-red-500 flex items-center justify-center rounded-[100px] py-[16px] w-full text-[14px] font-semibold leading-[20px] text-white"
              href={'/forgot-password'}
            >
              {t('auth.continue')}
            </Link>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
export default ForgotPasswordDrawer;
