import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verify() {
  const projectId = "cmo3b9odw0002ih7kw2lmhtdt";
  const userId = "cmo3788q90000iho82apbgc2d";

  console.log("--- Phase 1: Creating fresh Analysis ---");
  const analysis = await prisma.analysis.create({
    data: {
        projectId,
        userId,
        uValue: 0.45,
        rValue: 2.22,
        heatLoss: 5500,
        efficiency: 80,
        details: { test: true }
    }
  });
  console.log(`Created Analysis: ${analysis.id}`);

  console.log("\n--- Phase 2: Simulating AI Optimization ---");
  // Get materials to pick IDs
  const materials = await prisma.material.findMany({ take: 3 });
  if (materials.length < 2) throw new Error("Need materials to test");
  
  const optimizedLayers = [
    { materialId: materials[0].id, thickness: 100 },
    { materialId: materials[1].id, thickness: 150 }
  ];

  await prisma.analysis.update({
    where: { id: analysis.id },
    data: { optimizedLayers }
  });
  console.log("Optimized layers persisted successfully.");

  console.log("\n--- Phase 3: Verifying Procurement Calculation ---");
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { layers: true }
  });
  
  const WASTE_FACTOR = 1.10;
  const area = project?.wallArea || 100;
  
  // Logic from our refactored /api/procurement
  const dbMaterials = await prisma.material.findMany({
    where: { id: { in: optimizedLayers.map(l => l.materialId) } }
  });

  const procurementItems = optimizedLayers.map(l => {
    const mat = dbMaterials.find(m => m.id === l.materialId);
    const quantity = area * WASTE_FACTOR;
    const cost = quantity * (mat?.unitCost || 0);
    return { name: mat?.name, quantity, cost };
  });

  console.log("Procurement Items (with 10% waste):");
  procurementItems.forEach(item => {
    console.log(`- ${item.name}: ${item.quantity} m2, Cost: $${item.cost.toFixed(2)}`);
  });

  console.log("\n--- Phase 4: Verifying Report Snapshot ---");
  const reportSnapshot = {
      project: { name: project?.name, layers: project?.layers },
      analysis: { uValue: analysis.uValue, optimizedLayers },
      procurement: { items: procurementItems }
  };

  const report = await prisma.report.create({
    data: {
        projectId,
        userId,
        type: "Verification Test",
        data: reportSnapshot as any
    }
  });
  console.log(`Report Snapshot created: ${report.id}`);
  
  // Final verification check
  const savedReport = await prisma.report.findUnique({ where: { id: report.id } });
  const snapshot = savedReport?.data as any;
  
  if (snapshot.analysis.optimizedLayers[0].materialId === optimizedLayers[0].materialId) {
    console.log("\n✅ VERIFICATION SUCCESS: Data Pipeline Stable.");
  } else {
    console.log("\n❌ VERIFICATION FAILED: Data mismatch.");
  }
}

verify()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
