import { CardSkeleton } from '@/components/ui/skeletons';

export default async function Loading() {
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 py-10 px-8 md:p-8 ">
      <h1 className="font-cal text-xl font-medium dark:text-white">Customers</h1>
      <CardSkeleton />
    </div>
  );
}
