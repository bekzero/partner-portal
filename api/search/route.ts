import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim() || "";

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  // For SQLite, we need to handle case-insensitivity differently
  // We'll fetch and filter in memory for simplicity
  const lowerQuery = query.toLowerCase();

  try {
    // Search battle cards
    const allBattleCards = await prisma.battleCard.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        competitor: true,
        industry: true,
        summary: true,
      },
    });

    const battleCards = allBattleCards.filter((bc) =>
      bc.title.toLowerCase().includes(lowerQuery) ||
      bc.competitor.toLowerCase().includes(lowerQuery) ||
      bc.industry.toLowerCase().includes(lowerQuery) ||
      bc.summary.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);

    // Search announcements
    const allAnnouncements = await prisma.announcement.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        contentMarkdown: true,
      },
    });

    const announcements = allAnnouncements.filter((a) =>
      a.title.toLowerCase().includes(lowerQuery) ||
      a.contentMarkdown.toLowerCase().includes(lowerQuery)
    ).slice(0, 3);

    // Get unique industries
    const allIndustries = await prisma.battleCard.groupBy({
      by: ["industry"],
      where: { published: true },
    });

    const industries = allIndustries
      .filter((i) => i.industry.toLowerCase().includes(lowerQuery))
      .slice(0, 3);

    const results = [
      ...battleCards.map((bc) => ({
        id: bc.id,
        title: bc.title,
        subtitle: `${bc.competitor} • ${bc.industry}`,
        type: "battleCard" as const,
      })),
      ...announcements.map((a) => ({
        id: a.id,
        title: a.title,
        type: "announcement" as const,
      })),
      ...industries.map((i) => ({
        id: i.industry,
        title: i.industry,
        type: "industry" as const,
      })),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
