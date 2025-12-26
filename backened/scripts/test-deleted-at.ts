import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const all = await prisma.customer.count();
  const withNull = await prisma.customer.count({ where: { deletedAt: null } });
  const withUndefined = await prisma.customer.count({
    where: { deletedAt: undefined },
  });

  console.log(`Total customers: ${all}`);
  console.log(`With deletedAt: null: ${withNull}`);
  console.log(`With deletedAt: undefined: ${withUndefined}`);

  const first = await prisma.customer.findFirst();
  console.log("First customer deletedAt:", first?.deletedAt);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
