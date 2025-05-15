'use client';

import { useRef } from 'react';
import { useForm } from 'react-hook-form';

import Input from '@/components/common/Input';

import ResetPasswordDrawer from './ResetPasswordSuccessDrawer';

function ConfirmPassword() {
  const { register, handleSubmit } = useForm<{
    newPassword: string;
    confirmPassword: string;
  }>();

  const drawerRef = useRef(null);

  const resetPasswordHandler = handleSubmit(async data => {
    if (drawerRef.current) (drawerRef?.current as any).click();
  });

  return (
    <form
      className="flex w-full h-full flex-col"
      onSubmit={resetPasswordHandler}
    >
      <ResetPasswordDrawer ref={drawerRef} />
      <div className="mb-[24px] gap-y-[8px]">
        <span>New Password</span>
        <Input
          label="New Password"
          {...register('newPassword', { required: 'new password required' })}
          type="password"
          className="py-[16px] focus:outline-gray-500 border-[#D6D6D6] border-[1px]"
        />
        <span className="text-[14px] font-[500] leading-[20px] text-[#878787] mt-[8px]">
          Must be at least 8 character
        </span>
      </div>
      <div className="mb-[24px] gap-y-[8px]">
        <span>Confirm Password</span>
        <Input
          label="Confirm Password"
          {...register('confirmPassword', {
            required: 'confirm password required',
          })}
          type="password"
          className="py-[16px] focus:outline-gray-500 border-[#D6D6D6] border-[1px]"
        />
        <span className="text-[14px] font-[500] leading-[20px] text-[#878787] mt-[8px]">
          Both password must match
        </span>
      </div>

      <div className="flex w-full h-full items-end mb-[20px]">
        <button className="bg-red-500 rounded-[100px] py-[16px] w-full text-[14px] font-semibold leading-[20px] text-white">
          Verify Account
        </button>
      </div>
    </form>
  );
}
export default ConfirmPassword;
