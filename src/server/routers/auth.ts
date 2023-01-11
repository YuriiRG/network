import { z } from 'zod';
import { router, procedure } from '../trpc';
import bcrypt from 'bcrypt';
import { getClientIp } from 'request-ip';
import { TRPCError } from '@trpc/server';

export const authRouter = router({
  signUp: procedure
    .input(
      z.object({
        name: z.string(),
        password: z.string(),
        about: z.string().optional()
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.user.create({
        data: {
          name: input.name,
          passwordHash: await bcrypt.hash(input.password, 10)
        }
      });
    }),
  signIn: procedure
    .input(
      z.object({
        name: z.string(),
        password: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          name: input.name
        }
      });
      if (!user) {
        return false;
      }
      if (!(await bcrypt.compare(input.password, user.passwordHash))) {
        return false;
      }
      if (ctx.res && ctx.req) {
        const session = await ctx.prisma.session.create({
          data: {
            ipAddress: getClientIp(ctx.req),
            userAgent: ctx.req.headers['user-agent'],
            userId: user.id
          }
        });
        ctx.res.setHeader(
          'Set-Cookie',
          `sessionId=${
            session.id
          }; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age=${
            60 * 60 * 24 * 30
          }`
        );
        return true;
      }
    }),
  getUser: procedure.query(async ({ ctx }) => {
    return ctx.session?.user ?? null;
  })
});
