import { IconUserCircle } from '@tabler/icons';
import Link from 'next/link';
import type { ReactNode } from 'react';
import NavLink from '../features/layout/NavLink';
import { api } from '../utils/api';

export default function Layout({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  const { data } = api.auth.getUser.useQuery();
  const utils = api.useContext();
  const signOut = api.auth.signOut.useMutation({
    onSuccess: () => {
      utils.auth.invalidate();
    }
  });
  return (
    <div className='flex flex-col'>
      <header className='flex items-center justify-between px-2 pt-1'>
        <Link href='/' className='text-xl font-bold'>
          Network
        </Link>
        {data ? (
          <div className='group relative h-10 w-10'>
            <button className='peer h-full w-full'>
              <IconUserCircle className='h-full w-full' />
            </button>
            <div className='absolute top-10 right-0 hidden w-max max-w-sm rounded-lg border bg-gray-100 px-4 py-2 shadow-md group-hover:block peer-focus:block'>
              <div className='p-2 font-semibold'>{data.name}</div>
              <button
                className='rounded-lg bg-blue-400 px-4 py-2'
                onClick={() => signOut.mutate()}
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <ul className='flex items-baseline'>
            <NavLink href='/signin'>Sign in</NavLink>
            <NavLink href='/signup'>Sign up</NavLink>
          </ul>
        )}
      </header>
      <main className={'p-2' + ' ' + (className ?? '')}>{children}</main>
    </div>
  );
}
