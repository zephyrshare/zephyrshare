import AIChat from '@/components/ai-chat';

export default function Page() {
  return (
    <div className="flex max-w-screen-xl flex-col py-10 px-8 md:p-8">
      <h1 className="font-cal text-xl font-medium dark:text-white">Dashboard</h1>
      <AIChat />
    </div>
  );
}