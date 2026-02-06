import Link from "next/link";
import { redirect } from "next/navigation";
import { Shield, FileText, Megaphone, FolderOpen, Plus, Edit, Trash2 } from "lucide-react";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { DeleteBattleCardButton, DeleteAnnouncementButton, DeleteResourceButton } from "./delete-buttons";

export default async function AdminContentPage() {
  const session = await getSession();
  
  if (session?.user?.role !== "admin") {
    redirect("/app");
  }

  const battleCards = await prisma.battleCard.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });

  const resources = await prisma.resource.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Manage Content
        </h1>
        <p className="text-sm text-zinc-400">
          Create and manage portal content
        </p>
      </div>

      <Tabs defaultValue="battlecards" className="w-full">
        <TabsList className="bg-zinc-950 border border-zinc-800/60">
          <TabsTrigger value="battlecards" className="data-[state=active]:bg-zinc-800">
            <FileText className="mr-2 h-4 w-4" />
            Battle Cards ({battleCards.length})
          </TabsTrigger>
          <TabsTrigger value="announcements" className="data-[state=active]:bg-zinc-800">
            <Megaphone className="mr-2 h-4 w-4" />
            Announcements ({announcements.length})
          </TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-zinc-800">
            <FolderOpen className="mr-2 h-4 w-4" />
            Resources ({resources.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="battlecards" className="mt-4">
          <Card className="border-zinc-800/60 bg-zinc-900/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-zinc-100">Battle Cards</CardTitle>
                <CardDescription className="text-zinc-500">
                  Manage competitive intelligence content
                </CardDescription>
              </div>
              <Button asChild className="bg-kzOrange text-zinc-950 hover:bg-kzOrange/90">
                <Link href="/battle-cards/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {battleCards.map((card) => (
                  <div
                    key={card.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-950/50 p-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-zinc-200">{card.title}</span>
                        {!card.published && (
                          <Badge variant="outline" className="border-zinc-700 text-zinc-500">
                            Draft
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-zinc-500">
                        <span>{card.competitor}</span>
                        <span>·</span>
                        <span>{card.industry}</span>
                        <span>·</span>
                        <span>Updated {formatDistanceToNow(card.updatedAt, { addSuffix: true })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                      >
                        <Link href={`/app/battle-cards/${card.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteBattleCardButton id={card.id} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="mt-4">
          <Card className="border-zinc-800/60 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-zinc-100">Announcements</CardTitle>
              <CardDescription className="text-zinc-500">
                Manage announcements and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-950/50 p-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-zinc-200">{announcement.title}</span>
                        {!announcement.published && (
                          <Badge variant="outline" className="border-zinc-700 text-zinc-500">
                            Draft
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-zinc-500 mt-1">
                        Posted {formatDistanceToNow(announcement.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                    <DeleteAnnouncementButton announcementId={announcement.id} announcementTitle={announcement.title} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-4">
          <Card className="border-zinc-800/60 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-zinc-100">Resources</CardTitle>
              <CardDescription className="text-zinc-500">
                Manage sales enablement resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-950/50 p-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-zinc-200">{resource.title}</span>
                        <Badge variant="secondary" className="bg-zinc-800/60 text-zinc-400">
                          {resource.category}
                        </Badge>
                        {!resource.published && (
                          <Badge variant="outline" className="border-zinc-700 text-zinc-500">
                            Draft
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-zinc-500 mt-1">
                        {resource.description}
                      </p>
                    </div>
                    <DeleteResourceButton resourceId={resource.id} resourceTitle={resource.title} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
