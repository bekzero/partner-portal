import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { BattleCardForm } from "@/components/battle-card-form";

export default async function NewBattleCardPage() {
  const session = await getSession();
  
  if (session?.user?.role !== "admin") {
    redirect("/app/battle-cards");
  }

  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Create Battle Card
        </h1>
        <p className="text-sm text-zinc-400">
          Create a new competitive intelligence card
        </p>
      </div>

      <BattleCardForm allTags={tags} />
    </div>
  );
}
