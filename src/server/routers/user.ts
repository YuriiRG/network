import { z } from 'zod';
import { router, procedure } from '../trpc';

export const userRouter = router({
  all: procedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  }),
  get: procedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return await ctx.prisma.user.findUnique({
      where: {
        id: input.id
      }
    });
  })
});
