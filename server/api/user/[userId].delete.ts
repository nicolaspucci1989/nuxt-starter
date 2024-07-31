import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const userId = getRouterParam(event, "userId");
    await prisma.user.delete({ where: { id: Number(userId) } });
    return { ok: true };
  } catch (error) {
    return { error };
  }
});
