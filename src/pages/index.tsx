import { GetServerSidePropsContext } from 'next';
import { trpc } from '../utils/trpc';
import { appRouter } from '../server/routers/_app';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { createContextInner } from '../server/context';
import superjson from 'superjson';
import { createSSRHelpers } from '../server/ssr-helpers';

export default function Home() {
  const { data } = trpc.auth.all.useQuery();
  if (!data) {
    return <div>no prefetched data</div>;
  }
  return (
    <>
      <article className='prose m-4 mt-10'>
        <h1>Hello, World!</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quos rem
          consectetur maxime voluptas nostrum, libero perferendis sapiente ipsam
          laboriosam enim labore nobis distinctio porro, voluptates repellat
          similique dolores, dolore deleniti.
        </p>
      </article>
      {data.map((user) => (
        <pre key={user.id}>{JSON.stringify(user, null, 2)}</pre>
      ))}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const ssr = await createSSRHelpers(context);

  await ssr.auth.all.prefetch();

  return {
    props: {
      trpcState: ssr.dehydrate()
    }
  };
}
