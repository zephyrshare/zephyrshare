'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateUser } from '@/lib/actions/actions';
import { generateApiToken } from '@/lib/api-token';

interface APITokenFormProps {
  initialToken: string | null;
}

export default function APITokenForm({ initialToken = '' }: APITokenFormProps) {
  const [apiToken, setApiToken] = useState(initialToken);
  const [showToken, setShowToken] = useState(false);
  const form = useForm({ defaultValues: {} });

  const handleGenerateToken = async () => {
    const newToken = generateApiToken();
    await updateUser({ apiToken: newToken });
    setApiToken(newToken);
    setShowToken(true);
  };

  const handleToggleTokenVisibility = () => {
    setShowToken((prev) => !prev);

    if (!showToken) {
      navigator.clipboard.writeText(apiToken || '');
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-8">
        <div className="grid gap-4 py-4">
          <FormField
            name="apiToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Token</FormLabel>
                <FormControl className="relative">
                  <div>
                    <Input
                      type={showToken ? 'text' : 'password'}
                      placeholder="Your API Token"
                      value={apiToken || ''}
                      readOnly
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-stone-700 transition-all duration-150 ease-in-out hover:bg-slate-200 active:bg-slate-200 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800"
                      onClick={handleToggleTokenVisibility}
                    >
                      {showToken ? <EyeOff width={18} /> : <Eye width={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-center">
          <Button type="button" onClick={handleGenerateToken} disabled={typeof apiToken !== 'string'}>
            {apiToken ? 'Regenerate Token' : 'Generate Token'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
