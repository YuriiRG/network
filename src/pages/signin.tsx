import Head from 'next/head';
import Router from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IconEye, IconEyeOff, IconLoader2 } from '@tabler/icons';
import Layout from '../components/Layout';
import { api } from '../utils/api';
import TextInput from '../features/forms/TextInput';
import PasswordInput from '../features/forms/PasswordInput';

export default function SignIn() {
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
          className='mt-4 flex w-72 flex-col gap-6'
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className='text-4xl font-bold'>Sign In</h1>
          <TextInput
            placeholder='Username'
            autoComplete='off'
            {...register('name', {
              required: { value: true, message: 'Username is required' }
            })}
            isError={errors.name !== undefined}
          />
          <PasswordInput
            placeholder='Password'
            isError={errors.password !== undefined}
            {...register('password', { required: 'Password is required' })}
          />

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
