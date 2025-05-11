'use client';

import Link from 'next/link';

import BrandPreviewCard from './BrandPreviewCard';

function BrandPreview() {
  return (
    <div className="flex w-full flex-col mt-[1rem]">
      <div className="flex w-full items-center justify-between px-[1.2rem]">
        <span className="text-[1rem] font-[600] leading-[1.8rem]">
          Feature Brands
        </span>
        <Link
          href={'/application/Brand/list'}
          className="text-[#FE8C00] text-[0.875rem] leading-[1.25rem] font-[500] underline"
        >
          See All
        </Link>
      </div>
      <div className="flex w-full space-x-4 p-4 scrollbar-none overflow-x-auto ">
        <div className="w-[20dvw] sm:w-[80px] flex-shrink-0" key={1}>
          <BrandPreviewCard url="https://eiee6dhaa8.ufs.sh/f/4PbNtc78sfabDF2mcPrfdlNWVtLCO1PiknM56XES2I0xUHD3" />
        </div>
        <div className="w-[20dvw] sm:w-[80px] flex-shrink-0" key={2}>
          <BrandPreviewCard url="https://eiee6dhaa8.ufs.sh/f/4PbNtc78sfabaReD9ySk6E8cndIAjYtlUyKV50Jh7B1xNrbq" />
        </div>
        <div className="w-[20dvw] sm:w-[80px] flex-shrink-0" key={3}>
          <BrandPreviewCard url="https://eiee6dhaa8.ufs.sh/f/4PbNtc78sfabfKLv7WwQCdNc2WXxOiF8RLjDuTGkYs7zZytB" />
        </div>
        <div className="w-[20dvw] sm:w-[80px] flex-shrink-0" key={4}>
          <BrandPreviewCard url="https://eiee6dhaa8.ufs.sh/f/4PbNtc78sfabUZ7yFYzsuozOgF69IWcMV0irmafSbAKwZXC2" />
        </div>
        <div className="w-[20dvw] sm:w-[80px] flex-shrink-0" key={5}>
          <BrandPreviewCard url="https://eiee6dhaa8.ufs.sh/f/4PbNtc78sfabDF2mcPrfdlNWVtLCO1PiknM56XES2I0xUHD3" />
        </div>
        <div className="w-[20dvw] sm:w-[80px] flex-shrink-0" key={6}>
          <BrandPreviewCard url="https://eiee6dhaa8.ufs.sh/f/4PbNtc78sfabaReD9ySk6E8cndIAjYtlUyKV50Jh7B1xNrbq" />
        </div>
        <div className="w-[20dvw] sm:w-[80px] flex-shrink-0" key={7}>
          <BrandPreviewCard url="https://eiee6dhaa8.ufs.sh/f/4PbNtc78sfabfKLv7WwQCdNc2WXxOiF8RLjDuTGkYs7zZytB" />
        </div>
        <div className="w-[20dvw] sm:w-[80px] flex-shrink-0" key={8}>
          <BrandPreviewCard url="https://eiee6dhaa8.ufs.sh/f/4PbNtc78sfabUZ7yFYzsuozOgF69IWcMV0irmafSbAKwZXC2" />
        </div>
      </div>
    </div>
  );
}
export default BrandPreview;
