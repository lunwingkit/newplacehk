"use client";
export const runtime = "nodejs";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "@/auth";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const login = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut({});
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return { session, status, login, logout };
}
