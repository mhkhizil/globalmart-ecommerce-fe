import { ChevronDown } from 'lucide-react';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

function MenuCategory() {
  return (
    <Drawer>
      <DrawerTrigger>
        <div className="flex rounded-[15px] px-[1rem] py-[0.2rem] border-[1px] w-fit">
          <span>Menu</span>
          <ChevronDown />
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-w-[430px]">
        <DrawerHeader className="flex w-full flex-col items-start px-[20px] py-[3px]">
          <DrawerTitle className="text-[24px] leading[32px] font-semibold">
            Select Menu
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex w-full pt-0 px-[20px] flex-col">
          Select Menu here
        </div>
      </DrawerContent>
    </Drawer>
  );
}
export default MenuCategory;
