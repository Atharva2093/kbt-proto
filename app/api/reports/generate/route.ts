import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-server-utils";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { user } = await verifyAuth(req);
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // 1. Fetch all data for the snapshot
    const project = await prisma.project.findUnique({
      where: { id: projectId, userId: user.id },
      include: { 
        layers: { orderBy: { order: "asc" } }
      }
    });

    if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const latestAnalysis = await prisma.analysis.findFirst({
        where: { projectId, userId: user.id },
        orderBy: { createdAt: "desc" }
    });

    if (!latestAnalysis) {
        return NextResponse.json({ error: "No analysis found. Report generation requires analysis." }, { status: 400 });
    }

    const latestProcurement = await prisma.procurement.findFirst({
        where: { projectId, userId: user.id },
        orderBy: { createdAt: "desc" }
    });

    // Collate data for snapshot
    const snapshot = {
        project: {
            name: project.name,
            buildingType: project.buildingType,
            climateZone: project.climateZone,
            wallArea: project.wallArea,
            layers: project.layers
        },
        analysis: {
            uValue: latestAnalysis.uValue,
            rValue: latestAnalysis.rValue,
            heatLoss: latestAnalysis.heatLoss,
            efficiency: latestAnalysis.efficiency,
            details: latestAnalysis.details,
            optimizedLayers: latestAnalysis.optimizedLayers, // CRITICAL: Include optimized design
            date: latestAnalysis.createdAt
        },
        procurement: latestProcurement ? {
            items: latestProcurement.items,
            totalCost: latestProcurement.totalCost,
            status: latestProcurement.status,
            orderDate: latestProcurement.orderDate
        } : null,
        timestamp: new Date().toISOString()
    };

    // 2. Create the Report record
    const report = await prisma.report.create({
      data: {
        projectId,
        userId: user.id,
        type: "Full Engineering Report",
        status: "READY",
        data: snapshot as any
      }
    });

    console.log(`[REPORT] Generated snapshot ${report.id} for project ${projectId}`);
    return NextResponse.json(report);
  } catch (err: any) {
    console.error("[REPORT] Generation Error:", err);
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
