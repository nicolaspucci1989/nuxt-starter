import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const contractId = Number(getRouterParam(event, "contractId"));
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const pageSize = Number(query.pageSize) || 10;

  const [payments, total] = await Promise.all([
    prisma.contractPayment.findMany({
      where: { contractId },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contractPayment.count({ where: { contractId } }),
  ]);

  return {
    payments,
    total,
    page,
    pageSize,
    pages: Math.ceil(total / pageSize),
  };
});