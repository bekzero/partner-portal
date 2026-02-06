"use client";

import { Suspense, useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SignInFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/app";

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);

        const form = new FormData(e.currentTarget);
        const email = String(form.get("email") || "");
        const password = String(form.get("password") || "");

        startTransition(async () => {
          const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl,
          });

          if (!res || res.error) {
            setError("Invalid email or password.");
            return;
          }

          router.push(res.url || callbackUrl);
          router.refresh();
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="email" className="text-zinc-300">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-11 bg-zinc-950/40"
          placeholder="you@company.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-zinc-300">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-11 bg-zinc-950/40"
          placeholder="••••••••"
        />
      </div>

      {error ? (
        <div className="rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={isPending}
        className="h-11 w-full bg-zinc-100 text-zinc-950 hover:bg-white"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

export default function SignInForm() {
  return (
    <Suspense fallback={<div className="space-y-5"><div className="h-11 bg-zinc-800 rounded animate-pulse" /><div className="h-11 bg-zinc-800 rounded animate-pulse" /></div>}>
      <SignInFormInner />
    </Suspense>
  );
}
