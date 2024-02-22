'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Organization, OrganizationRole, Agreement } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

export const updateUser = async (userData: any) => {
  const session = await getSession();
  console.log('Session in updateUser:', session);
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }

  console.log('Updating user:', userData);

  try {
    const response = await prisma.user.update({
      where: { id: session?.user.id },
      data: { ...userData },
    });
    console.log('Updated user:', response);
    return response;
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateUserOnLogin = async (userData: any, id: string) => {
  try {
    const response = await prisma.user.update({
      where: { id },
      data: { ...userData },
    });
    console.log('Updated user on login:', response);
    return response;
  } catch (error: any) {
    return { error: error.message };
  }
};

export const createOrganization = async (organizationData: any) => {
  try {
    const organization = await prisma.organization.create({ data: { ...organizationData } });
    return organization;
  } catch (error: any) {
    console.error('Error adding organization:', error);
    return { error: error.message };
  } finally {
    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/customers');
    redirect('/customers');
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
      emailDomain: organization.emailDomain,
      logo: organization.logo, // Assuming 'logo' is a field in your Organization model
      createdAt: organization.createdAt, // Assuming 'createdAt' is a field in your Organization model
      role: organization.role as OrganizationRole,
    };
  } catch (error: any) {
    console.error('Error fetching organization by ID:', error);
    throw new Error(error.message);
  }
};

export const getOrganizationByEmailDomain = async (emailDomain: string): Promise<Organization | null> => {
  try {
    const organization = await prisma.organization.findUnique({
      where: {
        emailDomain,
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
      emailDomain: organization.emailDomain,
      logo: organization.logo, // Assuming 'logo' is a field in your Organization model
      createdAt: organization.createdAt, // Assuming 'createdAt' is a field in your Organization model
      role: organization.role as OrganizationRole,
    };
  } catch (error: any) {
    console.error('Error fetching organization by email domain:', error);
    throw new Error(error.message);
  }
};

export const getOrganizations = async (): Promise<Organization[]> => {
  try {
    const organizations = await prisma.organization.findMany();

    // remove organization with name "Your Organization"
    const filteredOrganizations = organizations.filter((org) => org.name !== 'Your Organization');

    return filteredOrganizations.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      emailDomain: c.emailDomain,
      logo: c.logo,
      createdAt: c.createdAt, // Assuming 'createdAt' exists in your Prisma model
      role: c.role as OrganizationRole,
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
        uploaderId: session?.user.id,
        organizationId: session?.user.organizationId,
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

/**
 * Get all agreements
 */
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
      uploaderId: a.uploaderId,
      startDate: a.startDate,
      endDate: a.endDate,
      organizationId: a.organizationId,
    }));
  } catch (error: any) {
    console.error('Error fetching agreements:', error);
    throw new Error(error.message);
  }
};

/**
 * Get all agreements that belong to an organization
 * Use the organizationId from the session.user object
 */
export const getAgreementsByOrganization = async (): Promise<Agreement[]> => {
  const session = await getSession();
  console.log('Session in getAgreementsByOrganization:', session);
  if (!session?.user.organizationId) {
    return [];
  }

  noStore(); // Prevent caching of this page

  console.log('Fetching agreements for organization:', session.user.organizationId);

  try {
    const agreements = await prisma.agreement.findMany({
      where: {
        organizationId: session.user.organizationId,
      },
    });
    return agreements.map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
      file: a.file,
      contentType: a.contentType,
      uploaderId: a.uploaderId,
      startDate: a.startDate,
      endDate: a.endDate,
      organizationId: a.organizationId,
    }));
  } catch (error: any) {
    console.error('Error fetching organization agreements:', error);
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
