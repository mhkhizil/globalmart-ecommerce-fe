'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { parsePhoneNumber } from 'react-phone-number-input';

import Input from '@/components/common/Input';
import Loader from '@/components/common/loader/Loader';
import { Checkbox } from '@/components/ui/checkbox';
import { PhoneInput } from '@/components/ui/phone-input';
import { Textarea } from '@/components/ui/textarea';
import { ShopType } from '@/core/entity/Shop';
import { ValidationError } from '@/core/repository/UserRepository';
import { useMerchantRegister } from '@/lib/hooks/service/merchant/useMerchantRegister';
import { isValidEmail } from '@/lib/util/validate-email';
import { hasPasswordCriteria } from '@/lib/util/validate-password';

import CitySelect from './CitySelect';
import CountrySelect from './CountrySelect';
import ShopSelect from './ShopSelect';
import StateSelect from './StateSelect';

interface InputProps {
  shopList: ShopType[];
  countryList: any;
  stateList: any;
  cityList: any;
}

interface Country {
  name: string;
  isoCode: string;
  flag: string;
  phonecode: string;
  currency: string;
}

interface State {
  name: string;
  isoCode: string;
  countryCode: string;
  latitude: string;
  longitude: string;
}

interface City {
  name: string;
  countryCode: string;
  stateCode: string;
  longitude: string;
  latitude: string;
}

type RegisterProps = {
  email: string;
  password: string;
  confirm_password: string;
  country_id: string;
  state_id: string;
  city_id: string;
  phone_code: number;
  phone: string;
  name: string;
  address: string;
  latlong: string;
  s_id: number;
};

function flattenStateData(json: any): any[] {
  const result: any[] = [];

  for (const country in json) {
    if (json.hasOwnProperty(country)) {
      for (const state of json[country]) {
        result.push(state);
      }
    }
  }

  return result;
}

function flattenCityData(json: any) {
  let result: any = [];

  // Iterate over each country
  for (let country in json) {
    // Iterate over each state in the country
    for (let state in json[country]) {
      // Iterate over each city in the state
      json[country][state].forEach((city: any) => {
        // Add the city object to the result array
        result.push(city);
      });
    }
  }

  return result;
}

// Custom No-Country-Display Phone Input that accepts any number format
const HiddenCountryPhoneInput = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof PhoneInput>
>((props, ref) => {
  const t = useTranslations();

  // Handle direct input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = event.target.value.replaceAll(/[^0-9]/g, '');
    props.onChange?.(value as any);
  };

  return (
    <div ref={ref} className="relative w-full">
      <Input
        value={props.value || ''}
        onChange={handleInputChange}
        className={`${props.className} pl-3 rounded-lg border border-[#D6D6D6]`}
        type="tel"
        label={t('auth.phoneNumber')}
        name="phone-direct"
      />
    </div>
  );
});

HiddenCountryPhoneInput.displayName = 'HiddenCountryPhoneInput';

