import AIChat from '@/components/ai-chat';

export default function Page() {
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <h1 className="font-cal text-3xl font-bold dark:text-white">Dashboard</h1>
      <AIChat />
    </div>
  );
}
