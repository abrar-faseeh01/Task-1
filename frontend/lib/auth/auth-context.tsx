"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiFetch } from "../api-client";

type User = { email: string; role: "admin" | "user" } | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateCredentials: (
    currentPassword: string,
    newEmail?: string,
    newPassword?: string,
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  async function refetchMe() {
    try {
      const res = await apiFetch("/auth/me");
      setUser(res.data);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    refetchMe().finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setUser(res.data);
  }

  async function signup(email: string, password: string) {
    await apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    await login(email, password); // auto-login after signup
  }

  async function logout() {
    await apiFetch("/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  }

  async function updateCredentials(
    currentPassword: string,
    newEmail?: string,
    newPassword?: string,
  ) {
    const res = await apiFetch("/auth/me", {
      method: "PATCH",
      body: JSON.stringify({
        currentPassword,
        newEmail,
        newPassword,
      }),
    });

    setUser(res.data);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, updateCredentials }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}
