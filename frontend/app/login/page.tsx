"use client";
import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      router.push("/");
    } catch {
      setError("Invalid email or password"); // generic — never reveal which field
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-sm mx-auto mt-10 flex flex-col gap-3"
    >
      <h1 className="text-xl font-bold">Login</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <input
        type="email"
        required
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="password"
        required
        minLength={8}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-black text-white p-2 rounded">
        Login
      </button>
    </form>
  );
}
