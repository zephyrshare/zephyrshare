'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { User } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';


/**
 * 
 * Fetch user from the database
 * 
 * @param id 
 * @returns 
 */
export const getUser = async (id: string) => {
  const session = await getSession();
  console.log('Session in getUser:', session);
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return { error: error.message };
  }
}


/**
 * Update user in the database 
 *
 * 
 * @param userData 
 * @returns 
 */
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
