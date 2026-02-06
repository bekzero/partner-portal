"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Megaphone, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { AppShell } from "@/components/app-shell";

interface DashboardData {
  recentBattleCards: Array<{
    id: string;
    title: string;
    summary: string;
    competitor: string;
    industry: string;
    updatedAt: Date;
    tags: Array<{ tag: { id: string; name: string } }>;
  }>;
  recentAnnouncements: Array<{
    id: string;
    title: string;
    contentMarkdown: string;
    createdAt: Date;
  }>;
  battleCardCount: number;
  announcementCount: number;
  resourceCount: number;
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  } | undefined;
}

export default function DashboardClient({ initialData }: { initialData: DashboardData }) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const newData = await res.json();
          setData(newData);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const isAdmin = data.user?.role === "admin";
  const user = data.user || { id: "", email: "", name: "", role: "" };

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-400">
            Welcome back, {data.user?.name || data.user?.email}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-zinc-800/60 bg-zinc-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-300">Battle Cards</CardTitle>
              <FileText className="h-4 w-4 text-kzOrange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-100">{data.battleCardCount}</div>
              <p className="text-xs text-zinc-500">Competitive intelligence cards</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800/60 bg-zinc-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-300">Announcements</CardTitle>
              <Megaphone className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-100">{data.announcementCount}</div>
              <p className="text-xs text-zinc-500">Latest updates and news</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800/60 bg-zinc-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-300">Resources</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-100">{data.resourceCount}</div>
              <p className="text-xs text-zinc-500">Sales enablement assets</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800/60 bg-zinc-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-300">Security Assessment</CardTitle>
              <ShieldCheck className="h-4 w-4 text-kzOrange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-100">Tool</div>
              <p className="text-xs text-zinc-500">Client readiness assessment</p>
              <Button asChild className="mt-3 bg-kzOrange text-zinc-950 hover:bg-kzOrange/90 w-full">
                <Link href="/security-assessment">
                  Launch Tool <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-zinc-800/60 bg-zinc-900/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-zinc-100">Recent Battle Cards</CardTitle>
                <CardDescription className="text-zinc-500">Latest competitive intelligence</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild className="border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">
                <Link href="/battle-cards">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p className="text-sm text-zinc-500">Loading...</p>
              ) : data.recentBattleCards.length === 0 ? (
                <p className="text-sm text-zinc-500">No battle cards yet.</p>
              ) : (
                data.recentBattleCards.map((card) => (
                  <Link
                    key={card.id}
                    href={`/battle-cards/${card.id}`}
                    className="group block space-y-2 rounded-lg border border-zinc-800/60 bg-zinc-950/50 p-3 transition-all hover:border-zinc-700 hover:bg-zinc-800/30"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-zinc-200 group-hover:text-kzOrange">{card.title}</h4>
                      <span className="text-xs text-zinc-600">{formatDistanceToNow(card.updatedAt, { addSuffix: true })}</span>
                    </div>
                    <p className="text-sm text-zinc-500 line-clamp-2">{card.summary}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="secondary" className="bg-zinc-800/60 text-zinc-400 text-xs">{card.competitor}</Badge>
                      <Badge variant="secondary" className="bg-zinc-800/60 text-zinc-400 text-xs">{card.industry}</Badge>
                      {card.tags.slice(0, 2).map(({ tag }) => (
                        <Badge key={tag.id} variant="outline" className="border-zinc-700 text-zinc-500 text-xs">{tag.name}</Badge>
                      ))}
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-zinc-800/60 bg-zinc-900/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-zinc-100">Latest Announcements</CardTitle>
                <CardDescription className="text-zinc-500">Stay updated with the latest news</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild className="border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">
                <Link href="/announcements">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p className="text-sm text-zinc-500">Loading...</p>
              ) : data.recentAnnouncements.length === 0 ? (
                <p className="text-sm text-zinc-500">No announcements yet.</p>
              ) : (
                data.recentAnnouncements.map((announcement) => (
                  <Link
                    key={announcement.id}
                    href={`/announcements/${announcement.id}`}
                    className="group block space-y-2 rounded-lg border border-zinc-800/60 bg-zinc-950/50 p-3 transition-all hover:border-zinc-700 hover:bg-zinc-800/30"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-zinc-200 group-hover:text-blue-400">{announcement.title}</h4>
                      <span className="text-xs text-zinc-600">{formatDistanceToNow(announcement.createdAt, { addSuffix: true })}</span>
                    </div>
                    <p className="text-sm text-zinc-500 line-clamp-2">{announcement.contentMarkdown.slice(0, 120)}...</p>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {isAdmin && (
          <Card className="border-zinc-800/60 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-zinc-100">Admin Quick Actions</CardTitle>
              <CardDescription className="text-zinc-500">Manage content and users</CardDescription>
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
