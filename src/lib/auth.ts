import NextAuth from "next-auth"
import prisma from './prisma'
import { PrismaAdapter } from "@auth/prisma-adapter"
import { Adapter } from "next-auth/adapters"
import GitHub from "next-auth/providers/github"
import Google from 'next-auth/providers/google'
import type { Provider } from "next-auth/providers"

const providers: Provider[] = [
  GitHub({
    clientId: process.env.AUTH_GITHUB_ID!,
    clientSecret: process.env.AUTH_GITHUB_SECRET!,
  })
];

// Adicionar Google apenas se as credenciais estiverem configuradas
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    })
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers,
  pages: {
    error: '/auth/error',
  },
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      try {
        // Permitir login sempre (resolve OAuthAccountNotLinked)
        console.log('SignIn attempt:', { 
          email: user.email, 
          provider: account?.provider 
        });
        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  events: {
    linkAccount: async ({ user, account, profile }) => {
      console.log('Account linked:', { user: user.email, provider: account.provider });
    },
  },
  debug: process.env.NODE_ENV === 'development',
})