"use client";
import { useAuth } from "@/lib/auth/auth-context";
import Link from "next/link";

export function Header() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <Link href="/" className="font-bold">
        Dev Community
      </Link>
      <nav className="flex items-center gap-4">
        {loading ? null : user ? (
          <>
            <span className="text-sm">
              {user.email} {user.role === "admin" && <b>(Admin)</b>}
            </span>
            <button onClick={logout} className="text-sm underline">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
}
