import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, procedure } from '../trpc';
import { DrizzleError, desc } from 'drizzle-orm';
import { posts } from '../../db/schema';
import postgres from 'postgres'; // don't use named imports, they are wrong
const { PostgresError } = postgres;

export const postRouter = router({
  getNew: procedure
    .input(z.object({ length: z.number(), page: z.number() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.query.posts.findMany({
        offset: input.length * input.page,
        limit: input.length,
        orderBy: [desc(posts.id)],
        with: {
          author: true
        }
      });
    }),
  read: procedure.input(z.number()).query(async ({ ctx, input: postId }) => {
    return await ctx.db.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, postId)
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
        const [{ id }] = await ctx.db
          .insert(posts)
          .values({
            title: input.title,
            content: input.content,
            authorId: ctx.session.userId
          })
          .returning();
        return id;
      } catch (e) {
        if (e instanceof PostgresError && e.code === '23505') {
          throw new TRPCError({ code: 'CONFLICT' });
        }
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    })
});
