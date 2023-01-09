import { router, procedure } from '../trpc';

export const authRouter = router({
  all: procedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  })
});
