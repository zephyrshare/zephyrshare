import PageContainer from '@/components/ui/page-container';

export default function Page() {
  return (
    <PageContainer>
      <h1 className="font-cal text-xl font-medium dark:text-white">Contracts</h1>
      <div className="flex flex-col items-center w-full">
        <h3 className="font-cal text-xl font-bold dark:text-white mb-6">Create a new contract</h3>
      </div>
    </PageContainer>
  );
}
