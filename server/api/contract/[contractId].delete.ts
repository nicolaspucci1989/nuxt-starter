import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const contractId = getRouterParam(event, "contractId");
    await prisma.contract.delete({ where: { id: Number(contractId) } });
    return { ok: true };
  } catch (error) {
    return { error };
  }
});
