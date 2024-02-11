'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { addOrganization } from '@/lib/actions';

interface OrganizationFormData {
  organizationName: string;
  organizationDescription?: string; // Marked as optional because it can be omitted
}

const formSchema = z.object({
  organizationName: z
    .string()
    .min(1, 'Organization Name is required.')
    .max(50, 'Organization Name must not exceed 50 characters.'),
  organizationDescription: z.string().max(400, 'Organization Description must not exceed 400 characters.').optional(),
});

export default function AddOrganizationPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // const onSubmit = async (data: OrganizationFormData) => {
    console.log('data', values);
    // Here you can integrate the form submission logic, e.g., calling an API.
    await addOrganization(values);
    // Handle submission success, e.g., showing a notification, redirecting, etc.
  }

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">Add Organization</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Organization Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizationDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your organization (Optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
