import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    await prisma.contract.create({
      data: body.contract,
    });
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { error: "Failed to create new contract" };
  }
});
