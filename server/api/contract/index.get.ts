// server/api/users.js
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query: { search?: string; page?: number; pageSize?: number } =
    getQuery(event);
  const page = Number(query.page) || 1;
  const pageSize = Number(query.pageSize) || 25;

  const filter: Prisma.ContractFindManyArgs = {
    orderBy: {
      createdAt: "desc",
    },
  };

  if (query?.search) {
    filter.where = {
      title: {
        contains: query.search,
      },
    };
  }

  const [contracts, total] = await Promise.all([
    prisma.contract.findMany({
      ...filter,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.contract.count({
      where: filter.where,
    }),
  ]);

  for (const contract of contracts) {
    if (contract.media) {
      contract.media = JSON.parse(contract.media)[0];
    }
  }

  return {
    contracts,
    total,
    page,
    pageSize,
    pages: Math.ceil(total / pageSize),
  };
});
