import { prisma } from "../src/lib/prisma";

async function main() {
  const result = await prisma.product.updateMany({
    data: {
      deletedAt: null,
    },
  });

  console.log(`✅ Updated ${result.count} customers`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
