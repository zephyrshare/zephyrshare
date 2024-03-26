import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3, DynamoDB } from 'aws-sdk';
import { FileInfo } from '../../utils/types';

const S3_BUCKET_NAME = process.env.S3_BUCKET || '';
const FILE_TABLE_NAME = process.env.FILE_TABLE || '';
const USER_TABLE_NAME = process.env.USER_TABLE || '';
const s3 = new S3();
const dynamoDBClient = new DynamoDB.DocumentClient();

export async function main(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const authHeader = event.headers.authorization;
  if (!authHeader) {
    return { statusCode: 401, body: 'Unauthorized: Missing authorization token' };
  }

  const apiKey = authHeader.split(' ')[1];
  const fileId = event.pathParameters?.fileId;
  if (!fileId) {
    return { statusCode: 400, body: 'Missing fileId' };
  }

  try {
    // 1. Authentication (using the same approach as other handlers)
    const userResult = await dynamoDBClient
      .query({
        TableName: USER_TABLE_NAME,
        IndexName: 'apiKey-index',
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

    // 2. Retrieve File Metadata
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

    // 3. Authorization (verify file ownership)
    if (fileInfo.userId !== user.userId) {
      return { statusCode: 403, body: 'Forbidden: Not authorized to delete' };
    }

    // 4. Delete S3 Object
    await s3
      .deleteObject({
        Bucket: S3_BUCKET_NAME,
        Key: fileInfo.s3Key,
      })
      .promise();

    // 5. Delete DynamoDB Entry
    await dynamoDBClient
      .delete({
        TableName: FILE_TABLE_NAME,
        Key: { fileId },
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
      body: 'File deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { statusCode: 500, body: 'Internal server error' };
  }
}
