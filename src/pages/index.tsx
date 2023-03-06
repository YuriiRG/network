import type { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import Layout from '../components/Layout';
import { createSSRHelpers } from '../server/helpers/ssr';
import { api } from '../utils/api';

export default function Home() {
  const utils = api.useContext();
  const {
    data: posts,
    isLoading,
    isError
  } = api.post.getNew.useQuery({ length: 10, page: 0 });
  if (isLoading || isError) {
    return (
      <Layout>
        <></>
      </Layout>
    );
  }
  return (
    <Layout>
      <Link
        href='/post/create'
        className={`block w-max rounded-lg border-2 border-blue-700 px-4 py-2 text-blue-700
          hover:border-blue-800 hover:text-blue-800`}
      >
        Create a new post
      </Link>
      {posts.map(({ title, id }) => (
        <div key={id}>{title}</div>
      ))}
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
