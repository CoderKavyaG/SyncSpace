import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import compare from "bcryptjs";
import { db } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.hashedPassword) {
          return null;
        }

        const isPasswordValid = await compare.compare(password, user.hashedPassword);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatarUrl,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;

        const normalizedEmail = user.email.toLowerCase().trim();

        try {
          let dbUser = await db.user.findUnique({
            where: { email: normalizedEmail },
            include: { memberships: true },
          });

          if (!dbUser) {
            // Provision new user record in database
            dbUser = await db.user.create({
              data: {
                email: normalizedEmail,
                name: user.name || "SyncSpace User",
                avatarUrl: user.image || null,
              },
              include: { memberships: true },
            });
          } else if (user.image && !dbUser.avatarUrl) {
            await db.user.update({
              where: { id: dbUser.id },
              data: { avatarUrl: user.image },
            });
          }

          // Ensure the user immediately has an owner workspace so the interior UI is fully functional
          if (!dbUser.memberships || dbUser.memberships.length === 0) {
            const baseSlug = (user.name || "personal")
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "-")
              .replace(/-+/g, "-")
              .replace(/^-|-$/g, "");
            const randomSuffix = Math.random().toString(36).substring(2, 7);
            const workspaceSlug = `${baseSlug || "personal"}-${randomSuffix}`;

            const workspace = await db.workspace.create({
              data: {
                name: `${user.name || "Personal"}'s Workspace`,
                slug: workspaceSlug,
                ownerId: dbUser.id,
                iconUrl: "sparkles",
              },
            });

            await db.workspaceMember.create({
              data: {
                workspaceId: workspace.id,
                userId: dbUser.id,
                role: "OWNER",
              },
            });

            await db.page.create({
              data: {
                title: "Getting Started with SyncSpace",
                icon: null,
                workspaceId: workspace.id,
                createdById: dbUser.id,
              },
            });
          }

          // Crucial: assign postgres CUID to user.id so JWT token stores database ID
          user.id = dbUser.id;
          return true;
        } catch (err) {
          console.error("[NextAuth] Error in Google signIn callback:", err);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
});
