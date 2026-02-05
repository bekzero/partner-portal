import Link from "next/link";
import { ExternalLink, FolderOpen, FileText, Shield, TrendingUp } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function ResourcesPage() {
  const session = await getSession();
  const isAdmin = session?.user?.role === "admin";

  const resources = await prisma.resource.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  // Group by category
  const resourcesByCategory = resources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<string, typeof resources>);

  const categories = Object.keys(resourcesByCategory).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Resources
          </h1>
          <p className="text-sm text-zinc-400">
            Sales enablement assets and documentation
          </p>
        </div>
        {isAdmin && (
          <Button className="bg-kzOrange text-zinc-950 hover:bg-kzOrange/90">
            Add Resource
          </Button>
        )}
      </div>

      {categories.length === 0 ? (
        <Card className="border-zinc-800/60 bg-zinc-900/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-zinc-600" />
            <h3 className="mt-4 text-lg font-medium text-zinc-300">No resources yet</h3>
            <p className="mt-2 text-sm text-zinc-500">
              Check back later for new resources.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <Card key={category} className="border-zinc-800/60 bg-zinc-900/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-kzOrange" />
                  <CardTitle className="text-zinc-100">{category}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {resourcesByCategory[category].map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between rounded-lg border border-zinc-800/60 bg-zinc-950/50 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-800/30"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-zinc-200 group-hover:text-kzOrange">
                          {resource.title}
                        </h4>
                        <ExternalLink className="h-3.5 w-3.5 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      {resource.description && (
                        <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
                          {resource.description}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
