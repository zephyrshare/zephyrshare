import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3, DynamoDB } from 'aws-sdk';
import { FileInfo } from '../../utils/types';

const S3_BUCKET_NAME = process.env.S3_BUCKET || '';
const FILE_TABLE_NAME = process.env.FILE_TABLE || ''; // Assuming a table to store file metadata
const USER_TABLE_NAME = process.env.USER_TABLE || '';
const EXPIRATION_TIME = 3600;
const s3 = new S3();
const dynamoDBClient = new DynamoDB.DocumentClient();

export async function main(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const authHeader = event.headers.authorization;
  if (!authHeader) {
    return { statusCode: 401, body: 'Unauthorized: Missing authorization token' };
  }

  const apiKey = authHeader.split(' ')[1];

  // 1. Authentication (reusing logic from your other handlers)

  try {
    const userResult = await dynamoDBClient
      .query({
        TableName: USER_TABLE_NAME,
        IndexName: 'apiKey-index', // Using the GSI
        KeyConditionExpression: 'apiKey = :apiKey',
        ExpressionAttributeValues: {
          ':apiKey': apiKey,
        },
      })
      .promise();

    const user = userResult.Items?.[0];

    if (!user) {
      return { statusCode: 403, body: 'Forbidden: Invalid API key' };
    }
  } catch (error) {
    console.error('Error authenticating user:', error);
    return { statusCode: 500, body: 'Internal server error' };
  }

  // 2. File Metadata (assuming 'fileId' is passed in query parameters)
  const fileId = event.queryStringParameters?.fileId;
  if (!fileId) {
    return { statusCode: 400, body: 'Missing fileId' };
  }

  try {
    const fileResult = await dynamoDBClient
      .get({
        TableName: FILE_TABLE_NAME,
        Key: { fileId },
      })
      .promise();

    const fileInfo = fileResult.Item as FileInfo;
    if (!fileInfo) {
      return { statusCode: 404, body: 'File not found' };
    }

    // 3. S3 Download URL
    const s3Params = {
      Bucket: S3_BUCKET_NAME,
      Key: fileInfo.s3Key, // Assuming you store the S3 object key in DynamoDB
      Expires: EXPIRATION_TIME,
    };

    const downloadUrl = await s3.getSignedUrlPromise('getObject', s3Params);

    // 4. Response
    return {
      statusCode: 200,
      // Add CORS headers
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow requests from any origin
        'Access-Control-Allow-Headers': '*', // Allow any headers
        'Access-Control-Allow-Methods': 'OPTIONS,GET,POST', // Allow essential methods
      },
      body: JSON.stringify({ downloadUrl }),
    };
  } catch (error) {
    console.error('Error generating download URL:', error);
    return { statusCode: 500, body: 'Internal server error' };
  }
}
