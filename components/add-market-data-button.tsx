'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { addMarketDataFile, addMarketDataSource, getS3PresignedUploadUrl } from '@/lib/actions';
import UploadDropzone from '@/components/upload-dropzone';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  dataSourceName: z
    .string()
    .min(1, 'Market Data name is required.')
    .max(50, 'Market Data name must not exceed 50 characters.'),
  dataSourceDescription: z.string().max(400, 'Description must not exceed 400 characters.').optional(),
});

export default function AddMarketDataButton({ user }: { user: User | undefined }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataSourceName: '',
      dataSourceDescription: '',
    },
  });

  if (!user) {
    return null;
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!user?.organizationId) {
      toast.error('User not associated with an organization. Cannot add data source.');
      return;
    }

    setUploading(true);

    const { dataSourceName, dataSourceDescription } = data;
    const organizationId = user?.organizationId;
    let marketDataSourceRes;

    try {
      // Represents a collection of related data files that are uploaded by the user
      marketDataSourceRes = await addMarketDataSource({
        id: uuid(),
        name: dataSourceName,
        description: dataSourceDescription || null,
        organizationId,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error adding Market Data Source:', error);
      toast.error('Error adding Market Data Source');
      setUploading(false);
      setOpen(false);
      return;
    }

    // Check if the file is chosen and prevent form submission if not
    if (!currentFile) {
      toast.error('Please select a file to upload.');
      return;
    }

    // Sample uploaded file object
    // path: "2024-02 Copper Mountain Ski Resort FY24_Trail_Map.pdf"
    // lastModified: 1708699356005
    // lastModifiedDate: Fri Feb 23 2024 09:42:36 GMT-0500 (Eastern Standard Time) {}
    // name: "2024-02 Copper Mountain Ski Resort FY24_Trail_Map.pdf"
    // size: 3381664
    // type: "application/pdf"

    const fileId = uuid();
    const s3Key = `${organizationId}/${fileId}`;

    console.log('user', user);
    console.log('fileId', fileId);
    console.log('s3Key', s3Key);

    // Get an AWS S3 Pre-signed file upload URL from the server
    const uploadUrl = await getS3PresignedUploadUrl(s3Key);

    console.log('uploadUrl', uploadUrl);

    try {
      // PUT call to upload the file on the client side to the S3 Pre-signed URL
      const opt = {
        method: 'PUT',
        body: currentFile,
        headers: {
          'Content-Type': currentFile.type,
        },
      };
      console.log('Request options', opt);
      const response = await fetch(uploadUrl, opt);

      console.log('response', response);
    } catch (error) {
      console.error('Error uploading file', error);
      toast.error('Error uploading file');
    }

    try {
      // Add the new Market Data File record to the database
      const marketDataFileResponse = await addMarketDataFile({
        id: fileId,
        name: currentFile.name,
        file: s3Key,
        contentType: currentFile.type,
        uploaderId: user.id,
        organizationId,
        marketDataSourceId: marketDataSourceRes.id,
        createdAt: new Date(),
      });

      toast.success('Market Data Record added successfully');
    } catch (error) {
      console.error('Error adding Market Data Record:', error);
      toast.error('Error adding Market Data Record');
    }

    setUploading(false);
    setOpen(false);
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      form.reset(); // Reset form when dialog is closed
      setCurrentFile(null);
    }
    setOpen(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" size="default" className="w-36">
          + Add Market Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Market Data Source</DialogTitle>
          <DialogDescription>
            Add a market data source and upload a new file here. Click add when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="dataSourceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market Data name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex, End of Day Settlement Prices" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dataSourceDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the market data" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pb-6">
              <UploadDropzone currentFile={currentFile} setCurrentFile={setCurrentFile} />
            </div>
            <div className="flex justify-center">
              <Button type="submit" className="w-full lg:w-1/2" disabled={uploading || !currentFile}>
                {uploading ? 'Adding...' : 'Add Market Data'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