function CredentialMerchantRegister(props: InputProps) {
  const t = useTranslations();
  const { shopList, countryList, stateList, cityList } = props;
  const flattenedStateList = flattenStateData(stateList);
  const flattenedCityList = flattenCityData(cityList);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [currentShop, setCurrentShop] = useState<number>(shopList[0]?.id || 0);
  const [currentCountry, setCurrentCountry] = useState<Country>();
  const [currentState, setCurrentState] = useState<State>();
  const [currentCity, setCurrentCity] = useState<City>();
  const [defaultPhoneCode, setDefaultPhoneCode] = useState<any>();
  const [latlong, setLatlong] = useState<string>();

  useEffect(() => {
    if (currentCountry) {
      setDefaultPhoneCode(currentCountry?.isoCode);
    }
  }, [currentCountry]);

  useEffect(() => {
    if ('geolocation' in navigator && !latlong) {
      navigator.geolocation.getCurrentPosition(async position => {
        // setValue(
        //   'latlong',
        //   `${position.coords.latitude}|${position.coords.longitude}`
        // );
        const lat = position.coords.latitude.toString();
        const lng = position.coords.longitude.toString();
        setLatlong(lat + '|' + lng);
      });
    }
  }, [latlong, setLatlong]);

  const filterStateList = useMemo(() => {
    if (!currentCountry) return flattenStateData;
    return flattenedStateList.filter(
      (state: State) => state.countryCode === currentCountry.isoCode
    );
  }, [currentCountry, flattenedStateList]);

  const filterCityList = useMemo(() => {
    if (!currentCountry && !currentState) return flattenCityData;

    if (!currentState && currentCountry)
      return flattenedCityList.filter(
        (city: City) => city.countryCode === currentCountry.isoCode
      );
    if (currentCountry && currentState)
      return flattenedCityList.filter(
        (city: City) =>
          city.countryCode === currentCountry.isoCode &&
          city.stateCode === currentState.isoCode
      );
  }, [currentCountry, currentState, flattenedCityList]);

  const { register, handleSubmit, control, setValue } =
    useForm<RegisterProps>();
  const router = useRouter();
  const { mutateAsync: merchantRegisterHandler, isPending } =
    useMerchantRegister({
      onSuccess: () => {
        router.push('/verification-pending');
      },
      onError: (error: Error | ValidationError) => {
        if (error instanceof ValidationError && error.errors) {
          // Handle validation errors specifically - show the first error from each field
          const validationMessages = Object.entries(error.errors)
            .map(([field, messages]) => `${field}: ${messages[0]}`)
            .join('\n');
          toast.error(validationMessages);
        } else {
          // Handle generic errors
          toast.error(error.message);
        }
      },
    });

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        setValue(
          'latlong',
          `${position.coords.latitude}|${position.coords.longitude}`
        );
      });
    }
  }, [setValue]);

  const handleRegister = handleSubmit(async credentials => {
    if (!isChecked) {
      toast.error('You need to aggree with terms and service');
      return;
    }

    if (!isValidEmail(credentials.email)) {
      toast.error('Invalid email format');
      return;
    }
    if (credentials.confirm_password !== credentials.password) {
      toast.error('Please confirm your password');
      return;
    }
    // if (!hasPasswordCriteria(credentials.password)) {
    //   toast.error(
    //     'Your password must include at least one upper-case, lower-case, number and special character'
    //   );
    //   return;
    // }
    if (credentials.password.length < 6) {
      toast.error(t('auth.passwordLessThan6'));
      return;
    }

    // Handle phone number directly
    const phoneValue = credentials.phone || '';

    const { ...registrationData } = credentials;
    merchantRegisterHandler({
      ...registrationData,
      phone_code: 0, // Not using phone code validation anymore
      phone: phoneValue,
      country_id: '', // previously: currentCountry?.isoCode || '',
      state_id: '', // previously: currentState?.isoCode || '',
      city_id: '', // previously: currentCity?.name || '',
      latlong: latlong || '0|0',
      s_id: currentShop,
      shop_type_id: shopList.find(shop => shop.id === currentShop)?.id || 0,
    });
  });
  return (
    <form className="flex w-full  flex-col" onSubmit={handleRegister}>
      <Toaster />
      <div className="mb-[14px]">
        <span>{t('auth.name')}</span>
        <Input
          label={t('auth.name')}
          {...register('name', { required: 'email required' })}
          className="py-[16px] h-[58px] focus:outline-gray-500 border-[#D6D6D6] border-[1px]"
        />
      </div>
      <div className="mb-[14px]">
        <span>{t('auth.emailAddress')}</span>
        <Input
          label={t('auth.emailAddress')}
          {...register('email', { required: 'email required' })}
          className="py-[16px] h-[58px] focus:outline-gray-500 border-[#D6D6D6] border-[1px]"
        />
      </div>
      <div className="mb-[14px]">
        <span>{t('auth.password')}</span>
        <Input
          label={t('auth.password')}
          {...register('password', { required: 'password required' })}
          type="password"
          className="py-[16px] h-[58px] focus:outline-gray-500 border-[#D6D6D6] border-[1px]"
        />
      </div>
      <div className="mb-[14px]">
        <span>{t('auth.confirmPassword')}</span>
        <Input
          label={t('auth.confirmPassword')}
          {...register('confirm_password', {
            required: 'confirm password required',
          })}
          type="password"
          className="py-[16px] h-[58px] focus:outline-gray-500 border-[#D6D6D6] border-[1px]"
        />
      </div>
      <div className="mb-[14px]">
        <span>{t('auth.shopAddress')}</span>
        <Textarea
          placeholder={t('auth.shopAddress')}
          {...register('address', { required: 'address is required' })}
          className="focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>
      {/* Country, State and City fields - commented for future reuse
      <div className="mb-[14px]">
        <span>{t('auth.country')}</span>
        <CountrySelect options={countryList} setCountry={setCurrentCountry} />
      </div>
      <div className="mb-[14px]">
        <span>{t('auth.state')}</span>
        <StateSelect
          options={filterStateList}
          setStateId={setCurrentState}
          disabled={currentCountry ? false : true}
        />
      </div>
      <div className="mb-[14px]">
        <span>{t('auth.city')}</span>
        <CitySelect
          options={filterCityList}
          setCityId={setCurrentCity}
          disabled={currentCountry ? false : true}
        />
      </div>
      */}
      <div className="mb-[14px]">
        <span>{t('auth.phoneNumber')}</span>

        <Controller
          name="phone"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <HiddenCountryPhoneInput
              className="min-h-[58px] h-[58px]"
              value={value}
              onChange={onChange}
            />
          )}
        />
      </div>
      <div className="mb-[14px]">
        <span>{t('auth.shopType')}</span>
        <ShopSelect options={shopList} setShop={setCurrentShop} />
      </div>
      <div className="flex w-full mb-[24px] items-center gap-x-1">
        <Checkbox
          id="terms1"
          color="yellow"
          className={clsx('rounded-[4px] mr-1', {
            'border-0': isChecked,
          })}
          onClick={() => setIsChecked(previous => !previous)}
        />
        <div className="text-[14px] font-[500] leading-[20px] flex-shrink ">
          {t('auth.agreeToTerms')}{' '}
          <span className="text-[#FE8C00]">
            <Link href="#">{t('auth.termsOfService')}</Link>
          </span>{' '}
          {t('common.and')}{' '}
          <span className="text-[#FE8C00]">
            <Link href="#">{t('auth.privacyPolicy')}</Link>
          </span>
        </div>
      </div>
      <div className="w-full flex items-center justify-center">
        <Link
          href={'/register'}
          className="text-[#FE8C00] text-[14px] font-[500] leading-[20px]  text-center underline mb-[1.5rem]"
        >
          {t('auth.registerAsUser')}
        </Link>
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
          {isPending ? <Loader /> : t('auth.signUp')}
        </button>
      </div>
    </form>
  );
}
export default CredentialMerchantRegister;
