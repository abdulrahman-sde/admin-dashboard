import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const metrics = await prisma.dailyMetrics.findMany({
    take: 5,
    orderBy: { date: "desc" },
  });
}
main().finally(() => prisma.$disconnect());
