'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingDots from '@/components/ui/loading-dots';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createOrganization } from '@/lib/actions';
import { minimumDelay } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(1, 'Customer Name is required.').max(50, 'Customer Name must not exceed 50 characters.'),
  description: z.string().max(400, 'Customer Description must not exceed 400 characters.').optional(),
});

export default function AddCustomerButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    await minimumDelay(async () => {
      try {
        await createOrganization(values);
        form.reset(); // This will reset the form fields to their initial state
      } catch (error) {
        console.error('Error submitting form', error);
      }
    }, 200);
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="default" className="max-w-[250px]">
          + Customer Organization
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Customer</DialogTitle>
          <DialogDescription>Add a new customer here. Click add when you're done.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Customer's Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your customer (Optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? <LoadingDots /> : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
