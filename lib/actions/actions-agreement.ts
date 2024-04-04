'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Agreement } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

export * from './actions-agreement';
export * from './actions-aws';
export * from './actions-organization';
export * from './actions-user';


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
