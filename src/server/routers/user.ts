import { z } from 'zod';
import { router, procedure } from '../trpc';

export const userRouter = router({
  all: procedure.query(async ({ ctx }) => {
    return await ctx.db.query.users.findMany();
  }),
  get: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, input.id)
      });
    })
});
