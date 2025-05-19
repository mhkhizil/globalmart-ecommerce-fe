'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

import BackIcon from '@/components/common/icons/BackIcon';
import CameraIcon from '@/components/common/icons/CameraIcon';
import Input from '@/components/common/Input';
import Loader from '@/components/common/loader/Loader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProfileUpdateRequestDto } from '@/core/dtos/user/profile-update/ProfileUpdateRequestDto';
import { useGetUser } from '@/lib/hooks/service/user/useGetUserById';
import { useProfileUpdate } from '@/lib/hooks/service/user/useProfileUpdate';
import { useSession } from '@/lib/hooks/session/useSession';

import ProfileHeader from '../profile/ProfileHeader';

function PersonalData() {
  const router = useRouter();
  const t = useTranslations();
  const { register, handleSubmit, reset } = useForm<ProfileUpdateRequestDto>();

  const { data: currentUser, isLoading } = useGetUser();

  const { mutateAsync: updateProfile, isPending } = useProfileUpdate({
    onSuccess: data => {
      toast.success(t('profile.profileUpdated'));
    },
    onError: () => {
      toast.error(t('profile.updateError'));
    },
  });
  const onProfileUpdate = handleSubmit(async credentials => {
    await updateProfile({
      ...credentials,
      // email: currentUser?.email || "",
    });
  });
  useEffect(() => {
    if (currentUser) {
      reset({
        name: currentUser.name,
        latlong: currentUser.latlong,
        phone: currentUser.phone,
        email: currentUser.email,
        address: currentUser.address,
      });
    }
  }, [currentUser, reset]);
  return (
    <div className="flex w-full flex-col px-[1.5rem] items-center">
      <Toaster />
      <div className="flex relative w-full mt-[20px] items-center justify-center">
        <div className="absolute left-0">
          <button onClick={() => router.back()}>
            <BackIcon />
          </button>
        </div>
        <div className="">
          <span className="text-[#101010] text-[16px] leading-[24px] font-semibold">
            {t('profile.personalData')}
          </span>
        </div>
      </div>
      {/* <div className="relative mt-[2.625rem]">
        <Avatar className="w-[6.25rem] h-[6.25rem]">
          <AvatarImage
            src="/profilepicture.png"
            alt="@shadcn"
            className="object-cover"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="absolute bottom-[2%] right-[1px]">
          <CameraIcon />
        </div>
      </div> */}
      <ProfileHeader />
      <form
        className="flex w-full mt-[1.5rem] flex-col font-['Montserrat']"
        onSubmit={onProfileUpdate}
      >
        <div className="flex w-full mb-4">
          <span className="text-[#101010] text-[16px] leading-[24px] font-semibold">
            {'Personal Details'}
          </span>
        </div>
        {/* <div className="mb-[14px]">
          <span>{t('profile.fullName')}</span>
          <Input
            label="name"
            {...register('name', { required: 'name required' })}
            className="py-[16px]  focus:outline-gray-500 border-[#D6D6D6] border-[1px] h-[3.25rem]"
          />
        </div>
        <div className="mb-[24px]">
          <span>{t('profile.address')}</span>
          <Input
            label="Address"
            {...register('address', { required: 'location required' })}
            type="text"
            className="py-[16px] focus:outline-gray-500 border-[#D6D6D6] border-[1px] h-[3.25rem]"
          />
        </div>

        <div className="mb-[24px] flex flex-col">
          <span>{t('profile.phone')}</span>
          <Input
            label="Phone"
            {...register('phone', { required: 'phone required' })}
            type="text"
            className="py-[16px] focus:outline-gray-500 border-[#D6D6D6] border-[1px] h-[3.25rem]"
          />
        </div> */}
        <div className="mb-[14px]">
          <span>{t('profile.email')}</span>
          <Input
            label="email"
            {...register('email', { required: 'email required' })}
            className="py-[16px]  focus:outline-gray-500 border-[#D6D6D6] border-[1px] h-[3.25rem]"
          />
        </div>
        <div className="mb-[14px]">
          <span>{'Password'}</span>
          <Input
            type="password"
            label="password"
            {...register('phone', { required: 'password required' })}
            className="py-[16px]  focus:outline-gray-500 border-[#D6D6D6] border-[1px] h-[3.25rem]"
          />
        </div>
        <div className="flex w-full justify-end">
          <span className="text-[#F83758] text-[12px] leading-[24px] font-[500] underline cursor-pointer">
            {'Change Password'}
          </span>
        </div>

        <div className="flex w-full my-4">
          <span className="text-[#101010] text-[16px] leading-[24px] font-semibold">
            {'Business Address Detail'}
          </span>
        </div>

        <div className="mb-[24px]">
          <span>{'Pincode'}</span>
          <Input
            label="Address"
            {...register('address', { required: 'pin code required' })}
            type="text"
            className="py-[16px] focus:outline-gray-500 border-[#D6D6D6] border-[1px] h-[3.25rem]"
          />
        </div>
        <div className="mb-[24px]">
          <span>{t('profile.address')}</span>
          <Input
            label="Address"
            {...register('address', { required: 'city required' })}
            type="text"
            className="py-[16px] focus:outline-gray-500 border-[#D6D6D6] border-[1px] h-[3.25rem]"
          />
        </div>
        <div className="mb-[24px]">
          <span>{'City'}</span>
          <Input
            label="Address"
            {...register('address', { required: 'city required' })}
            type="text"
            className="py-[16px] focus:outline-gray-500 border-[#D6D6D6] border-[1px] h-[3.25rem]"
          />
        </div>
        <div className="mb-[24px]">
          <span>{'State'}</span>
          <Input
            label="Address"
            {...register('address', { required: 'state required' })}
            type="text"
            className="py-[16px] focus:outline-gray-500 border-[#D6D6D6] border-[1px] h-[3.25rem]"
          />
        </div>
        <div className="mb-[24px]">
          <span>{'Country'}</span>
          <Input
            label="Address"
            {...register('address', { required: 'country required' })}
            type="text"
            className="py-[16px] focus:outline-gray-500 border-[#D6D6D6] border-[1px] h-[3.25rem]"
          />
        </div>

        <div className="flex w-full mb-4">
          <button
            className={clsx(
              ' rounded-[8px] py-[16px] min-h-[52px] w-full text-[14px] font-semibold leading-[20px] text-white',
              {
                'bg-[#F83758]': !isPending,
                'bg-[#F83758]/70': isPending,
              }
            )}
          >
            {isPending ? <Loader /> : t('profile.save')}
          </button>
        </div>
      </form>
    </div>
  );
}
export default PersonalData;
