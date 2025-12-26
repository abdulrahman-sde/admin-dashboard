import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🗑️  Clearing all data from database...");

  try {
    await prisma.sessionEvent.deleteMany();
    await prisma.session.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.user.deleteMany();
    await prisma.coupon.deleteMany();
    await prisma.storePaymentMethod.deleteMany();
    await prisma.realtimeMetrics.deleteMany();
    await prisma.dailyMetrics.deleteMany();

    console.log("✅ All data has been successfully deleted.");
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
