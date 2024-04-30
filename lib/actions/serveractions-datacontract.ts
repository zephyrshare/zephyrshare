'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { unstable_noStore as noStore } from 'next/cache';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { v4 as uuid } from 'uuid';

/**
 * Create new data contract only by a data owner, with an initial DataContractStatus
 *
 * Omitting the dataOwnerId field from the data object, as it will be set from the session
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

  // Start a transaction to ensure both DataContract and DataContractStatus are created atomically
  const contract = await prisma.$transaction(async (prisma) => {
    const dataContractStatusId = uuid(); // Generate a new UUID for the data contract status
    const dataContractId = uuid(); // Generate a new UUID for the data contract

    // Create a new DataContractStatus first
    await prisma.dataContractStatus.create({
      data: {
        id: dataContractStatusId,
        statusType: 'PENDING_CUSTOMER_ACTION',
        statusName: 'Pending Customer Action',
        dataContractId,
      },
    });

    // Now create the DataContract and link to the newly created status
    return prisma.dataContract.create({
      data: {
        ...data,
        id: dataContractId,
        dataOwnerId: session.user.dataOwnerId,
        latestStatusId: dataContractStatusId,
      },
    });
  });

  // Revalidate the contracts page
  revalidatePath('/owner/contracts');

  return contract;
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
