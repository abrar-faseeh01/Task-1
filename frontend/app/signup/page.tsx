"use client";
import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await signup(email, password);
      router.push("/");
    } catch {
      setError("Signup failed — email may already be in use");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-sm mx-auto mt-10 flex flex-col gap-3"
    >
      <h1 className="text-xl font-bold">Sign up</h1>
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
        placeholder="Password (min 8 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-black text-white p-2 rounded">
        Sign up
      </button>
    </form>
  );
}
