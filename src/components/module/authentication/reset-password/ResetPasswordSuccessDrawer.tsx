import Link from 'next/link';

import ResetPasswordSuccessIcon from '@/components/common/icons/ResetPasswordSuccessIcon';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

function ResetPasswordDrawer({ ref }: any) {
  return (
    <Drawer>
      <DrawerTrigger className="fixed hidden" ref={ref}>
        <span className="text-[#FE8C00] text-[14px] font-[500] leading-[20px]">
          Forgot password?
        </span>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex w-full flex-col items-start px-[20px] py-[3px]">
          <DrawerTitle className="text-[24px] leading[32px] font-semibold">
            {''}
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex w-full pt-0 px-[20px] flex-col items-center justify-center">
          <div className="my-[32px]">
            <ResetPasswordSuccessIcon />
          </div>
          <span className="text-[24px] leading[32px] font-semibold mb-[12px]">
            Password Changed
          </span>
          <span className="text-[14px] font-[500] leading-[20px] text-center text-wrap text-[#878787] mb-[32px]">
            Password changed successfully, you can login again with a new
            password
          </span>
          <div className="px-[4px] mb-[36px] flex w-full">
            <button className="bg-[#FE8C00] rounded-[100px] py-[16px] w-full text-[14px] font-semibold leading-[20px] text-white">
              <Link href={'/login'}>Verify Account</Link>
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
export default ResetPasswordDrawer;
