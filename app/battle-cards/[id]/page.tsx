import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Building2, Target, Tag, Calendar, Download } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MarkdownContent } from "@/components/markdown-content";
import { DeleteBattleCardButton } from "@/components/delete-battle-card-button";
import { formatDistanceToNow } from "date-fns";

interface BattleCardPageProps {
  params: Promise<{ id: string }>;
}

export default async function BattleCardPage({ params }: BattleCardPageProps) {
  const session = await getSession();
  const isAdmin = session?.user?.role === "admin";
  const { id } = await params;

  const battleCard = await prisma.battleCard.findUnique({
    where: { id },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  if (!battleCard || (!battleCard.published && !isAdmin)) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-zinc-400 hover:text-zinc-100"
        >
          <Link href="/app/battle-cards">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Battle Cards
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            {battleCard.title}
          </h1>
          <p className="text-zinc-400">{battleCard.summary}</p>
          <div className="flex gap-3 mt-3">
            {battleCard.id === "passwordless-law-firms" && (
              <a
                href="/battle-card-law-firms.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-kzOrange text-white font-medium rounded-lg hover:bg-kzOrange/90 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </a>
            )}
            {battleCard.id === "passwordless-healthcare" && (
              <a
                href="/battle-card-healthcare.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-kzOrange text-white font-medium rounded-lg hover:bg-kzOrange/90 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </a>
            )}
          </div>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            >
              <Link href={`/app/battle-cards/${battleCard.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <DeleteBattleCardButton id={battleCard.id} />
          </div>
        )}
      </div>

      {/* Meta Information */}
      <Card className="border-zinc-800/60 bg-zinc-900/50">
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-kzOrange" />
              <div>
                <p className="text-xs text-zinc-500">Competitor</p>
                <p className="text-sm font-medium text-zinc-200">{battleCard.competitor}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-xs text-zinc-500">Industry</p>
                <p className="text-sm font-medium text-zinc-200">{battleCard.industry}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Tag className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-xs text-zinc-500">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {battleCard.tags.length > 0 ? (
                    battleCard.tags.map(({ tag }) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="border-zinc-700 text-zinc-400 text-xs"
                      >
                        {tag.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-zinc-600">None</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-zinc-500" />
              <div>
                <p className="text-xs text-zinc-500">Updated</p>
                <p className="text-sm font-medium text-zinc-200">
                  {formatDistanceToNow(battleCard.updatedAt, { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="bg-zinc-800/60" />

      {/* Content */}
      <Card className="border-zinc-800/60 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-zinc-100">Content</CardTitle>
        </CardHeader>
        <CardContent>
          <MarkdownContent content={battleCard.contentMarkdown} />
        </CardContent>
      </Card>
    </div>
  );
}
