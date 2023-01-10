import { z } from 'zod';
import { router, procedure } from '../trpc';
import bcrypt from 'bcrypt';

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
          passwordHash: await bcrypt.hash(input.password, 1)
        }
      });
    })
});
