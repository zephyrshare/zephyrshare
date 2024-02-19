'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Customer, Agreement } from '@/lib/types';

export const editUser = async (formData: FormData, _id: unknown, key: string) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }
  const value = formData.get(key) as string;

  try {
    const response = await prisma.user.update({
      where: {
        id: session?.user.id,
      },
      data: {
        [key]: value,
      },
    });
    return response;
  } catch (error: any) {
    if (error.code === 'P2002') {
      return {
        error: `This ${key} is already in use`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
};

// Assuming you're using TypeScript, if not, you can ignore the type annotations
export const addCustomer = async ({
  customerName,
  customerDescription,
}: // Assuming 'logo' might also be a part of your form, or you can omit this if not.
{
  customerName: string;
  customerDescription?: string;
  // logo?: string; // Include this if your form actually includes a logo upload; otherwise, omit it
}) => {
  try {
    const customer = await prisma.customer.create({
      data: {
        name: customerName,
        description: customerDescription,
        // Assuming 'logo' handling remains as is, or adjust according to your actual form data structure
        // logo: logo || null, // Adjust this logic based on how you're handling logos
      },
    });
    return customer;
  } catch (error: any) {
    console.error('Error adding customer:', error);
    return {
      error: error.message,
    };
  } finally {
    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/customers');
    redirect('/customers');
  }
};

export const getCustomerById = async (id: string): Promise<Customer | null> => {
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id,
      },
    });
    if (!customer) {
      console.error('Customer not found');
      return null;
    }
    return {
      id: customer.id,
      name: customer.name,
      description: customer.description,
      logo: customer.logo, // Assuming 'logo' is a field in your Customer model
      createdAt: customer.createdAt, // Assuming 'createdAt' is a field in your Customer model
    };
  } catch (error: any) {
    console.error('Error fetching customer by ID:', error);
    throw new Error(error.message);
  }
};

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const customers = await prisma.customer.findMany();
    return customers.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      logo: c.logo,
      createdAt: c.createdAt, // Assuming 'createdAt' exists in your Prisma model
    }));
  } catch (error: any) {
    console.error('Error fetching customers:', error);
    throw new Error(error.message); // Throw an error to be caught by the caller
  }
};

export const deleteCustomer = async (customerId: string) => {
  const session = await getSession();

  // Check if the user is authenticated
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }

  try {
    const deletedCustomer = await prisma.customer.delete({
      where: {
        id: customerId,
      },
    });
    console.log('Deleted customer:', deletedCustomer);

    // Optionally, revalidate the customers page to reflect the deletion
    await revalidatePath('/customers');

    return deletedCustomer;
  } catch (error: any) {
    console.error('Error deleting customer:', error);
    return {
      error: error.message,
    };
  }
};

export async function addAgreement(agreementData: any) {
  const session = await getSession();
  try {
    const newAgreement = await prisma.agreement.create({
      data: {
        ...agreementData,
        ownerId: session?.user.id,
      },
    });
    console.log('Added agreement:', newAgreement);

    // Optionally, revalidate the agreements page to reflect the addition
    await revalidatePath('/agreements');

    return newAgreement;
  } catch (error: any) {
    console.error('Error adding agreement:', error);
    return {
      error: error.message,
    };
  }
}

export const getAgreements = async (): Promise<Agreement[]> => {
  try {
    const agreements = await prisma.agreement.findMany();
    return agreements.map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
      file: a.file,
      contentType: a.contentType,
      ownerId: a.ownerId,
      startDate: a.startDate,
      endDate: a.endDate,
    }));
  } catch (error: any) {
    console.error('Error fetching agreements:', error);
    throw new Error(error.message);
  }
};

export const deleteAgreement = async (agreementId: string) => {
  const session = await getSession();

  // Check if the user is authenticated
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }

  try {
    const deletedAgreement = await prisma.agreement.delete({
      where: {
        id: agreementId,
      },
    });
    console.log('Deleted agreement:', deletedAgreement);

    // Optionally, revalidate the agreements page to reflect the deletion
    await revalidatePath('/agreements');

    return deletedAgreement;
  } catch (error: any) {
    console.error('Error deleting agreement:', error);
    return {
      error: error.message,
    };
  }
};
