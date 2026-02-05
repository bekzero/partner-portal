import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type RouteParams = Promise<{ id: string }>;

// PUT /api/battle-cards/[id] - Update battle card
export async function PUT(req: NextRequest, { params }: { params: RouteParams }) {
  const session = await getSession();
  
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const data = await req.json();
    
    const battleCard = await prisma.battleCard.update({
      where: { id },
      data: {
        title: data.title,
        summary: data.summary,
        competitor: data.competitor,
        industry: data.industry,
        contentMarkdown: data.contentMarkdown,
        published: data.published,
      },
    });

    // Handle tags - delete existing and recreate
    await prisma.battleCardTag.deleteMany({
      where: { battleCardId: id },
    });

    if (data.tags && data.tags.length > 0) {
      for (const tagName of data.tags) {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          create: { name: tagName },
          update: {},
        });
        
        await prisma.battleCardTag.create({
          data: {
            battleCardId: id,
            tagId: tag.id,
          },
        });
      }
    }

    return NextResponse.json(battleCard);
  } catch (error) {
    console.error("Error updating battle card:", error);
    return NextResponse.json(
      { error: "Failed to update battle card" },
      { status: 500 }
    );
  }
}

// DELETE /api/battle-cards/[id] - Delete battle card
export async function DELETE(req: NextRequest, { params }: { params: RouteParams }) {
  const session = await getSession();
  
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    
    await prisma.battleCard.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting battle card:", error);
    return NextResponse.json(
      { error: "Failed to delete battle card" },
      { status: 500 }
    );
  }
}
