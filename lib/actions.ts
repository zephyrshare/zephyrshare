'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

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
  }
};
