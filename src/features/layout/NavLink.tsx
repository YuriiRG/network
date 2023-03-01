import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

export default function NavLink(props: { href: string; children: ReactNode }) {
  const { pathname } = useRouter();

  return (
    <li>
      <Link
        {...props}
        className={
          'block p-2 px-2 font-semibold' +
          ' ' +
          (pathname === props.href
            ? 'border-b-4 border-blue-600 text-blue-800'
            : 'text-gray-600')
        }
      />
    </li>
  );
}
