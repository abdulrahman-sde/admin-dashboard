import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.storePaymentMethod.update({
    where: { id: "695b816695e6b4cca4a4770c" },
    data: { isDefault: true },
  });
  console.log("Set 695b816695e6b4cca4a4770c as default.");
}
main().finally(() => prisma.$disconnect());
