import { getServerSession, type NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from 'next-auth/providers/credentials';
import { sendVerificationRequestEmail } from './email-lib/send-verification-request-email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          gh_username: profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: 'OWNER_ADMIN', // Default role for now
        };
      },
    }),
    EmailProvider({
      // TODO: how to set the default role for email signups?
      async sendVerificationRequest({ identifier, url }) {
        // identifier: the email address the verification request was sent to
        // url: the url to verify the users email

        if (process.env.NODE_ENV === 'development') {
          console.log(`Login link: ${url}`);
          return;
        } else {
          await sendVerificationRequestEmail({
            url,
            email: identifier,
          });
        }
      },
    }),
    CredentialsProvider({
      // The CredentialsProvider is used for testing purposes only and will not insert user rows into the database. This must be done manually.
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // Here you would fetch user data from your database
        // And compare the password with the hashed password stored in the database

        if (credentials?.username === 'zonalexchange' && credentials?.password === 'zonalpass') {
          console.log('correct credentialas - returning user');
          // Return a sample user here based on the code and the schema.prisma
          return {
            id: 'aoiefjoiwef',
            name: 'Zonal Exchange',
            username: 'zonalexchange',
            email: 'test@zexchange.com',
            role: 'OWNER_ADMIN',
            dataOwnerId: 'new_dataowner_id',
          };
        }

        if (credentials?.username === 'drwtrader' && credentials?.password === 'drwpass') {
          return {
            id: 'qweiojwqef',
            name: 'DRW Trader',
            username: 'drwtrader',
            email: 'trader@drwholdings.com',
            role: 'CUSTOMER_ADMIN',
            dataCustomerId: 'new_datacustomer_id',
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: `/login`,
    verifyRequest: `/login`,
    error: '/login', // Error code passed in query string as ?error=
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
        domain: VERCEL_DEPLOYMENT ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = {
        // @ts-expect-error
        id: token.sub,
        // @ts-expect-error
        name: token?.user?.name,
        // @ts-expect-error
        username: token?.user?.username || token?.user?.gh_username,
        // @ts-expect-error
        email: token?.user?.email,
        // @ts-expect-error
        emailVerified: token?.user?.emailVerified,
        // @ts-expect-error
        image: token?.user?.image,
        // @ts-expect-error
        createdAt: token?.user?.createdAt,
        // @ts-expect-error
        updatedAt: token?.user?.updatedAt,
        // @ts-expect-error
        role: token?.user?.role, // Include the user's role in the session
        // @ts-expect-error
        apiToken: token?.user?.apiToken,
        // @ts-expect-error
        dataOwnerId: token?.user?.dataOwnerId,
        // @ts-expect-error
        dataCustomerId: token?.user?.dataCustomerId,
        // @ts-expect-error
        hasOnboarded: token?.user?.hasOnboarded,
      };
      return session;
    },
    signIn: async ({ user }) => {
      // Use this callback to control if a user is allowed to sign in. Returning true will continue the sign-in flow.
      // Throwing an error or returning a string will stop the flow, and redirect the user.

      return true;
    },
  },
  events: {
    signIn: async ({ user }) => {},
  },
};

export function getSession() {
  return getServerSession(authOptions) as Promise<{ user: User } | null>;
}
