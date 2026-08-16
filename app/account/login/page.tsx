"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);

    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/account");
      router.refresh();
    }
  }

  return (
    <div className="ibee-container py-20 max-w-sm mx-auto">
      <h1 className="ibee-heading text-2xl mb-8 text-center">Log In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input id="email" name="email" type="email" label="Email" required />
        <Input id="password" name="password" type="password" label="Password" required />
        {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </Button>
      </form>
      <p className="text-sm text-center text-black/60 mt-6">
        No account? <Link href="/account/signup" className="underline">Sign up</Link>
      </p>
      <p className="text-xs text-center text-black/40 mt-4">
        Demo: customer@ibee.demo / Customer@123
      </p>
    </div>
  );
}
