'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { unstable_noStore as noStore } from 'next/cache';

/**
 * Get all DataCustomers that are related to the DataOwner
 * identified by the dataOwnerId from the session.user object.
 */
export const getDataCustomers = async (params?: { query?: string }) => {
  const query = params?.query;
  const session = await getSession();

  if (!session?.user.dataOwnerId) {
    throw new Error('Not associated with any data owner');
  }

  noStore(); // Prevent caching of this page

  const customers = await prisma.customerRelationship.findMany({
    where: {
      dataOwnerId: session.user.dataOwnerId,
      dataCustomer: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    },
    include: {
      dataCustomer: true, // Ensures that data about the customers is returned
    },
  });

  // Extract the dataCustomers from the relationships
  const dataCustomers = customers.map((cr: any) => cr.dataCustomer);

  return dataCustomers;
};
