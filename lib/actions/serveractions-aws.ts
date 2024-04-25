'use server';

import { PutObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const getS3PresignedUploadUrl = async (s3key: string) => {
  const client = new S3Client({ region: process.env.AWS_REGION });
  const command = new PutObjectCommand({ Bucket: process.env.AWS_FILES_BUCKET_NAME, Key: s3key });
  const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 /* 5 minutes */});
  console.log('signedUrl in actions-aws', signedUrl);
  return signedUrl;
};


export const getS3PresignedDownloadUrl = async (s3key: string) => {
  const client = new S3Client({ region: process.env.AWS_REGION });
  const command = new GetObjectCommand({ Bucket: process.env.AWS_FILES_BUCKET_NAME, Key: s3key });
  const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 /* 5 minutes */});
  console.log('signedUrl in actions-aws', signedUrl);
  return signedUrl;
}
