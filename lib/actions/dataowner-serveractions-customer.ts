'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { unstable_noStore as noStore } from 'next/cache';
import { revalidatePath } from 'next/cache';

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

/**
 * Adds a new DataCustomer associated with the DataOwner
 * identified by the dataOwnerId from the session.user object.
 * @param {Object} dataCustomer - The DataCustomer information to add.
 */
export const addDataCustomer = async (dataCustomer: {
  name: string;
  description?: string;
  logo?: string;
  emailDomain?: string;
}) => {
  const session = await getSession();

  if (!session?.user.dataOwnerId) {
    throw new Error('Not associated with any data owner');
  }

  noStore(); // Prevent caching of this page

  // Create a new DataCustomer linked to the DataOwner
  const newCustomer = await prisma.dataCustomer.create({
    data: {
      name: dataCustomer.name,
      description: dataCustomer.description,
      logo: dataCustomer.logo,
      emailDomain: dataCustomer.emailDomain,
      createdAt: new Date(),
      CustomerRelationship: {
        create: {
          dataOwnerId: session.user.dataOwnerId,
        },
      },
    },
  });

  // Revalidate the cache for the data customers page
  revalidatePath('/owner/customers');

  return newCustomer;
};

/**
 * Deletes a DataCustomer associated with the DataOwner
 * identified by the dataOwnerId from the session.user object.
 * @param {string} customerId - The ID of the DataCustomer to delete.
 */
export const deleteDataCustomer = async (customerId: string) => {
  const session = await getSession();

  if (!session?.user.dataOwnerId) {
    throw new Error('Not associated with any data owner');
  }

  noStore(); // Prevent caching of this page

  // Delete the DataCustomer only if it is linked to the dataOwnerId from the session
  const deleteResult = await prisma.customerRelationship.deleteMany({
    where: {
      dataCustomerId: customerId,
      dataOwnerId: session.user.dataOwnerId,
    },
  });

  // Check if a DataCustomer was actually deleted and revalidate the cache if necessary
  if (deleteResult.count > 0) {
    await prisma.dataCustomer.delete({
      where: {
        id: customerId,
      },
    });

    // Revalidate the cache for the data customers page
    revalidatePath('/owner/customers');
  } else {
    throw new Error('Customer not found or you do not have permission to delete this customer');
  }

  return deleteResult;
};
