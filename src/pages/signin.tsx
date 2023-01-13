import Head from 'next/head';
import Router from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IconEye, IconEyeOff, IconLoader2 } from '@tabler/icons';
import Layout from '../components/Layout';
import { api } from '../utils/api';

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  const utils = api.useContext();

  const { mutate, isLoading } = api.auth.signIn.useMutation({
    onSuccess: (data) => {
      utils.auth.invalidate();
      if (data?.success) {
        Router.push('/');
      } else if (data?.success === false) {
        setError(data.errorField, { message: data.errorMessage });
      }
    }
  });

  type FormInputs = Parameters<typeof mutate>[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<FormInputs>({
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    mutate({ ...data });
  };

  const isValidationError =
    errors.name !== undefined || errors.password !== undefined;

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <Layout className='flex justify-center'>
        <form
          className='flex w-72 flex-col gap-6'
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className='text-4xl font-bold'>Sign In</h1>
          <input
            type='text'
            placeholder='Username'
            autoComplete='off'
            {...register('name', {
              required: { value: true, message: 'Username is required' },
              maxLength: {
                value: 20,
                message: 'Username cannot be longer than 20 characters'
              }
            })}
            className={
              'rounded-lg border-2 p-3' +
              ' ' +
              (errors.name !== undefined
                ? 'border-red-600 bg-red-50 outline-2 outline-red-600 focus:outline'
                : 'border-gray-200 bg-gray-100')
            }
          />
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              {...register('password', { required: 'Password is required' })}
              className={
                'w-full rounded-lg border-2 p-3 pr-10 font-mono placeholder:font-sans' +
                ' ' +
                (errors.password !== undefined
                  ? 'border-red-600 bg-red-50 outline-2 outline-red-600 focus:outline'
                  : 'border-gray-200 bg-gray-100')
              }
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

          <button
            type='submit'
            disabled={isLoading || isValidationError}
            className='rounded-lg bg-blue-500 p-3 font-semibold text-white transition-all hover:enabled:bg-blue-600 active:enabled:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-700'
          >
            {isLoading ? (
              <IconLoader2 className='mx-auto animate-spin' />
            ) : (
              'Sign In'
            )}
          </button>

          {isValidationError && (
            <div className='rounded-r-lg border-l-8 border-red-600 bg-red-100 p-4'>
              <ul>
                {[errors.name?.message, errors.password?.message].map(
                  (errorMessage) =>
                    errorMessage && (
                      <li key={errorMessage} className='font-semibold'>
                        {errorMessage}
                      </li>
                    )
                )}
              </ul>
            </div>
          )}
        </form>
      </Layout>
    </>
  );
}
