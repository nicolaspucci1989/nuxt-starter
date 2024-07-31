import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const userId = getRouterParam(event, 'userId');
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });
    return user;
  } catch (error) {
    return { error: 'Failed to fetch users in user id' };
  }
});