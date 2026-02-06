import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, BarChart, Megaphone, BookOpen, Shield } from "lucide-react";

export default async function RootPage() {
  const session = await getSession();
  if (!session) {
    redirect("/signin");
  }

  const isAdmin = session.user?.role === "admin";

  const [battleCardCount, announcementCount, resourceCount, userCount] = await Promise.all([
    prisma.battleCard.count({ where: { published: true } }),
    prisma.announcement.count({ where: { published: true } }),
    prisma.resource.count({ where: { published: true } }),
    prisma.user.count(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
          Welcome back, {session.user?.name || session.user?.email}
        </h1>
        <p className="mt-2 text-zinc-400">
          Here's an overview of the Partner Portal
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/battle-cards">
          <Card className="group cursor-pointer border-zinc-800/60 bg-zinc-900/50 transition-all hover:border-kzOrange hover:bg-zinc-800/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Battle Cards
              </CardTitle>
              <FileText className="h-5 w-5 text-kzOrange transition-transform group-hover:scale-110" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-100">{battleCardCount}</div>
              <p className="text-xs text-zinc-500 mt-1">
                Competitive intelligence & positioning guides
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/announcements">
          <Card className="group cursor-pointer border-zinc-800/60 bg-zinc-900/50 transition-all hover:border-kzOrange hover:bg-zinc-800/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Announcements
              </CardTitle>
              <Megaphone className="h-5 w-5 text-kzOrange transition-transform group-hover:scale-110" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-100">{announcementCount}</div>
              <p className="text-xs text-zinc-500 mt-1">
                Latest partner updates and news
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/resources">
          <Card className="group cursor-pointer border-zinc-800/60 bg-zinc-900/50 transition-all hover:border-kzOrange hover:bg-zinc-800/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Resources
              </CardTitle>
              <BookOpen className="h-5 w-5 text-kzOrange transition-transform group-hover:scale-110" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-100">{resourceCount}</div>
              <p className="text-xs text-zinc-500 mt-1">
                Sales materials and enablement content
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/industries">
          <Card className="group cursor-pointer border-zinc-800/60 bg-zinc-900/50 transition-all hover:border-kzOrange hover:bg-zinc-800/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Industries
              </CardTitle>
              <BarChart className="h-5 w-5 text-kzOrange transition-transform group-hover:scale-110" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-zinc-300 mt-1">
                Browse by industry
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Filter battle cards by your target verticals
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/security-assessment">
          <Card className="group cursor-pointer border-zinc-800/60 bg-zinc-900/50 transition-all hover:border-kzOrange hover:bg-zinc-800/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Security Assessment
              </CardTitle>
              <Shield className="h-5 w-5 text-kzOrange transition-transform group-hover:scale-110" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-zinc-300 mt-1">
                Customer security questionnaire
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Help your customers with security reviews
              </p>
            </CardContent>
          </Card>
        </Link>

        {isAdmin && (
          <Link href="/admin/users">
            <Card className="group cursor-pointer border-zinc-800/60 bg-zinc-900/50 transition-all hover:border-kzOrange hover:bg-zinc-800/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Admin: Users
                </CardTitle>
                <Users className="h-5 w-5 text-kzOrange transition-transform group-hover:scale-110" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-zinc-100">{userCount}</div>
                <p className="text-xs text-zinc-500 mt-1">
                  Manage portal users and partners
                </p>
              </CardContent>
            </Card>
          </Link>
        )}

        {isAdmin && (
          <Link href="/admin/content">
            <Card className="group cursor-pointer border-zinc-800/60 bg-zinc-900/50 transition-all hover:border-kzOrange hover:bg-zinc-800/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Admin: Content
                </CardTitle>
                <FileText className="h-5 w-5 text-kzOrange transition-transform group-hover:scale-110" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-zinc-300 mt-1">
                  Manage all content
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Battle cards, announcements, and resources
                </p>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </div>
  );
}
