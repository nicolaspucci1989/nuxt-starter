import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const contractId = getRouterParam(event, "contractId");
    const body = await readBody(event);
    
    const contract = await prisma.contract.update({
      where: {
        id: Number(contractId),
      },
      data: body.contract,
    });
    return contract;
  } catch (error) {
    return { error: "Failed to put contract" };
  }
});
