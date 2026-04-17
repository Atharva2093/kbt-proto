import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-server-utils";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { user } = await verifyAuth(req);

    const [projectCount, recentProjects, stats] = await Promise.all([
      prisma.project.count({
        where: { userId: user.id },
      }),
      prisma.project.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
      prisma.project.aggregate({
        where: { userId: user.id },
        _avg: {
          uValue: true,
          efficiency: true,
          totalHeatLoss: true,
        },
      }),
    ]);

    // Format metrics for the dashboard
    const metrics = [
      {
        title: "Active Projects",
        value: projectCount.toString(),
        change: "Total tracked",
      },
      {
        title: "Last Heat Loss",
        value: stats._avg.totalHeatLoss 
          ? `${stats._avg.totalHeatLoss.toFixed(1)} W/m²` 
          : "--",
        change: "Average across projects",
      },
      {
        title: "Avg Efficiency",
        value: stats._avg.efficiency 
          ? `${stats._avg.efficiency.toFixed(0)}%` 
          : "--",
        change: "Performance rating",
      },
      {
        title: "System Status",
        value: "Healthy",
        change: "Backend connected",
      },
    ];

    return NextResponse.json({
      metrics,
      recentProjects: recentProjects.map(p => ({
        id: p.id,
        name: p.name,
        type: p.buildingType || "Not Specified",
        updated: p.updatedAt.toISOString(), // Frontend will format relative time
        status: p.efficiency ? "Analyzed" : "Pending",
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
