export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-server-utils";
import prisma from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const { user } = await verifyAuth(req);
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // Find the latest generated procurement for this project
    const latestProcurement = await prisma.procurement.findFirst({
      where: { 
        projectId, 
        userId: user.id,
        status: "GENERATED"
      },
      orderBy: { createdAt: "desc" }
    });

    if (!latestProcurement) {
      return NextResponse.json({ error: "No generated procurement found to order" }, { status: 404 });
    }

    const updated = await prisma.procurement.update({
      where: { id: latestProcurement.id },
      data: {
        status: "ORDERED",
        orderDate: new Date()
      }
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
