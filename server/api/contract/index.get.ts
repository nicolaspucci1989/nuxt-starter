// server/api/users.js
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query: { search?: string } = getQuery(event);
  const filter: Prisma.ContractFindManyArgs = {
    orderBy: {
      updatedAt: "asc",
    },
  };

  if (query?.search) {
    filter.where = {
      title: {
        contains: query.search,
      },
    };
  }

  const contract = await prisma.contract.findMany(filter);
  return contract;
});
