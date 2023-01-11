import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { GetServerSidePropsContext } from 'next';
import { createContextInner } from '../context';
import { appRouter } from '../routers/_app';
import superjson from 'superjson';
import { getClientIp } from 'request-ip';

export const createSSRHelpers = async (context: GetServerSidePropsContext) =>
  createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({
      sessionId: context.req.cookies.sessionId,
      ipAddress: getClientIp(context.req),
      userAgent: context.req.headers['user-agent'] ?? null
    }),
    transformer: superjson
  });
