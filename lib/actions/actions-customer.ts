'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { unstable_noStore as noStore } from 'next/cache';

/**
 * Get all customers that belong to an organization
 * Use the organizationId from the session.user object
 */
export const getCustomersByOrganization = async (params?: {
  query?: string;
}) => {
  const query = params?.query;
  const session = await getSession();

  if (!session?.user.id) {
    throw new Error('Not authenticated');
  }

  if (!session.user.organizationId) {
    throw new Error('Not belongs to any orgination');
  }

  noStore(); // Prevent caching of this page

  const customers = await prisma.organization.findMany({
    where: {
      id: { not: session.user.organizationId },
      name: {
        contains: query,
      },
    },
  });

  return customers;
};
