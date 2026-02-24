/**
 * Конфигурация Auth.js (NextAuth v5) для ProStore.
 * OAuth Google, server-side сессии, Prisma-адаптер (пользователь создаётся в БД при первом входе).
 */
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 дней
    updateAge: 24 * 60 * 60,   // обновлять сессию раз в сутки
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // В сессии доступен userId — стабильный id пользователя из БД
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  events: {
    // Опционально: логировать создание пользователя при первом входе
    createUser: async ({ user }) => {
      console.log("[Auth] Новый пользователь создан в БД:", user.email ?? user.id);
    },
  },
});
