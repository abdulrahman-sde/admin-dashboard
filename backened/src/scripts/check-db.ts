import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.transaction.count();
  const linkedCount = await prisma.transaction.count({
    where: { storePaymentMethodId: "695b816695e6b4cca4a4770c" },
  });
  console.log(`Total transactions: ${count}`);
  console.log(`Linked to ID: ${linkedCount}`);
}
main().finally(() => prisma.$disconnect());
