import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const contractId = getRouterParam(event, "contractId");
    const contract = await prisma.contract.findUnique({
      where: {
        id: Number(contractId),
      },
      include: {
        contractRoles: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!contract) {
      return { error: "Contract not found" };
    }
    contract.media = contract.media ? JSON.parse(contract.media) : [];
    return contract;
  } catch (error) {
    return { error: "Failed to fetch contract" };
  }
});
