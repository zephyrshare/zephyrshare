'use client';

import LoadingDots from '@/components/ui/loading-dots';
import { signIn } from 'next-auth/react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { useState, useEffect, FormEvent } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

export default function TestCredentialsLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error;
    errorMessage && toast.error(errorMessage);
  }, [error]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setUsernameError(!username.trim());
    setPasswordError(!password.trim());

    if (!username.trim() || !password.trim()) {
      toast.error('Both username and password are required.');
      return; // Stop the form submission if either field is empty
    }

    setLoading(true);

    // https://next-auth.js.org/getting-started/client#using-the-redirect-false-option
    const res = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    if (res?.ok && !res?.error) {
      router.push('/marketdata');
    } else {
      toast.error('Error logging in. Try again?');
      setUsername('');
      setPassword('');
      setUsernameError(false);
      setPasswordError(false);
    }
    setLoading(false);
  };

  return (
    <>
      <form className="flex flex-col px-6 py-4 mb-2 rounded-md bg-slate-100" onSubmit={handleSubmit} noValidate>
        <p className="text-stone-600 dark:text-stone-400 text-left mb-2">Test credentials:</p>
        <Input
          className={`border-2 w-full text-left mb-2 ${usernameError ? 'border-red-500' : 'border-stone-200'}`}
          placeholder="Username"
          value={username}
          type="text"
          onChange={(e) => {
            setUsername(e.target.value);
            setUsernameError(false);
          }}
        />
        <Input
          className={`border-2 w-full text-left ${passwordError ? 'border-red-500' : 'border-stone-200'}`}
          placeholder="●●●●●●●●"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(false);
          }}
        />
        <button
          type="submit"
          disabled={loading}
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
              <p className="text-sm font-medium text-stone-600 dark:text-stone-400">Continue</p>
            </>
          )}
        </button>
      </form>
    </>
  );
}
