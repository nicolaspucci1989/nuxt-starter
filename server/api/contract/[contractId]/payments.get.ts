// server/api/users.js
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const contractId = getRouterParam(event, "contractId");
  const query: { search?: string; page?: number; pageSize?: number } =
    getQuery(event);
  const page = Number(query.page) || 1;
  const pageSize = Number(query.pageSize) || 25;

  const filter: Prisma.ContractPaymentFindManyArgs = {
    orderBy: {
      createdAt: "desc",
    },
  };

  if (query?.search) {
    filter.where = {
      description: {
        contains: query.search,
      },
      contractId: Number(contractId),
    };
  }

  const [payments, total] = await Promise.all([
    prisma.contractPayment.findMany({
      ...filter,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.contractPayment.count({
      where: filter.where,
    }),
  ]);

  return {
    payments,
    total,
    page,
    pageSize,
    pages: Math.ceil(total / pageSize),
  };
});
