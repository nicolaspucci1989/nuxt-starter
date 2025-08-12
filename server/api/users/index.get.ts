// server/api/users.js
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const filter: Prisma.UserFindManyArgs = {
    orderBy: {
      name: "asc",
    },
  };

  const users = await prisma.user.findMany({
    ...filter,
  });

  return users;
});
