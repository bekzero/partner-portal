import Link from "next/link";
import { Plus, Search, Filter, FileText } from "lucide-react";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface BattleCardsPageProps {
  searchParams: Promise<{
    industry?: string;
    competitor?: string;
    search?: string;
  }>;
}

export default async function BattleCardsPage({ searchParams }: BattleCardsPageProps) {
  const session = await getSession();
  const isAdmin = session?.user?.role === "admin";
  const params = await searchParams;
  
  const industry = params.industry || "";
  const competitor = params.competitor || "";
  const search = params.search || "";

  // Build where clause
  const where: any = { published: true };
  if (industry) where.industry = industry;
  if (competitor) where.competitor = competitor;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { summary: { contains: search } },
      { competitor: { contains: search } },
    ];
  }

  const battleCards = await prisma.battleCard.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  // Get unique industries and competitors for filters
  const industries = await prisma.battleCard.groupBy({
    by: ["industry"],
    where: { published: true },
  });

  const competitors = await prisma.battleCard.groupBy({
    by: ["competitor"],
    where: { published: true },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Battle Cards
          </h1>
          <p className="text-sm text-zinc-400">
            Competitive intelligence and positioning guides
          </p>
        </div>
        {isAdmin && (
          <Button asChild className="bg-kzOrange text-zinc-950 hover:bg-kzOrange/90">
            <Link href="/battle-cards/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Battle Card
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="border-zinc-800/60 bg-zinc-900/50">
        <CardContent className="pt-6">
          <form className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                name="search"
                placeholder="Search battle cards..."
                defaultValue={search}
                className="border-zinc-800/60 bg-zinc-950/50 pl-10 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                name="industry"
                defaultValue={industry}
                className="h-10 rounded-md border border-zinc-800/60 bg-zinc-950/50 px-3 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-kzOrange"
              >
                <option value="">All Industries</option>
                {industries.map((i) => (
                  <option key={i.industry} value={i.industry}>
                    {i.industry}
                  </option>
                ))}
              </select>
              <select
                name="competitor"
                defaultValue={competitor}
                className="h-10 rounded-md border border-zinc-800/60 bg-zinc-950/50 px-3 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-kzOrange"
              >
                <option value="">All Competitors</option>
                {competitors.map((c) => (
                  <option key={c.competitor} value={c.competitor}>
                    {c.competitor}
                  </option>
                ))}
              </select>
              <Button
                type="submit"
                variant="outline"
                className="border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {battleCards.length === 0 ? (
        <Card className="border-zinc-800/60 bg-zinc-900/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-zinc-600" />
            <h3 className="mt-4 text-lg font-medium text-zinc-300">No battle cards found</h3>
            <p className="mt-2 text-sm text-zinc-500">
              Try adjusting your filters or search query.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {battleCards.map((card) => (
            <Link key={card.id} href={`/battle-cards/${card.id}`}>
              <Card className="group h-full border-zinc-800/60 bg-zinc-900/50 transition-all hover:border-zinc-700 hover:bg-zinc-800/30">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="line-clamp-2 text-lg text-zinc-200 group-hover:text-kzOrange">
                      {card.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="line-clamp-2 text-sm text-zinc-500">
                    {card.summary}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-zinc-800/60 text-zinc-400">
                      {card.competitor}
                    </Badge>
                    <Badge variant="secondary" className="bg-zinc-800/60 text-zinc-400">
                      {card.industry}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {card.tags.map(({ tag }) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="border-zinc-700 text-zinc-500 text-xs"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-zinc-600">
                    Updated {formatDistanceToNow(card.updatedAt, { addSuffix: true })}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
