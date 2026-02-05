import Link from "next/link";
import { Megaphone, Calendar, ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, formatDate } from "date-fns";
import { MarkdownContent } from "@/components/markdown-content";

export default async function AnnouncementsPage() {
  const session = await getSession();
  const isAdmin = session?.user?.role === "admin";

  const announcements = await prisma.announcement.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Announcements
          </h1>
          <p className="text-sm text-zinc-400">
            Latest updates and news from the team
          </p>
        </div>
        {isAdmin && (
          <Button className="bg-kzOrange text-zinc-950 hover:bg-kzOrange/90">
            Post Announcement
          </Button>
        )}
      </div>

      {announcements.length === 0 ? (
        <Card className="border-zinc-800/60 bg-zinc-900/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Megaphone className="h-12 w-12 text-zinc-600" />
            <h3 className="mt-4 text-lg font-medium text-zinc-300">No announcements yet</h3>
            <p className="mt-2 text-sm text-zinc-500">
              Check back later for updates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card
              key={announcement.id}
              className="border-zinc-800/60 bg-zinc-900/50"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Megaphone className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-zinc-100">
                        {announcement.title}
                      </CardTitle>
                      <p className="text-sm text-zinc-500 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(announcement.createdAt, "MMM d, yyyy")} · {" "}
                        {formatDistanceToNow(announcement.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <MarkdownContent content={announcement.contentMarkdown} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
