import { redirect, notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { BattleCardForm } from "@/components/battle-card-form";

interface EditBattleCardPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBattleCardPage({ params }: EditBattleCardPageProps) {
  const session = await getSession();
  
  if (session?.user?.role !== "admin") {
    redirect("/app/battle-cards");
  }

  const { id } = await params;

  const battleCard = await prisma.battleCard.findUnique({
    where: { id },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  if (!battleCard) {
    notFound();
  }

  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Edit Battle Card
        </h1>
        <p className="text-sm text-zinc-400">
          Update battle card content and metadata
        </p>
      </div>

      <BattleCardForm
        initialData={{
          id: battleCard.id,
          title: battleCard.title,
          summary: battleCard.summary,
          competitor: battleCard.competitor,
          industry: battleCard.industry,
          contentMarkdown: battleCard.contentMarkdown,
          published: battleCard.published,
          tags: battleCard.tags.map((t) => t.tag.name),
        }}
        allTags={tags}
      />
    </div>
  );
}
