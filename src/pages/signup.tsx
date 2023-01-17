import Head from 'next/head';
import Layout from '../components/Layout';

export default function SignUp() {
  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <Layout className='flex justify-center'>
        <form className='mt-4 flex w-72 flex-col gap-6'>
          <h1 className='text-4xl font-bold'>Sign Up</h1>
        </form>
      </Layout>
    </>
  );
}
