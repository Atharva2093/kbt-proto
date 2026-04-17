import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const materials = [
  {
    name: "Standard Red Brick",
    category: "Masonry",
    conductivity: 0.72,
    density: 1920,
    unitCost: 15.50,
  },
  {
    name: "Concrete Block (Heavy)",
    category: "Masonry",
    conductivity: 1.28,
    density: 2300,
    unitCost: 12.00,
  },
  {
    name: "Aerated Concrete (Autoclaved)",
    category: "Masonry",
    conductivity: 0.16,
    density: 600,
    unitCost: 45.00,
  },
  {
    name: "Mineral Wool Insulation",
    category: "Insulation",
    conductivity: 0.04,
    density: 30,
    unitCost: 28.00,
  },
  {
    name: "EPS (Expanded Polystyrene)",
    category: "Insulation",
    conductivity: 0.035,
    density: 20,
    unitCost: 18.50,
  },
  {
    name: "XPS (Extruded Polystyrene)",
    category: "Insulation",
    conductivity: 0.03,
    density: 35,
    unitCost: 38.00,
  },
  {
    name: "PUR/PIR Insulation Board",
    category: "Insulation",
    conductivity: 0.022,
    density: 32,
    unitCost: 55.00,
  },
  {
    name: "Aerogel Insulation Panel",
    category: "Insulation",
    conductivity: 0.015,
    density: 150,
    unitCost: 145.00,
  },
  {
    name: "Standard Plasterboard",
    category: "Finish",
    conductivity: 0.17,
    density: 800,
    unitCost: 8.50,
  },
  {
    name: "Vapor Barrier Membrane",
    category: "Protective",
    conductivity: 0.25,
    density: 900,
    unitCost: 3.50,
  },
]

async function main() {
  console.log('Start seeding materials...')
  
  for (const material of materials) {
    const existing = await prisma.material.findFirst({
      where: { name: material.name }
    })
    
    if (!existing) {
       await prisma.material.create({
         data: material
       })
       console.log(`Created material: ${material.name}`)
    } else {
       console.log(`Material already exists: ${material.name}`)
    }
  }
  
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
