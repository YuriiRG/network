import { sessions, type users } from '../db/schema';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import type { GetServerSidePropsContext } from 'next';
import { getClientIp } from 'request-ip';
import { db } from '../db';
import { eq } from 'drizzle-orm';

type CreateInnerContextOptions =
  | GetServerSidePropsContext
  | CreateNextContextOptions;

export async function createContext(opts: CreateInnerContextOptions): Promise<{
  db: typeof db;
  session:
    | ((typeof sessions)['$inferSelect'] & {
        user: Omit<(typeof users)['$inferSelect'], 'passwordHash'>;
      })
    | null;
  req: CreateInnerContextOptions['req'];
  res: CreateInnerContextOptions['res'];
}> {
  const sessionId = Number(opts.req.cookies.sessionId);

  const result: Context = {
    db,
    session: null,
    req: opts.req,
    res: opts.res
  };

  if (isNaN(sessionId)) {
    return result;
  }

  const session = await db.query.sessions.findFirst({
    where: (sessions, { eq }) => eq(sessions.id, sessionId),
    with: {
      user: {
        columns: {
          passwordHash: false
        }
      }
    }
  });

  if (session === undefined) {
    return result;
  }

  if (
    new Date(session.createdAt.getTime() + 1000 * 60 * 60 * 24 * 30) <
    new Date()
  ) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));

    return result;
  }

  await db
    .update(sessions)
    .set({
      lastActivity: new Date(),
      userAgent: opts.req.headers['user-agent'] ?? null,
      ipAddress: getClientIp(opts.req)
    })
    .where(eq(sessions.id, sessionId));

  result.session = session;
  return result;
}

export type Context = Awaited<ReturnType<typeof createContext>>;
