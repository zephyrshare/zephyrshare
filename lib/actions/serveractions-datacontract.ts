'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { unstable_noStore as noStore } from 'next/cache';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

/**
 * Create new data contract only by a data owner
 */
export const addDataContract = async (data: Omit<Prisma.DataContractUncheckedCreateInput, 'dataOwnerId'>) => {
  const session = await getSession();

  if (!session?.user.id) {
    throw new Error('Not authenticated');
  }

  if (!session.user.dataOwnerId) {
    throw new Error('User is not associated with any data owner');
  }

  noStore(); // Prevent caching of this page

  await prisma.dataContract.create({
    data: {
      ...data,
      dataOwnerId: session.user.dataOwnerId,
    },
  });

  // Revalidate the contracts page
  revalidatePath('/owner/contracts');
};

/**
 * Get all data contracts for a data owner
 */
export const getDataContractsOfDataOwner = async () => {
  const session = await getSession();
  if (!session?.user.id) {
    throw new Error('Not authenticated');
  }

  if (!session.user.dataOwnerId) {
    throw new Error('User is not associated with any data owner');
  }

  return prisma.dataContract.findMany({
    where: {
      dataOwnerId: session.user.dataOwnerId,
    },
  });
};

/**
 * Get all data contracts for a data customer
 */
export const getDataContractsOfDataCustomer = async () => {
  const session = await getSession();
  if (!session?.user.id) {
    throw new Error('Not authenticated');
  }

  if (!session.user.dataCustomerId) {
    throw new Error('User is not associated with any data customer');
  }

  return prisma.dataContract.findMany({
    where: {
      dataCustomerId: session.user.dataCustomerId,
    },
  });
};
