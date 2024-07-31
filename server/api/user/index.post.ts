import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const user = await prisma.user.create({
      data: body.user,
    });
    return {ok: true}
  } catch (error) {
    console.log(error)
    return { error: "Failed to create new user" };
  }
});
