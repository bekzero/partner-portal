import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();

  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const data = await req.json();

    const resource = await prisma.resource.create({
      data: {
        title: data.title,
        url: data.url,
        category: data.category,
        description: data.description,
      },
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error("Error creating resource:", error);
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}
