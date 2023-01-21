import { router, procedure } from '../trpc';

export const userRouter = router({
  all: procedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  })
});
