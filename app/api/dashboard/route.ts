import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [recentBattleCards, recentAnnouncements, battleCardCount, announcementCount, resourceCount] = await Promise.all([
      prisma.battleCard.findMany({
        where: { published: true },
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: { tags: { include: { tag: true } } },
      }),
      prisma.announcement.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.battleCard.count({ where: { published: true } }),
      prisma.announcement.count({ where: { published: true } }),
      prisma.resource.count({ where: { published: true } }),
    ]);

    return NextResponse.json({
      recentBattleCards,
      recentAnnouncements,
      battleCardCount,
      announcementCount,
      resourceCount,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
