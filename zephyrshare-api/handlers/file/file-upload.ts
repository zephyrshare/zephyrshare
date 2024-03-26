import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { S3, DynamoDB } from 'aws-sdk';
import { FileInfo } from '../../utils/types';

const S3_BUCKET_NAME = process.env.S3_BUCKET || '';
const USER_TABLE_NAME = process.env.USER_TABLE || '';
const FILE_TABLE_NAME = process.env.FILE_TABLE || '';
const EXPIRATION_TIME = 3600;
const s3 = new S3();
const dynamoDBClient = new DynamoDB.DocumentClient();

export async function main(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const authHeader = event.headers.authorization; // Get the Authorization header. Note, this is case-sensitive and AWS Lambda will automatically convert it to lowercase
  if (!authHeader) {
    return { statusCode: 401, body: 'Unauthorized: Missing authorization token' };
  }

  const apiKey = authHeader.split(' ')[1];

  let user;

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

    user = userResult.Items?.[0];

    if (!user) {
      return { statusCode: 403, body: 'Forbidden: Invalid API key' };
    }
  } catch (error) {
    console.error('Error authenticating user:', error);
    return { statusCode: 500, body: 'Internal server error' };
  }

  try {
    // Generate an S3 pre-signed URL for uploading
    const fileId = uuidv4(); // Generate unique file ID
    const fileName = event.queryStringParameters?.fileName || fileId;
    const s3Key = `${user.userId}/${fileName}`;
    const s3Params = {
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      Expires: EXPIRATION_TIME,
    };

    const uploadUrl = await s3.getSignedUrlPromise('putObject', s3Params);

    // DynamoDB Entry
    const fileInfo: FileInfo = {
      fileId,
      userId: user.userId,
      fileName,
      s3Key,
    };

    await dynamoDBClient
      .put({
        TableName: FILE_TABLE_NAME,
        Item: fileInfo,
      })
      .promise();

    return {
      statusCode: 200,
      // Add CORS headers
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow requests from any origin
        'Access-Control-Allow-Headers': '*', // Allow any headers
        'Access-Control-Allow-Methods': 'OPTIONS,GET,POST', // Allow essential methods
      },
      body: JSON.stringify({ uploadUrl, fileId }),
    };
  } catch (error) {
    console.error('Error generating pre-signed URL: ', error);
    return {
      statusCode: 500,
      body: 'Internal server error',
    };
  }
}
