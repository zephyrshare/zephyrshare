'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Organization, Agreement } from '@prisma/client';

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
    return organizations.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      logo: c.logo,
      createdAt: c.createdAt, // Assuming 'createdAt' exists in your Prisma model
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
