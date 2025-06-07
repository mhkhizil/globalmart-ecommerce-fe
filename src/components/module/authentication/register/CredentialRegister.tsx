'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { z } from 'zod';

import Input from '@/components/common/Input';
import Loader from '@/components/common/loader/Loader';
import { Checkbox } from '@/components/ui/checkbox';
import { ValidationError } from '@/core/repository/UserRepository';
import { useRegister } from '@/lib/hooks/service/user/useRegister';

// Moved hook calls and schema definition outside the component function
const useCredentialRegister = () => {
  const t = useTranslations();
  const router = useRouter();

  const RegisterSchema = z
    .object({
      name: z.string().min(1, { message: t('validation.nameRequired') }),
      email: z.string().email({ message: t('validation.emailInvalid') }),
      password: z
        .string()
        .min(6, { message: t('validation.passwordMinLength') }),
      confirm_password: z
        .string()
        .min(1, { message: t('validation.confirmPasswordRequired') }),
    })
    .refine(data => data.password === data.confirm_password, {
      message: t('validation.passwordsDoNotMatch'),
      path: ['confirm_password'],
    });

  type ResgisterInputProps = z.infer<typeof RegisterSchema>;

  const { mutateAsync: registerHandler, isPending: isLoading } = useRegister({
    onSuccess: data => {
      toast.success(t('auth.registerSuccess'));
      router.push('/verification-pending');
    },
    onError: (error: Error | ValidationError) => {
      if (error instanceof ValidationError && error.errors) {
        const validationMessages = Object.entries(error.errors)
          .map(([, messages]) => messages[0])
          .join('\n');
        toast.error(validationMessages || t('auth.registrationFailed'));
      } else {
        toast.error(error.message || t('auth.registrationFailed'));
      }
    },
  });

  const formMethods = useForm<ResgisterInputProps>({
    resolver: zodResolver(RegisterSchema),
  });

  return { t, router, registerHandler, isLoading, formMethods };
};

function CredentialRegister() {
  const { t, router, registerHandler, isLoading, formMethods } =
    useCredentialRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formMethods;
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleRegister = handleSubmit(async credentials => {
    if (!isChecked) {
      toast.error(t('auth.termsNotAgreed'));
      return;
    }
    await registerHandler({
      ...credentials,
    });
  });

  return (
    <form className="flex w-full  flex-col" onSubmit={handleRegister}>
      <Toaster position="top-center" />
      <div className="mb-[14px]">
        {/* <span>{t('auth.name')}</span> */}
        <Input
          label={t('auth.name')}
          {...register('name')}
          className={clsx(
            'py-[16px] focus:outline-gray-500 border-[1px]',
            errors.name ? 'border-red-900' : 'border-[#D6D6D6]'
          )}
        />
        {errors.name && (
          <p className="text-red-900 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>
      <div className="mb-[14px]">
        {/* <span>{t('auth.emailAddress')}</span> */}
        <Input
          label={t('auth.emailAddress')}
          {...register('email')}
          className={clsx(
            'py-[16px] focus:outline-gray-500 border-[1px]',
            errors.email ? 'border-red-900' : 'border-[#D6D6D6]'
          )}
        />
        {errors.email && (
          <p className="text-red-900 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-[24px]">
        {/* <span>{t('auth.password')}</span> */}
        <Input
          label={t('auth.password')}
          {...register('password')}
          type="password"
          className={clsx(
            'py-[16px] focus:outline-gray-500 border-[1px]',
            errors.password ? 'border-red-900' : 'border-[#D6D6D6]'
          )}
        />
        {errors.password && (
          <p className="text-red-900 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>
      <div className="mb-[24px]">
        {/* <span>{t('auth.confirmPassword')}</span> */}
        <Input
          label={t('auth.confirmPassword')}
          {...register('confirm_password')}
          type="password"
          className={clsx(
            'py-[16px] focus:outline-gray-500 border-[1px]',
            errors.confirm_password ? 'border-red-900' : 'border-[#D6D6D6]'
          )}
        />
        {errors.confirm_password && (
          <p className="text-red-900 text-sm mt-1">
            {errors.confirm_password.message}
          </p>
        )}
      </div>
      <div className="flex w-full mb-[24px] items-center gap-x-1">
        <Checkbox
          id="terms1"
          color="yellow"
          className={clsx('rounded-[4px] mr-1', {
            'border-0': isChecked,
          })}
          checked={isChecked}
          onCheckedChange={checked => setIsChecked(Boolean(checked))}
        />
        <div className="text-[14px] font-[500] leading-[20px] flex-shrink ">
          {t('auth.agreeToTerms')}{' '}
          <span className="text-red-500">
            <Link href="#">{t('auth.termsOfService')}</Link>
          </span>{' '}
          {t('common.and')}{' '}
          <span className="text-red-500">
            <Link href="#">{t('auth.privacyPolicy')}</Link>
          </span>
        </div>
      </div>
      <div className="w-full flex items-center justify-center">
        {/* <Link
          href={'/merchant-register'}
          className="text-red-500 text-[14px] font-[500] leading-[20px]  text-center underline mb-[1.5rem]"
        >
          {t('auth.registerAsMerchant')}
        </Link> */}
      </div>
      <div className="flex w-full">
        <button
          type="submit"
          className={clsx(
            ' rounded-[100px] py-[16px] min-h-[52px] w-full text-[14px] font-semibold leading-[20px] text-white',
            {
              'bg-red-500': !isLoading,
              'bg-red-500/70': isLoading,
            }
          )}
        >
          {!isLoading && t('auth.signUp')}
          {isLoading && (
            <>
              <Loader />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
export default CredentialRegister;
