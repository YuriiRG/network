import Link from 'next/link';
import { ReactNode } from 'react';
import NavLink from '../features/layout/NavLink';

export default function Layout({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className='flex min-h-screen flex-col'>
      <nav className='flex items-baseline gap-4 px-2'>
        <Link href='/' className='text-xl font-bold'>
          Network
        </Link>
        <ul className='flex gap-4'>
          <NavLink href='/'>Main page</NavLink>
          <NavLink href='/signin'>Sign In</NavLink>
        </ul>
      </nav>
      <main className={'flex-grow p-2' + ' ' + (className ?? '')}>
        {children}
      </main>
    </div>
  );
}
