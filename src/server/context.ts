import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
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
  if (!opts.sessionId) {
    return {
      prisma,
      session: null
    };
  }

  let session = await prisma.session.findFirst({
    where: {
      id: opts.sessionId
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          about: true,
          registeredAt: true
        }
      }
    }
  });

  if (session === null) {
    return {
      prisma,
      session
    };
  }

  if (
    new Date(session.createdAt.getTime() + 1000 * 60 * 60 * 24 * 30) <
    new Date()
  ) {
    await prisma.session.delete({
      where: {
        id: opts.sessionId
      }
    });
    session = null;
    return {
      prisma,
      session
    };
  }

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
      user: {
        select: {
          id: true,
          name: true,
          about: true,
          registeredAt: true
        }
      }
    }
  });
  return {
    prisma,
    session
  };
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
