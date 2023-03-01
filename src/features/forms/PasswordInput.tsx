import IconEye from '../../components/icons/IconEye';
import IconEyeOff from '../../components/icons/IconEyeOff';
import { forwardRef, type InputHTMLAttributes, useState } from 'react';
import { twMerge } from 'tailwind-merge';

type TextInputProps = {
  isError?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export default forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { isError = false, className = '', ...inputProps },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className='relative'>
      <input
        type={showPassword ? 'text' : 'password'}
        {...inputProps}
        className={twMerge(
          `w-full rounded-lg border-2 p-3 pr-10 font-mono placeholder:font-sans ${
            isError
              ? 'border-red-600 bg-red-50 outline-2 outline-red-600 focus:outline'
              : 'border-gray-200 bg-gray-100'
          }`,
          className
        )}
        ref={ref}
      />
      <div
        className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 outline-none'
        onClick={() => setShowPassword((sp) => !sp)}
        title={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          <IconEyeOff
            className='h-full w-full'
            aria-label='Hide password'
            cursor={'pointer'}
          />
        ) : (
          <IconEye
            className='h-full w-full'
            aria-label='Show password'
            cursor={'pointer'}
          />
        )}
      </div>
    </div>
  );
});
