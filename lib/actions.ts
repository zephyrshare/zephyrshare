"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const editUser = async (
  formData: FormData,
  _id: unknown,
  key: string,
) => {
  const session = await getSession();

  console.log('session', session, 'formData', formData, 'key', key);
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
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
    if (error.code === "P2002") {
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


export const addOrganization = async (
  formData: FormData,
) => {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const logo = formData.get('logo') as string;

  try {
    const organization = await prisma.organization.create({
      data: {
        name,
        description,
        logo,
      },
    });
    return organization;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};