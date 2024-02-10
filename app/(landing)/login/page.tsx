import GithubLoginButton from './github-login-button';
import EmailLoginButton from './email-login-button';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <div className="mx-5 border border-stone-200 py-10 dark:border-stone-700 sm:mx-auto sm:w-full sm:max-w-md sm:rounded-lg sm:shadow-md">
      <h1 className="mt-6 text-center font-cal text-3xl dark:text-white">Zephyr Share</h1>
      <p className="mt-2 text-center text-sm text-stone-600 dark:text-stone-400">
        Platform to securely share your company's data
        <br />
        <a
          className="font-medium text-black hover:text-stone-800 dark:text-stone-300 dark:hover:text-stone-100"
          href="https://vercel.com/blog/platforms-starter-kit"
          rel="noreferrer"
          target="_blank"
        >
          Read the announcement.
        </a>
      </p>

      <div className="mx-auto mt-4 w-11/12 max-w-xs sm:w-full">
        <Suspense
          fallback={
            <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
          <EmailLoginButton />
        </Suspense>
        <p className="text-center text-sm">or</p>
        <Suspense
          fallback={
            <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
          <GithubLoginButton />
        </Suspense>
      </div>
    </div>
  );
}
