import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LogoutButton from './logout-button';

export default async function Profile() {
  const session = await getSession();
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="flex w-full items-center justify-between">
      <Link
        href="/account"
        className="flex w-full flex-1 items-center space-x-3 rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-slate-200 active:bg-slate-200 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800"
      >
        <Image
          src={session.user.image ?? `https://avatar.vercel.sh/${session.user.email}`}
          width={40}
          height={40}
          alt={session.user.name ?? 'User avatar'}
          className="h-6 w-6 rounded-full"
        />
        <span className="truncate text-sm font-medium">{session.user.name}</span>
      </Link>
      <TooltipProvider delayDuration={50}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <LogoutButton />
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={10}>
            <p>Logout</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
