import { z } from 'zod';
import 'dotenv/config';

export const env = z
  .object({
    DATABASE_URL: z.string(),
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development')
  })
  .parse(process.env);
