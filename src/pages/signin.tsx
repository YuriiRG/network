import Head from 'next/head';
import { useState } from 'react';
import { TbEye, TbEyeOff } from 'react-icons/tb';
import Layout from '../components/Layout';
export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <Layout className='flex items-center justify-center'>
        <form
          className='flex w-72 flex-col gap-6'
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <h1 className='text-4xl font-bold'>Sign In</h1>
          <input
            type='text'
            name='name'
            placeholder='Username'
            autoComplete='off'
            className='rounded-lg border-2 border-gray-200 bg-gray-100 p-3'
          />
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              name='password'
              placeholder='Password'
              className='w-full rounded-lg border-2 border-gray-200 bg-gray-100 p-3 pr-10 font-mono placeholder:font-sans'
            />
            <div
              className='absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-600 outline-none'
              onClick={() => setShowPassword((sp) => !sp)}
            >
              {showPassword ? (
                <TbEyeOff
                  className='h-full w-full'
                  title='Hide password'
                  aria-label='Hide password'
                  cursor={'pointer'}
                />
              ) : (
                <TbEye
                  className='h-full w-full'
                  title='Show password'
                  aria-label='Show password'
                  cursor={'pointer'}
                />
              )}
            </div>
          </div>

          <button
            type='submit'
            className='rounded-lg bg-blue-500 p-3 font-semibold text-white transition-all hover:bg-blue-600 active:bg-blue-700'
          >
            Sign In
          </button>
        </form>
      </Layout>
    </>
  );
}
