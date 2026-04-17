import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-server-utils";
import prisma from "@/lib/db";

const standardMaterials = [
  { name: "Brick", conductivity: 0.72, density: 1920, category: "Masonry" },
  { name: "Concrete", conductivity: 1.28, density: 2300, category: "Masonry" },
  { name: "Mineral Wool", conductivity: 0.04, density: 30, category: "Insulation" },
  { name: "EPS Insulation", conductivity: 0.035, density: 20, category: "Insulation" },
  { name: "Aerogel Panel", conductivity: 0.015, density: 150, category: "Insulation" },
  { name: "Plasterboard", conductivity: 0.17, density: 800, category: "Finish" },
  { name: "Wood (Soft)", conductivity: 0.13, density: 500, category: "Structure" },
];

export async function GET(req: Request) {
  try {
    const { user } = await verifyAuth(req);

    const customMaterials = await prisma.material.findMany({
      where: { 
        OR: [
          { userId: user.id },
          { userId: null, isCustom: false } // Include system materials if we store them in DB
        ]
      }
    });

    // Merge system defaults with DB materials
    // For now, return these standard ones plus many from DB
    return NextResponse.json([...standardMaterials, ...customMaterials]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
