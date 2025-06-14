'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

import Input from '@/components/common/Input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useResetPassword } from '@/lib/hooks/service/auth/useResetPassword';

import ResetPasswordDrawer from './ResetPasswordSuccessDrawer';

interface FormData {
  newPassword: string;
  confirmPassword: string;
}

function ConfirmPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const drawerRef = useRef(null);

  // State for error handling
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Extract URL parameters with validation
  const { otp, email } = useMemo(() => {
    if (!searchParams) {
      return { otp: '', email: '' };
    }

    const otp = searchParams.get('otp');
    const email = searchParams.get('email');

    return {
      otp: otp?.trim() || '',
      email: email?.trim() || '',
    };
  }, [searchParams]);

  // Form setup with validation
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: 'onChange',
  });

  const watchNewPassword = watch('newPassword');

  // Reset password mutation with comprehensive error handling
  const { mutate: resetPassword, isPending } = useResetPassword({
    onSuccess: () => {
      toast.success('Password reset successfully!');
      if (drawerRef.current) {
        (drawerRef.current as any).click();
      }
    },
    onError: (error: Error) => {
      const message =
        error.message || 'Password reset failed. Please try again.';
      setErrorMessage(message);
      setShowErrorModal(true);
      toast.error(message);
    },
  });

  // Validate URL parameters on component mount
  useEffect(() => {
    if (!otp || !email) {
      toast.error('Invalid reset link. Please request a new password reset.');
      router.push('/forgot-password');
    }
  }, [otp, email, router]);

  // Password validation rules
  const passwordValidation = {
    required: 'New password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters long',
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    },
  };

  const confirmPasswordValidation = {
    required: 'Please confirm your password',
    validate: (value: string) =>
      value === watchNewPassword || 'Passwords do not match',
  };

  // Form submission handler
  const resetPasswordHandler = handleSubmit(async (data: FormData) => {
    if (!otp || !email) {
      toast.error('Invalid reset parameters. Please try again.');
      return;
    }

    resetPassword({
      otp,
      email,
      password: data.newPassword,
      confirm_password: data.confirmPassword,
    });
  });

  // Error modal handlers
  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  const handleRedirectToLogin = () => {
    setShowErrorModal(false);
    router.push('/login');
  };

  const isLoading = isPending || isSubmitting;

  return (
    <>
      <Toaster position="top-right" />

      <form
        className="flex w-full h-full flex-col"
        onSubmit={resetPasswordHandler}
      >
        <ResetPasswordDrawer ref={drawerRef} />

        {/* New Password Field */}
        <div className="mb-[24px] gap-y-[8px]">
          <span className="text-[14px] font-[500] leading-[20px] text-[#101010]">
            New Password
          </span>
          <Input
            label="New Password"
            {...register('newPassword', passwordValidation)}
            type="password"
            className="py-[16px] focus:outline-gray-500 border-[#D6D6D6] border-[1px] mt-[8px]"
            disabled={isLoading}
          />
          {errors.newPassword && (
            <span className="text-[12px] font-[400] leading-[16px] text-red-500 mt-[4px] block">
              {errors.newPassword.message}
            </span>
          )}
          {!errors.newPassword && (
            <span className="text-[14px] font-[500] leading-[20px] text-[#878787] mt-[8px] block">
              Must be at least 8 characters with uppercase, lowercase, and
              number
            </span>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="mb-[24px] gap-y-[8px]">
          <span className="text-[14px] font-[500] leading-[20px] text-[#101010]">
            Confirm Password
          </span>
          <Input
            label="Confirm Password"
            {...register('confirmPassword', confirmPasswordValidation)}
            type="password"
            className="py-[16px] focus:outline-gray-500 border-[#D6D6D6] border-[1px] mt-[8px]"
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <span className="text-[12px] font-[400] leading-[16px] text-red-500 mt-[4px] block">
              {errors.confirmPassword.message}
            </span>
          )}
          {!errors.confirmPassword && (
            <span className="text-[14px] font-[500] leading-[20px] text-[#878787] mt-[8px] block">
              Both passwords must match
            </span>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex w-full h-full items-end mb-[20px]">
          <button
            type="submit"
            disabled={isLoading || !otp || !email}
            className="bg-[#FE8C00] rounded-[100px] py-[16px] w-full text-[14px] font-semibold leading-[20px] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FE8C00]/90 transition-colors"
          >
            {isLoading ? 'Updating Password...' : 'Reset Password'}
          </button>
        </div>
      </form>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="sm:max-w-md w-[90%] mx-auto rounded-lg bg-white border-none shadow-2xl">
          <DialogHeader className="text-center space-y-4 pt-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
              Password Reset Failed
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-base leading-relaxed">
              {errorMessage}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col gap-3 pt-4">
            <Button
              onClick={handleRedirectToLogin}
              className="w-full bg-[#FE8C00] hover:bg-[#FE8C00]/90 text-white font-semibold py-3 rounded-full text-sm transition-colors"
            >
              Go to Login
            </Button>
            <Button
              onClick={handleCloseErrorModal}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 font-semibold py-3 rounded-full text-sm hover:bg-gray-50 transition-colors"
            >
              Try Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ConfirmPassword;
