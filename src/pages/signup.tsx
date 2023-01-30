import Head from 'next/head';
import { z } from 'zod';
import Layout from '../components/Layout';
import PasswordInput from '../features/forms/PasswordInput';
import SubmitButton from '../features/forms/SubmitButton';
import TextInput from '../features/forms/TextInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { api } from '../utils/api';
import Router from 'next/router';
import ErrorsBlock from '../features/forms/ErrorsBlock';
import { IconLoader2 } from '@tabler/icons';

export const signUpSchema = z.object({
  name: z
    .string()
    .min(1, 'Username is required')
    .max(20, 'Username cannot be longer than 20 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain alphanumeric characters and underscores'
    ),
  password: z.string().min(1, 'Password is required')
});

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const { mutate: signInMutate, isLoading: signInLoading } =
    api.auth.signIn.useMutation({
      onSuccess: async (data) => {
        if (data.success) {
          await utils.auth.invalidate();
          await Router.push('/');
        } else if (data.success === false) {
          setError(data.errorField, { message: data.errorMessage });
        }
      }
    });

  const utils = api.useContext();
  const { mutate: signUpMutate, isLoading: signUpLoading } =
    api.auth.signUp.useMutation({
      onSuccess: (data) => {
        if (data.success) {
          const formData = getValues();
          signInMutate({ name: formData.name, password: formData.password });
        } else if (data.success === false) {
          setError(data.errorField, { message: data.errorMessage });
        }
      }
    });

  const isLoading = signInLoading || signUpLoading;

  const isValidationError =
    errors.name !== undefined || errors.password !== undefined;

  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <Layout className='flex justify-center'>
        <form
          className='mt-4 flex w-72 flex-col gap-6'
          onSubmit={(e) =>
            void handleSubmit((data) => signUpMutate({ ...data }))(e)
          }
        >
          <h1 className='text-4xl font-bold'>Sign Up</h1>
          <TextInput
            isError={errors.name !== undefined}
            placeholder='Username'
            {...register('name')}
          />
          <PasswordInput
            isError={errors.password !== undefined}
            placeholder='Password'
            {...register('password')}
          />
          <SubmitButton disabled={isLoading || isValidationError}>
            {isLoading ? (
              <IconLoader2 className='mx-auto animate-spin' />
            ) : (
              'Sign Up'
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
