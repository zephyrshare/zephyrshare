'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { MarketDataFile, MarketDataSource } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

// export async function getMarketDataSourcesForDataCustomer(): Promise<MarketDataSource[]> {
//   const session = await getSession();
//   if (!session?.user.dataCustomerId) {
//     return [];
//   }

//   noStore(); // Prevent caching of this page
//   console.log('Fetching Market Data Sources for Data Owner:', session.user.dataOwnerId);

//   try {
//     const marketDataSources = await prisma.marketDataSource.findMany({
//       where: { dataCustomerId: session.user.dataCustomerId },
//     });
//     return marketDataSources;
//   } catch (error) {
//     console.error('Error fetching Market Data Sources:', error);
//     throw new Error('Failed to fetch market data sources.');
//   }
// }
