import { Dummy } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { prisma } from '../server/prisma';

type HomeProps = {
  dummies: Dummy[];
};

export default function Home({ dummies }: HomeProps) {
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
        {dummies.map((dummy) => (
          <li key={dummy.id}>
            id: {dummy.id}; data: {dummy.data}
          </li>
        ))}
      </ul>
    </article>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  await prisma.dummy.create({
    data: {
      data: context.req.headers['user-agent']
    }
  });

  const dummies = await prisma.dummy.findMany();

  const props: HomeProps = { dummies };
  return { props };
};
