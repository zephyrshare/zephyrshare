import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as bcrypt from 'bcryptjs'; 
import { v4 as uuidv4  } from 'uuid';
import { DynamoDB } from 'aws-sdk'; 

const USER_TABLE_NAME = process.env.USER_TABLE || '';
const dynamoDBClient = new DynamoDB.DocumentClient();

interface User {
    userId: string;
    email: string;
    passwordHash: string;
    apiKey: string;
    createdAt?: string; 
}

export async function main(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    if (!event.body) {
        return {
            statusCode: 400,
            body: 'Email and password are required'
        };
    }

    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
        return {
            statusCode: 400,
            body: 'Email and password are required'
        };
    }

    // Hash the password with bcrypt
    const salt = await bcrypt.genSalt(10);  // Cost factor of 10 is common
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a unique API key 
    const apiKey = uuidv4();

    const newUser: User = {
        userId: uuidv4(),
        email,
        passwordHash: hashedPassword,
        apiKey,
        createdAt: new Date().toISOString() 
    };

    try {
        await dynamoDBClient.put({
            TableName: USER_TABLE_NAME,
            Item: newUser
        }).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ apiKey })
        };
    } catch (error) {
        console.error('Error creating user: ', error); 
        return {
            statusCode: 500,
            body: 'Error creating user' 
        };
    }
}
