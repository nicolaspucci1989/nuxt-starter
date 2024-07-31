// server/api/users.js
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query: { search?: string } = getQuery(event);
  const filter: Prisma.UserFindManyArgs = {
    orderBy: {
      updatedAt: "asc",
    },
  };

  if (query?.search) {
    filter.where = {
      email: {
        contains: query.search,
      },
    };
  }

  const users = await prisma.user.findMany(filter);
  return users;
});
