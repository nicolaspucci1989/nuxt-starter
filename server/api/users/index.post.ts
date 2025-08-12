import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const { user } = await readBody(event);

  const prisma = new PrismaClient();

  const createdUser = await prisma.user.create({ data: user });

  return { user: createdUser };
});
