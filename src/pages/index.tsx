import { api } from '../utils/api';

export default function Home() {
  const { data: users } = api.user.all.useQuery();
  if (!users) return <div>no prefetched data</div>;

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
      {users.map((user) => (
        <pre key={user.id}>{JSON.stringify(user, null, 2)}</pre>
      ))}
    </>
  );
}
