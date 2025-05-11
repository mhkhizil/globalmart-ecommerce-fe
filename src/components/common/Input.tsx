'use client';

import clsx from 'clsx';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { get } from 'react-hook-form';

import Eye from './icons/Eye';
import EyeOff from './icons/EyeOff';

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'placeholder'
> & {
  label: string;
  errors?: Record<string, unknown>;
  touched?: Record<string, unknown>;
  name: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { type, name, label, errors, touched, required, className, ...props },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [inputType, setInputType] = useState(type);
    const [hasFocus, setHasFocus] = useState(false);

    const handleFocus = React.useCallback(() => {
      if (type === 'password' && showPassword) {
        setInputType('text');
      }

      if (type === 'password' && !showPassword) {
        setInputType('password');
      }
      setHasFocus(true);
    }, [showPassword, type]);

    const handleBlur = React.useCallback(() => {
      if (type === 'password' && showPassword) {
        setInputType('text');
      }

      if (type === 'password' && !showPassword) {
        setInputType('password');
      }
      setHasFocus(false);
    }, [showPassword, type]);

    useEffect(() => {
      if (type === 'password' && showPassword) {
        setInputType('text');
      }

      if (type === 'password' && !showPassword) {
        setInputType('password');
      }
      const inputElement = inputRef.current;

      if (inputElement) {
        inputElement.addEventListener('focus', handleFocus);
        inputElement.addEventListener('blur', handleBlur);

        return () => {
          inputElement.removeEventListener('focus', handleFocus);
          inputElement.removeEventListener('blur', handleBlur);
        };
      }
    }, [type, showPassword, handleFocus, handleBlur]);

    useImperativeHandle(ref, () => inputRef.current!);

    //const hasError = get(errors, name) && get(touched, name);
    const hasError = get(errors, name);

    return (
      <>
        <div className="text-base-regular relative z-0 w-full flex items-center justify-center ">
          <input
            type={inputType}
            name={name}
            placeholder={label}
            className={clsx(
              'mt-0 block w-full appearance-none  rounded-[8px]   bg-transparent px-4  ',
              className
            )}
            {...props}
            ref={inputRef}
          />
          {/* <label
            htmlFor={name}
            onClick={() => inputRef.current?.focus()}
            className={clsx(
              "-z-1 origin-0 absolute top-3 mx-3 px-1 text-gray-500 transition-all duration-300 "
              // {
              //   "!text-rose-500": hasError,
              // }
            )}
          >
            {label}
            {required && <span className="text-rose-500">*</span>}
            {hasError && (
              <span
                className={clsx("ml-2 text-red-500 ", {
                  "hidden": !hasFocus,
                },
                {"":hasFocus}
                )}
              >
                (Invalid)
              </span>
            )}
          </label> */}
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 bottom-[30%] px-4 text-gray-400 outline-none transition-all duration-150 focus:text-gray-700 focus:outline-none"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          )}
        </div>
        {/* {hasError && (
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => {
              return (
                <div className="text-xsmall-regular pl-2 pt-1 text-rose-500">
                  <span>{message}</span>
                </div>
              );
            }}
          />
        )} */}
      </>
    );
  }
);

Input.displayName = 'Input';

export default Input;
