import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🛠️ Fixing deletedAt fields (setting to null)...");

  try {
    // 1. Customers
    console.log("Updating Customers...");
    const c = await prisma.customer.updateMany({
      where: { deletedAt: { isSet: false } }, // Optional optimization, or just update all
      data: { deletedAt: null },
    });
    // Actually updateMany without where updates ALL. Safer to ensure consistency.
    const c2 = await prisma.customer.updateMany({
      data: { deletedAt: null },
    });
    console.log(`Updated ${c2.count} customers.`);

    // 2. Products
    console.log("Updating Products...");
    const p = await prisma.product.updateMany({
      data: { deletedAt: null },
    });
    console.log(`Updated ${p.count} products.`);

    // 3. Categories
    console.log("Updating Categories...");
    const cat = await prisma.category.updateMany({
      data: { deletedAt: null },
    });
    console.log(`Updated ${cat.count} categories.`);

    // 4. Orders
    console.log("Updating Orders...");
    const o = await prisma.order.updateMany({
      data: { deletedAt: null },
    });
    console.log(`Updated ${o.count} orders.`);

    console.log("✅ Data fixed successfully. No more hallucinations.");
  } catch (error) {
    console.error("❌ Error fixing deletedAt:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
