import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const userId = getRouterParam(event, "userId");
    const body = await readBody(event);
    const user = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: body.user,
    });
    return user
  } catch (error) {
    return { error: "Failed to put user" };
  }
});
