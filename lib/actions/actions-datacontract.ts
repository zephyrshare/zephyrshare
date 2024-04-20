'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { unstable_noStore as noStore } from 'next/cache';
import { Prisma } from '@prisma/client';

/**
 * Create new data contract
 */
export const addDataContract = async (
  data: Omit<Prisma.DataContractUncheckedCreateInput, 'sellerOrgId'>
) => {
  const session = await getSession();
  if (!session?.user.id) {
    throw new Error('Not authenticated');
  }

  if (!session.user.organizationId) {
    throw new Error('Not belongs to any orgination');
  }

  noStore(); // Prevent caching of this page

  await prisma.dataContract.create({
    data: {
      ...data,
      sellerOrgId: session.user.organizationId,
    },
  });
};
