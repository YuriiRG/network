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
        New post
      </Link>
      <div className='mt-2 flex justify-center'>
        <div className='flex w-prose flex-col gap-2'>
          {posts.map(({ title, id, author }) => (
            <div key={id} className='rounded-lg border bg-gray-100 p-2 text-sm'>
              <div className='self-end'>by {author.name}</div>
              <Link
                href={`/post/${id}`}
                className='block text-lg font-semibold'
              >
                {title}
              </Link>
            </div>
          ))}
        </div>
      </div>
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
