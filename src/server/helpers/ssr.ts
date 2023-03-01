import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import type { GetServerSidePropsContext } from 'next';
import { createContext } from '../context';
import { appRouter } from '../routers/_app';
import superjson from 'superjson';
import { getClientIp } from 'request-ip';

export const createSSRHelpers = async (context: GetServerSidePropsContext) =>
  createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(context),
    transformer: superjson
  });
