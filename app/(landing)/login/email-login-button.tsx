'use client';

import LoadingDots from '@/components/icons/loading-dots';
import { signIn } from 'next-auth/react';
import { useSearchParams, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function EmailLoginButton() {
  const { next } = useParams as { next?: string };
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>('');

  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error;
    errorMessage && toast.error(errorMessage);
  }, [error]);

  return (
    <>
      <form className="flex flex-col pt-8 gap-4">
        <Input
          className=" border-2 w-full text-center"
          placeholder="jsmith@company.co"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </form>
      <button
        disabled={loading}
        onClick={(e) => {
          setLoading(true);
          e.preventDefault();
          signIn('email', {
            email: email,
            redirect: false,
            ...(next && next.length > 0 ? { callbackUrl: next } : {}),
          }).then((res) => {
            if (res?.ok && !res?.error) {
              setEmail('');
              toast.success('Email sent - check your inbox!');
            } else {
              toast.error('Error sending email - try again?');
            }
          });
        }}
        className={`${
          loading
            ? 'cursor-not-allowed bg-stone-50 dark:bg-stone-800'
            : 'bg-white hover:bg-stone-50 active:bg-stone-100 dark:bg-black dark:hover:border-white dark:hover:bg-black'
        } group my-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-stone-200 transition-colors duration-75 focus:outline-none dark:border-stone-700`}
      >
        {loading ? (
          <LoadingDots color="#A8A29E" />
        ) : (
          <>
            <p className="text-sm font-medium text-stone-600 dark:text-stone-400">Login with Email</p>
          </>
        )}
      </button>
    </>
  );
}
