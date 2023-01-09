import { prisma } from '../../server/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@prisma/client';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User[]>
) {
  res.status(200).json(await prisma.user.findMany());
}
