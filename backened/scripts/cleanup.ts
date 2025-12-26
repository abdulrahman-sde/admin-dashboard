import { prisma } from "../src/lib/prisma.js";

async function main() {
  console.log("🧹 Cleanup starting: Deleting data from ALL collections...");

  // 1. Delete records with foreign key dependencies first
  const transactions = await prisma.transaction.deleteMany({});
  console.log(`- Deleted ${transactions.count} transactions`);

  const sessionEvents = await prisma.sessionEvent.deleteMany({});
  console.log(`- Deleted ${sessionEvents.count} session events`);

  const orderItems = await prisma.orderItem.deleteMany({});
  console.log(`- Deleted ${orderItems.count} order items`);

  const sessions = await prisma.session.deleteMany({});
  console.log(`- Deleted ${sessions.count} sessions`);

  const orders = await prisma.order.deleteMany({});
  console.log(`- Deleted ${orders.count} orders`);

  // 2. Delete main entities
  const products = await prisma.product.deleteMany({});
  console.log(`- Deleted ${products.count} products`);

  const customers = await prisma.customer.deleteMany({});
  console.log(`- Deleted ${customers.count} customers`);

  const categories = await prisma.category.deleteMany({});
  console.log(`- Deleted ${categories.count} categories`);

  const coupons = await prisma.coupon.deleteMany({});
  console.log(`- Deleted ${coupons.count} coupons`);

  const users = await prisma.user.deleteMany({});
  console.log(`- Deleted ${users.count} users`);

  // 3. Delete metrics and config
  const dailyMetrics = await prisma.dailyMetrics.deleteMany({});
  console.log(`- Deleted ${dailyMetrics.count} daily metrics`);

  const realtimeMetrics = await prisma.realtimeMetrics.deleteMany({});
  console.log(`- Deleted ${realtimeMetrics.count} realtime metrics`);

  const storePaymentMethods = await prisma.storePaymentMethod.deleteMany({});
  console.log(`- Deleted ${storePaymentMethods.count} store payment methods`);

  console.log("✅ Full cleanup complete: Database is empty.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
