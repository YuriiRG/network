import { forwardRef, type InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type SubmitButtonProps = {
  isError?: boolean;
} & Omit<InputHTMLAttributes<HTMLButtonElement>, 'type'>;

export default forwardRef<HTMLButtonElement, SubmitButtonProps>(
  function SubmitButton(
    { className, ...submitButtonProps }: SubmitButtonProps,
    ref
  ) {
    return (
      <button
        type='submit'
        {...submitButtonProps}
        className={twMerge(
          `rounded-lg bg-blue-500 p-3 font-semibold text-white transition-all hover:enabled:bg-blue-600 active:enabled:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-700`,
          className
        )}
        ref={ref}
      ></button>
    );
  }
);
