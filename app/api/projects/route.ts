import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-server-utils";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { user } = await verifyAuth(req);
    const body = await req.json();
    const { name, buildingType, climateZone, wallArea } = body;

    if (!name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        buildingType,
        climateZone,
        userId: user.id,
        // we can store wallArea in a new field if we want, or just pass it in analysis
      },
    });

    return NextResponse.json(project);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

export async function GET(req: Request) {
  try {
    const { user } = await verifyAuth(req);
    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
