import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import DashboardClient from "@/components/dashboard-client";

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect("/signin");
  }

  return <DashboardClient initialData={{ recentBattleCards: [], recentAnnouncements: [], battleCardCount: 0, announcementCount: 0, resourceCount: 0, user: session.user as any }} />;
}
