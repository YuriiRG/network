import { IconUserCircle } from '@tabler/icons';
import Link from 'next/link';
import { ReactNode } from 'react';
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
  return (
    <div className='flex flex-col'>
      <header className='flex justify-between px-2 pt-1'>
        <nav className='flex items-baseline gap-2'>
          <Link href='/' className='text-xl font-bold'>
            Network
          </Link>
          <ul className='flex'>
            <NavLink href='/'>Main page</NavLink>
          </ul>
        </nav>
        {data ? (
          <div className='group relative h-10 w-10 self-center'>
            <button className='h-full w-full'>
              <IconUserCircle className='h-full w-full' />
            </button>
            <div className='absolute top-10 right-0 hidden rounded-lg border border-gray-500 bg-gray-100 p-4 shadow-md group-hover:block'>
              {data.name}
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
