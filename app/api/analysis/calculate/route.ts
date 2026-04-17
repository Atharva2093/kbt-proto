import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-server-utils";
import prisma from "@/lib/db";
import { calculateThermalPerformance } from "@/lib/thermal-calc";

export async function POST(req: Request) {
  try {
    const { user } = await verifyAuth(req);
    const body = await req.json();
    const { projectId, layers, area, insideTemp, outsideTemp } = body;

    if (!projectId || !layers || !area) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Run Calculations
    const results = calculateThermalPerformance(
      layers,
      parseFloat(area),
      parseFloat(insideTemp),
      parseFloat(outsideTemp)
    );

    // 2. Clear old layers and Save new ones
    // (Atomic transaction recommended)
    await prisma.$transaction([
      // Delete old layers for this project
      prisma.wallLayer.deleteMany({
        where: { projectId },
      }),
      // Create new layers
      prisma.wallLayer.createMany({
        data: layers.map((l: any, i: number) => ({
          projectId,
          material: l.material,
          thickness: parseFloat(l.thickness),
          conductivity: parseFloat(l.conductivity),
          density: parseFloat(l.density) || null,
          order: i,
        })),
      }),
      // Save Analysis run
      prisma.analysis.create({
        data: {
          projectId,
          userId: user.id,
          uValue: results.uValue,
          rValue: results.rValue,
          heatLoss: results.heatLoss,
          efficiency: results.efficiency,
          details: { tempProfile: results.tempProfile },
        },
      }),
      // Update Project summary
      prisma.project.update({
        where: { id: projectId },
        data: {
          totalHeatLoss: results.heatLoss,
          uValue: results.uValue,
          efficiency: results.efficiency,
        },
      }),
    ]);

    return NextResponse.json(results);
  } catch (err: any) {
    console.error("[CALC_API_ERROR]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
