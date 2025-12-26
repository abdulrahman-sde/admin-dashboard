import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Checking database for deletedAt fields...");

  const customerCount = await prisma.customer.count();
  const customersWithNull = await prisma.customer.count({
    where: { deletedAt: null },
  });

  const productCount = await prisma.product.count();
  const productsWithNull = await prisma.product.count({
    where: { deletedAt: null },
  });

  console.log(`\nCustomers:`);
  console.log(`- Total: ${customerCount}`);
  console.log(`- With deletedAt: null: ${customersWithNull}`);

  console.log(`\nProducts:`);
  console.log(`- Total: ${productCount}`);
  console.log(`- With deletedAt: null: ${productsWithNull}`);

  if (customerCount > 0) {
    const sample = await prisma.customer.findFirst();
    console.log("\nSample customer raw:", JSON.stringify(sample, null, 2));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
