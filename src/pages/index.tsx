import { Mutation } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import Layout from '../components/Layout';
import { createSSRHelpers } from '../server/helpers/ssr';
import { api } from '../utils/api';

export default function Home() {
  const utils = api.useContext();
  const signUp = api.auth.signUp.useMutation({
    onSuccess: () => {
      utils.user.all.invalidate();
    }
  });
  const signIn = api.auth.signIn.useMutation({
    onSuccess: () => {
      utils.auth.getUser.invalidate();
    }
  });
  const { data } = api.auth.getUser.useQuery();

  return (
    <Layout>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      <button
        className='rounded bg-gray-300 p-2'
        onClick={() => signIn.mutate({ name: 'JohnDoe', password: '12345678' })}
      >
        Sign In
      </button>
      <button
        className='rounded bg-gray-300 p-2'
        onClick={() =>
          signUp.mutate({ name: 'JohnDoe3', password: '12345678' })
        }
      >
        Sign Up
      </button>
      {signUp.isLoading && 'signing up'}
      {signUp.isError && <div>An error occurred: {signUp.error.message}</div>}
      {signUp.isSuccess && <div>Success</div>}
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const ssr = await createSSRHelpers(context);
  await ssr.auth.getUser.prefetch();
  return {
    props: {
      trpcState: ssr.dehydrate()
    }
  };
}
