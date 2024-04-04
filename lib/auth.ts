import { getServerSession, type NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import EmailProvider from 'next-auth/providers/email';
import { sendVerificationRequestEmail } from './email-lib/send-verification-request-email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';
import { getEmailDomain, getEmailUsername } from '@/lib/utils';
import { createOrganization, updateUserOnLogin, getOrganizationByEmailDomain } from '@/lib/actions';
import { DEFAULT_ORG_NAME } from '@/lib/constants';

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
        organizationId: token?.user?.organizationId,
        // @ts-expect-error
        apiToken: token?.user?.apiToken,
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
    signIn: async ({ user }) => {
      // When a user signs up
      // 1. If the user has no organizationId, check whether an organization exists for the user's email domain
      //      If one exists, save the organizationId to the user
      //      If none exists, create a new organization and save the organizationId to the user
      // 2. Add their "name" default to their email without the @domain
      // 3. Assign the user a role

      const updatedUserFields: any = {};

      // Check whether an organization exists with the given email domain
      //@ts-expect-error
      if (!user.organizationId) {
        const emailDomain = getEmailDomain(user?.email);
        const organization = await getOrganizationByEmailDomain(emailDomain);

        if (organization) {
          // Add the organizationId of the existing Organization to the user
          updatedUserFields.organizationId = organization.id;
        } else {
          // TODO - add a "business" or "personal" email option. If personal, don't create an organization (or just create a personal one)
          // TODO - validate no business organizations use personal email domains such as @gmail.com, @yahoo.com, @hotmail.com, @icloud.com, @outlook.com, @aol.com, @me.com

          const organization = await createOrganization({
            name: DEFAULT_ORG_NAME,
            emailDomain,
          });
          console.log('Created organization', organization);

          // Add the organizationId of the newly created Organization to the user
          // @ts-expect-error
          updatedUserFields.organizationId = organization.id;
        }
      }

      // Update the user here in the code:
      // 1. User's name to be their email without the domain
      // 2. organizationId to be the user's organization
      if (!user.name) {
        updatedUserFields.name = getEmailUsername(user.email);
      }

      // if updatedUserFields is not empty, update the user
      if (Object.keys(updatedUserFields).length > 0) {
        const updatedUser = await updateUserOnLogin(updatedUserFields, user.id);
        console.log('Updated user in signIn callback', updatedUser);
      }
    },
  },
};

export function getSession() {
  return getServerSession(authOptions) as Promise<{ user: User } | null>;
}
