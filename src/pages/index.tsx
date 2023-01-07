import { Dummy } from '@prisma/client';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { prisma } from '../server/prisma';

export default function Home() {
  const { data: dummies } = useQuery({
    queryKey: ['dummies'],
    queryFn: async () => (await (await fetch('/api/dummies')).json()) as Dummy[]
  });
  return (
    <article className='prose m-4 mt-10 max-w-prose'>
      <h1>Hello, World!</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quos rem
        consectetur maxime voluptas nostrum, libero perferendis sapiente ipsam
        laboriosam enim labore nobis distinctio porro, voluptates repellat
        similique dolores, dolore deleniti.
      </p>
      <ul>
        {dummies?.map((dummy) => (
          <li key={dummy.id}>
            id: {dummy.id}; data: {dummy.data}
          </li>
        ))}
      </ul>
    </article>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();

  await prisma.dummy.create({
    data: {
      data: context.req.headers['user-agent']
    }
  });

  const dummies = await prisma.dummy.findMany();

  await queryClient.prefetchQuery(['dummies'], () => dummies);
  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};
