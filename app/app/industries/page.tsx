import Link from "next/link";
import { Building2, FileText, ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface IndustriesPageProps {
  searchParams: Promise<{ industry?: string }>;
}

export default async function IndustriesPage({ searchParams }: IndustriesPageProps) {
  const params = await searchParams;
  const selectedIndustry = params.industry || "";

  // Get all unique industries with counts
  const industriesWithCounts = await prisma.battleCard.groupBy({
    by: ["industry"],
    where: { published: true },
    _count: {
      id: true,
    },
  });

  // Get battle cards for selected industry
  const battleCards = selectedIndustry
    ? await prisma.battleCard.findMany({
        where: {
          published: true,
          industry: selectedIndustry,
        },
        orderBy: { updatedAt: "desc" },
        include: {
          tags: {
            include: { tag: true },
          },
        },
      })
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Industries
        </h1>
        <p className="text-sm text-zinc-400">
          Browse battle cards by industry
        </p>
      </div>

      {/* Industries Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {industriesWithCounts.map(({ industry, _count }) => (
          <Link
            key={industry}
            href={`/app/industries?industry=${encodeURIComponent(industry)}`}
          >
            <Card
              className={`border-zinc-800/60 bg-zinc-900/50 transition-all hover:border-zinc-700 hover:bg-zinc-800/30 ${
                selectedIndustry === industry ? "border-kzOrange bg-kzOrange/5" : ""
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-zinc-800/60 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-zinc-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-zinc-200">{industry}</h3>
                      <p className="text-sm text-zinc-500">
                        {_count.id} battle card{_count.id !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    className={`h-5 w-5 transition-colors ${
                      selectedIndustry === industry
                        ? "text-kzOrange"
                        : "text-zinc-600"
                    }`}
                  />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Selected Industry Battle Cards */}
      {selectedIndustry && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-100">
              {selectedIndustry} Battle Cards
            </h2>
            <Link
              href="/app/industries"
              className="text-sm text-zinc-500 hover:text-zinc-300"
            >
              Clear filter
            </Link>
          </div>

          {battleCards.length === 0 ? (
            <Card className="border-zinc-800/60 bg-zinc-900/50">
              <CardContent className="py-8 text-center">
                <p className="text-zinc-500">No battle cards found for this industry.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {battleCards.map((card) => (
                <Link key={card.id} href={`/app/battle-cards/${card.id}`}>
                  <Card className="border-zinc-800/60 bg-zinc-900/50 transition-all hover:border-zinc-700 hover:bg-zinc-800/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-zinc-200 hover:text-kzOrange">
                        {card.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-zinc-500 line-clamp-2">
                        {card.summary}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-zinc-800/60 text-zinc-400">
                          {card.competitor}
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
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
