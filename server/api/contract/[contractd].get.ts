import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const contractId = getRouterParam(event, 'userId');
    const contract = await prisma.user.findUnique({
      where: {
        id: Number(contractId),
      },
    });
    return contract;
  } catch (error) {
    return { error: 'Failed to fetch contract' };
  }
});