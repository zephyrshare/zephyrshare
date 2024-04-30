'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { unstable_noStore as noStore } from 'next/cache';
import { MarketDataSource } from '@prisma/client';

export async function getMarketDataSourcesForDataCustomer(): Promise<MarketDataSource[]> {
  const session = await getSession();
  if (!session?.user.dataCustomerId) {
    return [];
  }

  noStore(); // Prevent caching of this page
  console.log('Fetching Market Data Sources for Data Customer:', session.user.dataCustomerId);

  try {
    const marketDataSources = await prisma.dataContract.findMany({
      where: {
        dataCustomerId: session.user.dataCustomerId,
        latestStatus: {
          statusType: 'ACTIVE',
        },
        // Assuming there's a way to determine active contracts, e.g., a boolean field or date range
        // isActive: true,
      },
      include: {
        marketDataSource: true, // Ensure you include the MarketDataSource in the result
      },
    });

    // Extract MarketDataSource entities from the contracts
    const sources = marketDataSources.map((contract) => contract.marketDataSource).filter((source) => !!source);

    return sources;
  } catch (error) {
    console.error('Error fetching Market Data Sources:', error);
    throw new Error('Failed to fetch market data sources.');
  }
}
