"use client";
import { useAuth } from "@/lib/auth/auth-context";
import Link from "next/link";

export function Header() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-bold tracking-tight text-foreground"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
            &lt;/&gt;
          </span>
          <span className="hidden sm:inline">Dev Community</span>
          <span className="sm:hidden">Dev</span>
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          {loading ? null : user ? (
            <>
              <span className="hidden max-w-48 truncate px-2 text-muted sm:inline">
                {user.email}
              </span>

              {user.role === "admin" && (
                <span className="hidden rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent sm:inline">
                  Admin
                </span>
              )}

              <Link
                href="/settings"
                className="rounded-lg px-3 py-2 font-medium text-muted transition-colors hover:bg-background hover:text-foreground"
              >
                Settings
              </Link>

              <button
                onClick={logout}
                className="rounded-lg px-3 py-2 font-medium text-muted transition-colors hover:bg-background hover:text-foreground"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 font-medium text-muted transition-colors hover:bg-background hover:text-foreground hover:text-foreground"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-accent px-4 py-2 font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
