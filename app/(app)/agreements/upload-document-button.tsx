'use client';

import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingDots from '@/components/icons/loading-dots';
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
import { minimumDelay } from '@/lib/utils';

const formSchema = z.object({
  organizationName: z
    .string()
    .min(1, 'Organization Name is required.')
    .max(50, 'Organization Name must not exceed 50 characters.'),
  organizationDescription: z.string().max(400, 'Organization Description must not exceed 400 characters.').optional(),
});

export default function UploadDocumentButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {},
  // });

  // async function onSubmit(values: z.infer<typeof formSchema>) {
  //   setLoading(true);

  //   await minimumDelay(async () => {
  //     try {
  //       await addOrganization(values);
  //       form.reset(); // This will reset the form fields to their initial state
  //     } catch (error) {
  //       console.error('Error submitting form', error);
  //     }
  //   }), 200;
  //   setLoading(false);
  //   setOpen(false);
  // }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="default" className="w-36">
          Upload Agreement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload an Agreement</DialogTitle>
          <DialogDescription>Upload a new agreement here. Click upload when you're done.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (event) => {
            event.preventDefault();

            if (!inputFileRef.current?.files) {
              throw new Error('No file selected');
            }

            const file = inputFileRef.current.files[0];

            const newBlob = await upload(file.name, file, {
              access: 'public',
              handleUploadUrl: '/api/upload/agreement',
            });

            setBlob(newBlob);
          }}
        >
          <input name="file" ref={inputFileRef} type="file" required />
          <button type="submit">Upload</button>
        </form>
        {blob && (
          <div>
            Blob url: <a href={blob.url}>{blob.url}</a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
