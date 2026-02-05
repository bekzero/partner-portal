import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "Partner Portal",
  description: "Partner enablement portal",
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <AppShell user={session.user}>
      {children}
    </AppShell>
  );
}
