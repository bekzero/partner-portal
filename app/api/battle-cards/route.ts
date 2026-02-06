import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// POST /api/battle-cards - Create new battle card
export async function POST(req: NextRequest) {
  const session = await getSession();
  
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const data = await req.json();
    
    const battleCard = await prisma.battleCard.create({
      data: {
        title: data.title,
        summary: data.summary,
        competitor: data.competitor,
        industry: data.industry,
        contentMarkdown: data.contentMarkdown,
        published: data.published,
        createdById: session.user.id,
      },
    });

    // Handle tags
    if (data.tags && data.tags.length > 0) {
      for (const tagName of data.tags) {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          create: { name: tagName },
          update: {},
        });
        
        await prisma.battleCardTag.create({
          data: {
            battleCardId: battleCard.id,
            tagId: tag.id,
          },
        });
      }
    }

    return NextResponse.json(battleCard);
  } catch (error) {
    console.error("Error creating battle card:", error);
    return NextResponse.json(
      { error: "Failed to create battle card" },
      { status: 500 }
    );
  }
}
