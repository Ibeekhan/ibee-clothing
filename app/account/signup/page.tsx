"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
    });

    setLoading(false);
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="ibee-container py-20 max-w-sm mx-auto">
      <h1 className="ibee-heading text-2xl mb-8 text-center">Create Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input id="fullName" name="fullName" label="Full Name" required />
        <Input id="email" name="email" type="email" label="Email" required />
        <Input id="phone" name="phone" label="Phone (optional)" />
        <Input id="password" name="password" type="password" label="Password" required minLength={8} />
        {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
      <p className="text-sm text-center text-black/60 mt-6">
        Already have an account? <Link href="/account/login" className="underline">Log in</Link>
      </p>
    </div>
  );
}
