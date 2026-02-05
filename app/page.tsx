import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, Megaphone, TrendingUp, Users, ShieldCheck, ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { AppShell } from "@/components/app-shell";

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect("/signin");
  }

  const isAdmin = session.user.role === "admin";

  // Fetch recent battle cards
  const recentBattleCards = await prisma.battleCard.findMany({
    where: { published: true },
    orderBy: { updatedAt: "desc" },
    take: 5,
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  // Fetch recent announcements
  const recentAnnouncements = await prisma.announcement.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  // Fetch stats
  const battleCardCount = await prisma.battleCard.count({ where: { published: true } });
  const announcementCount = await prisma.announcement.count({ where: { published: true } });
  const resourceCount = await prisma.resource.count({ where: { published: true } });

  return (
    <AppShell user={session.user}>
      <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Dashboard
        </h1>
        <p className="text-sm text-zinc-400">
          Welcome back, {session?.user?.name || session?.user?.email}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-zinc-800/60 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">
              Battle Cards
            </CardTitle>
            <FileText className="h-4 w-4 text-kzOrange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">{battleCardCount}</div>
            <p className="text-xs text-zinc-500">
              Competitive intelligence cards
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800/60 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">
              Announcements
            </CardTitle>
            <Megaphone className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">{announcementCount}</div>
            <p className="text-xs text-zinc-500">
              Latest updates and news
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800/60 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">
              Resources
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">{resourceCount}</div>
            <p className="text-xs text-zinc-500">
              Sales enablement assets
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800/60 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">
              Security Assessment
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-kzOrange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">Tool</div>
            <p className="text-xs text-zinc-500">
              Client readiness assessment
            </p>
            <Button asChild className="mt-3 bg-kzOrange text-zinc-950 hover:bg-kzOrange/90 w-full">
              <Link href="/security-assessment">
                Launch Tool <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Battle Cards */}
        <Card className="border-zinc-800/60 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-zinc-100">Recent Battle Cards</CardTitle>
              <CardDescription className="text-zinc-500">
                Latest competitive intelligence
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild className="border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">
              <Link href="/battle-cards">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentBattleCards.length === 0 ? (
              <p className="text-sm text-zinc-500">No battle cards yet.</p>
            ) : (
              recentBattleCards.map((card) => (
                  <Link
                  key={card.id}
                  href={`/battle-cards/${card.id}`}
                  className="group block space-y-2 rounded-lg border border-zinc-800/60 bg-zinc-950/50 p-3 transition-all hover:border-zinc-700 hover:bg-zinc-800/30"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-zinc-200 group-hover:text-kzOrange">
                      {card.title}
                    </h4>
                    <span className="text-xs text-zinc-600">
                      {formatDistanceToNow(card.updatedAt, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 line-clamp-2">{card.summary}</p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="bg-zinc-800/60 text-zinc-400 text-xs">
                      {card.competitor}
                    </Badge>
                    <Badge variant="secondary" className="bg-zinc-800/60 text-zinc-400 text-xs">
                      {card.industry}
                    </Badge>
                    {card.tags.slice(0, 2).map(({ tag }) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="border-zinc-700 text-zinc-500 text-xs"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card className="border-zinc-800/60 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-zinc-100">Latest Announcements</CardTitle>
              <CardDescription className="text-zinc-500">
                Stay updated with the latest news
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild className="border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">
              <Link href="/announcements">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAnnouncements.length === 0 ? (
              <p className="text-sm text-zinc-500">No announcements yet.</p>
            ) : (
              recentAnnouncements.map((announcement) => (
                <Link
                  key={announcement.id}
                  href={`/announcements/${announcement.id}`}
                  className="group block space-y-2 rounded-lg border border-zinc-800/60 bg-zinc-950/50 p-3 transition-all hover:border-zinc-700 hover:bg-zinc-800/30"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-zinc-200 group-hover:text-blue-400">
                      {announcement.title}
                    </h4>
                    <span className="text-xs text-zinc-600">
                      {formatDistanceToNow(announcement.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 line-clamp-2">
                    {announcement.contentMarkdown.slice(0, 120)}...
                  </p>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {isAdmin && (
        <Card className="border-zinc-800/60 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="text-zinc-100">Admin Quick Actions</CardTitle>
            <CardDescription className="text-zinc-500">
              Manage content and users
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild className="bg-kzOrange text-zinc-950 hover:bg-kzOrange/90">
              <Link href="/battle-cards/new">Create Battle Card</Link>
            </Button>
            <Button variant="outline" asChild className="border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">
              <Link href="/admin/users">Manage Users</Link>
            </Button>
            <Button variant="outline" asChild className="border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">
              <Link href="/admin/content">Manage Content</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
    </AppShell>
  );
}
