import { CardSkeleton } from '@/components/ui/skeletons';
import PageContainer from '@/components/ui/page-container';

export default async function Loading() {
  return (
    <PageContainer>
      <h1 className="font-cal text-xl font-medium dark:text-white">Market Data</h1>
      <CardSkeleton />
    </PageContainer>
  );
}
