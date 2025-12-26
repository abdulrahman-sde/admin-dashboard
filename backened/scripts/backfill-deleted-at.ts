import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Initializing deletedAt fields for consistent filtering...");

  // Update Customers
  const customers = await prisma.customer.updateMany({
    where: {
      OR: [
        { deletedAt: { isSet: false } }, // Field missing in MongoDB
        { deletedAt: undefined }, // Field undefined in Prisma context
      ],
    },
    data: { deletedAt: null },
  });
  console.log(`✅ Updated ${customers.count} customers`);

  // Update Products
  const products = await prisma.product.updateMany({
    where: {
      OR: [{ deletedAt: { isSet: false } }, { deletedAt: undefined }],
    },
    data: { deletedAt: null },
  });
  console.log(`✅ Updated ${products.count} products`);

  // Update Categories
  const categories = await prisma.category.updateMany({
    where: {
      OR: [{ deletedAt: { isSet: false } }, { deletedAt: undefined }],
    },
    data: { deletedAt: null },
  });
  console.log(`✅ Updated ${categories.count} categories`);

  // Update Users (Admins)
  const users = await prisma.user.updateMany({
    where: {
      OR: [{ deletedAt: { isSet: false } }, { deletedAt: undefined }],
    },
    data: { deletedAt: null },
  });
  console.log(`✅ Updated ${users.count} users`);

  console.log("✨ Data initialization complete.");
}

main()
  .catch((e) => {
    console.error("❌ Error during backfill:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
