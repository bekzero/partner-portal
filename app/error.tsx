"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h2>
          <p className="text-zinc-400 mb-6">
            We encountered an error loading the dashboard. This might be a temporary connection issue.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={reset} className="bg-kzOrange text-zinc-950 hover:bg-kzOrange/90">
              Try again
            </Button>
            <Link href="/">
              <Button variant="outline" className="border-zinc-700 bg-zinc-950 text-zinc-300">
                Refresh
              </Button>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
