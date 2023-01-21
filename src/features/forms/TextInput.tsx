import { forwardRef, InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type TextInputProps = {
  isError?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export default forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { isError = false, className = '', ...inputProps },
  ref
) {
  return (
    <input
      type='text'
      {...inputProps}
      ref={ref}
      className={twMerge(
        `rounded-lg border-2 p-3 ${
          isError
            ? 'border-red-600 bg-red-50 outline-2 outline-red-600 focus:outline'
            : 'border-gray-200 bg-gray-100'
        }`,
        className
      )}
    />
  );
});
