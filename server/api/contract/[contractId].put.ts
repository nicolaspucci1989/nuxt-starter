import ContractService from "./ContractService";

export default defineEventHandler(async (event) => {
  try {
    const contractId = getRouterParam(event, "contractId");
    const { contract } = await readBody(event);

    if (!contractId || !contract) {
      return { error: "Invalid contract data" };
    }

    ContractService.update(parseInt(contractId), contract);

    return contract;
  } catch (error) {
    return { error: "Failed to put contract" };
  }
});
