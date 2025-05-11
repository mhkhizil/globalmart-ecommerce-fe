import Image from 'next/image';

import NotificationIcon from '@/components/common/icons/NotificationIcon';
import SearchIcon from '@/components/common/icons/SearchIcon';
import { Skeleton } from '@/components/ui/skeleton';

interface InputProps {
  isLoading: boolean;
  coverImage: string;
}

function MerchantProfileHeader(props: InputProps) {
  const { coverImage, isLoading } = props;

  if (isLoading)
    return (
      <Skeleton className="flex w-full h-[30dvh] relative flex-col flex-shrink-0 z-0" />
    );

  return (
    <div className="flex w-full h-[30dvh] relative flex-col flex-shrink-0 z-0">
      <Image
        src={
          coverImage === ''
            ? 'https://eiee6dhaa8.ufs.sh/f/4PbNtc78sfabl22wqbpUB5crbpzm0hLAqj3yRitvkJFw2Dod'
            : coverImage
        }
        width={512}
        height={512}
        alt="header"
        className="w-full h-full inset-0 absolute"
      />
      <div className="flex w-full justify-end z-20 gap-x-3 pt-[1rem] pr-[1rem]">
        <SearchIcon className=" fill-none hover:scale-[110%] transform duration-500" />

        <NotificationIcon className=" fill-none hover:scale-[110%] transform duration-500" />
      </div>
    </div>
  );
}
export default MerchantProfileHeader;
