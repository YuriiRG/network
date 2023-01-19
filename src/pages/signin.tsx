import Head from 'next/head';
import Router from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IconLoader2 } from '@tabler/icons';
import Layout from '../components/Layout';
import { api } from '../utils/api';
import TextInput from '../features/forms/TextInput';
import PasswordInput from '../features/forms/PasswordInput';
import { z } from 'zod';
import SubmitButton from '../features/forms/SubmitButton';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorsBlock from '../features/forms/ErrorsBlock';

export const signInSchema = z.object({
  name: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

export default function SignIn() {
  const utils = api.useContext();
  const { mutate, isLoading } = api.auth.signIn.useMutation({
    onSuccess: (data) => {
      if (data?.success) {
        utils.auth.invalidate();
        Router.push('/');
      } else if (data?.success === false) {
        setError(data.errorField, { message: data.errorMessage });
      }
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const onSubmit: SubmitHandler<z.infer<typeof signInSchema>> = (data) => {
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
            {...register('name')}
            isError={errors.name !== undefined}
          />
          <PasswordInput
            placeholder='Password'
            isError={errors.password !== undefined}
            {...register('password')}
          />

          <SubmitButton disabled={isLoading || isValidationError}>
            {isLoading ? (
              <IconLoader2 className='mx-auto animate-spin' />
            ) : (
              'Sign In'
            )}
          </SubmitButton>
          <ErrorsBlock
            errors={[errors.name?.message, errors.password?.message]}
          />
        </form>
      </Layout>
    </>
  );
}
