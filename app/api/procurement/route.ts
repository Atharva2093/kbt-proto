import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-server-utils";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { user } = await verifyAuth(req);
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId, userId: user.id },
      include: { 
        layers: { orderBy: { order: "asc" } },
        procurements: { orderBy: { createdAt: "desc" }, take: 1 },
        analyses: { orderBy: { createdAt: "desc" }, take: 1 }
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const latestAnalysis = project.analyses[0];
    const WASTE_FACTOR = 1.10;
    const area = project.wallArea;

    let items: any[] = [];
    
    // DECISION: Use Optimized Layers if they exist in the latest analysis
    if (latestAnalysis?.optimizedLayers && Array.isArray(latestAnalysis.optimizedLayers)) {
      console.log(`[PROCUREMENT] Using optimized layers from analysis ${latestAnalysis.id}`);
      
      const optimizedLayers = latestAnalysis.optimizedLayers as any[];
      
      // Fetch details for all materials in the optimized list
      const materialIds = optimizedLayers.map(l => l.materialId);
      const dbMaterials = await prisma.material.findMany({
        where: { id: { in: materialIds } }
      });

      items = optimizedLayers.map((l, idx) => {
        const mat = dbMaterials.find(m => m.id === l.materialId);
        const unitCost = mat?.unitCost || 0;
        const name = mat?.name || "Unknown Material";
        
        const quantityVal = area * (l.thickness / 1000) * WASTE_FACTOR; // thickness is normally mm
        // Actually, procurement usually measures in m2 of specific thickness boards
        // For simplicity, we calculate m2 required for that layer
        const layerArea = area * WASTE_FACTOR; 
        const totalCost = layerArea * unitCost;

        return {
          layer: idx + 1,
          name: name,
          quantity: `${layerArea.toFixed(2)} m²`,
          quantityNum: layerArea,
          unitCost: `$${unitCost.toFixed(2)}`,
          unitCostNum: unitCost,
          totalCost: `$${totalCost.toLocaleString()}`,
          totalCostNum: totalCost
        };
      });
    } else {
      console.log(`[PROCUREMENT] Falling back to project layers`);
      // Use standard layers
      items = project.layers.map(layer => {
        // Fallback pricing if material database isn't perfectly mapped to project.layers names
        let unitCost = 15;
        if (layer.conductivity < 0.02) unitCost = 85;
        else if (layer.conductivity < 0.05) unitCost = 32;
        
        const quantityVal = area * WASTE_FACTOR;
        const totalCost = quantityVal * unitCost;

        return {
          layer: layer.order + 1,
          name: layer.material,
          quantity: `${quantityVal.toFixed(2)} m²`,
          quantityNum: quantityVal,
          unitCost: `$${unitCost.toFixed(2)}`,
          unitCostNum: unitCost,
          totalCost: `$${totalCost.toLocaleString()}`,
          totalCostNum: totalCost
        };
      });
    }

    if (items.length > 0) {
      items.push({
        layer: items.length + 1,
        name: "Fasteners & Adhesives Kit",
        quantity: "2 sets",
        quantityNum: 2,
        unitCost: "$120.00",
        unitCostNum: 120,
        totalCost: "$240.00",
        totalCostNum: 240
      });
    }

    const totalCost = items.reduce((sum, item) => sum + item.totalCostNum, 0);

    return NextResponse.json({
      items,
      totalCost,
      status: project.procurements[0]?.status || "NOT_GENERATED",
      orderDate: project.procurements[0]?.orderDate,
    });

  } catch (err: any) {
    console.error("[PROCUREMENT] GET Error:", err);
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const { user } = await verifyAuth(req);
    const { projectId, items, totalCost } = await req.json();

    if (!projectId) {
        return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const procurement = await prisma.procurement.create({
      data: {
        projectId,
        userId: user.id,
        items,
        totalCost,
        status: "GENERATED"
      }
    });

    console.log(`[PROCUREMENT] List generated for project ${projectId}`);
    return NextResponse.json(procurement);
  } catch (err: any) {
    console.error("[PROCUREMENT] POST Error:", err);
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
