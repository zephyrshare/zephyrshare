'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { DataFile } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

export async function getDataFilesByOrganization(): Promise<DataFile[]> {
  const session = await getSession();
  if (!session?.user.organizationId) {
    return [];
  }

  noStore(); // Prevent caching of this page

  console.log('Fetching data files for organization:', session.user.organizationId);

  try {
    const dataFiles = await prisma.dataFile.findMany({
      where: { organizationId: session.user.organizationId },
    });
    return dataFiles;
  } catch (error) {
    console.error('Error fetching data files:', error);
    throw new Error('Failed to fetch data files.');
  }
}

export const deleteDataFile = async (dataFileId: string) => {
  const session = await getSession();

  // Check if the user is authenticated
  if (!session?.user.id) {
    return {
      error: 'Not authenticated',
    };
  }

  try {
    const deletedDataFile = await prisma.dataFile.delete({
      where: {
        id: dataFileId,
      },
    });
    console.log('Deleted data file:', deletedDataFile);

    // Optionally, revalidate the data files page to reflect the deletion
    await revalidatePath('/dashboard');

    return deletedDataFile;
  } catch (error: any) {
    console.error('Error deleting data file:', error);
    return {
      error: error.message,
    };
  }
}

export async function addDataFile(file: any): Promise<any> {
  console.log('Adding data file:', file)
  try {
    const session = await getSession();
    const newFile = await prisma.dataFile.create({
      data: {
        name: file.name,
        file: file.uploadedFileUrl, // Replace with actual uploaded file URL
        contentType: file.type,
        uploaderId: session?.user.id,
        organizationId: session?.user.organizationId || undefined,
      },
    });
    return newFile;
  } catch (error) {
    console.error('Error adding data file:', error);
    throw new Error('Failed to add data file.');
  }
}


