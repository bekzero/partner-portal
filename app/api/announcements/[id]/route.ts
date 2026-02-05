import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export async function GET(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("Error fetching announcement:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { title, contentMarkdown, published } = body;

  try {
    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title,
        contentMarkdown,
        published,
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("Error updating announcement:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    await prisma.announcement.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
