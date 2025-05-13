'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import Input from '@/components/common/Input';

function ConfirmEmail() {
  const router = useRouter();
  const t = useTranslations();
  const { register, handleSubmit } = useForm<{ email: string }>({
    defaultValues: { email: '' },
  });

  const confirmEmailHandler = handleSubmit(data => {
    router.push(`/otp-forgot-password?email=${data?.email}`);
  });

  return (
    <form
      className="flex w-full h-full flex-col"
      onSubmit={confirmEmailHandler}
    >
      <div className="mb-[14px]">
        <span>{t('forgotPassword.emailAddress')}</span>
        <Input
          label={t('auth.email')}
          className="py-[16px]  focus:outline-gray-500 border-[#D6D6D6] border-[1px]"
          {...register('email', { required: t('auth.invalidEmail') })}
        />
      </div>

      <div className="flex w-full h-full items-end">
        <button
          type="submit"
          className="bg-red-500 rounded-[100px] py-[16px] w-full text-[14px] font-semibold leading-[20px] text-white"
        >
          {t('auth.continue')}
        </button>
      </div>
    </form>
  );
}
export default ConfirmEmail;
