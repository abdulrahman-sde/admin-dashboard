import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const metrics = await prisma.dailyMetrics.findMany({
    take: 5,
    orderBy: { date: "desc" },
  });
  console.log(JSON.stringify(metrics, null, 2));
}
main().finally(() => prisma.$disconnect());
