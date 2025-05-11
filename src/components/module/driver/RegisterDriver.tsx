'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Check, Eye, EyeOff, FileImage, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import { z } from 'zod';

import { FileUpload } from '@/components/common/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { CreateDriverDto, DriverDto } from '@/core/dtos/merchant/DriverDto';
import { ValidationError } from '@/core/repository/UserRepository';
import { useDriverRegister } from '@/lib/hooks/service/merchant/useDriverRegister';
import { useSession } from '@/lib/hooks/session/useSession';
import { isValidEmail } from '@/lib/util/validate-email';
import { hasPasswordCriteria } from '@/lib/util/validate-password';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

// Form validation schema
const driverFormSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().min(10, { message: 'Valid phone number is required' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .refine(value => hasPasswordCriteria(value), {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
      }),
    confirmPassword: z.string(),
    merchantId: z.string().optional(),
    latlong: z.string().default('0|0'),
    image: z.any().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type DriverFormValues = z.infer<typeof driverFormSchema>;

function RegisterDriver() {
  const { data: sessionData } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registeredDriver, setRegisteredDriver] = useState<
    CreateDriverDto | undefined
  >();
  const [copySuccess, setCopySuccess] = useState<string | undefined>();
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [lastSubmittedPassword, setLastSubmittedPassword] =
    useState<string>('');
  // Add a key state to reset FileUpload component
  const [fileUploadKey, setFileUploadKey] = useState<number>(0);
  const t = useTranslations('driver');
  // Add a useEffect to debug registeredDriver state changes
  useEffect(() => {
    if (registeredDriver) {
      console.log('registeredDriver state updated:', registeredDriver);
    }
  }, [registeredDriver]);

  const { mutate: registerDriver, isPending } = useDriverRegister({
    onSuccess: data => {
      toast.success(t('driverRegisteredSuccess'));
      console.log('API Response data:', data);

      // We don't need to set the driver data here as we've already set it
      // before the API call in the form submission handler
      console.log('Currently stored driver data:', registeredDriver);

      // Reset form and upload state for next entry
      reset();
      setUploadedImages([]);
      // Reset the file upload component
      setFileUploadKey(previous => previous + 1);
    },
    onError: (error: Error | ValidationError) => {
      if (error instanceof ValidationError && error.errors) {
        // Handle validation errors specifically
        const validationMessages = Object.entries(error.errors)
          .map(([field, messages]) => {
            // Special handling for image-related errors
            if (field === 'image') {
              return `${t('photo')}: ${messages[0]} (${t('imageUploadRequirement')})`;
            }
            return `${field}: ${messages[0]}`;
          })
          .join('\n');
        toast.error(validationMessages);
      } else {
        // Handle generic errors
        toast.error(error.message || t('registrationError'));
      }

      // Log the error for debugging
      console.error('Registration error:', error);
    },
  });

  // Function to copy driver info to clipboard
  const copyDriverInfo = () => {
    if (!registeredDriver) return;

    console.log('Copying driver info:', registeredDriver);

    const driverInfo = `
${t('driverInformation')}:
------------------
${t('name')}: ${registeredDriver.name}
${t('email')}: ${registeredDriver.email}
${t('phone')}: ${registeredDriver.phone}
${t('password')}: ${lastSubmittedPassword}
    `.trim();

    navigator.clipboard
      .writeText(driverInfo)
      .then(() => {
        setCopySuccess(t('copied'));
        setTimeout(() => setCopySuccess(undefined), 2000);
      })
      .catch(error => {
        console.error('Failed to copy text:', error);
        toast.error(t('failedToCopy'));
      });
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      latlong: '0|0',
      image: undefined,
    },
  });

  // Add a debug function to log errors
  const logFormErrors = () => {
    console.log('Form errors:', JSON.stringify(errors));
    console.log('Form values:', watch());
    console.log('Images uploaded:', uploadedImages);
    console.log('Is form valid?', isValid);
  };

  // Set merchant ID from session and try to get location on component mount
  useEffect(() => {
    if (sessionData?.user?.merchant_id) {
      setValue('merchantId', sessionData.user.merchant_id);
    }

    // Get geolocation in the background when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          const latlongValue = `${lat}|${long}`;
          setValue('latlong', latlongValue);
        },
        error => {
          console.error('Error getting location:', error);
          setValue('latlong', '0|0'); // Default if location access fails
        },
        { enableHighAccuracy: true, timeout: 10_000 }
      );
    }
  }, [sessionData, setValue]);

  // Handle file upload
  const handleFileUpload = (files: File[]) => {
    if (files.length === 0) {
      setUploadedImages([]);
      return;
    }

    // Validate file size (5MB max)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (files[0].size > MAX_FILE_SIZE) {
      toast.error(t('fileSizeExceedsLimit'));
      return;
    }

    setUploadedImages(files);
    toast.success(t('photoUploadedSuccess'));
  };

  // Add a debug function to log form data
  const debugFormData = (formData: FormData) => {
    console.log('--- FormData Contents ---');
    for (const pair of formData.entries()) {
      if (pair[0] === 'image' && pair[1] instanceof File) {
        console.log(
          `${pair[0]}: File - ${(pair[1] as File).name}, type: ${(pair[1] as File).type}, size: ${(pair[1] as File).size} bytes`
        );
      } else {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    }
    console.log('-----------------------');
  };

  return (
    <div className="h-[92dvh] w-full overflow-y-auto scrollbar-none py-6">
      <Toaster position="top-center" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-2xl font-bold mb-6 px-4">
          {t('registerNewDriver')}
        </h1>

        {/* Registered Driver Information Card */}
        {registeredDriver && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mb-8 bg-green-50 border border-green-200 rounded-lg overflow-hidden"
          >
            <div className="p-4 bg-green-100 border-b border-green-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-green-800">
                {t('driverRegisteredSuccessfully')}
              </h2>
              <Button
                onClick={copyDriverInfo}
                variant="ghost"
                className="h-8 px-3 text-green-700 hover:text-green-800 hover:bg-green-200"
              >
                {copySuccess ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    {copySuccess}
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                    {t('copyInfo')}
                  </>
                )}
              </Button>
            </div>
            <div className="p-4 space-y-2">
              <div className="grid grid-cols-[120px_1fr] gap-1">
                <span className="text-sm font-medium text-gray-600">
                  {t('name')}:
                </span>
                <span className="text-sm text-gray-800">
                  {registeredDriver.name}
                </span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-1">
                <span className="text-sm font-medium text-gray-600">
                  {t('email')}:
                </span>
                <span className="text-sm text-gray-800">
                  {registeredDriver.email}
                </span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-1">
                <span className="text-sm font-medium text-gray-600">
                  {t('phone')}:
                </span>
                <span className="text-sm text-gray-800">
                  {registeredDriver.phone}
                </span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-1">
                <span className="text-sm font-medium text-gray-600">
                  {t('password')}:
                </span>
                <span className="text-sm text-gray-800">
                  {lastSubmittedPassword}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={event => {
            event.preventDefault();
            console.log('Form submitted, bypassing normal validation');

            // Log current form state
            logFormErrors();

            // Get form values directly
            const formValues = watch();

            // Store the form values for future reference
            const driverFormData = {
              name: formValues.name,
              email: formValues.email,
              phone: formValues.phone,
              password: formValues.password,
              confirmPassword: formValues.confirmPassword,
            };
            console.log('Stored form values for later use:', driverFormData);

            // Manual validation
            let hasError = false;

            // Check required fields
            if (!formValues.name || formValues.name.length < 2) {
              toast.error(t('nameRequired'));
              hasError = true;
            }

            if (!formValues.email || !isValidEmail(formValues.email)) {
              toast.error(t('validEmailRequired'));
              hasError = true;
            }

            if (!formValues.phone) {
              toast.error(t('validPhoneRequired'));
              hasError = true;
            }

            if (!formValues.password || formValues.password.length < 6) {
              toast.error(t('validPasswordRequired'));
              hasError = true;
            }

            if (formValues.password !== formValues.confirmPassword) {
              toast.error(t('passwordsMustMatch'));
              hasError = true;
            }

            if (uploadedImages.length === 0) {
              toast.error(t('driverPhotoRequired'));
              hasError = true;
            }

            // If there are errors, stop here
            if (hasError) {
              console.log('Manual validation failed');
              return;
            }

            console.log('Manual validation passed, proceeding with submission');

            // Create FormData manually without relying on form validation
            try {
              const formData = new FormData();

              // Add basic fields
              formData.append('name', formValues.name);
              formData.append('email', formValues.email);
              formData.append('password', formValues.password);
              formData.append('confirm_password', formValues.confirmPassword);
              formData.append('contact_number', formValues.phone);
              formData.append('latlong', formValues.latlong);

              // Add merchant_id if available
              if (sessionData?.user?.merchant_id) {
                formData.append('merchant_id', sessionData.user.merchant_id);
              }

              // Add image
              if (uploadedImages.length > 0) {
                formData.append('image', uploadedImages[0]);
              }

              // Save password for display
              setLastSubmittedPassword(formValues.password);

              // Save form values in case the API doesn't return all fields
              setRegisteredDriver({
                name: formValues.name,
                email: formValues.email,
                phone: formValues.phone,
                password: formValues.password,
                confirmPassword: formValues.confirmPassword,
              });

              // Debug the FormData being sent
              debugFormData(formData);

              // Submit directly, bypassing react-hook-form
              registerDriver(formData);
            } catch (error) {
              console.error('Error in manual submission:', error);
              toast.error(t('formSubmissionFailed'));
            }
          }}
          className="space-y-6 bg-white p-6 w-full"
        >
          {/* Name Field */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              {t('fullName')}
            </label>
            <Input
              id="name"
              type="text"
              {...register('name')}
              placeholder={t('enterDriverFullName')}
              className={`w-full ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{t('nameError')}</p>
            )}
          </motion.div>

          {/* Email Field */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              {t('emailAddress')}
            </label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder={t('enterEmailAddress')}
              className={`w-full ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{t('emailError')}</p>
            )}
          </motion.div>

          {/* Phone Field */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              {t('phoneNumber')}
            </label>
            <Input
              id="phone"
              type="text"
              {...register('phone')}
              placeholder={t('enterPhoneNumber')}
              className={`w-full ${errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{t('phoneError')}</p>
            )}
          </motion.div>

          {/* Image Upload Field */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label
              htmlFor="image"
              className=" text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <FileImage size={16} className="text-gray-500" />
              {t('driverPhoto')}
            </label>
            <FileUpload
              key={fileUploadKey}
              onFileUpload={handleFileUpload}
              accept="image/jpeg, image/jpg, image/png"
              multiple={false}
              className={
                uploadedImages.length === 0 && errors.image
                  ? 'border-red-500'
                  : ''
              }
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">{t('uploadClearPhoto')}</p>
              {uploadedImages.length > 0 && (
                <p className="text-xs text-green-600 font-medium">
                  ✓ {t('photoUploaded')}
                </p>
              )}
            </div>
            {errors.image && (
              <p className="text-sm text-red-500">
                {typeof errors.image.message === 'string'
                  ? errors.image.message
                  : t('driverPhotoRequired')}
              </p>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              {t('password')}
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder={t('createStrongPassword')}
                className={`w-full pr-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{t('passwordError')}</p>
            )}
          </motion.div>

          {/* Confirm Password Field */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              {t('confirmPassword')}
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                placeholder={t('confirmYourPassword')}
                className={`w-full pr-10 ${errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {t('confirmPasswordError')}
              </p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="pt-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('registering')}
                </>
              ) : (
                t('registerDriver')
              )}
            </Button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
}

export default RegisterDriver;
