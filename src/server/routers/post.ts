import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, procedure } from '../trpc';
import { Prisma } from '@prisma/client';
export const postRouter = router({
  getNew: procedure
    .input(z.object({ length: z.number(), page: z.number() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.post.findMany({
        skip: input.length * input.page,
        take: input.length,
        orderBy: {
          publishedAt: 'desc'
        },
        include: {
          author: true
        }
      });
    }),
  read: procedure
    .input(z.string().uuid())
    .query(async ({ ctx, input: postId }) => {
      return await ctx.prisma.post.findFirst({
        where: {
          id: postId
        }
      });
    }),
  create: procedure
    .input(
      z.object({
        title: z.string(),
        content: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session === null) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      try {
        const { id } = await ctx.prisma.post.create({
          data: {
            title: input.title,
            content: input.content,
            authorId: ctx.session.userId
          },
          select: {
            id: true
          }
        });
        return id;
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2002') {
            throw new TRPCError({ code: 'CONFLICT' });
          }
        }
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    })
});
