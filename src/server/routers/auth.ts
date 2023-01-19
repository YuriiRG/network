import { z } from 'zod';
import { router, procedure } from '../trpc';
import bcrypt from 'bcrypt';
import { getClientIp } from 'request-ip';
import { TRPCError } from '@trpc/server';
import { signInSchema } from '../../pages/signin';
import { signUpSchema } from '../../pages/signup';

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
      await ctx.prisma.user.create({
        data: {
          name: input.name,
          passwordHash: await bcrypt.hash(input.password, 10)
        }
      });
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
      const user = await ctx.prisma.user.findFirst({
        where: {
          name: input.name
        }
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
      }
      return {
        success: true
      };
    }),
  signOut: procedure.mutation(async ({ ctx }) => {
    if (ctx.session) {
      await ctx.prisma.session.delete({
        where: {
          id: ctx.session.id
        }
      });
    }
    if (ctx.res && ctx.req) {
      ctx.res.setHeader(
        'Set-Cookie',
        `sessionId=deleted; HttpOnly; Max-Age=-1`
      );
    }
    return true;
  }),
  getUser: procedure.query(async ({ ctx }) => {
    return ctx.session?.user ?? null;
  })
});
