'use client';

import { format } from 'date-fns';
import { Fragment, useState } from 'react';
import { toast } from 'sonner';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MarketDataSource, Organization, User } from '@prisma/client';
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
import { addMarketDataFile, addMarketDataSource, addDataContract, getS3PresignedUploadUrl } from '@/lib/actions';
import UploadDropzone from '@/components/upload-dropzone';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from './ui/calendar';
import { Input } from './ui/input';

const formSchema = z.object({
  marketDataSourceId: z.string().optional(),
  customerId: z.string({ required_error: 'Customer is required' }),
  allowDownload: z.boolean().optional(),
  contractDetails: z.object({
    startDate: z.date({
      required_error: 'Contract start date is required',
    }),
    endDate: z.date({
      required_error: 'Contract start date is required',
    }),
    contractAmount: z.string({
      required_error: 'Contract monthly data liceense cost is required',
    }),
  }),
});

export default function AddContractDataButton({
  user,
  marketDataSources = [],
  customers = [],
}: {
  user?: User;
  customers?: Organization[];
  marketDataSources?: MarketDataSource[];
}) {
  const [open, setOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marketDataSourceId: '',
      customerId: '',
      allowDownload: false,
    },
  });

  const startDate = useWatch({
    name: 'contractDetails.startDate',
    control: form.control,
  });

  const endDate = useWatch({
    name: 'contractDetails.endDate',
    control: form.control,
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!user?.organizationId) {
      toast.error('User not associated with an organization. Cannot create customer contract.');
      return;
    }

    const { customerId, allowDownload, contractDetails } = data;
    let marketDataSourceId = data.marketDataSourceId;

    // Check if the file is chosen or market data source is chosen and prevent form submission if not
    if (!currentFile && !marketDataSourceId) {
      toast.error('Please choose market data source or select a new market data file to upload.');
      return;
    }

    const organizationId = user?.organizationId;
    let marketDataSourceRes;

    // Handle upload file in case market data source is not chosen
    if (!marketDataSourceId && currentFile) {
      // Sample uploaded file object
      // path: "2024-02 Copper Mountain Ski Resort FY24_Trail_Map.pdf"
      // lastModified: 1708699356005
      // lastModifiedDate: Fri Feb 23 2024 09:42:36 GMT-0500 (Eastern Standard Time) {}
      // name: "2024-02 Copper Mountain Ski Resort FY24_Trail_Map.pdf"
      // size: 3381664
      // type: "application/pdf"

      const fileId = uuid();
      const s3Key = `${organizationId}/${fileId}`;

      // Get an AWS S3 Pre-signed file upload URL from the server
      const uploadUrl = await getS3PresignedUploadUrl(s3Key);

      try {
        // PUT call to upload the file on the client side to the S3 Pre-signed URL
        const opt = {
          method: 'PUT',
          body: currentFile,
          headers: {
            'Content-Type': currentFile.type,
          },
        };
        const response = await fetch(uploadUrl, opt);
      } catch (error) {
        console.error('Error uploading file', error);
        toast.error('Error uploading file');
      }

      try {
        // Represents a collection of related data files that are uploaded by the user
        marketDataSourceRes = await addMarketDataSource({
          id: uuid(),
          name: currentFile.name,
          description: null,
          organizationId,
          createdAt: new Date(),
        });

        marketDataSourceId = marketDataSourceRes.id;
      } catch (error) {
        console.error('Error adding Market Data Source:', error);
        toast.error('Error adding Market Data Source');
        return;
      }

      try {
        // Add the new Market Data File record to the database
        await addMarketDataFile({
          id: fileId,
          name: currentFile.name,
          file: s3Key,
          contentType: currentFile.type,
          uploaderId: user.id,
          organizationId,
          marketDataSourceId,
          createdAt: new Date(),
        });

        toast.success('Market Data Record added successfully');
      } catch (error) {
        console.error('Error adding Market Data Record:', error);
        toast.error('Error adding Market Data Record');
        return;
      }
    }

    try {
      await addDataContract({
        buyerOrgId: customerId,
        marketDataSourceId: marketDataSourceId!,
        startDate: contractDetails.startDate,
        endDate: contractDetails.endDate,
        contractAmount: parseFloat(contractDetails.contractAmount),
        allowDownload,
      });
      toast.success('Contract is created succesfully.');
      setOpen(false);
    } catch (error: any) {
      toast.error('Cannot create customer contract. Please try again later.');
    }
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      form.reset(); // Reset form when dialog is closed
      setCurrentFile(null);
    }
    setOpen(isOpen);
  }

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" size="default" className="w-36">
          + Add Contract
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add a new customer contract</DialogTitle>
          <DialogDescription>
            Add a contract data source and upload a new file here. Click create contract when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
            <FormField
              control={form.control}
              name="marketDataSourceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>1. Choose market data source</FormLabel>
                  <FormControl>
                    <Select disabled={!!currentFile} onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a market data source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {marketDataSources.length ? (
                            marketDataSources.map((source) => (
                              <Fragment key={source.id}>
                                <SelectItem value={source.id}>{source.name}</SelectItem>
                              </Fragment>
                            ))
                          ) : (
                            <div className="text-center text-xs">No market data souce found</div>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Or drag a data file to create new</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <UploadDropzone currentFile={currentFile} setCurrentFile={setCurrentFile} />
            <FormField
              control={form.control}
              name="allowDownload"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Switch id="allow-download" onCheckedChange={field.onChange} />
                      <FormLabel htmlFor="allow-download">Allow Download</FormLabel>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>2. Choose a customer</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {customers.length ? (
                            customers.map((customer) => (
                              <Fragment key={customer.id}>
                                <SelectItem value={customer.id}>{customer.name}</SelectItem>
                              </Fragment>
                            ))
                          ) : (
                            <div className="text-center text-xs">No customer found</div>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>3. Choose contract dates</FormLabel>
              <div className="flex flex-row gap-2">
                <FormField
                  control={form.control}
                  name="contractDetails.startDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                return endDate ? date >= endDate : false;
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contractDetails.endDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                return startDate ? date <= startDate : false;
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="contractDetails.contractAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>4. Enter monthly data license cost</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter amount" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center mt-6">
              <Button type="submit" className="w-full lg:w-1/2" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating...' : 'Create Contract'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
