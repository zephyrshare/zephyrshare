import { getServerSession, type NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import EmailProvider from 'next-auth/providers/email';
import { sendVerificationRequestEmail } from './email-lib/send-verification-request-email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';

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
    EmailProvider({ // TODO: how to set the default role for email signups?
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
        ...session.user,
        // @ts-expect-error
        id: token.sub,
        // @ts-expect-error
        username: token?.user?.username || token?.user?.gh_username,
        // @ts-expect-error
        role: token?.user?.role, // Include the user's role in the session
      };
      return session;
    },
  },
};

export function getSession() {
  return getServerSession(authOptions) as Promise<{
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
      image: string;
      role: string;
    };
  } | null>;
}

// export function withSiteAuth(action: any) {
//   return async (formData: FormData | null, siteId: string, key: string | null) => {
//     const session = await getSession();
//     if (!session) {
//       return {
//         error: 'Not authenticated',
//       };
//     }
//     const site = await prisma.site.findUnique({
//       where: {
//         id: siteId,
//       },
//     });
//     if (!site || site.userId !== session.user.id) {
//       return {
//         error: 'Not authorized',
//       };
//     }

//     return action(formData, site, key);
//   };
// }
