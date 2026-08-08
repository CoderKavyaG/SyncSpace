"use client";

import { useSession } from "next-auth/react";

export interface UserSessionData {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}

export function useCurrentUser() {
  const { data: session, status } = useSession();

  const user = session?.user as UserSessionData | undefined;
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && !!user;

  return {
    user,
    status,
    isLoading,
    isAuthenticated,
  };
}
