import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-server-utils";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { user } = await verifyAuth(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const projectId = searchParams.get("projectId");

    if (id) {
        const report = await prisma.report.findUnique({
            where: { id, userId: user.id },
            include: { project: true }
        });
        return NextResponse.json(report);
    }

    const where: any = { userId: user.id };
    if (projectId) {
        where.projectId = projectId;
    }

    const reports = await prisma.report.findMany({
      where,
      include: {
          project: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(reports);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
