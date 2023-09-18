import { z } from 'zod';
import { router, procedure } from '../trpc';
import bcrypt from 'bcryptjs';
import { getClientIp } from 'request-ip';
import { TRPCError } from '@trpc/server';
import { signInSchema } from '../../pages/signin';
import { signUpSchema } from '../../pages/signup';
import { sessions, users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import postgres from 'postgres'; // don't use named imports, they are wrong
const { PostgresError } = postgres;

export const authRouter = router({
  signUp: procedure
    .input(signUpSchema)
    .output(
      z.discriminatedUnion('success', [
        z.object({
          success: z.literal(true)
        }),
        z.object({
          success: z.literal(false),
          errorField: z.union([z.literal('name'), z.literal('password')]),
          errorMessage: z.string()
        })
      ])
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.db.insert(users).values({
          name: input.name,
          passwordHash: await bcrypt.hash(input.password, 10)
        });
      } catch (e) {
        // 23505 means unique constraint violated
        if (e instanceof PostgresError && e.code === '23505') {
          return {
            success: false,
            errorField: 'name',
            errorMessage: 'User already exists'
          };
        } else {
          throw e;
        }
      }
      return {
        success: true
      };
    }),
  signIn: procedure
    .input(signInSchema)
    .output(
      z.discriminatedUnion('success', [
        z.object({
          success: z.literal(true)
        }),
        z.object({
          success: z.literal(false),
          errorField: z.union([z.literal('name'), z.literal('password')]),
          errorMessage: z.string()
        })
      ])
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.name, input.name)
      });
      if (!user) {
        return {
          success: false,
          errorField: 'name',
          errorMessage: 'Invalid username'
        };
      }
      if (!(await bcrypt.compare(input.password, user.passwordHash))) {
        return {
          success: false,
          errorField: 'password',
          errorMessage: 'Invalid password'
        };
      }
      const [session] = await ctx.db
        .insert(sessions)
        .values({
          ipAddress: getClientIp(ctx.req),
          userAgent: ctx.req.headers['user-agent'],
          userId: user.id
        })
        .returning();
      ctx.res.setHeader(
        'Set-Cookie',
        `sessionId=${
          session.id
        }; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 30}`
      );
      return {
        success: true
      };
    }),
  signOut: procedure.mutation(async ({ ctx }) => {
    if (ctx.session) {
      await ctx.db.delete(sessions).where(eq(sessions.id, ctx.session.id));
    }
    ctx.res.setHeader('Set-Cookie', `sessionId=deleted; HttpOnly; Max-Age=-1`);
    return true;
  }),
  getUser: procedure.query(({ ctx }) => {
    return ctx.session?.user ?? null;
  })
});
