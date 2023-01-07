import { prisma } from '../../server/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { Dummy } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Dummy[]>
) {
  res.status(200).json(await prisma.dummy.findMany());
}
