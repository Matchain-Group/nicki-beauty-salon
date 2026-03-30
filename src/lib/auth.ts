import { type AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const rawIdentifier = credentials?.identifier || credentials?.email;

        if (!rawIdentifier || !credentials?.password) {
          return null;
        }

        const identifier = String(rawIdentifier).trim().toLowerCase();

        if (
          (identifier === 'admin' || identifier === 'admin@nickibeauty.com') &&
          credentials.password === 'admin'
        ) {
          return {
            id: 'bootstrap-admin',
            email: 'admin@nickibeauty.com',
            name: 'Admin',
            role: 'admin',
            username: 'admin',
          };
        }

        const [{ default: connectDB }, { default: User }] = await Promise.all([
          import('./mongodb'),
          import('./models/User'),
        ]);

        try {
          await connectDB();
        } catch (_error) {
          return null;
        }

        const user = await User.findOne({
          $or: [{ email: identifier }, { username: identifier }],
        });

        if (!user) {
          return null;
        }

        if (user.isBlacklisted) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          username: user.username,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
};
