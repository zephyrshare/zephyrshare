'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { MarketDataFile, MarketDataSource } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

// Functions:
// 1. getMarketDataSourcesByOrganization
// 2. updateMarketDataSource
// 3. deleteMarketDataSourceAndDataFiles
// 4. addMarketDataSource
// 5. getMarketDataFilesByMarketDataSource
// 6. deleteMarketDataFile
// 7. addMarketDataFile
// 8. updateMarketDataFile

export async function getMarketDataSourcesByOrganization(): Promise<MarketDataSource[]> {
  const session = await getSession();
  if (!session?.user.organizationId) {
    return [];
  }

  noStore(); // Prevent caching of this page
  console.log('Fetching Market Data Sources for organization:', session.user.organizationId);

  try {
    const marketDataSources = await prisma.marketDataSource.findMany({
      where: { organizationId: session.user.organizationId },
    });
    return marketDataSources;
  } catch (error) {
    console.error('Error fetching Market Data Sources:', error);
    throw new Error('Failed to fetch market data sources.');
  }
}

export async function updateMarketDataSource(dataSource: MarketDataSource): Promise<MarketDataSource> {
  console.log('Updating Market Data Source:', dataSource);
  try {
    const updatedDataSource = await prisma.marketDataSource.update({
      where: {
        id: dataSource.id,
      },
      data: {
        name: dataSource.name,
        description: dataSource.description,
        organizationId: dataSource.organizationId,
      },
    });
    return updatedDataSource;
  } catch (error) {
    console.error('Error updating Market Data Source:', error);
    throw new Error('Failed to update market data source.');
  }
}

export async function deleteMarketDataSourceAndDataFiles(dataSourceId: string): Promise<MarketDataSource> {
  console.log('Deleting Market Data Source:', dataSourceId);
  try {
    // Delete all data files associated with this data source
    await prisma.marketDataFile.deleteMany({
      where: {
        marketDataSourceId: dataSourceId,
      },
    });

    const deletedDataSource = await prisma.marketDataSource.delete({
      where: {
        id: dataSourceId,
      },
    });

    return deletedDataSource;
  } catch (error) {
    console.error('Error deleting Market Data Source:', error);
    throw new Error('Failed to delete market data source.');
  }
}

export async function addMarketDataSource(dataSource: MarketDataSource): Promise<MarketDataSource> {
  console.log('Adding Market Data Source:', dataSource);
  try {
    const session = await getSession();

    if (!session?.user.organizationId) {
      throw new Error('User not associated with an organization. Cannot add data source.');
    }

    const organizationId = session?.user.organizationId;
    const newDataSource = await prisma.marketDataSource.create({
      data: {
        name: dataSource.name,
        description: dataSource.description,
        organizationId,
      },
    });

    // Revalidate the market data page to reflect the new data source
    revalidatePath('/marketdata');

    return newDataSource;
  } catch (error) {
    console.error('Error adding Market Data Source:', error);
    throw new Error('Failed to add market data source.');
  }
}


export async function getMarketDataFilesByMarketDataSource(dataSourceId: string): Promise<MarketDataFile[]> {
  console.log('Fetching Market Data Files for data source:', dataSourceId);
  try {
    const marketDataFiles = await prisma.marketDataFile.findMany({
      where: { marketDataSourceId: dataSourceId },
    });
    return marketDataFiles;
  } catch (error) {
    console.error('Error fetching Market Data Files:', error);
    throw new Error('Failed to fetch market data files.');
  }
}

export async function deleteMarketDataFile(fileId: string): Promise<MarketDataFile> {
  console.log('Deleting Market Data File:', fileId);
  try {
    const deletedFile = await prisma.marketDataFile.delete({
      where: {
        id: fileId,
      },
    });
    return deletedFile;
  } catch (error) {
    console.error('Error deleting Market Data File:', error);
    throw new Error('Failed to delete market data file.');
  }
}

export async function addMarketDataFile(file: MarketDataFile): Promise<MarketDataFile> {
  console.log('Adding Market Data File:', file);
  try {
    const newFile = await prisma.marketDataFile.create({
      data: {
        name: file.name,
        file: file.file,
        contentType: file.contentType,
        uploaderId: file.uploaderId,
        organizationId: file.organizationId,
        marketDataSourceId: file.marketDataSourceId,
      },
    });
    return newFile;
  } catch (error) {
    console.error('Error adding Market Data File:', error);
    throw new Error('Failed to add market data file.');
  }
}

export async function updateMarketDataFile(file: MarketDataFile): Promise<MarketDataFile> {
  console.log('Updating Market Data File:', file);
  try {
    const updatedFile = await prisma.marketDataFile.update({
      where: {
        id: file.id,
      },
      data: {
        name: file.name,
        file: file.file,
        contentType: file.contentType,
        uploaderId: file.uploaderId,
        organizationId: file.organizationId,
        marketDataSourceId: file.marketDataSourceId,
      },
    });
    return updatedFile;
  } catch (error) {
    console.error('Error updating Market Data File:', error);
    throw new Error('Failed to update market data file.');
  }
}

