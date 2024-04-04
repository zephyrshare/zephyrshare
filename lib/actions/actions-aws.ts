'use server';

import { S3 } from 'aws-sdk';

// Load the AWS SDK and create a new S3 client
const s3 = new S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function getS3PresignedUploadUrl(s3Key: string) {
  const params = {
    Bucket: process.env.AWS_FILES_BUCKET_NAME,
    Key: s3Key,
    Expires: 60 * 5, // 5 minutes
  };

  console.log('params in actions-aws', params)

  const signedUrl = await s3.getSignedUrlPromise('putObject', params);

  console.log('signedUrl in actions-aws', signedUrl)

  return signedUrl;
}
