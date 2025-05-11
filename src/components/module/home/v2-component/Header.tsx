import { SearchIcon } from 'lucide-react';

import LikeIcon from '@/components/common/icons/LikeIcon';
import LocationIcon from '@/components/common/icons/LocationIcon';

function Header() {
  return (
    <div className="flex w-full flex-col bg-[#FE8C00] pt-[1rem] h-[30dvh] flex-shrink-0">
      <div className="flex w-full justify-between items-center px-[1.2rem]">
        <div className="flex items-center gap-x-3">
          <LocationIcon />
          <div className="flex flex-col">
            <span className="text-white text-[1rem]  font-[600]">
              55/2 Soi Suwinthawong2
            </span>
            <span className="text-white text-[0.8rem]  font-[600]">
              Min Buri,Bangkok
            </span>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center px-[1.5rem] py-[1rem] sticky top-2">
        <div className="flex w-full items-center border-[1px] bg-white rounded-[15px] py-[0.3rem] px-[0.2rem] gap-x-2">
          <SearchIcon color="#FE8C00" />
          <input
            className="flex w-full rounded-[10px] focus:outline-none px-[0.3rem]"
            placeholder="search your food"
          />
        </div>
      </div>
    </div>
  );
}
export default Header;
