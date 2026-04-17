import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const materials = await prisma.material.findMany();
  console.log(JSON.stringify(materials, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
