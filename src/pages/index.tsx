import { Mutation } from '@tanstack/react-query';
import type { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import Layout from '../components/Layout';
import { createSSRHelpers } from '../server/helpers/ssr';
import { api } from '../utils/api';

export default function Home() {
  const utils = api.useContext();
  const signUp = api.auth.signUp.useMutation({
    onSuccess: async () => {
      await utils.user.all.invalidate();
    }
  });
  const signIn = api.auth.signIn.useMutation({
    onSuccess: async () => {
      await utils.auth.getUser.invalidate();
    }
  });
  const { data } = api.auth.getUser.useQuery();

  return (
    <Layout>
      <Link
        href='/post/create'
        className={`rounded-lg border-2 border-blue-700 px-4 py-2 text-blue-700
          hover:border-blue-800 hover:text-blue-800`}
      >
        Create a new post
      </Link>
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
