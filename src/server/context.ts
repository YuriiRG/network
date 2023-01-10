import { inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { prisma } from './db';

type CreateInnerContextOptions = {
  sessionId?: string;
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
  return {
    prisma,
    session: await prisma.session.findFirst({
      where: {
        id: opts.sessionId
      }
    })
  };
}
/**
 * Outer context. Used in the routers and will e.g. bring `req` & `res` to the context as "not `undefined`".
 *
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */
export async function createContext(opts: CreateNextContextOptions) {
  const contextInner = await createContextInner({
    sessionId: opts.req.cookies.sessionId
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
