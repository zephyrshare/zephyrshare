'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Organization } from '@/lib/types';

export const editUser = async (formData: FormData, _id: unknown, key: string) => {
  const session = await getSession();

  console.log('session', session, 'formData', formData, 'key', key);
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }
  const value = formData.get(key) as string;

  try {
    const response = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        [key]: value,
      },
    });
    console.log('response', response);
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
export const addOrganization = async ({
  organizationName,
  organizationDescription,
}: // Assuming 'logo' might also be a part of your form, or you can omit this if not.
{
  organizationName: string;
  organizationDescription?: string;
  // logo?: string; // Include this if your form actually includes a logo upload; otherwise, omit it
}) => {
  try {
    const organization = await prisma.organization.create({
      data: {
        name: organizationName,
        description: organizationDescription,
        // Assuming 'logo' handling remains as is, or adjust according to your actual form data structure
        // logo: logo || null, // Adjust this logic based on how you're handling logos
      },
    });
    return organization;
  } catch (error: any) {
    console.error('Error adding organization:', error);
    return {
      error: error.message,
    };
  } finally {
    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/organizations');
    redirect('/organizations');
  }
};

export const getOrganizationById = async (id: string): Promise<Organization | null> => {
  try {
    const organization = await prisma.organization.findUnique({
      where: {
        id,
      },
    });
    if (!organization) {
      console.error('Organization not found');
      return null;
    }
    return {
      id: organization.id,
      name: organization.name,
      description: organization.description,
      logo: organization.logo, // Assuming 'logo' is a field in your Organization model
      createdAt: organization.createdAt, // Assuming 'createdAt' is a field in your Organization model
    };
  } catch (error: any) {
    console.error('Error fetching organization by ID:', error);
    throw new Error(error.message);
  }
};

export const getOrganizations = async (): Promise<Organization[]> => {
  try {
    const organizations = await prisma.organization.findMany();
    return organizations.map((org) => ({
      id: org.id,
      name: org.name,
      description: org.description,
      logo: org.logo,
      createdAt: org.createdAt, // Assuming 'createdAt' exists in your Prisma model
    }));
  } catch (error: any) {
    console.error('Error fetching organizations:', error);
    throw new Error(error.message); // Throw an error to be caught by the caller
  }
};

export const deleteOrganization = async (organizationId: string) => {
  const session = await getSession();

  // Check if the user is authenticated
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }

  try {
    const deletedOrganization = await prisma.organization.delete({
      where: {
        id: organizationId,
      },
    });
    console.log('Deleted organization:', deletedOrganization);

    // Optionally, revalidate the organizations page to reflect the deletion
    await revalidatePath('/organizations');

    return deletedOrganization;
  } catch (error: any) {
    console.error('Error deleting organization:', error);
    return {
      error: error.message,
    };
  }
};
