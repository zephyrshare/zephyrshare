'use client';

import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';
import { toast } from "sonner";
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
import { addAgreement } from '@/lib/actions';
import UploadDropzone from '@/components/upload-dropzone';

const formSchema = z.object({
  customerName: z.string().min(1, 'Customer Name is required.').max(50, 'Customer Name must not exceed 50 characters.'),
  customerDescription: z.string().max(400, 'Customer Description must not exceed 400 characters.').optional(),
});

export default function UploadDocumentButton() {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {},
  // });

  // async function onSubmit(values: z.infer<typeof formSchema>) {
  //   setLoading(true);

  //   await minimumDelay(async () => {
  //     try {
  //       await addCustomer(values);
  //       form.reset(); // This will reset the form fields to their initial state
  //     } catch (error) {
  //       console.error('Error submitting form', error);
  //     }
  //   }), 200;
  //   setLoading(false);
  //   setOpen(false);
  // }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Check if the file is chosen
    if (!currentFile) {
      toast.error('Please select a file to upload.');
      return; // prevent form from submitting
    }

    setUploading(true);

    const newBlob = await upload(currentFile.name, currentFile, {
      access: 'public',
      handleUploadUrl: '/api/upload/agreement',
    });

    const newAgreement = await addAgreement({
      name: currentFile.name,
      file: newBlob.url,
      contentType: newBlob.contentType,
    });

    console.log('newBlob', newBlob);

    setBlob(newBlob);
    setUploading(false);
    setOpen(false);
  }

  function handleOpenChange(isOpen: boolean) {
    currentFile !== null && setCurrentFile(null)
    setOpen(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
        <form encType="multipart/form-data" onSubmit={handleSubmit} className="flex flex-col">
          <div className="space-y-1">
            <div className="pb-6">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <UploadDropzone currentFile={currentFile} setCurrentFile={setCurrentFile} />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button type="submit" className="w-full lg:w-1/2" disabled={uploading || !currentFile}>
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
