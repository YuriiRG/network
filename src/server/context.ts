import { Session, User } from '@prisma/client';
import { inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getClientIp } from 'request-ip';
import { prisma } from './db';

type CreateInnerContextOptions = {
  sessionId?: string;
  ipAddress: string | null;
  userAgent: string | null;
};

/**
 * Inner context. Will always be available in your procedures, in contrast to the outer context.
 *
 * Also useful for:
 * - testing, so you don't have to mock Next.js' `req`/`res`
 * - tRPC's `createSSGHelpers` where we don't have Next API `req`/`res` (not getServerSideProps ones)
 *
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */
export async function createContextInner(opts: CreateInnerContextOptions) {
  let session: (Session & { user: User }) | null = null;

  if (!opts.sessionId) {
    return {
      prisma,
      session
    };
  }

  try {
    session = await prisma.session.update({
      where: {
        id: opts.sessionId
      },
      data: {
        lastActivity: new Date(),
        userAgent: opts.userAgent,
        ipAddress: opts.ipAddress
      },
      include: {
        user: true
      }
    });
  } finally {
    return {
      prisma,
      session
    };
  }
}
/**
 * Outer context. Used in the routers and will e.g. bring `req` & `res` to the context as "not `undefined`".
 *
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */
export async function createContext(opts: CreateNextContextOptions) {
  const contextInner = await createContextInner({
    sessionId: opts.req.cookies.sessionId,
    ipAddress: getClientIp(opts.req),
    userAgent: opts.req.headers['user-agent'] ?? null
  });
  return {
    ...contextInner,
    req: opts.req,
    res: opts.res
  };
}

export type InnerContext = inferAsyncReturnType<typeof createContextInner>;

export type OuterContext = Omit<
  inferAsyncReturnType<typeof createContext>,
  keyof InnerContext
>;

export type Context = InnerContext & Partial<OuterContext>;
