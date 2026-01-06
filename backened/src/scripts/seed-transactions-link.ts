import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const methodId = "695b816695e6b4cca4a4770c";
  console.log(`Linking all transactions to StorePaymentMethod: ${methodId}`);

  const result = await prisma.transaction.updateMany({
    data: {
      storePaymentMethodId: methodId,
    },
  });

  console.log(`Updated ${result.count} transactions.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
