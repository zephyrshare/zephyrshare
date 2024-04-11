'use client';

import { useState } from 'react';
import { toast } from 'sonner';
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

export default function AddMarketDataButton({ user }: { user: User | undefined }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [dataSourceName, setDataSourceName] = useState<string>('');
  const [dataSourceDescription, setDataSourceDescription] = useState<string>('');

  if (!user) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user?.organizationId) {
      toast.error('User not associated with an organization. Cannot add data source.');
      return;
    }

    const organizationId = user?.organizationId;
    let marketDataSourceRes;

    try {
      // Represents a collection of related data files that are uploaded by the user
      marketDataSourceRes = await addMarketDataSource({
        id: '1',
        name: dataSourceName || 'ahhhh',
        description: dataSourceDescription,
        organizationId,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error adding Market Data Source:', error);
      toast.error('Error adding Market Data Source');
      return;
    }

    // Check if the file is chosen and prevent form submission if not
    if (!currentFile) {
      toast.error('Please select a file to upload.');
      return;
    }

    setUploading(true);

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
        createdAt: new Date()
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
    currentFile !== null && setCurrentFile(null);
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
          <DialogTitle>Upload a File</DialogTitle>
          <DialogDescription>Upload a new file here. Click upload when you're done.</DialogDescription>
        </DialogHeader>
        <form encType="multipart/form-data" onSubmit={handleSubmit} className="flex flex-col">
          <div className="pb-6">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <UploadDropzone currentFile={currentFile} setCurrentFile={setCurrentFile} />
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
