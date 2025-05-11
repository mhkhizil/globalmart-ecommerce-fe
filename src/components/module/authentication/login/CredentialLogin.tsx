'use client';

import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import Input from '@/components/common/Input';
import Loader from '@/components/common/loader/Loader';
import { useLogin } from '@/lib/hooks/service/auth/useLogin';
import { useCart } from '@/lib/hooks/store/useCart';
import { AppDispatch } from '@/lib/redux/ReduxStore';
import { loginUser } from '@/lib/redux/slices/CartSlice';

import ForgotPasswordDrawer from './ForgotPassowrdDrawer';

export type LoginProps = {
  email: string;
  password: string;
};

function CredentialLogin() {
  const t = useTranslations();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginProps>();
  const queryClient = useQueryClient();
  const { mutateAsync: handleLogin, isPending } = useLogin({
    onSuccess: data => {
      // setUser(data?.data?.user?.id.toString());
      const userId = data?.data?.user?.id.toString();
      dispatch(loginUser(userId));
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries();
      switch (data?.data?.user?.roles) {
        case 1: {
          router.push('/application/home');
          break;
        }
        case 2: {
          router.push('/application/merchant-home');
          break;
        }
        case 3: {
          router.push('/application/driver-home');
          break;
        }
        default: {
          router.push('/application/home');
        }
      }
    },
    onError: (error: any) => {
      toast.error(error?.message);
    },
  });

  const loginHandler = handleSubmit(async credentials => {
    handleLogin({ ...credentials });
  });
  return (
    <form className="flex w-full  flex-col" onSubmit={loginHandler}>
      <Toaster />
      <div className="mb-[14px]">
        <span>{t('auth.email')}</span>
        <Input
          label={t('auth.email')}
          {...register('email', { required: 'email required' })}
          className="py-[16px]  focus:outline-gray-500 border-[#D6D6D6] border-[1px]"
        />
      </div>
      <div className="mb-[24px]">
        <span>{t('auth.password')}</span>
        <Input
          label={t('auth.password')}
          {...register('password', { required: 'password required' })}
          type="password"
          className="py-[16px] focus:outline-gray-500 border-[#D6D6D6] border-[1px]"
        />
      </div>
      <div className="flex w-full justify-end mb-[24px]">
        <ForgotPasswordDrawer />
      </div>
      <div className="flex w-full">
        <button
          type="submit"
          className={clsx(
            ' rounded-[100px] py-[16px] min-h-[52px] w-full text-[14px] font-semibold leading-[20px] text-white',
            {
              'bg-[#FE8C00]': !isPending,
              'bg-[#FE8C00]/70': isPending,
            }
          )}
        >
          {isPending ? (
            <span>
              <Loader />
            </span>
          ) : (
            <span>{t('auth.signIn')}</span>
          )}
          {/* {isPending && (
            <>
              <Loader />
            </>
          )} */}
        </button>
      </div>
    </form>
  );
}
export default CredentialLogin;
