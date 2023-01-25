import type { Session } from '@prisma/client';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import type { GetServerSidePropsContext } from 'next';
import { getClientIp } from 'request-ip';
import { prisma } from './db';

type CreateInnerContextOptions =
  | GetServerSidePropsContext
  | CreateNextContextOptions;

export async function createContext(opts: CreateInnerContextOptions): Promise<{
  prisma: typeof prisma;
  session:
    | (Session & {
        user: {
          id: string;
          name: string;
          about: string | null;
          registeredAt: Date;
        };
      })
    | null;
  req: CreateInnerContextOptions['req'];
  res: CreateInnerContextOptions['res'];
}> {
  const sessionId = opts.req.cookies.sessionId;

  const result: Context = {
    prisma,
    session: null,
    req: opts.req,
    res: opts.res
  };

  if (!sessionId) {
    return result;
  }

  let session = await prisma.session.findFirst({
    where: {
      id: sessionId
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
    return result;
  }

  if (
    new Date(session.createdAt.getTime() + 1000 * 60 * 60 * 24 * 30) <
    new Date()
  ) {
    await prisma.session.delete({
      where: {
        id: sessionId
      }
    });
    return result;
  }

  session = await prisma.session.update({
    where: {
      id: sessionId
    },
    data: {
      lastActivity: new Date(),
      userAgent: opts.req.headers['user-agent'] ?? null,
      ipAddress: getClientIp(opts.req)
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
  result.session = session;
  return result;
}

export type Context = Awaited<ReturnType<typeof createContext>>;
